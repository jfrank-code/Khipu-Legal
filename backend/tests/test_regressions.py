import json
import os
import tempfile
import unittest
from unittest.mock import patch

from app.main import split_bilingual_response, source_url_for_filename, complete_bilingual_findings, clean_inline_citations, normalize_ui_catalog, run_official_web_search, UI_STRINGS_ES, UiCopyRequest, ui_copy
from app.evidence_engine import build_evidence_engine, ENGINE_NAME


class BilingualSplitRegressionTests(unittest.TestCase):
    def test_markdown_sections_split_into_two_languages(self):
        text = (
            "## Español\n\n**La respuesta es clara.**\n\n"
            "## Quechua (traducción experimental)\n\nRunasimi tekstu."
        )
        self.assertEqual(
            split_bilingual_response(text),
            ("**La respuesta es clara.**", "Runasimi tekstu."),
        )

    def test_quechua_first_word_is_not_removed_as_a_heading(self):
        text = "## Español\nRespuesta.\n\n## Quechua (traducción experimental)\nRunasimi simipi, kaymi qillqa."
        self.assertEqual(
            split_bilingual_response(text),
            ("Respuesta.", "Runasimi simipi, kaymi qillqa."),
        )

    def test_bold_headers_split(self):
        text = "**Español**\nRespuesta.\n**Quechua (traducción experimental)**\nKutichiy."
        self.assertEqual(split_bilingual_response(text), ("Respuesta.", "Kutichiy."))

    def test_official_source_links_are_resolved_for_known_index_filenames(self):
        self.assertTrue(source_url_for_filename("01_Constitucion_Peru_21ed_actualizada_2025.pdf").startswith("https://"))
        self.assertTrue(source_url_for_filename("07_MTPE_como_calcular_las_horas_extras.pdf").startswith("https://"))
        self.assertTrue(source_url_for_filename("SUNAT_horas_extra.pdf").startswith("https://"))


class EvidenceEngineTests(unittest.TestCase):
    def test_bilingual_trace_uses_only_actual_sources_and_disclaims_support(self):
        sources = [{
            "title": "Ley N.º 29735 — Ley de Lenguas Originarias",
            "filename": "04_Ley_29735_Lenguas_Originarias.pdf",
            "url": "https://www.gob.pe/institucion/minedu/normas-legales/118448-29735",
            "snippet": "La Ley 29735 regula el uso, preservación, desarrollo, recuperación, fomento y difusión de las lenguas originarias del Perú.",
            "source_type": "vector_store",
        }]
        trace = build_evidence_engine(
            query="derechos sobre lenguas originarias",
            answer_es="La Ley N.º 29735 regula los derechos lingüísticos.",
            answer_qu="Runasimipi derechoskunamanta kay kamachikuy riman.",
            sources=sources,
            plan={"legal_areas": ["Derechos lingüísticos"]},
        )
        self.assertEqual(trace["engine"], ENGINE_NAME)
        self.assertEqual(trace["source_count"], 1)
        self.assertEqual(trace["claims"][0]["text_es"], "La Ley N.º 29735 regula los derechos lingüísticos.")
        self.assertEqual(trace["claims"][0]["text_qu"], "Runasimipi derechoskunamanta kay kamachikuy riman.")
        self.assertTrue(trace["claims"][0]["links"])
        self.assertIn("no demuestran", trace["limitations"]["es"].lower())

    def test_no_sources_does_not_create_fake_source_links(self):
        trace = build_evidence_engine(query="Mi consulta", answer_es="Respuesta breve.", answer_qu="Runasimi kutichiy.", sources=[])
        self.assertEqual(trace["status"], "no_sources")
        self.assertEqual(trace["source_count"], 0)
        self.assertEqual(trace["claims"][0]["links"], [])


    def test_document_findings_keep_spanish_and_quechua_fields_separate(self):
        sources = [{"title": "Ley N.º 29735 — Lenguas Originarias", "filename": "04_Ley_29735.pdf", "snippet": "La Ley N.º 29735 regula los derechos lingüísticos."}]
        trace = build_evidence_engine(
            query="revisar cláusula sobre idioma",
            sources=sources,
            findings=[{
                "title": "Idioma de atención",
                "title_qu": "Runasimi rimay",
                "quote": "La atención será únicamente en español.",
                "translated_quote": "Atenciónqa kastilla simillapim kanqa.",
                "explanation": "El documento limita el idioma de atención.",
                "explanation_qu": "Qillqasqaqa mayqin simipi yanapayta limitan.",
                "source_references": ["Ley N.º 29735 — Lenguas Originarias"],
            }],
            mode="documento",
        )
        claim = trace["claims"][0]
        self.assertEqual(claim["text_es"], "El documento limita el idioma de atención.")
        self.assertEqual(claim["text_qu"], "Qillqasqaqa mayqin simipi yanapayta limitan.")
        self.assertEqual(claim["quote_es"], "La atención será únicamente en español.")
        self.assertTrue(claim["translation_exact"])
        self.assertEqual(claim["title_qu"], "Runasimi rimay")

    def test_citation_check_is_a_presence_check_not_a_truth_score(self):
        sources = [{"title": "Código Penal — Decreto Legislativo N.º 635", "filename": "02_Codigo_Penal.pdf", "snippet": "Código Penal Decreto Legislativo 635", "url": "https://example.org/codigo-penal"}]
        trace = build_evidence_engine(query="delitos", answer_es="Consulta el Código Penal.", answer_qu="Runasimi.", sources=sources)
        if trace["citation_checks"]:
            self.assertIn(trace["citation_checks"][0]["status"], {"mention_found_in_retrieved_material", "not_found_in_retrieved_material"})
        self.assertEqual(trace["method"], "token-overlap-and-reference-presence; no truth score")

    def test_missing_document_quechua_summary_and_fields_are_filled_separately(self):
        class FakeResponse:
            output_text = json.dumps({
                "summary_qu": "Quechua summary",
                "translations": [{
                    "index": 0,
                    "title_qu": "Título en quechua",
                    "explanation_qu": "Explicación en quechua",
                    "verification_reason_qu": "Razón en quechua",
                    "why_review_qu": "Revisar en quechua",
                    "legal_basis_qu": "Base jurídica en quechua",
                    "competent_authority_qu": "Autoridad en quechua",
                    "next_steps_qu": ["Paso en quechua"],
                    "questions_to_ask_qu": ["¿Pregunta en quechua?"],
                }],
            })
        class FakeResponses:
            def create(self, **kwargs):
                return FakeResponse()
        class FakeClient:
            responses = FakeResponses()

        result = complete_bilingual_findings(FakeClient(), {
            "summary": "Resumen en español",
            "findings": [{
                "title": "Título en español",
                "explanation": "Explicación en español",
                "verification_reason": "Razón en español",
                "why_review": "Revisar en español",
                "legal_basis": "Base jurídica en español",
                "competent_authority": "Autoridad en español",
                "next_steps": ["Paso en español"],
                "questions_to_ask": ["¿Pregunta en español?"],
            }],
        }, "chanka")
        self.assertEqual(result["summary_qu"], "Quechua summary")
        self.assertEqual(result["findings"][0]["explanation_qu"], "Explicación en quechua")
        self.assertEqual(result["findings"][0]["verification_reason_qu"], "Razón en quechua")
        self.assertEqual(result["findings"][0]["questions_to_ask_qu"], ["¿Pregunta en quechua?"])
        self.assertEqual(result["findings"][0]["legal_basis_qu"], "Base jurídica en quechua")
        self.assertEqual(result["findings"][0]["competent_authority_qu"], "Autoridad en quechua")
        self.assertEqual(result["findings"][0]["next_steps_qu"], ["Paso en quechua"])


class SearchAndPresentationRegressionTests(unittest.TestCase):
    def test_raw_file_search_citation_becomes_readable_official_link(self):
        raw = "La referencia es 【1:1-6†02_Codigo_Penal_DL_635_Poder_Judicial.pdf】."
        sources = [{
            "filename": "02_Codigo_Penal_DL_635_Poder_Judicial.pdf",
            "title": "Código Penal — Decreto Legislativo N.º 635",
            "url": "https://www.pj.gob.pe/wps/wcm/connect/official/codigo-penal.pdf",
        }]
        cleaned = clean_inline_citations(raw, sources)
        self.assertNotIn("【1:1-6", cleaned)
        self.assertIn("[Código Penal — Decreto Legislativo N.º 635](https://www.pj.gob.pe", cleaned)

    def test_ui_catalog_sanitizer_keeps_expanding_catalog_and_discards_invalid_values(self):
        catalog = {"button": "Enviar", "null_value": None, "number": 4}
        normalized = normalize_ui_catalog(catalog)
        self.assertEqual(normalized["button"], "Enviar")
        self.assertEqual(normalized["number"], "4")
        self.assertNotIn("null_value", normalized)
        large = {f"label_{i}": f"Etiqueta {i}" for i in range(900)}
        self.assertEqual(len(normalize_ui_catalog(large)), 800)
        for key in ("doc_legal_basis", "doc_authority", "doc_next_steps", "followup_question_label"):
            self.assertIn(key, UI_STRINGS_ES)

    def test_web_search_request_has_no_filters_and_can_collect_six_official_sources(self):
        from types import SimpleNamespace
        urls = [f"https://www.gob.pe/institucion/test-{i}/normas-legales/{i}" for i in range(6)]
        source_items = [SimpleNamespace(url=url, title=f"Fuente oficial {i+1}", snippet="Fragmento pertinente") for i, url in enumerate(urls)]
        response_obj = SimpleNamespace(output_text="Síntesis oficial", output=[SimpleNamespace(type="web_search_call", action=SimpleNamespace(sources=source_items))])
        class FakeResponses:
            def __init__(self): self.requests = []
            def create(self, **kwargs): self.requests.append(kwargs); return response_obj
        class FakeClient:
            def __init__(self): self.responses = FakeResponses()
        client = FakeClient()
        _research, sources, error = run_official_web_search(client, "derechos laborales", [], max_sources=8)
        self.assertIsNone(error)
        self.assertEqual(len(sources), 6)
        self.assertTrue(all("filters" not in tool for call in client.responses.requests for tool in call.get("tools", [])))
        self.assertTrue(all(s["url"].startswith("https://www.gob.pe/") for s in sources))


    def test_web_search_retries_without_filters_after_compatibility_error(self):
        from types import SimpleNamespace
        urls = [f"https://www.gob.pe/institucion/rrhh-{i}/normas-legales/{i}" for i in range(6)]
        items = [SimpleNamespace(url=url, title=f"Fuente oficial {i+1}", snippet="Fragmento pertinente") for i, url in enumerate(urls)]
        response_obj = SimpleNamespace(output_text="Síntesis", output=[SimpleNamespace(type="web_search_call", action=SimpleNamespace(sources=items))])
        class FakeResponses:
            def __init__(self): self.requests = []
            def create(self, **kwargs):
                self.requests.append(kwargs)
                if len(self.requests) == 1:
                    raise RuntimeError("Parameter 'filters' not supported with model 'gpt-4.1-mini'")
                return response_obj
        class FakeClient:
            def __init__(self): self.responses = FakeResponses()
        client = FakeClient()
        with patch.dict(os.environ, {"OPENAI_SEARCH_MODEL": "gpt-4.1-mini", "OPENAI_SEARCH_FALLBACK_MODEL": "gpt-4.1", "KHIPU_ENABLE_WEB_SEARCH": "true"}):
            _research, sources, error = run_official_web_search(client, "derechos laborales", [], max_sources=8)
        self.assertIsNone(error)
        self.assertEqual(len(sources), 6)
        self.assertGreaterEqual(len(client.responses.requests), 2)
        self.assertTrue(all("filters" not in tool for call in client.responses.requests for tool in call.get("tools", [])))

    def test_ui_copy_does_not_reject_expanded_catalog(self):
        catalog = {f"key_{i}": f"Spanish label {i}" for i in range(42)}
        def fake_call_json(_client, _model, _instructions, prompt):
            payload = json.loads(prompt[prompt.rfind("\n\n") + 2:])
            return {key: "quechua " + value for key, value in payload.items()}
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch("app.main.DATA_DIR", __import__("pathlib").Path(temp_dir)), patch("app.main.get_client", return_value=object()), patch("app.main.call_json", side_effect=fake_call_json):
                result = ui_copy(UiCopyRequest(language="qu", strings=catalog))
        self.assertEqual(len(result["copy"]), len(catalog))
        self.assertEqual(result["missing_keys"], [])
        self.assertTrue(result["copy"]["key_41"].startswith("quechua"))


if __name__ == "__main__":
    unittest.main()
