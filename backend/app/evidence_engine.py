"""KHIPU Evidence Engine: deterministic traceability helpers.

This module deliberately does NOT decide whether a legal proposition is true or
whether a source legally supports it. It records where text overlaps with actual
retrieved snippets and makes the limits of that relationship visible.
"""
from __future__ import annotations

import re
import unicodedata
from typing import Any

ENGINE_NAME = "KHIPU Evidence Engine"
ENGINE_VERSION = "1.1.0"

_STOPWORDS = {
    "para", "como", "cuando", "donde", "desde", "hasta", "sobre", "entre", "porque",
    "pero", "tambien", "puede", "pueden", "debe", "deben", "deberia", "seria", "seran",
    "ser", "son", "esta", "estan", "tiene", "tienen", "hay", "que", "con", "sin", "por",
    "del", "las", "los", "una", "uno", "unos", "unas", "este", "esta", "estos", "estas",
    "eso", "esa", "ello", "ella", "ellos", "ellas", "toda", "todo", "todos", "todas",
    "legal", "juridica", "juridico", "peru", "peruana", "peruano", "segun", "dicho", "dicha",
    "informacion", "persona", "personas", "consulta", "respuesta", "fuente", "fuentes", "texto",
    "kan", "chay", "kay", "mana", "hina", "huk", "hukuna", "icha", "runa", "runasimi",
    "pipas", "mayqan", "imayna", "chayqa", "allin", "manam", "kanchu", "kanku", "kaymi",
}


def _norm(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value or "").lower())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = re.sub(r"[^a-z0-9ñ]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def _tokens(value: str) -> set[str]:
    return {token for token in _norm(value).split() if len(token) >= 4 and token not in _STOPWORDS}


def _source_title(source: dict[str, Any]) -> str:
    return str(source.get("title") or source.get("filename") or "Fuente recuperada")


def _source_body(source: dict[str, Any]) -> str:
    return " ".join(str(source.get(k) or "") for k in ("title", "filename", "institution", "topic", "snippet", "note"))


def _canonical_source_key(source: dict[str, Any]) -> str:
    return str(source.get("url") or source.get("filename") or source.get("title") or "").strip().lower()


def _extract_references(text: str) -> list[str]:
    patterns = [
        r"\b(?:art[ií]culo|art\.?)\s*(?:n[.º°o]*\s*)?\d{1,4}(?:\s*[-.]\s*\d{1,3})?",
        r"\bLey\s*(?:N[.º°o]*\s*)?\d{1,6}(?:[-/]\d{2,4})?",
        r"\bDecreto\s+(?:Supremo|Legislativo)\s*(?:N[.º°o]*\s*)?[\d.-]+(?:\s*[-/]\s*[A-Z]{1,8})?",
        r"\bD\.?\s*S\.?\s*(?:N[.º°o]*\s*)?[\d.-]+\s*[-/]\s*[A-Z]{1,8}",
        r"\bConstituci[oó]n\s+Pol[ií]tica\s+del\s+Per[uú]",
        r"\bC[oó]digo\s+(?:Penal|Procesal\s+Penal)\b",
    ]
    matches: list[str] = []
    seen: set[str] = set()
    for pattern in patterns:
        for match in re.finditer(pattern, text or "", flags=re.I):
            item = re.sub(r"\s+", " ", match.group(0)).strip(" .,:;")
            key = _norm(item)
            if key and key not in seen:
                seen.add(key)
                matches.append(item)
    return matches[:18]


def _source_is_named(reference: str, source: dict[str, Any]) -> bool:
    ref_norm = _norm(reference)
    body_norm = _norm(_source_body(source))
    if not ref_norm or not body_norm:
        return False
    # Exact phrase is strongest; for references with a number, also require that number.
    if ref_norm in body_norm:
        return True
    numbers = re.findall(r"\d+", ref_norm)
    if numbers and all(number in body_norm.split() for number in numbers):
        family = next((x for x in ("ley", "decreto supremo", "decreto legislativo", "articulo", "art ", "codigo penal", "codigo procesal penal", "constitucion politica del peru") if x in ref_norm), "")
        if family == "art ":
            return bool(re.search(r"\b(?:art(?:iculo)?|art\.)\s*" + re.escape(numbers[0]) + r"\b", body_norm))
        if family:
            family_aliases = {"articulo": ("articulo", "art"), "codigo procesal penal": ("codigo procesal penal",), "codigo penal": ("codigo penal",), "constitucion politica del peru": ("constitucion politica del peru",)}
            return any(alias in body_norm for alias in family_aliases.get(family, (family,)))
        return False
    return False


def build_evidence_engine(
    *,
    query: str = "",
    answer_es: str = "",
    answer_qu: str = "",
    sources: list[dict[str, Any]] | None = None,
    plan: dict[str, Any] | None = None,
    findings: list[dict[str, Any]] | None = None,
    document_summary: str = "",
    mode: str = "orienta",
) -> dict[str, Any]:
    """Build a bilingual, inspectable trace over retrieved sources.

    Relation labels intentionally describe only text/name overlap, never legal support.
    """
    sources = list(sources or [])
    findings = [item for item in (findings or []) if isinstance(item, dict)]
    plan = plan or {}
    trace_sources: list[dict[str, Any]] = []
    for idx, source in enumerate(sources[:20], 1):
        trace_sources.append({
            "id": f"source-{idx}",
            "title": _source_title(source),
            "filename": str(source.get("filename") or ""),
            "institution": str(source.get("institution") or ""),
            "url": str(source.get("url") or ""),
            "source_type": str(source.get("source_type") or "unknown"),
            "snippet": str(source.get("snippet") or "")[:650],
            "source_key": _canonical_source_key(source),
            "terms": sorted(_tokens(_source_body(source))),
        })

    claims: list[dict[str, Any]] = []
    if findings:
        for idx, finding in enumerate(findings[:8], 1):
            title = str(finding.get("title") or finding.get("category") or f"Hallazgo {idx}")
            quote = str(finding.get("quote") or "").strip()
            explanation = str(finding.get("explanation") or finding.get("verification_reason") or "").strip()
            legal_basis = str(finding.get("legal_basis") or "").strip()
            authority = str(finding.get("competent_authority") or "").strip()
            next_steps = finding.get("next_steps") if isinstance(finding.get("next_steps"), list) else []
            references = finding.get("source_references") if isinstance(finding.get("source_references"), list) else []
            translated_quote = str(finding.get("translated_quote") or "").strip()
            translated_explanation = str(finding.get("explanation_qu") or "").strip()
            reference_context = " ".join(str(finding.get(key) or "") for key in ("verification_reason", "why_review", "legal_basis", "competent_authority", "title", "source_references")) + " " + " ".join(str(step) for step in next_steps)
            claims.append({
                "id": f"claim-{idx}",
                "title_es": title,
                "title_qu": str(finding.get("title_qu") or "").strip()[:200],
                "text_es": (explanation or quote or title)[:1100],
                "text_qu": (translated_explanation or (translated_quote if not explanation else ""))[:1100],
                "legal_basis_es": legal_basis[:850],
                "legal_basis_qu": str(finding.get("legal_basis_qu") or "").strip()[:850],
                "authority_es": authority[:700],
                "authority_qu": str(finding.get("competent_authority_qu") or "").strip()[:700],
                "next_steps_es": [str(step)[:300] for step in next_steps[:3]],
                "next_steps_qu": [str(step)[:300] for step in (finding.get("next_steps_qu") if isinstance(finding.get("next_steps_qu"), list) else [])[:3]],
                "quote_es": quote[:700],
                "quote_qu": translated_quote[:700],
                "translation_exact": bool(quote and translated_quote),
                "source_references": [str(x) for x in references[:8]],
                "reference_context": reference_context[:2000],
                "verification_status": str(finding.get("verification_status") or "no_verificable_con_el_corpus"),
            })
    else:
        es = str(answer_es or "").strip()
        qu = str(answer_qu or "").strip()
        if es or qu:
            claims.append({
                "id": "claim-response",
                "title_es": "Respuesta de la consulta" if mode != "documento" else "Resumen del documento",
                "text_es": (es or document_summary or query)[:1800],
                "text_qu": qu[:1800],
                "translation_exact": bool(qu),
                "source_references": [],
                "verification_status": "requiere_revision_de_fuentes",
            })
        elif document_summary or query:
            claims.append({
                "id": "claim-context",
                "title_es": "Contexto analizado",
                "text_es": str(document_summary or query)[:1200],
                "text_qu": "",
                "translation_exact": False,
                "source_references": [],
                "verification_status": "requiere_revision_de_fuentes",
            })

    query_terms = _tokens(query)
    all_claim_terms = set().union(*[_tokens(c.get("text_es", "")) for c in claims]) if claims else set()
    # The query is included to retrieve topical relationships; claim-only overlap is evaluated per claim below.
    source_terms_all = set().union(*[set(s["terms"]) for s in trace_sources]) if trace_sources else set()
    references = _extract_references("\n".join([
        str(answer_es or ""), str(document_summary or ""),
        " ".join(str(c.get("text_es") or "") + " " + str(c.get("legal_basis_es") or "") + " " + str(c.get("authority_es") or "") + " " + str(c.get("reference_context") or "") + " " + " ".join(c.get("source_references") or []) for c in claims),
    ]))
    citation_checks: list[dict[str, Any]] = []
    for reference in references:
        matched = [s for s in trace_sources if _source_is_named(reference, {
            "title": s["title"], "filename": s["filename"], "institution": s["institution"], "topic": "", "snippet": s["snippet"], "note": ""
        })]
        citation_checks.append({
            "reference": reference,
            "status": "mention_found_in_retrieved_material" if matched else "not_found_in_retrieved_material",
            "source_ids": [s["id"] for s in matched],
            "source_titles": [s["title"] for s in matched],
        })

    linked_claims = 0
    for claim in claims:
        claim_terms = _tokens(" ".join([
            str(claim.get("title_es", "")), str(claim.get("text_es", "")), str(claim.get("quote_es", "")),
            str(claim.get("legal_basis_es", "")), str(claim.get("authority_es", "")), " ".join(claim.get("source_references") or []),
        ]))
        linked: list[dict[str, Any]] = []
        for source in trace_sources:
            source_terms = set(source["terms"])
            overlap = sorted(claim_terms & source_terms)
            ref_names_source = any(
                _norm(ref) in _norm(source["title"] + " " + source["filename"])
                or _norm(source["title"]) in _norm(ref)
                for ref in (claim.get("source_references") or []) if ref.strip()
            )
            citation_match = any(source["id"] in check["source_ids"] and _norm(check["reference"]) in _norm(claim.get("text_es", "")) for check in citation_checks)
            query_overlap = sorted(query_terms & source_terms)
            overlap_used = overlap if overlap else query_overlap
            named = ref_names_source or citation_match
            if named or len(overlap_used) >= 2:
                relation = "named_in_analysis" if named else "textual_overlap"
                matched_terms = sorted(set(overlap_used))[:8]
                linked.append({"source_id": source["id"], "relation": relation, "matched_terms": matched_terms})
        claim["links"] = linked
        claim["relation_status"] = "has_trace_links" if linked else "no_clear_textual_link"
        if linked:
            linked_claims += 1

    linked_source_ids = {link["source_id"] for claim in claims for link in claim.get("links", [])}
    unlinked_source_ids = {s["id"] for s in trace_sources} - linked_source_ids
    source_map = {s["id"]: s for s in trace_sources}
    for source in trace_sources:
        source["related_to_claim"] = source["id"] in linked_source_ids
        source["relation_note"] = "Coincidencia textual o mención en el análisis; no acredita respaldo jurídico." if source["related_to_claim"] else "Fuente recuperada, pero no se detectó un vínculo textual claro con la explicación."
        source.pop("terms", None)
        source.pop("source_key", None)

    checks_found = sum(1 for item in citation_checks if item["status"] == "mention_found_in_retrieved_material")
    if not trace_sources:
        status = "no_sources"
    elif linked_claims:
        status = "partial_trace"
    else:
        status = "sources_without_clear_link"

    themes = [str(item) for item in plan.get("legal_areas", [])[:6]] if isinstance(plan.get("legal_areas", []), list) else []
    return {
        "engine": ENGINE_NAME,
        "version": ENGINE_VERSION,
        "mode": mode,
        "status": status,
        "source_count": len(trace_sources),
        "claim_count": len(claims),
        "linked_claim_count": linked_claims,
        "sources_without_clear_link_count": len(unlinked_source_ids),
        "citation_check_count": len(citation_checks),
        "citation_mentions_found_count": checks_found,
        "themes": themes,
        "claims": claims,
        "sources": trace_sources,
        "citation_checks": citation_checks,
        "limitations": {
            "es": "Las relaciones se calculan por coincidencia textual o mención de nombres. No demuestran que una fuente respalde legalmente una conclusión.",
            "qu": "Kay tinkichiyqa qillqapi tupayllata utaq sutikunapi rikuyllata qawachin. Manam sapallanqa huk kamachikuyqa yuyayta chiqaqchayninta rikuchinchu.",
        },
        "method": "token-overlap-and-reference-presence; no truth score",
        "source_ids_are_retrieved_only": True,
    }
