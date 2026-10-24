import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AlertTriangle, ArrowDownUp, ArrowLeft, ArrowRight, AudioLines, BookOpen, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Copy, ExternalLink, FileCheck2, FileSearch, FileText,
  GitBranch, Globe2, Headphones, Info, Languages, LoaderCircle, Mic, MicOff, Network, Plus, Search,
  Send, ShieldCheck, Sparkles, Square, Upload, Volume2, X, Menu, RefreshCw, ScanText, Scale,
} from 'lucide-react';
import AndeanIntro from './components/AndeanIntro.jsx';
import { api } from './lib/api.js';

const ES = {
  nav_orienta: 'Orienta', nav_documentos: 'Documento Claro', nav_live: 'Voz en vivo',
  language: 'Idioma', interface_language: 'Interfaz', response_language: 'Respuesta en', input_language: 'Escribes en', variety: 'Variedad de quechua', chanka: 'Quechua chanka / Ayacucho',
  welcome_kicker: 'Tecnología con propósito', welcome_title: 'Comprende tus derechos. En tu idioma.', welcome_first: 'Comprende tus derechos.', welcome_second: 'En tu idioma.',
  welcome_body: 'Un espacio bilingüe para explorar información jurídica, comprender documentos y seguir una explicación con fuentes visibles.',
  continue: 'Entrar a Khipu Legal', privacy_note: 'Prototipo informativo · No sustituye asesoría jurídica ni interpretación acreditada.',
  choose_module: '¿Qué necesitas hoy?', module_subtitle: 'Elige un recorrido. Puedes volver y cambiar de idioma en cualquier momento.',
  orienta_title: 'Cuéntanos qué ocurrió', orienta_subtitle: 'Ordenamos tu consulta, buscamos fuentes y distinguimos lo confirmado de lo pendiente.',
  input_placeholder: 'Describe la situación con tus propias palabras…', analyze: 'Analizar mi situación', examples: 'Prueba con un ejemplo',
  example_defamation: 'Me han difamado en redes sociales', example_notice: 'No entiendo una citación', example_contract: 'Quiero revisar un contrato antes de firmar',
  planned_search: 'Plan de búsqueda', evidence: 'Evidencia jurídica', sources: 'Fuentes consultadas', no_sources: 'Aún no se han recuperado fuentes pertinentes.',
  document_title: 'Comprende tu documento', document_subtitle: 'Compara el texto original con la explicación, revisa alertas y abre la evidencia que las respalda.',
  drop_title: 'Arrastra un documento aquí', drop_subtitle: 'PDF, DOCX, TXT o imagen · máximo según configuración', choose_file: 'Elegir archivo',
  sample_contract: 'Cargar contrato ficticio', document_context: '¿Qué te preocupa o qué deseas comprender?', document_context_placeholder: 'Ej.: Quiero entender obligaciones, penalidades y renovación…',
  analyze_document: 'Analizar documento', original_document: 'Texto original', findings: 'Puntos para revisar', finding_info: 'Información detectada',
  live_title: 'Escucha y comprende en directo', live_subtitle: 'Transcribe segmentos en español, traduce de forma experimental y contrasta afirmaciones jurídicas con el corpus.',
  consent: 'Tengo autorización para procesar este audio y entiendo que se envía a servicios de IA.', start_live: 'Iniciar micrófono', stop_live: 'Terminar consulta', try_live_sample: 'Probar texto de demostración',
  transcript: 'Transcripción en español', translation: 'Traducción experimental', legal_check: 'Contraste jurídico', pending: 'Pendiente', working: 'Procesando…', ready: 'Listo',
  sources_status: 'Corpus jurídico', connected: 'Conectado', not_connected: 'Sin conectar', disclaimer: 'Khipu Legal es un prototipo informativo. Las traducciones y contrastes automáticos pueden equivocarse; verifica las fuentes antes de actuar.',
  ui_qu_note: 'Interfaz en quechua generada automáticamente; requiere revisión de hablantes competentes.', copy_sources: 'Copiar evidencia', clear: 'Limpiar', send: 'Enviar', uploading: 'Leyendo documento…',
  no_api: 'Configura OPENAI_API_KEY en backend/.env para activar las funciones de IA.', demo_badge: 'DEMO INTERACTIVA', start_over: 'Volver al inicio',
  workspace_section: 'Espacio de trabajo', module_description_orienta: 'Consulta con fuentes y ruta visual', module_description_documents: 'Traducción y revisión de documentos', module_description_live: 'Transcripción y contraste en segmentos',
  orienta_eyebrow: 'Ruta de orientación', doc_eyebrow: 'Lectura guiada + evidencia', live_eyebrow: 'Transcripción + traducción + evidencia',
  language_spanish: 'Español', language_quechua: 'Quechua chanka', language_bilingual: 'Español + quechua', variety_line: 'Quechua chanka · experimental',
  additional_context: 'Contexto adicional (opcional)', additional_context_placeholder: 'Ej.: ocurrió ayer, fue una publicación pública…', characters_count: 'caracteres',
  result_title: 'Resultado de Khipu Legal', sources_count: 'fragmentos recuperados', queries_prepared: 'Consultas preparadas', corpus_connected_warning: 'No se detectó un índice jurídico. La respuesta no está fundamentada en el corpus de Khipu Legal.',
  upload_step: 'Carga del documento', selected_ready: 'listo para analizar', remove_document: 'Quitar documento', reading_document: 'Leyendo documento…', document_ready_note: 'Se procesa para extraer texto y contrastarlo con las fuentes del corpus.',
  structured_reading: 'Lectura estructurada', to_readable_points: 'De un documento extenso a puntos comprensibles', structured_reading_body: 'Khipu Legal separa el texto original, las observaciones y la evidencia para que puedas revisar cada hallazgo.',
  original_text: 'Texto original', bilingual_explanation: 'Explicación en quechua', review_finding: 'Hallazgo para revisar', what_means: '¿Qué significa?', why_review: '¿Por qué conviene revisarlo?', evidence_mentioned: 'Evidencia mencionada', questions_to_ask: 'Preguntas que puedes plantear', information_missing: 'Información que falta', analysis_document: 'Análisis del documento', read_augmented: 'Lectura aumentada', observations: 'observaciones',
  live_steps: 'Procesamiento por segmentos', live_steps_body: 'Audio autorizado → transcripción ES → traducción experimental → búsqueda de evidencia.', cannot_prove_more: 'No afirmar más de lo que se puede probar', cannot_prove_more_body: 'Khipu Legal diferencia respaldo documental, posible contradicción, evidencia insuficiente y contenido no evaluable.', segment_sequence: 'Secuencia de análisis', recent_segments: 'Fragmentos recientes', first_intervention: 'Tu primera intervención aparecerá aquí', first_intervention_body: 'Autoriza el audio o prueba el guion integrado. Cada segmento conservará el español original y el resultado de Khipu Legal.', demo_script: 'Guion de demostración', demo_script_body: 'Texto ficticio para evaluar el flujo sin micrófono', authorized_audio: 'Audio autorizado', text_step: 'Texto', sources_step: 'Fuentes', open_reference: 'Abrir fuente oficial', catalog_warning: 'El catálogo no garantiza que las fuentes estén indexadas ni que su texto esté consolidado a la fecha actual.',
  language_generated_note: 'Interfaz en quechua generada automáticamente; requiere revisión de hablantes competentes.', legal_demo_warning: 'Una alerta no determina que una cláusula sea ilegal. Khipu Legal debe explicar por qué recomienda revisarla y mostrar la evidencia disponible.', public_demo_note: 'Los casos demostrativos son ficticios. No subas datos confidenciales.',
  doc_header_eyebrow: 'Lectura guiada · evidencia visible', doc_header_title: 'Comprende lo que dice tu documento', doc_header_subtitle: 'Elige un ejemplo realista, mira el documento en pantalla y avanza paso a paso: original, traducción y puntos que necesitan verificación.',
  doc_method_no_download: 'Sin descargar nada', doc_method_bilingual: 'Español ↔ quechua', doc_method_sources: 'Fuentes recuperadas, si existen', doc_choose_demo: 'Elige un documento de demostración', doc_picker_intro: 'Todos los documentos son ficticios y se muestran aquí mismo. El jurado puede explorarlos sin subir archivos propios.', doc_other_file: '¿Quieres probar con otro archivo?', doc_optional: 'Opcional · PDF, DOCX, TXT o imagen · hasta 15 MB',
  doc_step_original: 'Documento original', doc_step_original_desc: 'Ver cómo se presenta', doc_step_translation: 'Traducción', doc_step_translation_desc: 'Leer y revisar fragmentos', doc_step_findings: 'Hallazgos', doc_step_findings_desc: 'Verificar y consultar fuentes', doc_step1_title: 'Así se ve el documento', doc_step1_desc: 'Lee el texto original antes de que la IA lo interprete.', doc_fictional: 'FICTICIO', doc_context_question: '¿Qué quieres comprender?', doc_context_placeholder: 'Ej.: Quiero entender la penalidad y comprobar si la afirmación se respalda…', doc_translate_to: 'Traducir a', doc_variety_label: 'Variedad de quechua (si corresponde)', doc_step2_button: 'Paso 2: traducir y revisar', doc_translating: 'Traduciendo y contrastando…', doc_experimental_note: 'La traducción al quechua es experimental. No se declara que un documento o cláusula sea legal o ilegal automáticamente.',
  intro_visual_caption: 'Khipu Legal · lengua · derechos · evidencia', intro_footer_line: 'Un puente entre el idioma y la comprensión jurídica.', intro_footer_right: 'Perú · prototipo de innovación', experimental_tag: 'experimental', status_rag_connected: 'RAG conectado', status_demo_no_rag: 'Demo / sin RAG', source_catalog_title: 'Fuentes de referencia', source_catalog_unavailable: 'No se pudo cargar el catálogo del backend.',
  graph_eyebrow: 'Trazabilidad interactiva', graph_title: 'Quipu de evidencia', graph_desc: 'Selecciona un nodo para ver qué conectó Khipu Legal. Es un mapa del flujo de análisis, no un veredicto jurídico.', graph_query: 'Consulta', graph_query_original: 'Consulta original', graph_concepts: 'Conceptos', graph_unidentified: 'Por identificar', graph_no_areas: 'El planificador no obtuvo áreas concretas. Revisa la consulta.', graph_plan: 'Plan de búsqueda', graph_sources: 'Fuentes', graph_no_index: 'Índice no conectado', graph_answer: 'Explicación', graph_model_evidence: 'Modelo + evidencia', graph_no_plan: 'No se generó un plan de búsqueda detallado.', graph_no_fragments: 'No se devolvieron fragmentos identificables en esta consulta.', graph_connect_store: 'Conecta un vector store con fuentes verificadas para habilitar RAG.', graph_response_detail: 'La respuesta se genera con el plan y, si hay corpus conectado, los fragmentos recuperados. La generación no certifica por sí sola la conclusión jurídica.', graph_footnote: 'Las conexiones representan el flujo de búsqueda y respuesta; las relaciones jurídicas deben verificarse en sus fuentes originales.', source_fragments_count: '{count} fragmento(s) recuperados', source_no_index_detail: 'No hay un índice jurídico local conectado. Las referencias solo aparecerán si una búsqueda devuelve fuentes pertinentes.', source_grounded_note: 'Se recuperaron fuentes. Comprueba el contexto y la vigencia antes de actuar.', source_not_proof_note: 'La recuperación no demuestra por sí sola que todas las conclusiones sean correctas.', quick_source_desc: 'El asistente busca fragmentos del índice y, cuando está configurado, consulta fuentes oficiales en la web. La vigencia debe verificarse por separado.', rag_active: 'RAG activo', no_index: 'Sin índice', orienta_rail_title: 'Transparencia antes que certeza falsa', orienta_rail_body: 'Khipu Legal debe decir cuándo recuperó evidencia, cuándo hay una posible contradicción y cuándo no sabe lo suficiente.', doc_demo_side_title: 'Qué hace esta demo', doc_demo_side_heading: 'De un papel difícil a información que puedes revisar', doc_demo_side_body: 'El recorrido revela cada etapa solo cuando el usuario está listo.', doc_demo_side_warning: 'Los modelos pueden equivocarse. Una alerta no determina que una cláusula sea ilegal; la evidencia solo cuenta si se recupera una fuente pertinente.', live_session_title: 'Sesión de interpretación', live_session_listening: 'Khipu Legal está escuchando', live_segment_status: 'Se envían segmentos de audio de forma secuencial.', live_idle_status: 'Puedes probar el micrófono o usar un guion incluido.', live_explainer: 'La demo procesa fragmentos de aproximadamente 10 segundos; la traducción y el contraste pueden llegar con retraso. No es una interpretación certificada ni un detector infalible de falsedades.', live_processing: 'Transcribiendo, traduciendo y consultando evidencia…', live_demo_label: 'Ejemplo', live_segment_label: 'Fragmento', live_tech_transcription: 'Transcripción por segmentos', live_tech_capture: 'Captura el audio autorizado mientras la persona decide cuándo terminar.', live_tech_segments: 'Los fragmentos se procesan en secuencia; no es traducción certificada en tiempo real.', live_tech_rag: 'Traducción experimental y contraste con fuentes disponibles.',
  doc_step2_title: 'Original y traducción, lado a lado', doc_step2_desc: 'Los subrayados conectan fragmentos que merecen atención con los hallazgos del siguiente paso.', doc_original_label: 'Texto original en español', doc_translation_label: 'Traducción al quechua', doc_translation_spanish: 'Texto en español', doc_highlighted: 'Fragmento importante detectado', doc_highlight_translation_associated: 'Párrafo relacionado con un hallazgo; la correspondencia literal no se pudo confirmar.', doc_verified: 'Verificación basada en fuentes, si se recuperaron', doc_back_original: 'Volver al original', doc_step3_button: 'Paso 3: ver hallazgos', doc_step3_title: 'Qué revisar y qué se pudo verificar', doc_step3_desc: '“No verificable” no significa falso. Mira qué fuentes se recuperaron antes de sacar conclusiones.', doc_status_guide: 'Cómo leer estos estados', doc_supported: 'Respaldada', doc_contradicted: 'Contradicha', doc_needs_context: 'Contexto', doc_not_verifiable: 'No verificable', doc_supported_desc: 'Hay una fuente recuperada pertinente.', doc_contradicted_desc: 'Una fuente recuperada parece contradecirla.', doc_context_desc: 'Faltan hechos o contexto para evaluar.', doc_unknown_desc: 'El corpus disponible no permite confirmar ni negar.', doc_tech_title: 'Tecnología en este módulo', doc_tech_openai: 'Traducción y análisis estructurado.', doc_tech_rag: 'Recupera fragmentos del corpus jurídico si el índice está conectado.', doc_tech_extraction: 'Extracción de texto y vista integrada en el navegador.', doc_try_another: 'Probar otro documento', doc_back_translation: 'Volver a la traducción', doc_findings_title: 'Qué revisar', doc_source_references: 'Fuentes citadas por el análisis', doc_missing_info: 'Información que falta', doc_open_original: 'Archivo cargado', doc_technology_orienta: 'Tecnología en Orienta', doc_technology_live: 'Tecnología en voz en vivo',
};


// Complete the translation catalogue for labels that are shared by all modules.
Object.assign(ES, {
  language_quechua: 'Quechua', always_bilingual: 'Respuesta en dos paneles: español y quechua',
  followup_first: '¿Qué quieres aclarar ahora?', followup_continue: 'Sigue preguntando',
  followup_placeholder: 'Pregunta por un concepto, una fuente o el siguiente paso…',
  followup_context_note: 'La respuesta tendrá en cuenta el contexto reciente de esta conversación.',
  continue_conversation: 'Continuar', conversation_current: 'Conversación en curso', conversation_exchanges: 'intercambios',
  translation_missing_note: 'No se recibió una respuesta en quechua para este turno. No se debe inventar una traducción; vuelve a enviar la consulta.',
  open_download_source: 'Abrir fuente oficial', source_link_not_available: 'No se obtuvo un enlace directo', source_view_excerpt: 'Ver fragmento recuperado', developed_by_team: 'Desarrollado por Team SuperNova', answer_missing_spanish: 'No se recibió un texto en español para este turno.', doc_translation_empty_error: 'No se recibió el texto traducido. Reintenta la traducción o prueba con un documento más corto.', doc_translation_ready_analysis_pending: 'Traducción guardada. Ahora se analizan los puntos jurídicos…', doc_translation_ready_analysis_failed: 'La traducción se completó, pero falló el análisis jurídico. Puedes seguir leyendo la versión traducida y volver a intentar los hallazgos.',
  step1_of3: 'PASO 1 DE 3', step2_of3: 'PASO 2 DE 3', step3_of3: 'PASO 3 DE 3',
  paper_demo: 'MODELO FICTICIO · DEMOSTRACIÓN', paper_example: 'DOCUMENTO DE EJEMPLO', paper_not_official: 'NO ES UN DOCUMENTO OFICIAL',
  paper_reading_view: 'KHIPU LEGAL · VISTA DE LECTURA', paper_page: 'Página',
  loaded_file_preview: 'Archivo cargado. El contenido se mostrará en la vista de análisis después de procesarlo.',
  sources_fragments_retrieved: 'fragmentos de fuentes recuperados',
  live_status_direct: 'EN DIRECTO', live_status_processing: 'PROCESANDO', live_status_waiting: 'EN ESPERA',
  live_bilingual_title: 'Respuesta bilingüe + contraste', live_no_transcript: 'No se detectó voz inteligible en este segmento.',
  live_recording_long: 'La sesión continúa hasta que pulses “Terminar consulta”. Cada fragmento se prepara como un archivo independiente; si el análisis tarda, la cola seguirá procesándose después de detener la grabación.',
  demo_tag: 'EJEMPLO', doc_findings_count: 'hallazgos',
  step_original_short: 'Original', step_translation_short: 'Traducción', step_evidence_short: 'Evidencia',
  file_selected: 'Archivo del usuario', translation_experimental_badge: 'Quechua experimental', clear: 'Limpiar',
  tech_orienta_openai_desc: 'Comprensión de la consulta y ruta breve de búsqueda.',
  tech_orienta_rag_desc: 'Busca fragmentos en el índice jurídico conectado.',
  tech_orienta_graph_desc: 'Red de fuentes que realmente se recuperaron en esta consulta.',
  variety_chanka: 'Quechua chanka / Ayacucho', variety_cusco: 'Cusco-Collao (experimental)',
  variety_ancash: 'Áncash (experimental)', variety_wanka: 'Wanka (experimental)',
  switch_interface: 'Cambiar idioma de interfaz', switch_to_spanish: 'Cambiar toda la interfaz a español', switch_to_quechua: 'Cambiar toda la interfaz a quechua',
  develop_credit: 'Desarrollado por',
  answer_not_verified: 'La recuperación documental no confirmó una base suficiente para esta respuesta.',
  graph_network_title: 'Quipu de evidencia', graph_network_description: 'Cada hilo conecta esta consulta con archivos que la búsqueda devolvió realmente. No representa una puntuación de verdad jurídica.',
  graph_source_count: '{count} fragmento(s) · seleccionar', graph_no_results: 'No se devolvieron fragmentos', graph_connect_index: 'Conecta el índice jurídico', graph_no_evidence: 'No hay evidencia recuperada para mostrar', graph_details_no_snippet: 'El archivo fue recuperado, pero no llegó un fragmento textual visible.', graph_themes_label: 'Áreas detectadas (hipótesis de búsqueda):', graph_link_flow_note: 'El mapa cambia según los archivos y fragmentos recuperados. No estima la verdad ni sustituye la lectura de la fuente.',
  tech_orienta_openai_title: 'Comprensión de la consulta', tech_orienta_rag_title: 'Recuperación de fuentes', tech_orienta_graph_title: 'Trazabilidad visual',
  tech_orienta_openai_desc: 'Comprensión de la consulta y ruta breve de búsqueda.', tech_orienta_rag_desc: 'Busca fragmentos en el índice y consulta fuentes oficiales en la web cuando esté disponible.', tech_orienta_graph_desc: 'Red de fuentes que realmente se recuperaron en esta consulta.',
  source_type_web: 'Fuente web oficial', source_type_index: 'Archivo del índice', source_catalog_count: 'archivos en el índice', source_catalog_official: 'Catálogo oficial para consultar',
  doc_structure_warning: 'El análisis no llegó en el formato esperado. La traducción del documento sigue disponible; vuelve a ejecutar el análisis si necesitas los hallazgos.', error_backend_connection: 'No se puede conectar con el backend. Comprueba que la API esté ejecutándose.', error_api_key_missing: 'Falta configurar la clave de OpenAI en backend/.env.', error_openai_dependency: 'Falta instalar las dependencias de OpenAI en el entorno del backend.', error_document_processing: 'No se pudo extraer o traducir correctamente el documento.', error_ai_request: 'La solicitud de IA no pudo completarse. Comprueba la API y vuelve a intentarlo.', error_api_status: 'La solicitud no pudo completarse. Revisa la configuración del backend.' , error_audio_segment: 'No se pudo procesar el segmento de audio.', error_audio_next_segment: 'No se pudo iniciar el siguiente fragmento de audio.', error_audio_start_recording: 'No se pudo comenzar la grabación.', live_segment_count: 'fragmentos', api_backend_notice: 'La interfaz de demostración sigue disponible, pero las funciones con IA necesitan el backend.', graph_aria_label: 'Quipu visual de fuentes recuperadas', graph_open_source: 'Abrir fuente {name}', doc_stepper_aria_label: 'Pasos de lectura del documento', status_web_configured: 'Búsqueda web configurada', status_demo_no_sources: 'Sin fuentes conectadas', sources_web_description: 'Se pueden consultar fuentes oficiales en la web cuando la API esté configurada. Los resultados reales aparecerán como enlaces.',
  doc_alquiler_type: 'Contrato de arrendamiento', doc_alquiler_desc: 'Renta, depósito, penalidades y renovación', doc_alquiler_category: 'VIVIENDA',
  doc_laboral_type: 'Contrato de trabajo', doc_laboral_desc: 'Remuneración, jornada y descuentos', doc_laboral_category: 'TRABAJO',
  doc_servicios_type: 'Contrato de servicios', doc_servicios_desc: 'Honorarios, entregables y propiedad intelectual', doc_servicios_category: 'SERVICIOS',
  doc_prestamo_type: 'Acuerdo de préstamo', doc_prestamo_desc: 'Capital, pagos, recargos y condiciones', doc_prestamo_category: 'PRÉSTAMO',
  doc_citacion_type: 'Citación administrativa simulada', doc_citacion_desc: 'Motivo, fecha, lugar y consulta', doc_citacion_category: 'CITACIÓN',
  doc_municipal_type: 'Notificación municipal de ejemplo', doc_municipal_desc: 'Motivo, descargos, plazos y contacto', doc_municipal_category: 'MUNICIPAL',
  doc_tag_fictional: 'Ejemplo ficticio', doc_tag_not_official: 'Aviso: no es oficial', doc_tag_admin_case: 'Caso administrativo',
  doc_status_sources: 'Fuentes recuperadas', doc_status_no_evidence: 'Sin evidencia confirmada aún', doc_summary_accessible: 'RESUMEN ACCESIBLE', doc_findings_sources: 'Fuentes citadas por el análisis', doc_questions: 'Preguntas que puedes plantear', doc_priority_review: 'Revisión prioritaria', doc_review_recommended: 'Conviene revisar', doc_informative: 'Informativo',
  doc_original_explanation_label: 'Texto original en español', doc_quechua_explanation_label: 'Traducción al quechua', source_catalog_indexed: 'Archivos del índice',
  open_menu: 'Abrir menú', close_notice: 'Cerrar aviso', nav_modules: 'Módulos de Khipu Legal',
  error_audio_consent: 'Confirma el consentimiento para procesar el audio antes de iniciar.', error_audio_browser: 'Este navegador no ofrece captura de micrófono compatible. Prueba Chrome o Edge actualizado y usa localhost/HTTPS.', error_audio_segment: 'No se pudo procesar el segmento de audio.', error_audio_recording: 'El navegador indicó un error al grabar el audio.', error_audio_denied: 'No se autorizó el micrófono. Permite su uso en el navegador e inténtalo de nuevo.', error_audio_open: 'No se pudo abrir el micrófono', error_empty_query: 'Escribe una situación o elige un ejemplo para empezar.', error_query_analysis: 'No se pudo analizar la consulta.', error_file_type: 'Formato no compatible. Usa PDF, DOCX, TXT o una imagen JPG/PNG/WebP.', error_file_size: 'El archivo supera 15 MB. Prueba con una versión más pequeña.', error_select_document: 'Selecciona uno de los documentos de demostración o carga tu propio archivo.', error_document_analysis: 'No se pudo analizar el documento.', error_live_sample: 'No se pudo ejecutar el ejemplo.',
  doc_summary_es: 'Resumen en español', doc_summary_qu: 'Resumen en quechua', doc_summary_translation_missing: 'La traducción de este campo no se pudo generar. Reintenta el análisis para obtenerla.', doc_finding_es: 'Explicación en español', doc_finding_qu: 'Explicación en quechua', doc_reason_es: 'Motivo en español', doc_reason_qu: 'Motivo en quechua', doc_questions_es: 'Preguntas en español', doc_questions_qu: 'Preguntas en quechua',
  engine_title: 'KHIPU Evidence Engine · Motor de trazabilidad', engine_subtitle: 'Conecta cada explicación con los fragmentos que realmente se recuperaron; no emite un veredicto automático.', engine_source_count: 'fuentes recuperadas', engine_claim_count: 'elementos revisados', engine_linked_count: 'elementos con vínculo textual', engine_unlinked_count: 'fuentes sin vínculo claro', engine_status_partial: 'Trazabilidad parcial', engine_status_no_sources: 'Sin fuentes recuperadas', engine_status_sources_unlinked: 'Vínculo no identificado', engine_claim: 'Elemento revisado', engine_claim_es: 'Español', engine_claim_qu: 'Quechua', engine_no_exact_translation: 'No se identificó una cita exacta en quechua para este hallazgo. No se debe presentar una traducción inferida como cita literal.', engine_linked_sources: 'Fuentes relacionadas por texto', engine_relation_named: 'Nombre de la fuente mencionado en el análisis', engine_relation_overlap: 'Coincidencia de términos · relación por revisar', engine_overlap_terms: 'Términos coincidentes', engine_no_links: 'No se detectó un vínculo textual claro con las fuentes recuperadas.', engine_reference_checks: 'Comprobación de menciones jurídicas', engine_reference_found: 'La mención aparece en el material recuperado', engine_reference_not_found: 'La mención no se localizó en el material recuperado', engine_reference_disclaimer: 'Encontrar una mención no confirma por sí solo la vigencia ni la interpretación jurídica de la referencia.', engine_panel_note: 'Este motor usa reglas deterministas de coincidencia de texto y presencia de referencias. Una coincidencia no demuestra que la fuente respalde jurídicamente la afirmación.', engine_open_source: 'Abrir fuente', engine_show_full_item: 'Ver texto completo', engine_method: 'Método', engine_method_value: 'Coincidencia textual y presencia de referencias', engine_source_count_empty: 'No se recuperaron fuentes para generar un rastro documental.', engine_claim_source_note: 'Las fuentes enlazadas son pistas de revisión, no una validación automática de legalidad.',   engine_exact_quote_label: 'Fragmento citado del documento',
  doc_followup_title: 'Continúa consultando este documento', doc_followup_desc: 'Pregunta por una cláusula, una norma o el siguiente paso. La respuesta buscará fuentes nuevas cuando sea posible.',
  live_followup_title: 'Sigue preguntando sobre la conversación', live_followup_desc: 'Pregunta por un segmento o pide que te expliquemos el derecho, la autoridad competente y las fuentes.',
  followup_question_label: 'Pregunta', doc_legal_basis: 'Base jurídica y alcance', doc_legal_basis_qu: 'Base jurídica en quechua', doc_authority: 'Autoridad y función', doc_authority_qu: 'Autoridad y función en quechua', doc_next_steps: 'Pasos siguientes', doc_next_steps_qu: 'Pasos siguientes en quechua',
  doc_legal_basis_missing: 'No se identificó una base jurídica específica en las fuentes recuperadas.', doc_authority_missing: 'La autoridad competente depende de los hechos y la materia.',
});

const MODULES = [
  { id: 'orienta', icon: GitBranch, titleKey: 'nav_orienta', descriptionKey: 'module_description_orienta', accent: 'clay' },
  { id: 'documentos', icon: FileSearch, titleKey: 'nav_documentos', descriptionKey: 'module_description_documents', accent: 'gold' },
  { id: 'live', icon: AudioLines, titleKey: 'nav_live', descriptionKey: 'module_description_live', accent: 'moss' },
];

function cx(...parts) { return parts.filter(Boolean).join(' '); }

function Brand({ compact = false, onClick }) {
  return (
    <button className={cx('brand-lockup', compact && 'brand-compact')} onClick={onClick} type="button" aria-label="Khipu Legal">
      <span className="brand-symbol"><span /><span /><span /><span /></span>
      <span className="brand-word">KHIPU LEGAL<span className="brand-dot">.</span><small>TEAM SUPERNOVA</small></span>
    </button>
  );
}

function InterfaceSwitch({ value, onChange, busy = false, label = 'Interfaz', t = (key) => key }) {
  return (
    <div className="interface-switch" role="group" aria-label={t('switch_interface')}>
      <span className="switch-label"><Languages size={14} /> {label}</span>
      <button type="button" disabled={busy} className={value === 'es' ? 'selected' : ''} onClick={() => onChange('es')} aria-label={t('switch_to_spanish')}>ES</button>
      <span className="language-switch-arrow" aria-hidden="true"><ArrowDownUp size={13} /></span>
      <button type="button" disabled={busy} className={value === 'qu' ? 'selected' : ''} onClick={() => onChange('qu')} aria-label={t('switch_to_quechua')}>QU</button>
      {busy && <LoaderCircle className="spin tiny" size={13} />}
    </div>
  );
}

function StatusBadge({ good, children }) {
  return <span className={cx('status-badge', good ? 'status-good' : 'status-warn')}><span className="status-dot" />{children}</span>;
}

function ModuleHeader({ icon: Icon, eyebrow, title, subtitle, color = 'clay' }) {
  return (
    <div className={`module-header accent-${color}`}>
      <div className="module-icon"><Icon size={22} strokeWidth={1.7} /></div>
      <div className="module-heading-copy"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>
    </div>
  );
}

function MarkdownAnswer({ children }) {
  return <div className="markdown-answer"><ReactMarkdown>{children || ''}</ReactMarkdown></div>;
}

function EvidenceGraph({ query, plan, sources = [], connected, t }) {
  const [selected, setSelected] = useState(0);
  const hasEvidence = sources.length > 0;
  const grouped = [];
  const index = new Map();
  for (const source of sources) {
    const filename = source.filename || source.title || 'Fuente recuperada';
    if (!index.has(filename)) {
      const item = { filename, snippets: [], url: source.url || '', count: 0 };
      index.set(filename, item); grouped.push(item);
    }
    const item = index.get(filename);
    item.count += 1;
    if (source.snippet && item.snippets.length < 2) item.snippets.push(source.snippet);
    if (!item.url && source.url) item.url = source.url;
  }
  const visibleSources = grouped.slice(0, 8);
  const height = Math.max(180, 58 + Math.max(1, visibleSources.length) * 66);
  const centerY = height / 2;
  const active = visibleSources[Math.min(selected, Math.max(0, visibleSources.length - 1))];
  const themes = (plan?.legal_areas || []).slice(0, 4);
  return <section className="surface-card evidence-graph-card">
    <div className="graph-head"><div><div className="eyebrow">{t('graph_eyebrow')}</div><h3>{t('graph_network_title')}</h3><p>{t('graph_network_description')}</p></div><span className="graph-legend"><span />{hasEvidence ? `${sources.length} ${t('sources_count')}` : connected ? t('graph_no_results') : t('no_index')}</span></div>
    <div className="evidence-graph-scroll"><svg className="evidence-graph-svg quipu-evidence-svg" viewBox={`0 0 720 ${height}`} role="group" aria-label={t('graph_aria_label')}>
      <defs><linearGradient id="khipu-thread" x1="0" x2="1"><stop offset="0%" stopColor="#bc8d44" stopOpacity=".65"/><stop offset="100%" stopColor="#7d9d73" stopOpacity=".9"/></linearGradient></defs>
      <rect x="18" y={centerY - 37} width="170" height="74" rx="16" className="quipu-root-card" />
      <circle cx="42" cy={centerY - 13} r="5" className="quipu-root-dot" />
      <text x="56" y={centerY - 8} className="quipu-root-title">{t('graph_query')}</text>
      <text x="32" y={centerY + 13} className="quipu-root-subtitle">{(query || t('graph_query_original')).slice(0, 22)}{(query || '').length > 22 ? '…' : ''}</text>
      {visibleSources.map((source, i) => {
        const y = 29 + i * 66;
        const label = source.filename.length > 28 ? source.filename.slice(0, 27) + '…' : source.filename;
        return <g key={source.filename} role="button" tabIndex="0" aria-label={t('graph_open_source').replace('{name}', source.filename)} className={`quipu-source-node ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(i); } }}>
          <path d={`M 188 ${centerY} C 270 ${centerY}, 280 ${y + 25}, 374 ${y + 25}`} className="quipu-thread" />
          <circle cx="374" cy={y + 25} r={5 + Math.min(source.count, 6)} className="quipu-knot" />
          <rect x="392" y={y} width="305" height="50" rx="12" className="quipu-source-rect" />
          <circle cx="410" cy={y + 16} r="3.5" className="quipu-source-dot" />
          <text x="421" y={y + 20} className="quipu-source-title">{label}</text>
          <text x="408" y={y + 38} className="quipu-source-subtitle">{t('graph_source_count').replace('{count}', source.count)}</text>
        </g>;
      })}
      {!visibleSources.length && <g><path d={`M 188 ${centerY} C 270 ${centerY}, 280 ${centerY}, 374 ${centerY}`} className="quipu-thread quipu-thread-muted"/><rect x="392" y={centerY - 25} width="305" height="50" rx="12" className="quipu-empty-rect"/><text x="410" y={centerY - 2} className="quipu-source-title">{t('graph_no_results')}</text><text x="410" y={centerY + 16} className="quipu-source-subtitle">{t('graph_no_evidence')}</text></g>}
    </svg></div>
    {active && <div className="graph-detail"><div className="graph-detail-mark"><BookOpen size={16}/></div><div><strong>{active.filename}</strong><p>{active.snippets.join(' · ') || t('graph_details_no_snippet')}</p>{active.url && <a href={active.url} target="_blank" rel="noreferrer" className="source-open-link"><ExternalLink size={13}/> {t('open_download_source')}</a>}</div></div>}
    {themes.length > 0 && <div className="graph-themes"><span>{t('graph_themes_label')}</span>{themes.map((theme, i) => <span key={i} className="plan-tag">{theme}</span>)}</div>}
    <div className="graph-footnote"><Info size={13}/>{connected ? t('graph_link_flow_note') : t('source_no_index_detail')}</div>
  </section>;
}

function SourcesPanel({ sources = [], grounded, connected, t }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <section className="surface-card sources-panel">
      <button className="panel-heading panel-toggle" onClick={() => setExpanded(v => !v)} type="button" aria-expanded={expanded}>
        <span className="panel-heading-icon"><BookOpen size={17} /></span>
        <span className="panel-heading-text"><strong>{t('sources')}</strong><small>{sources.length ? t('source_fragments_count').replace('{count}', sources.length) : connected ? t('no_sources') : t('not_connected')}</small></span>
        <ChevronDown size={17} className={expanded ? '' : 'rotate-closed'} />
      </button>
      {expanded && <div className="sources-list">
        {sources.length > 0 ? sources.map((source, i) => (
          <article className="source-item source-item-visible" key={`${source.url || source.filename || source.title}-${i}`}>
            <div className="source-row-visible"><span className="source-index">{String(i + 1).padStart(2, '0')}</span><div className="source-main-visible"><strong className="source-name">{source.title || source.filename || 'Fuente oficial recuperada'}</strong>{source.institution && <small className="source-institution">{source.institution}</small>}<span className={cx('source-type-pill', source.source_type === 'web' ? 'source-type-web' : 'source-type-index')}>{t(source.source_type === 'web' ? 'source_type_web' : 'source_type_index')}</span>{source.url ? <a className="source-open-link source-open-link-inline" href={source.url} target="_blank" rel="noreferrer"><ExternalLink size={14}/> {t('open_download_source')}</a> : <span className="source-link-unavailable">{t('source_link_not_available')}</span>}</div></div>
            {source.snippet && <details className="source-snippet-details"><summary>{t('source_view_excerpt')}</summary><p>{source.snippet}</p></details>}
          </article>
        )) : <div className="empty-source"><Info size={18} /><span>{connected ? t('no_sources') : t('source_no_index_detail')}</span></div>}
        {sources.length > 0 && <div className={cx('source-grounding', grounded ? 'grounded' : '')}><ShieldCheck size={15} />{grounded ? t('source_grounded_note') : t('source_not_proof_note')}</div>}
      </div>}
    </section>
  );
}

function EvidenceEnginePanel({ engine, t }) {
  if (!engine) return null;
  const engineSources = Array.isArray(engine.sources) ? engine.sources : [];
  const claims = Array.isArray(engine.claims) ? engine.claims : [];
  const citationChecks = Array.isArray(engine.citation_checks) ? engine.citation_checks : [];
  const sourceMap = new Map(engineSources.map((source) => [source.id, source]));
  const statusKey = engine.status === 'no_sources'
    ? 'engine_status_no_sources'
    : engine.status === 'partial_trace'
      ? 'engine_status_partial'
      : 'engine_status_sources_unlinked';

  const linkedSourcesFor = (claim) => (claim.links || [])
    .map((link) => ({ ...link, source: sourceMap.get(link.source_id) }))
    .filter((link) => link.source);

  return <section className="surface-card evidence-engine-panel" aria-label={t('engine_title')}>
    <div className="evidence-engine-heading">
      <div className="evidence-engine-mark"><ShieldCheck size={19}/></div>
      <div className="evidence-engine-heading-copy">
        <div className="eyebrow">{t('engine_method')}</div>
        <h3>{t('engine_title')}</h3>
        <p>{t('engine_subtitle')}</p>
      </div>
      <span className={cx('evidence-engine-status', engine.status === 'partial_trace' && 'status-partial')}>{t(statusKey)}</span>
    </div>
    <div className="evidence-engine-metrics">
      <div><strong>{Number(engine.source_count || 0)}</strong><span>{t('engine_source_count')}</span></div>
      <div><strong>{Number(engine.claim_count || 0)}</strong><span>{t('engine_claim_count')}</span></div>
      <div><strong>{Number(engine.linked_claim_count || 0)}</strong><span>{t('engine_linked_count')}</span></div>
      <div><strong>{Number(engine.sources_without_clear_link_count || 0)}</strong><span>{t('engine_unlinked_count')}</span></div>
    </div>
    {!engineSources.length && <p className="evidence-engine-empty"><Info size={15}/>{t('engine_source_count_empty')}</p>}
    {claims.length > 0 && <div className="evidence-engine-claims">
      {claims.slice(0, 5).map((claim, idx) => {
        const links = linkedSourcesFor(claim);
        const textEs = String(claim.text_es || '').trim();
        const textQu = String(claim.text_qu || '').trim();
        return <article className="evidence-engine-claim" key={claim.id || idx}>
          <div className="evidence-engine-claim-top"><span>{String(idx + 1).padStart(2, '0')}</span><strong>{claim.title_es || t('engine_claim')}</strong><span className="evidence-engine-link-count">{links.length} {t('engine_linked_sources')}</span></div>{claim.title_qu && <p className="evidence-engine-title-qu" lang="qu">{claim.title_qu}</p>}
          <div className="evidence-engine-bilingual">
            <div><span className="evidence-engine-language">ES · {t('engine_claim_es')}</span><p>{textEs.length > 360 ? `${textEs.slice(0, 360).trim()}…` : (textEs || '—')}</p>{textEs.length > 360 && <details><summary>{t('engine_show_full_item')}</summary><p>{textEs}</p></details>}</div>
            <div><span className="evidence-engine-language">QU · {t('engine_claim_qu')}</span><p>{textQu ? (textQu.length > 360 ? `${textQu.slice(0, 360).trim()}…` : textQu) : t('engine_no_exact_translation')}</p>{textQu.length > 360 && <details><summary>{t('engine_show_full_item')}</summary><p>{textQu}</p></details>}</div>
          </div>
          {claim.quote_es && <div className="evidence-engine-quote-compare"><strong>{t('engine_exact_quote_label')}</strong><div><small>ES</small><p>{claim.quote_es}</p></div><div><small>QU</small><p>{claim.quote_qu || t('engine_no_exact_translation')}</p></div></div>}
          {links.length > 0 ? <div className="evidence-engine-linked-sources"><strong>{t('engine_linked_sources')}</strong>{links.slice(0, 5).map((link, sourceIdx) => <div className="evidence-engine-source-link" key={`${link.source_id}-${sourceIdx}`}>
            <div className="evidence-engine-source-line"><BookOpen size={14}/><span>{link.source.title || link.source.filename}</span>{link.source.url && <a href={link.source.url} target="_blank" rel="noreferrer" aria-label={`${t('engine_open_source')}: ${link.source.title}`}><ExternalLink size={13}/>{t('engine_open_source')}</a>}</div>
            <small>{link.relation === 'named_in_analysis' ? t('engine_relation_named') : t('engine_relation_overlap')}{link.matched_terms?.length ? ` · ${t('engine_overlap_terms')}: ${link.matched_terms.join(', ')}` : ''}</small>
            {link.source.snippet && <details><summary>{t('source_view_excerpt')}</summary><p>{link.source.snippet}</p></details>}
          </div>)}</div> : <p className="evidence-engine-no-links"><Info size={14}/>{t('engine_no_links')}</p>}
        </article>;
      })}
    </div>}
    {citationChecks.length > 0 && <details className="evidence-engine-citation-checks">
      <summary><Search size={14}/>{t('engine_reference_checks')} ({citationChecks.length})</summary>
      {citationChecks.slice(0, 12).map((check, idx) => <div key={`${check.reference}-${idx}`} className="evidence-engine-citation-row"><span>{check.reference}</span><small className={check.status === 'mention_found_in_retrieved_material' ? 'citation-found' : 'citation-not-found'}>{t(check.status === 'mention_found_in_retrieved_material' ? 'engine_reference_found' : 'engine_reference_not_found')}</small>{(check.source_titles || []).length > 0 && <small>{check.source_titles.join(' · ')}</small>}</div>)}
      <p className="evidence-engine-disclaimer">{t('engine_reference_disclaimer')}</p>
    </details>}
    <div className="evidence-engine-limitations"><Info size={15}/><div><p>{t('engine_panel_note')}</p>{engine.limitations?.qu && <p lang="qu">{engine.limitations.qu}</p>}</div></div>
  </section>;
}

function QuickSourceCard({ health, t }) {
  const localRag = Boolean(health?.vector_store_connected);
  const webConfigured = Boolean(health?.api_configured && health?.web_search_enabled);
  const label = localRag ? `${t('connected')} · ${health?.vector_store_hint || 'RAG'}` : webConfigured ? t('status_web_configured') : t('not_connected');
  return (
    <section className="surface-card corpus-card">
      <div className="corpus-orb"><Network size={21} /></div>
      <div className="corpus-copy"><strong>{t('sources_status')}</strong><span>{label}</span></div>
      <StatusBadge good={localRag || webConfigured}>{localRag ? t('rag_active') : webConfigured ? t('status_web_configured') : t('no_index')}</StatusBadge>
      <p>{localRag ? t('quick_source_desc') : webConfigured ? t('sources_web_description') : t('source_no_index_detail')}</p>
    </section>
  );
}

function MessageSquareIcon() { return <span className="history-message-icon"><Languages size={16}/></span>; }

function splitBilingualAnswer(value = '') {
  const raw = String(value || '').trim();
  if (!raw) return { es: '', qu: '', split: false };
  const lines = raw.split(/\r?\n/);
  const quechuaHeading = /^\s*(?:#{1,6}[ \t]*)?(?:\*\*)?[ \t]*(?:Quechua|Runasimi)(?:[ \t]*\([^\n)]*\))?[ \t]*(?:\*\*)?[ \t]*:?[ \t]*$/i;
  const spanishHeading = /^\s*(?:#{1,6}[ \t]*)?(?:\*\*)?[ \t]*(?:Español|Spanish)[ \t]*(?:\*\*)?[ \t]*:?[ \t]*$/i;
  const quechuaIndex = lines.findIndex(line => quechuaHeading.test(line));
  if (quechuaIndex >= 0) {
    const spanishLines = lines.slice(0, quechuaIndex);
    const quechuaLines = lines.slice(quechuaIndex + 1);
    if (spanishLines.length && spanishHeading.test(spanishLines[0])) spanishLines.shift();
    const es = spanishLines.join('\n').trim();
    const qu = quechuaLines.join('\n').trim();
    if (es && qu) return { es, qu, split: true };
  }
  // Inline fallback only when a colon explicitly identifies the Quechua section.
  const inline = raw.match(/\s+(?:\*\*)?(?:Quechua|Runasimi)(?:\s*\([^)]*\))?(?:\*\*)?\s*:\s*/i);
  if (inline) {
    let es = raw.slice(0, inline.index).trim();
    es = es.replace(/^\s*(?:\*\*)?(?:Español|Spanish)(?:\*\*)?\s*:\s*/i, '').trim();
    const qu = raw.slice(inline.index + inline[0].length).trim();
    if (es && qu) return { es, qu, split: true };
  }
  const output = lines.filter((line, index) => !(index === 0 && spanishHeading.test(line)));
  return { es: output.join('\n').trim(), qu: '', split: false };
}

function BilingualAnswer({ children, es, qu, t = (key) => ({ language_spanish: 'Español', language_quechua: 'Quechua', experimental_tag: 'experimental' }[key] || key) }) {
  const parsed = splitBilingualAnswer(children);
  const spanish = String(es || parsed.es || '').trim();
  const quechua = String(qu || parsed.qu || '').trim();
  return <div className="bilingual-answer-grid">
    <section className="bilingual-answer-panel language-es-panel"><div className="bilingual-panel-heading"><span>ES</span><h3>{t('language_spanish')}</h3></div>{spanish ? <MarkdownAnswer>{spanish}</MarkdownAnswer> : <p className="translation-missing-note">{t('answer_missing_spanish')}</p>}</section>
    <section className="bilingual-answer-panel language-qu-panel"><div className="bilingual-panel-heading"><span>QU</span><h3>{t('language_quechua')} · {t('experimental_tag')}</h3></div>{quechua ? <MarkdownAnswer>{quechua}</MarkdownAnswer> : <p className="translation-missing-note">{t('translation_missing_note')}</p>}</section>
  </div>;
}

function OrientaView({ t, health, examples, defaultVariety }) {
  const [query, setQuery] = useState('');
  const [inputLanguage, setInputLanguage] = useState('es');
  const outputLanguage = 'bi';
  const [variety, setVariety] = useState(defaultVariety);
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [chatTurns, setChatTurns] = useState([]);
  const [lastQuestion, setLastQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const answerSectionRef = useRef(null);

  useEffect(() => {
    if (result && answerSectionRef.current) answerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const quickExamples = examples?.scenarios || [
    { label: t('example_defamation'), query: 'Me han difamado en redes sociales. ¿Qué opciones legales generales puedo evaluar y qué fuentes las respaldan?' },
    { label: t('example_notice'), query: 'He recibido una citación en español y no entiendo qué debo hacer. ¿Qué información debo revisar?' },
    { label: t('example_contract'), query: 'Quiero entender qué obligaciones, penalidades y condiciones de renovación debo revisar antes de firmar un contrato de alquiler.' },
  ];

  const submit = async (event) => {
    event?.preventDefault();
    if (query.trim().length < 3) return setError(t('error_empty_query'));
    const currentQuestion = query.trim();
    setLoading(true); setError('');
    const priorContext = chatTurns.slice(-4).map((turn, index) => `Intercambio ${index + 1} — persona: ${turn.query}\nRespuesta previa resumida: ${(turn.answer || '').slice(0, 650)}`).join('\n\n');
    const combinedContext = [context, priorContext ? `Historial breve de esta conversación (úsalo como contexto, no como fuente jurídica):\n${priorContext}` : ''].filter(Boolean).join('\n\n').slice(0, 2800);
    try {
      const response = await api.orienta({ query: currentQuestion, input_language: inputLanguage, output_language: outputLanguage, variety, context: combinedContext, max_results: 12 });
      setResult(response);
      setLastQuestion(currentQuestion);
      setChatTurns(prev => [...prev, { query: currentQuestion, answer: response.answer, answer_es: response.answer_es, answer_qu: response.answer_qu, sources: response.sources || [] }]);
      setQuery('');
    } catch (err) { setError(err.message || t('error_query_analysis')); }
    finally { setLoading(false); }
  };


  return (
    <div className="module-grid orienta-grid">
      <div className="module-main-column">
        <ModuleHeader icon={GitBranch} eyebrow={t('orienta_eyebrow')} title={t('orienta_title')} subtitle={t('orienta_subtitle')} color="clay" />
        {!result && <section className="surface-card composer-card">
          <div className="input-languages-row orienta-language-row">
            <label className="select-label"><span>{t('input_language')}</span><select value={inputLanguage} onChange={e => setInputLanguage(e.target.value)}><option value="es">Español</option><option value="qu">Quechua</option></select></label>
            <span className="language-output-hint"><Languages size={16}/> {t('always_bilingual')}</span>
            <label className="select-label"><span>{t('variety')}</span><select value={variety} onChange={e => setVariety(e.target.value)}><option value="chanka">{t('variety_chanka')}</option><option value="cusco-collao">{t('variety_cusco')}</option><option value="ancashino">{t('variety_ancash')}</option><option value="wanka">{t('variety_wanka')}</option></select></label>
          </div>
          <>
            <form onSubmit={submit}>
              <label className="field-label" htmlFor="situation-input">{chatTurns.length ? t('followup_first') : t('orienta_title')}</label>
              <textarea id="situation-input" rows={5} value={query} onChange={e => setQuery(e.target.value)} placeholder={chatTurns.length ? t('followup_placeholder') : t('input_placeholder')} maxLength={10000} />
              <div className="composer-footer"><span className="microcopy">{query.length.toLocaleString()} / 10 000</span><button className="button-primary" type="submit" disabled={loading || query.trim().length < 3}>{loading ? <><LoaderCircle size={16} className="spin" />{t('working')}</> : <><Sparkles size={16} />{t('analyze')}<ArrowRight size={16} /></>}</button></div>
            </form>
            <div className="quick-examples"><div className="quick-heading"><Sparkles size={14} />{t('examples')}</div><div className="example-chips">{quickExamples.map((item, idx) => { const labelKeys = ['example_defamation','example_notice','example_contract','example_work_contract','example_loan','example_service','example_municipal','example_language_rights']; return <button type="button" key={item.label || idx} className="example-chip" onClick={() => { setQuery(item.query); setInputLanguage('es'); setError(''); }}>{t(labelKeys[idx]) || item.label || item.query}<ArrowRight size={13} /></button>; })}</div></div>
            <label className="field-label optional-context-label" htmlFor="extra-context">{t('additional_context')}</label>
            <input id="extra-context" className="text-input" value={context} onChange={e => setContext(e.target.value)} placeholder={t('additional_context_placeholder')} />
            {error && <div className="error-callout"><AlertTriangle size={16} />{error}</div>}
          </>
        </section>}

        {chatTurns.length > 1 && <section className="conversation-history"><div className="history-heading"><MessageSquareIcon/><strong>{t('conversation_current')}</strong><span>{chatTurns.length} {t('conversation_exchanges')}</span></div>{chatTurns.slice(0, -1).map((turn, i) => <details className="history-turn" key={`${i}-${turn.query}`}><summary><span>{String(i + 1).padStart(2,'0')}</span>{turn.query}<ChevronDown size={15}/></summary><BilingualAnswer t={t} es={turn.answer_es} qu={turn.answer_qu}>{turn.answer}</BilingualAnswer></details>)}</section>}
        {result && <section className="answer-section" ref={answerSectionRef}>
          <div className="answer-topline"><div className="answer-title"><span className="success-orb"><CheckCircle2 size={18} /></span><div><h2>{t('result_title')}</h2><p>{result.grounded ? `${(result.sources || []).length} ${t('sources_fragments_retrieved')}` : t('answer_not_verified')}</p></div></div><button className="icon-action" title={t('clear')} onClick={() => { setResult(null); }}><X size={17} /></button></div>
          {result.warning && <div className="warning-callout"><AlertTriangle size={16} /><span>{result.warning}</span></div>}
          <BilingualAnswer t={t} es={result.answer_es} qu={result.answer_qu}>{result.answer}</BilingualAnswer>
          <form className="followup-composer surface-card" onSubmit={submit}>
            <div className="followup-heading-row"><MessageSquareIcon/><label className="field-label" htmlFor="followup-input">{chatTurns.length > 1 ? t('followup_continue') : t('followup_first')}</label></div>
            <textarea id="followup-input" rows={2} value={query} onChange={e => setQuery(e.target.value)} placeholder={t('followup_placeholder')} maxLength={10000}/>
            {error && <div className="error-callout"><AlertTriangle size={15}/>{error}</div>}
            <div className="followup-footer"><span>{t('followup_context_note')}</span><button className="button-primary" type="submit" disabled={loading || query.trim().length < 3}>{loading ? <LoaderCircle size={15} className="spin"/> : <Send size={15}/>} {t('continue_conversation')}</button></div>
          </form>
          <SourcesPanel sources={result.sources} grounded={result.grounded} connected={Boolean(result.vector_store_connected || result.web_search_enabled)} t={t} />
          <EvidenceEnginePanel engine={result.evidence_engine} t={t} />
          <details className="plan-card"><summary><div><Search size={16}/><strong>{t('planned_search')}</strong></div><ChevronDown size={16}/></summary><p>{result.plan?.issue_summary}</p><div className="plan-tags">{(result.plan?.legal_areas || []).slice(0, 5).map((v, i) => <span className="plan-tag" key={i}>{v}</span>)}</div>{(result.plan?.search_queries || []).length > 0 && <div className="query-plan-list"><span>{t('queries_prepared')}</span>{result.plan.search_queries.slice(0, 5).map((v, i) => <small key={i}>↳ {v}</small>)}</div>}</details>
          {result.plan && <EvidenceGraph query={lastQuestion || query} plan={result.plan} sources={result.sources || []} connected={Boolean(result.vector_store_connected || result.web_search_enabled)} t={t}/>}

        </section>}
      </div>
      <aside className="module-rail"><QuickSourceCard health={health} t={t} /><div className="rail-note"><div className="rail-note-icon"><ShieldCheck size={18} /></div><div><strong>{t('orienta_rail_title')}</strong><p>{t('orienta_rail_body')}</p></div></div><CorpusPeek health={health} t={t} /><div className="surface-card tech-stack-card"><span className="eyebrow">{t('doc_technology_orienta')}</span><strong><Sparkles size={15}/> OpenAI API</strong><small>{t('tech_orienta_openai_desc')}</small><strong><Network size={15}/> RAG · File Search</strong><small>{t('tech_orienta_rag_desc')}</small><strong><GitBranch size={15}/> {t('graph_title')}</strong><small>{t('tech_orienta_graph_desc')}</small></div></aside>
    </div>
  );
}

function CorpusPeek({ health, t }) {
  const [sources, setSources] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { api.sources().then(setSources).catch(() => setSources(null)); }, []);
  const indexed = sources?.files || [];
  const catalog = sources?.catalog || [];
  return <section className="surface-card source-catalog-card"><button className="panel-heading panel-toggle" onClick={() => setOpen(v => !v)} type="button"><span className="panel-heading-icon"><BookOpen size={17} /></span><span className="panel-heading-text"><strong>{t('source_catalog_title')}</strong><small>{indexed.length ? `${indexed.length} ${t('source_catalog_count')}` : t('source_catalog_official')}</small></span><ChevronDown size={16} className={open ? '' : 'rotate-closed'} /></button>{open && <div className="source-catalog-list">
    {indexed.length > 0 && <><div className="catalog-section-title">{t('source_type_index')}</div>{indexed.map((f, i) => <div className="catalog-line" key={`idx-${i}`}><span className="catalog-number">{String(i + 1).padStart(2, '0')}</span><div><strong>{f.filename}</strong><small>{f.status}</small>{f.url && <a href={f.url} target="_blank" rel="noreferrer">{t('open_download_source')} <ExternalLink size={11} /></a>}</div></div>)}</>}
    <div className="catalog-section-title">{t('source_catalog_official')}</div>{catalog.map((source, i) => <div className="catalog-line" key={`cat-${i}`}><span className="catalog-number">{String(i + 1).padStart(2, '0')}</span><div><strong>{source.title}</strong><small>{source.institution} · {source.note || source.topic || ''}</small><a href={source.url} target="_blank" rel="noreferrer">{t('open_download_source')} <ExternalLink size={11}/></a></div></div>)}{!sources && <p className="muted-small">{t('source_catalog_unavailable')}</p>}<p className="muted-small">{t('catalog_warning')}</p></div>}</section>;
}

function DocumentPaper({ document, highlighted = [], translated = false, t = (key) => key, emptyLabel = 'Selecciona un documento' }) {
  if (!document) return <div className="document-paper document-paper-empty"><FileText size={28} /><span>{emptyLabel}</span></div>;
  const text = translated ? (document.translated_document || '') : (document.text || '');
  const paragraphs = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const originalText = document.original_text || (translated ? document.text : '');
  const originalParagraphs = String(originalText || '').split(/\n+/).map(line => line.trim()).filter(Boolean);
  const highlightTerms = highlighted.map(item => translated ? item.translated_quote : item.quote).filter(Boolean).sort((a, b) => b.length - a.length);
  const fallbackParagraphIndices = new Set();
  if (translated && originalParagraphs.length) {
    highlighted.forEach((item) => {
      if (item.translated_quote || !item.quote) return;
      const originalIndex = originalParagraphs.findIndex(paragraph => paragraph.includes(item.quote) || item.quote.includes(paragraph));
      // The translation prompt preserves paragraph order; if an exact Quechua quote was not returned,
      // underline the corresponding translated paragraph as a linked review target, not as a word-for-word match.
      if (originalIndex >= 0 && originalIndex < paragraphs.length) fallbackParagraphIndices.add(originalIndex);
    });
  }
  const renderHighlighted = (line) => {
    let chunks = [{ text: line, hit: false }];
    highlightTerms.forEach(term => {
      const next = [];
      chunks.forEach(chunk => {
        if (chunk.hit || !chunk.text.toLowerCase().includes(term.toLowerCase())) { next.push(chunk); return; }
        const idx = chunk.text.toLowerCase().indexOf(term.toLowerCase());
        if (idx > 0) next.push({ text: chunk.text.slice(0, idx), hit: false });
        next.push({ text: chunk.text.slice(idx, idx + term.length), hit: true });
        if (idx + term.length < chunk.text.length) next.push({ text: chunk.text.slice(idx + term.length), hit: false });
      });
      chunks = next;
    });
    return chunks.map((chunk, i) => chunk.hit ? <mark key={i}>{chunk.text}</mark> : <span key={i}>{chunk.text}</span>);
  };
  return <div className="document-paper">
    <div className="paper-topline"><span>{t('paper_demo')}</span><span>{document.reference || 'DOC-DEMO'}</span></div>
    <div className="paper-emblem"><Scale size={22} /><span>{t('paper_example')}<br/><small>{t('paper_not_official')}</small></span></div>
    <div className="paper-content">{paragraphs.map((line, i) => <p className={/^(CONTRATO|ACUERDO|NOTIFICACIÓN|CITACIÓN|MODELO|DOCUMENTO|FIRMAS|FIN DEL|PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|OCTAVA|[0-9]+\.)/i.test(line) ? 'paper-heading' : ''} key={`${i}-${line.slice(0,12)}`}>{translated && fallbackParagraphIndices.has(i) ? <mark title={t('doc_highlight_translation_associated')}>{line}</mark> : renderHighlighted(line)}</p>)}</div>
    <div className="paper-footer"><span>KHIPU LEGAL · TEAM SUPERNOVA · {t('paper_reading_view')}</span><span>{t('paper_page')} 1 / 1</span></div>
  </div>;
}


function FollowupAssistant({ title, subtitle, question, setQuestion, turns = [], busy = false, error = '', onSubmit, t }) {
  return <section className="followup-assistant surface-card">
    <div className="followup-assistant-heading"><div className="insight-ico"><MessageSquareIcon /></div><div><h3>{title}</h3><p>{subtitle}</p></div></div>
    {turns.map((turn, index) => <article className="followup-turn" key={`${index}-${turn.question}`}>
      <div className="followup-turn-question"><span>{t('followup_question_label') || 'Pregunta'}</span><p>{turn.question}</p></div>
      <BilingualAnswer t={t} es={turn.answer_es} qu={turn.answer_qu}>{turn.answer}</BilingualAnswer>
      <SourcesPanel sources={turn.sources || []} grounded={turn.grounded} connected={Boolean(turn.vector_store_connected || turn.web_search_enabled)} t={t}/>
      <EvidenceEnginePanel engine={turn.evidence_engine} t={t}/>
    </article>)}
    <form className="followup-form" onSubmit={onSubmit}>
      <textarea value={question} onChange={event => setQuestion(event.target.value)} rows={2} maxLength={10000} placeholder={t('followup_placeholder') || 'Escribe tu siguiente pregunta…'} />
      {error && <div className="error-callout"><AlertTriangle size={15}/>{error}</div>}
      <div className="followup-form-footer"><small>{t('followup_context_note') || 'La respuesta tendrá en cuenta el contexto disponible.'}</small><button className="button-primary" type="submit" disabled={busy || question.trim().length < 3}>{busy ? <LoaderCircle size={15} className="spin"/> : <Send size={15}/>} {t('continue_conversation') || 'Enviar pregunta'}</button></div>
    </form>
  </section>;
}

function sourceForReference(reference, sources = []) {
  const norm = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
  const target = norm(reference);
  if (!target) return null;
  const exact = sources.find(source => {
    const title = norm(source.title); const filename = norm(source.filename);
    return (title && (title === target || title.includes(target) || target.includes(title))) || (filename && (filename === target || filename.includes(target) || target.includes(filename)));
  });
  if (exact) return exact;
  const stop = new Set(['del','de','la','el','los','las','nro','numero','ley','decreto','legislativo','supremo','expediente','articulo','articulos','art','inciso','numeral','codigo']);
  const tokens = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g)?.filter(token => token.length > 2 && !stop.has(token)) || [];
  const wanted = new Set(tokens(reference));
  let best = null; let bestScore = 0;
  for (const source of sources) {
    const available = new Set([...tokens(source.title), ...tokens(source.filename)]);
    const score = [...wanted].filter(token => available.has(token)).length;
    if (score > bestScore) { best = source; bestScore = score; }
  }
  return bestScore >= 1 ? best : null;
}

function DocumentView({ t, examples }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [context, setContext] = useState('');
  const outputLanguage = 'qu';
  const [variety, setVariety] = useState('chanka');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [followupTurns, setFollowupTurns] = useState([]);
  const [followupBusy, setFollowupBusy] = useState(false);
  const [followupError, setFollowupError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('alquiler');
  const documents = examples?.documents || (examples?.contract?.text ? [{ id: 'alquiler', category: 'VIVIENDA', type: 'Contrato de arrendamiento', filename: 'Contrato_arrendamiento_DEMO.txt', reference: 'DOC-DEMO-ALQ-026', description: 'Renta, depósito, penalidad y renovación', text: examples.contract.text, tag: 'Documento ficticio' }] : []);
  const demo = documents.find(item => item.id === selectedDemo) || documents[0];

  useEffect(() => {
    if (demo && !file) setFile(new File([demo.text || ''], (demo.filename || 'documento_ficticio.txt').replace(/\.(pdf|docx)$/i, '.txt'), { type: 'text/plain' }));
  }, [demo, file]);

  const selectDemo = (item) => {
    setSelectedDemo(item.id);
    setFile(new File([item.text || ''], (item.filename || 'documento_ficticio.txt').replace(/\.(pdf|docx)$/i, '.txt'), { type: 'text/plain' }));
    setResult(null); setStep(1); setError(''); setFollowupTurns([]); setFollowupQuestion('');
  };
  const acceptFile = (picked) => {
    if (!picked) return;
    const allowed = /\.(pdf|docx|txt|md|html|csv|png|jpg|jpeg|webp)$/i.test(picked.name);
    if (!allowed) { setError(t('error_file_type')); return; }
    if (picked.size > 15 * 1024 * 1024) { setError(t('error_file_size')); return; }
    setFile(picked); setResult(null); setStep(1); setError(''); setSelectedDemo(''); setFollowupTurns([]); setFollowupQuestion('');
  };
  const analyze = async () => {
    if (!file) return setError(t('error_select_document'));
    setLoading(true); setError('');
    try {
      // Step 1: save the translation first, independently of the legal analysis JSON.
      const translation = await api.translateDocument(file, variety);
      if (!translation?.translated_document?.trim()) throw new Error(t('doc_translation_empty_error'));
      const translationReady = {
        ...translation, analysis: null, sources: [], grounded: false, vector_store_connected: false,
        warning: t('doc_translation_ready_analysis_pending'),
      };
      setResult(translationReady); setStep(2);
      // Step 2: analyze the same source and reuse the translation rather than regenerating it.
      try {
        const analysisResult = await api.analyzeDocument(file, outputLanguage, variety, context, translation.translated_document);
        setResult({ ...analysisResult, translated_document: analysisResult?.translated_document || translation.translated_document, original_text: analysisResult?.original_text || translation.original_text });
      } catch (analysisError) {
        setResult(current => current ? { ...current, analysis: null, warning: `${t('doc_translation_ready_analysis_failed')} ${analysisError.message || ''}`.trim() } : current);
        setError(`${t('doc_translation_ready_analysis_failed')} ${analysisError.message || ''}`.trim());
      }
    } catch (err) { setError(err.message || t('error_document_analysis')); }
    finally { setLoading(false); }
  };
  const askDocumentFollowup = async (event) => {
    event?.preventDefault();
    const question = followupQuestion.trim();
    if (question.length < 3 || followupBusy) return;
    setFollowupBusy(true); setFollowupError('');
    const docText = String(result?.original_text || demo?.text || '').slice(0, 1600);
    const findingContext = (result?.analysis?.findings || []).slice(0, 5).map((finding, i) => `${i + 1}. ${finding.title || ''}: ${finding.explanation || ''}; estado=${finding.verification_status || 'requiere_contexto'}`).join('\n');
    const prior = followupTurns.slice(-3).map((turn) => `Persona: ${turn.question}\nRespuesta previa: ${(turn.answer_es || turn.answer || '').slice(0, 500)}`).join('\n');
    const contextual = `Seguimiento en Documento Claro para el archivo ${file?.name || demo?.filename || 'documento ficticio'}.\nResumen del análisis: ${result?.analysis?.summary || 'Todavía no hay resumen estructurado.'}\nHallazgos previos:\n${findingContext || 'No hay hallazgos estructurados disponibles.'}\nFragmento del documento (no es fuente jurídica):\n${docText}\nConversación previa:\n${prior}`.slice(0, 2750);
    try {
      const answer = await api.orienta({ query: question, input_language: 'es', output_language: 'bi', variety, context: contextual, max_results: 12 });
      setFollowupTurns(prev => [...prev, { question, ...answer }]);
      setFollowupQuestion('');
    } catch (err) { setFollowupError(err.message || t('error_query_analysis')); }
    finally { setFollowupBusy(false); }
  };

  const analysis = result?.analysis;
  const severityInfo = (severity) => {
    if (severity === 'alta') return { label: t('doc_priority_review'), className: 'severity-high', icon: AlertTriangle };
    if (severity === 'revisar') return { label: t('doc_review_recommended'), className: 'severity-review', icon: Search };
    return { label: t('doc_informative'), className: 'severity-info', icon: Info };
  };
  const verificationMeta = (status) => ({
    respaldada_por_fuente: { label: t('doc_supported') + ' por fuente recuperada', className: 'verification-supported', icon: CheckCircle2 },
    contradicha_por_fuente: { label: t('doc_contradicted') + ' con una fuente', className: 'verification-contradicted', icon: AlertTriangle },
    requiere_contexto: { label: t('doc_needs_context'), className: 'verification-context', icon: CircleHelp },
    no_verificable_con_el_corpus: { label: t('doc_not_verifiable') + ' con este corpus', className: 'verification-unknown', icon: Info },
  }[status] || { label: t('doc_review_recommended'), className: 'verification-unknown', icon: Info });
  const findings = analysis?.findings || [];

  return (
    <div className="module-grid document-grid">
      <div className="module-main-column">
        <ModuleHeader icon={FileSearch} eyebrow={t('doc_header_eyebrow')} title={t('doc_header_title')} subtitle={t('doc_header_subtitle')} color="gold" />
        <div className="document-method-strip"><span><ShieldCheck size={15}/> {t('doc_method_no_download')}</span><span><Languages size={15}/> {t('doc_method_bilingual')}</span><span><BookOpen size={15}/> {t('doc_method_sources')}</span></div>
        <section className="surface-card demo-document-picker">
          <div className="section-overline"><span>01</span> {t('doc_choose_demo')}</div>
          <p className="picker-intro">{t('doc_picker_intro')}</p>
          <div className="demo-document-grid">{documents.map((item, index) => <button type="button" key={item.id} className={cx('demo-document-card', selectedDemo === item.id && 'selected')} onClick={() => selectDemo(item)}>
            <span className="demo-doc-icon">{item.id === 'alquiler' ? <HomeIcon/> : item.id === 'laboral' ? <FileCheck2 size={19}/> : item.id === 'citacion' ? <Scale size={19}/> : item.id === 'prestamo' ? <ShieldCheck size={19}/> : item.id === 'municipal' ? <BookOpen size={19}/> : <FileText size={19}/>}</span>
            <span className="demo-doc-category">{t(`doc_${item.id}_category`) || item.category || 'DOCUMENTO'}</span><strong>{t(`doc_${item.id}_type`) || item.type}</strong><small>{t(`doc_${item.id}_desc`) || item.description}</small><span className="demo-doc-tag">{t(item.id === 'citacion' ? 'doc_tag_not_official' : item.id === 'municipal' ? 'doc_tag_admin_case' : 'doc_tag_fictional')}</span>
          </button>)}</div>
          <div className="upload-alternative"><div><strong>{t('doc_other_file')}</strong><small>{t('doc_optional')}</small></div><input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md,.html,.csv,.png,.jpg,.jpeg,.webp" onChange={e => acceptFile(e.target.files?.[0])} hidden/><button type="button" className="button-secondary" onClick={() => inputRef.current?.click()}><Upload size={15}/> {t('choose_file')}</button></div>
        </section>

        <div className="document-stepper" aria-label={t('doc_stepper_aria_label')}>{[{n:1,title:t('doc_step_original'),desc:t('doc_step_original_desc')},{n:2,title:t('doc_step_translation'),desc:t('doc_step_translation_desc')},{n:3,title:t('doc_step_findings'),desc:t('doc_step_findings_desc')}].map(item => <button type="button" key={item.n} className={cx('document-step', step === item.n && 'active', step > item.n && 'completed')} onClick={() => { if (item.n === 1 || (item.n === 2 && result) || (item.n === 3 && result)) setStep(item.n); }}><span className="step-number">{step > item.n ? <Check size={14}/> : `0${item.n}`}</span><span><strong>{item.title}</strong><small>{item.desc}</small></span></button>)}</div>

        {step === 1 && <section className="document-step-panel surface-card">
          <div className="document-step-heading"><div><span className="eyebrow">{t('step1_of3')}</span><h2>{t('doc_step1_title')}</h2><p>{t('doc_step1_desc')}</p></div><span className="document-fake-stamp">{t('doc_fictional')}</span></div>
          {demo && selectedDemo && <div className="document-meta-row"><span><FileText size={14}/>{demo.filename}</span><span><Clock3 size={14}/>{demo.date}</span><span><Scale size={14}/>{demo.reference}</span></div>}
          <div className="document-preview-wrap"><DocumentPaper t={t} document={selectedDemo ? demo : { type: file?.name, filename: file?.name, text: t('loaded_file_preview') }}/></div>
          <label className="field-label" htmlFor="doc-context">{t('doc_context_question')}</label><textarea id="doc-context" rows={2} value={context} onChange={e => setContext(e.target.value)} placeholder={t('doc_context_placeholder')}/>
          <div className="input-languages-row doc-language-row"><div className="select-label"><span>{t('doc_translate_to')}</span><div className="fixed-language-target"><Languages size={15}/> {t('language_quechua')} <small>{t('experimental_tag')}</small></div></div><label className="select-label"><span>{t('doc_variety_label')}</span><select value={variety} onChange={e => setVariety(e.target.value)}><option value="chanka">{t('variety_chanka')}</option><option value="cusco-collao">{t('variety_cusco')}</option><option value="ancashino">{t('variety_ancash')}</option><option value="wanka">{t('variety_wanka')}</option></select></label></div>
          <button type="button" className="button-primary button-wide" onClick={analyze} disabled={loading || !file}>{loading ? <><LoaderCircle className="spin" size={16}/>{t('doc_translating')}</> : <><Languages size={17}/>{t('doc_step2_button')} <ArrowRight size={16}/> </>}</button>
          <p className="microcopy privacy-inline"><ShieldCheck size={13}/> {t('doc_experimental_note')}</p>
          {error && <div className="error-callout"><AlertTriangle size={16}/>{error}</div>}
        </section>}

        {step === 2 && result && <section className="document-step-panel surface-card">
          <div className="document-step-heading"><div><span className="eyebrow">{t('step2_of3')}</span><h2>{t('doc_step2_title')}</h2><p>{t('doc_step2_desc')}</p></div><span className="translation-badge"><Languages size={14}/>{outputLanguage === 'qu' ? t('translation_experimental_badge') : t('doc_translation_spanish')}</span></div>
          {result.warning && <div className="warning-callout"><AlertTriangle size={16}/>{result.warning}</div>}
          {loading && <div className="processing-strip"><LoaderCircle className="spin" size={17}/><span>{t('doc_translation_ready_analysis_pending')}</span><div className="processing-bar"><i /></div></div>}
          <div className="document-compare-grid"><div><div className="compare-label"><span>01</span> {t('doc_original_label').toUpperCase()}</div><DocumentPaper t={t} document={selectedDemo ? demo : { filename: file?.name, reference: t('file_selected'), text: result.original_text || t('loaded_file_preview') }} highlighted={findings}/></div><div><div className="compare-label"><span>02</span> {t('doc_translation_label').toUpperCase()}</div><DocumentPaper t={t} document={{ ...demo, filename: outputLanguage === 'qu' ? t('translation_experimental_badge') : t('doc_translation_spanish'), translated_document: result?.translated_document || analysis?.translated_document || '', text: result?.original_text || demo?.text || '', original_text: result?.original_text || demo?.text || '', reference: t('translation_experimental_badge') }} highlighted={findings} translated/>{!result?.translated_document && <div className="error-callout"><AlertTriangle size={15}/>{t('doc_translation_empty_error')}</div>}</div></div>
          <div className="highlight-legend"><span><i className="legend-underline"/> {t('doc_highlighted')}</span><span><i className="legend-verified"/> {t('doc_verified')}</span></div>
          <div className="step-action-row"><button type="button" className="button-secondary" onClick={() => setStep(1)}><ArrowLeft size={15}/> {t('doc_back_original')}</button><button type="button" className="button-primary" onClick={() => setStep(3)}>{t('doc_step3_button')} <ArrowRight size={15}/></button></div>
          {!analysis && <div className="warning-callout"><Info size={16}/>{t('doc_structure_warning')}</div>}
        </section>}

        {step === 3 && result && <section className="document-step-panel surface-card">
          <div className="document-step-heading"><div><span className="eyebrow">{t('step3_of3')}</span><h2>{t('doc_step3_title')}</h2><p>{t('doc_step3_desc')}</p></div><span className="result-count">{findings.length} {t('doc_findings_count')}</span></div>
          {analysis ? <>
            <div className="doc-summary-card"><div className="summary-top"><div className="summary-icon"><FileText size={18}/></div><div><span className="eyebrow">{t('doc_summary_accessible')}</span><h3>{analysis.document_type || demo?.type || 'Documento analizado'}</h3></div></div><div className="doc-summary-bilingual"><div className="doc-bilingual-cell"><strong>{t('doc_summary_es')}</strong><p>{analysis.summary || '—'}</p></div><div className="doc-bilingual-cell" lang="qu"><strong>{t('doc_summary_qu')}</strong><p>{analysis.summary_qu || t('doc_summary_translation_missing')}</p></div></div>{(analysis.key_terms || []).length > 0 && <div className="plan-tags">{analysis.key_terms.slice(0,8).map((term,i)=><span className="plan-tag" key={i}>{term}</span>)}</div>}</div>
            <div className="verification-guide"><strong><ShieldCheck size={16}/> {t('doc_status_guide')}</strong><div><span className="verification-supported">{t('doc_supported')}</span><span>{t('doc_supported_desc')}</span></div><div><span className="verification-contradicted">{t('doc_contradicted')}</span><span>{t('doc_contradicted_desc')}</span></div><div><span className="verification-context">{t('doc_needs_context')}</span><span>{t('doc_context_desc')}</span></div><div><span className="verification-unknown">{t('doc_not_verifiable')}</span><span>{t('doc_unknown_desc')}</span></div></div>
            {findings.map((finding,index)=>{ const meta=severityInfo(finding.severity); const Icon=meta.icon; const verify=verificationMeta(finding.verification_status); const VIcon=verify.icon; return <article className="finding-card surface-card" key={`${finding.title}-${index}`}><div className="finding-top"><span className="finding-number">{String(index+1).padStart(2,'0')}</span><div className="finding-title-group"><h3>{finding.title || finding.category || 'Punto para revisar'}</h3>{finding.title_qu && <p className="finding-title-qu" lang="qu">{finding.title_qu}</p>}<span className={cx('severity-badge',meta.className)}><Icon size={13}/>{meta.label}</span></div></div>{finding.quote && <blockquote className="quote-highlight"><strong>{t('doc_summary_es')}:</strong> “{finding.quote}”{finding.translated_quote && <p lang="qu"><strong>{t('doc_summary_qu')}:</strong> “{finding.translated_quote}”</p>}</blockquote>}<div className="verification-status-line"><VIcon size={15}/><strong>{verify.label}</strong></div>{finding.verification_reason && <div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_reason_es')}</strong><p className="verification-reason">{finding.verification_reason}</p></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_reason_qu')}</strong><p className="verification-reason">{finding.verification_reason_qu || t('doc_summary_translation_missing')}</p></div></div>}<div className="finding-explanation"><strong>{t('what_means')}</strong><div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_finding_es')}</strong><p>{finding.explanation || '—'}</p></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_finding_qu')}</strong><p>{finding.explanation_qu || t('doc_summary_translation_missing')}</p></div></div></div>{finding.why_review && <div className="finding-why"><Info size={15}/><div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_reason_es')}</strong><p>{finding.why_review}</p></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_reason_qu')}</strong><p>{finding.why_review_qu || t('doc_summary_translation_missing')}</p></div></div></div>}{((finding.legal_basis || finding.legal_basis_qu || finding.competent_authority || finding.competent_authority_qu) || (finding.next_steps||[]).length > 0 || (finding.next_steps_qu||[]).length > 0) && <div className="finding-legal-practical"><div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_legal_basis')}</strong><p>{finding.legal_basis || t('doc_legal_basis_missing')}</p></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_legal_basis_qu')}</strong><p>{finding.legal_basis_qu || t('doc_summary_translation_missing')}</p></div></div><div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_authority')}</strong><p>{finding.competent_authority || t('doc_authority_missing')}</p></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_authority_qu')}</strong><p>{finding.competent_authority_qu || t('doc_summary_translation_missing')}</p></div></div>{((finding.next_steps||[]).length>0 || (finding.next_steps_qu||[]).length>0) && <div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_next_steps')}</strong><ol>{(finding.next_steps||[]).slice(0,3).map((step,i)=><li key={i}>{step}</li>)}</ol></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_next_steps_qu')}</strong><ol>{(finding.next_steps_qu||[]).slice(0,3).map((step,i)=><li key={i}>{step}</li>)}</ol>{!(finding.next_steps_qu||[]).length && <p>{t('doc_summary_translation_missing')}</p>}</div></div>}</div>}{(finding.source_references||[]).length>0 && <div className="finding-sources"><strong><BookOpen size={14}/> {t('doc_findings_sources')}</strong><ul>{finding.source_references.map((src,i)=>{const match=sourceForReference(src,result?.sources||[]); return <li key={i}>{match?.url ? <a href={match.url} target="_blank" rel="noreferrer" className="source-open-link">{match.title || src} <ExternalLink size={12}/></a> : (match?.title || src)}</li>})}</ul></div>}{((finding.questions_to_ask||[]).length>0 || (finding.questions_to_ask_qu||[]).length>0) && <details className="questions-detail"><summary>{t('doc_questions')} <ChevronDown size={14}/></summary><div className="finding-bilingual-fields"><div className="finding-bilingual-cell"><strong>{t('doc_questions_es')}</strong><ul>{(finding.questions_to_ask||[]).map((q,i)=><li key={i}>{q}</li>)}</ul></div><div className="finding-bilingual-cell" lang="qu"><strong>{t('doc_questions_qu')}</strong><ul>{(finding.questions_to_ask_qu||[]).map((q,i)=><li key={i}>{q}</li>)}</ul>{!(finding.questions_to_ask_qu||[]).length && <p>{t('doc_summary_translation_missing')}</p>}</div></div></details>}</article>})}
            {(analysis.missing_information||[]).length>0 && <div className="missing-info-card"><CircleHelp size={18}/><div><strong>{t('doc_missing_info')}</strong><ul>{analysis.missing_information.map((v,i)=><li key={i}>{v}</li>)}</ul></div></div>}
            {analysis.limitations && <p className="limitations-note"><Info size={14}/>{analysis.limitations}</p>}
          </> : <div className="answer-card surface-card"><MarkdownAnswer>{result.raw_answer}</MarkdownAnswer></div>}
          <SourcesPanel sources={result.sources} grounded={result.grounded} connected={Boolean(result.vector_store_connected || result.web_search_enabled)} t={t}/>
          <EvidenceEnginePanel engine={result.evidence_engine} t={t} />
          <div className="step-action-row"><button type="button" className="button-secondary" onClick={() => setStep(2)}><ArrowLeft size={15}/> {t('doc_back_translation')}</button><button type="button" className="button-primary" onClick={() => {setResult(null);setStep(1);}}>{t('doc_try_another')} <RefreshCw size={15}/></button></div>
        </section>}
        {result && step >= 2 && <FollowupAssistant title={t('doc_followup_title')} subtitle={t('doc_followup_desc')} question={followupQuestion} setQuestion={setFollowupQuestion} turns={followupTurns} busy={followupBusy} error={followupError} onSubmit={askDocumentFollowup} t={t} />}
      </div>
      <aside className="module-rail"><div className="document-side-rail"><div className="insight-card"><div className="insight-top"><div className="insight-ico"><ScanText size={18}/></div><span>{t('doc_demo_side_title')}</span></div><h3>{t('doc_demo_side_heading')}</h3><p>{t('doc_demo_side_body')}</p><div className="insight-stats"><div><strong>01</strong><span>{t('step_original_short')}</span></div><div><strong>02</strong><span>{t('step_translation_short')}</span></div><div><strong>03</strong><span>{t('step_evidence_short')}</span></div></div>{step === 1 && <button type="button" className="button-primary button-wide side-translate-button" onClick={analyze} disabled={loading || !file}>{loading ? <><LoaderCircle className="spin" size={15}/>{t('doc_translating')}</> : <><Languages size={16}/>{t('doc_step2_button')}<ArrowRight size={15}/></>}</button>}</div><div className="mini-warning"><AlertTriangle size={17}/><p>{t('doc_demo_side_warning')}</p></div><div className="surface-card tech-stack-card"><span className="eyebrow">{t('doc_tech_title')}</span><strong><Languages size={15}/> OpenAI API</strong><small>{t('doc_tech_openai')}</small><strong><Network size={15}/> RAG · File Search</strong><small>{t('doc_tech_rag')}</small><strong><FileText size={15}/> PDF / DOCX / TXT + OCR</strong><small>{t('doc_tech_extraction')}</small><StatusBadge good={Boolean(result?.grounded)}>{result?.grounded ? t('doc_status_sources') : t('doc_status_no_evidence')}</StatusBadge></div></div></aside>
    </div>
  );
}

function HomeIcon() { return <span className="home-icon-glyph">⌂</span>; }

function LiveView({ t, examples }) {
  const [consent, setConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [busyCount, setBusyCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [outputLanguage, setOutputLanguage] = useState('bi');
  const [inputLanguage, setInputLanguage] = useState('es');
  const [variety, setVariety] = useState('chanka');
  const [segments, setSegments] = useState([]);
  const [error, setError] = useState('');
  const [showScript, setShowScript] = useState(false);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [followupTurns, setFollowupTurns] = useState([]);
  const [followupBusy, setFollowupBusy] = useState(false);
  const [followupError, setFollowupError] = useState('');
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingRef = useRef(false);
  const segmentTimerRef = useRef(null);
  const queueRef = useRef(Promise.resolve());
  const segmentCountRef = useRef(0);

  const processBlob = useCallback(async (blob) => {
    if (!blob || blob.size < 300) return;
    segmentCountRef.current += 1;
    const id = segmentCountRef.current;
    setBusyCount(v => v + 1); setError('');
    try {
      const result = await api.liveSegment(blob, outputLanguage, variety, inputLanguage);
      setSegments(prev => [...prev, { id, ...result, createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }]);
    } catch (err) { setError(err.message || t('error_audio_segment')); }
    finally { setBusyCount(v => Math.max(0, v - 1)); }
  }, [outputLanguage, variety, inputLanguage]);

  const startRecording = async () => {
    if (!consent) { setError(t('error_audio_consent')); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError(t('error_audio_browser')); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      streamRef.current = stream;
      const preferredMime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(type => MediaRecorder.isTypeSupported(type)) || '';
      recordingRef.current = true;
      setElapsedSeconds(0); setRecording(true); setError('');

      // Each segment gets a fresh MediaRecorder so every uploaded WebM contains its own header/container metadata.
      // MediaRecorder timeslice blobs are not guaranteed to be independently playable when sent one by one.
      const recordNextSegment = () => {
        if (!recordingRef.current || !streamRef.current) return;
        let recorder;
        try {
          recorder = new MediaRecorder(streamRef.current, preferredMime ? { mimeType: preferredMime } : undefined);
        } catch (err) {
          recordingRef.current = false;
          setRecording(false);
          setError(t('error_audio_next_segment'));
          streamRef.current?.getTracks().forEach(track => track.stop());
          streamRef.current = null;
          return;
        }
        recorderRef.current = recorder;
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            const sourceBlob = event.data;
            const mime = (sourceBlob.type || recorder.mimeType || preferredMime || 'audio/webm').split(';')[0].toLowerCase();
            const blob = new Blob([sourceBlob], { type: mime });
            queueRef.current = queueRef.current.then(() => processBlob(blob)).catch((err) => setError(err.message || 'Falló el procesamiento de un segmento.'));
          }
        };
        recorder.onerror = () => setError(t('error_audio_recording'));
        recorder.onstop = () => {
          if (recordingRef.current && streamRef.current) {
            segmentTimerRef.current = window.setTimeout(recordNextSegment, 120);
          } else {
            streamRef.current?.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        };
        try {
          recorder.start();
          segmentTimerRef.current = window.setTimeout(() => {
            if (recorder.state === 'recording') recorder.stop();
          }, 10000);
        } catch (err) {
          recordingRef.current = false;
          setRecording(false);
          setError(t('error_audio_start_recording'));
          streamRef.current?.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      recordNextSegment();
    } catch (err) {
      recordingRef.current = false;
      setRecording(false);
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setError(err.name === 'NotAllowedError' ? t('error_audio_denied') : `${t('error_audio_open')}: ${err.message}`);
    }
  };

  const stopRecording = () => {
    recordingRef.current = false;
    if (segmentTimerRef.current) window.clearTimeout(segmentTimerRef.current);
    segmentTimerRef.current = null;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    else {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setRecording(false);
    // The last dataavailable event is queued automatically; busy status remains visible until queued work finishes.
  };

  const runTextSample = async () => {
    const sample = examples?.live_script || 'La persona debe comprobar qué vía procesal corresponde. No asumas que una afirmación jurídica general se aplica a todos los casos.';
    setShowScript(true); setBusyCount(v => v + 1); setError('');
    try {
      const result = await api.analyzeLiveText(sample.slice(0, 1800), outputLanguage, variety, inputLanguage);
      segmentCountRef.current += 1;
      setSegments(prev => [...prev, { id: segmentCountRef.current, transcript: sample.slice(0, 1800), answer: result.answer, answer_es: result.answer_es, answer_qu: result.answer_qu, sources: result.sources, grounded: result.grounded, vector_store_connected: result.vector_store_connected, plan: result.plan, evidence_engine: result.evidence_engine, createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), demo: true }]);
    } catch (err) { setError(err.message || t('error_live_sample')); }
    finally { setBusyCount(v => Math.max(0, v - 1)); }
  };

  const askLiveFollowup = async (event) => {
    event?.preventDefault();
    const question = followupQuestion.trim();
    if (question.length < 3 || followupBusy || busyCount > 0) return;
    setFollowupBusy(true); setFollowupError('');
    const segmentContext = segments.slice(-6).map((segment) => `Fragmento ${segment.id}: ${String(segment.transcript || '').slice(0, 420)}\nInterpretación ES: ${String(segment.answer_es || segment.answer || '').slice(0, 420)}`).join('\n\n');
    const prior = followupTurns.slice(-3).map((turn) => `Pregunta: ${turn.question}\nRespuesta: ${String(turn.answer_es || turn.answer || '').slice(0, 450)}`).join('\n');
    const contextual = `Seguimiento posterior a una sesión de voz en Khipu Legal. La transcripción puede contener errores y no constituye prueba por sí sola.\nFragmentos recientes:\n${segmentContext || 'No hay fragmentos procesados; responder la pregunta sin asumir contexto oral.'}\nPreguntas previas:\n${prior}`.slice(0, 2600);
    try {
      const answer = await api.orienta({ query: question, input_language: 'es', output_language: 'bi', variety, context: contextual, max_results: 12 });
      setFollowupTurns(prev => [...prev, { question, ...answer }]);
      setFollowupQuestion('');
    } catch (err) { setFollowupError(err.message || t('error_query_analysis')); }
    finally { setFollowupBusy(false); }
  };

  const clear = () => { setSegments([]); setError(''); setFollowupTurns([]); setFollowupQuestion(''); };
  useEffect(() => () => {
    recordingRef.current = false;
    if (segmentTimerRef.current) window.clearTimeout(segmentTimerRef.current);
    try { if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop(); } catch { /* ignore */ }
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);
  useEffect(() => {
    if (!recording) return undefined;
    const timer = window.setInterval(() => setElapsedSeconds(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  return (
    <div className="module-grid live-grid">
      <div className="module-main-column">
        <ModuleHeader icon={AudioLines} eyebrow={t('live_eyebrow')} title={t('live_title')} subtitle={t('live_subtitle')} color="moss" />
        <section className="live-control-card surface-card">
          <div className="live-control-header"><div className="live-wave-icon"><AudioLines size={23} /></div><div className="live-control-copy"><strong>{recording ? t('live_session_listening') : t('live_session_title')}</strong><span>{recording ? t('live_segment_status') : t('live_idle_status')}</span></div><div className="live-status-group"><span className="live-duration">{String(Math.floor(elapsedSeconds / 60)).padStart(2,'0')}:{String(elapsedSeconds % 60).padStart(2,'0')}</span><StatusBadge good={recording}>{recording ? t('live_status_direct') : busyCount ? t('live_status_processing') : t('live_status_waiting')}</StatusBadge></div></div>
          <div className="live-settings-row"><label className="select-label"><span>{t('input_language')}</span><select value={inputLanguage} onChange={e => setInputLanguage(e.target.value)} disabled={recording}><option value="es">Español</option><option value="qu">Quechua</option></select></label><label className="select-label"><span>{t('variety')}</span><select value={variety} onChange={e => setVariety(e.target.value)} disabled={recording}><option value="chanka">{t('variety_chanka')}</option><option value="cusco-collao">{t('variety_cusco')}</option><option value="ancashino">{t('variety_ancash')}</option><option value="wanka">{t('variety_wanka')}</option></select></label></div>
          <label className="consent-row"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={recording} /><span>{t('consent')}</span></label>
          <div className="live-buttons"><button className={cx('button-primary', recording && 'button-danger')} type="button" onClick={recording ? stopRecording : startRecording}>{recording ? <><Square size={15} fill="currentColor" />{t('stop_live')}</> : <><Mic size={17} />{t('start_live')}<span className="button-arrow"><ArrowRight size={15} /></span></>}</button><button className="button-secondary" type="button" onClick={runTextSample} disabled={busyCount > 0}><Sparkles size={16} />{t('try_live_sample')}</button>{segments.length > 0 && <button className="icon-action" type="button" title={t('clear')} onClick={clear}><RefreshCw size={16} /></button>}</div>
          <div className="live-explainer"><Info size={16} /><p>{t('live_recording_long')} {t('live_explainer')}</p></div>
          {error && <div className="error-callout"><AlertTriangle size={16} />{error}</div>}
        </section>
        {showScript && <section className="sample-script surface-card"><div className="panel-heading"><span className="panel-heading-icon"><BookOpen size={17} /></span><span className="panel-heading-text"><strong>{t('demo_script')}</strong><small>{t('demo_script_body')}</small></span></div><p>{examples?.live_script || 'El backend debe cargar el texto de demostración.'}</p></section>}
        <div className="live-feed-head"><div><div className="eyebrow">{t('segment_sequence')}</div><h2>{t('recent_segments')}</h2></div><span className="result-count">{segments.length} {t('live_segment_count')}</span></div>
        {busyCount > 0 && <div className="processing-strip"><LoaderCircle className="spin" size={17} /><span>{t('live_processing')}</span><div className="processing-bar"><i /></div></div>}
        {segments.length === 0 ? <div className="live-empty surface-card"><div className="empty-mic"><Mic size={23} /></div><h3>{t('first_intervention')}</h3><p>{t('first_intervention_body')}</p></div> : <div className="live-segments">{segments.map((segment) => <article className="live-segment surface-card" key={segment.id}><div className="segment-heading"><span className="segment-number">{t('live_segment_label').toUpperCase()} {String(segment.id).padStart(2, '0')}</span><span className="segment-time"><Clock3 size={13} />{segment.createdAt}</span>{segment.demo && <span className="demo-label">{t('demo_tag')}</span>}</div>{segment.transcript && <div className="segment-transcript"><div className="segment-label"><span className="audio-bar" />{t('transcript')}</div><p>{segment.transcript}</p></div>}{segment.answer && <div className="segment-interpretation"><div className="segment-label"><Languages size={14} />{t('live_bilingual_title')}</div><BilingualAnswer t={t} es={segment.answer_es} qu={segment.answer_qu}>{segment.answer}</BilingualAnswer></div>}<SourcesPanel sources={segment.sources || []} grounded={segment.grounded} connected={segment.vector_store_connected} t={t} /><EvidenceEnginePanel engine={segment.evidence_engine} t={t}/></article>)}</div>}
        {(segments.length > 0 || showScript) && <FollowupAssistant title={t('live_followup_title')} subtitle={t('live_followup_desc')} question={followupQuestion} setQuestion={setFollowupQuestion} turns={followupTurns} busy={followupBusy || busyCount > 0} error={followupError} onSubmit={askLiveFollowup} t={t} />}
      </div>
      <aside className="module-rail"><div className="live-status-rail surface-card"><div className="live-pulse"><span /></div><div><strong>{t('live_steps')}</strong><p>{t('live_steps_body')}</p></div><div className="live-pipeline"><div className={cx('pipeline-step', recording && 'active')}><span>01</span><b>{t('authorized_audio')}</b></div><div className="pipeline-line" /><div className={cx('pipeline-step', busyCount && 'active')}><span>02</span><b>{t('text_step')}</b></div><div className="pipeline-line" /><div className="pipeline-step"><span>03</span><b>{t('sources_step')}</b></div></div></div><div className="rail-note"><div className="rail-note-icon"><ShieldCheck size={18} /></div><div><strong>{t('cannot_prove_more')}</strong><p>{t('cannot_prove_more_body')}</p></div></div><div className="surface-card tech-stack-card"><span className="eyebrow">{t('doc_technology_live')}</span><strong><Mic size={15}/> MediaRecorder</strong><small>{t('live_tech_capture')}</small><strong><AudioLines size={15}/> {t('live_tech_transcription')}</strong><small>{t('live_tech_segments')}</small><strong><Network size={15}/> OpenAI API + RAG</strong><small>{t('live_tech_rag')}</small></div></aside>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [activeTab, setActiveTab] = useState('orienta');
  const [uiLang, setUiLang] = useState('es');
  const [copy, setCopy] = useState(ES);
  const [uiBusy, setUiBusy] = useState(false);
  const [uiError, setUiError] = useState('');
  const [health, setHealth] = useState(null);
  const [examples, setExamples] = useState(null);
  const [apiError, setApiError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLangNote, setShowLangNote] = useState(false);
  const t = (key) => copy[key] || ES[key] || key;

  useEffect(() => {
    api.health().then(setHealth).catch(err => setApiError(err.message));
    api.examples().then(setExamples).catch(() => {});
    const lastLang = localStorage.getItem('khipu-legal-ui-language-v8');
    if (lastLang === 'qu') {
      const cached = localStorage.getItem('khipu-legal-ui-copy-chanka-v8');
      if (cached) { try { const saved = JSON.parse(cached); if (Object.keys(ES).every((key) => typeof saved[key] === 'string' && saved[key].trim())) { setCopy(saved); setUiLang('qu'); } else { void api.uiCopy('qu', ES).then((result) => { setCopy({ ...ES, ...result.copy }); setUiLang('qu'); localStorage.setItem('khipu-legal-ui-copy-chanka-v8', JSON.stringify(result.copy)); localStorage.setItem('khipu-legal-ui-language-v8', 'qu'); }).catch(() => {}); } } catch { /* use Spanish fallback */ } }
      else { void api.uiCopy('qu', ES).then((result) => { setCopy({ ...ES, ...result.copy }); setUiLang('qu'); localStorage.setItem('khipu-legal-ui-copy-chanka-v8', JSON.stringify(result.copy)); localStorage.setItem('khipu-legal-ui-language-v8', 'qu'); }).catch(() => {}); }
    }
  }, []);

  const changeUiLang = async (language) => {
    if (language === uiLang) return;
    setUiBusy(true); setUiError('');
    try {
      if (language === 'es') {
        setCopy(ES); setUiLang('es'); localStorage.setItem('khipu-legal-ui-language-v8', 'es'); setShowLangNote(false);
      } else {
        const cached = localStorage.getItem('khipu-legal-ui-copy-chanka-v8');
        const cachedCopy = cached ? JSON.parse(cached) : null;
        if (cachedCopy && Object.keys(ES).every((key) => typeof cachedCopy[key] === 'string' && cachedCopy[key].trim())) {
          setCopy(cachedCopy); setUiLang('qu'); setShowLangNote(true); localStorage.setItem('khipu-legal-ui-language-v8', 'qu');
        } else {
          const result = await api.uiCopy('qu', ES);
          setCopy({ ...ES, ...result.copy }); setUiLang('qu'); setShowLangNote(true);
          localStorage.setItem('khipu-legal-ui-copy-chanka-v8', JSON.stringify(result.copy)); localStorage.setItem('khipu-legal-ui-language-v8', 'qu');
        }
      }
    } catch (err) {
      setCopy(ES); setUiLang('es'); setUiError(`${err.message} Se mantiene la interfaz en español.`);
    } finally { setUiBusy(false); }
  };

  const enterApp = () => { setScreen('app'); setActiveTab('orienta'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const backToIntro = () => { setScreen('intro'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (screen === 'intro') {
    return <div className="intro-page">
      <AndeanIntro />
      <div className="intro-vignette" />
      <header className="intro-topbar"><Brand compact onClick={backToIntro} /><div className="intro-top-actions"><span className="intro-edition"><span className="live-small-dot" /> {t('demo_badge')}</span><InterfaceSwitch value={uiLang} onChange={changeUiLang} busy={uiBusy} label={t('interface_language')} t={t} /></div></header>
      <main className="intro-main">
        <div className="intro-copy-block">
          <div className="intro-kicker"><span className="kicker-line" />{t('welcome_kicker')} <span className="kicker-dot">✳</span></div>
          <h1>{t('welcome_first')}<br /><em>{t('welcome_second')}</em></h1>
          <p className="intro-lead">{t('welcome_body')}</p>
          <div className="intro-language-pill"><Languages size={15} /><span>{t('language_spanish')}</span><span className="pill-separator">↔</span><span>{t('language_quechua')}</span><span className="pill-experimental">{t('experimental_tag')}</span></div>
          <button className="intro-continue" onClick={enterApp} type="button"><span>{t('continue')}</span><span className="intro-continue-icon"><ArrowRight size={19} /></span></button>
          <div className="intro-undertext"><ShieldCheck size={14} />{t('privacy_note')}</div>
        </div>
        <div className="intro-visual-caption"><span className="caption-rule" /><span>{t('intro_visual_caption').toUpperCase()}</span><span className="caption-index">01—03</span></div>
      </main>
      <footer className="intro-footer"><span>{t('intro_footer_line')}</span><span className="intro-footer-right"><span className="footer-ornament">◈</span> {t('intro_footer_right')} · TEAM SUPERNOVA</span></footer>
      {showLangNote && <div className="toast-note">{t('ui_qu_note')}</div>}
      {uiError && <div className="toast-note toast-error">{uiError}</div>}
    </div>;
  }

  const activeModule = MODULES.find(module => module.id === activeTab) || MODULES[0];
  return <div className="app-frame">
    <aside className="sidebar">
      <div className="sidebar-brand-row"><Brand onClick={backToIntro} /><button className="icon-action sidebar-back" onClick={backToIntro} title={t('start_over')}><ArrowLeft size={16} /></button></div>
      <div className="sidebar-section-title">{t('workspace_section')}</div>
      <nav className="desktop-nav" aria-label={t('nav_modules')}>
        {MODULES.map(({ id, icon: Icon, titleKey, descriptionKey, accent }, index) => <button key={id} className={cx('nav-item', activeTab === id && 'active', `nav-${accent}`)} onClick={() => setActiveTab(id)} type="button"><span className="nav-icon"><Icon size={18} /></span><span className="nav-copy"><strong>{t(titleKey)}</strong><small>{t(descriptionKey)}</small></span><span className="nav-index">0{index + 1}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-source-status"><div className="sidebar-source-icon"><Network size={17} /></div><div><strong>{t('sources_status')}</strong><span>{health?.vector_store_connected ? t('connected') : t('not_connected')}</span></div><span className={cx('health-indicator', health?.vector_store_connected && 'good')} /></div>
        <div className="sidebar-privacy"><ShieldCheck size={14} /><span>{t('public_demo_note')}</span></div>
        <div className="sidebar-version">KHIPU LEGAL · TEAM SUPERNOVA · 1.4</div>
      </div>
    </aside>

    <main className="workspace">
      <header className="workspace-header">
        <div className="breadcrumb"><span>KHIPU LEGAL · TEAM SUPERNOVA</span><ChevronRight size={14} /><strong>{t(activeModule.titleKey)}</strong><small className="breadcrumb-team">Team SuperNova</small></div>
        <div className="workspace-header-actions"><StatusBadge good={Boolean(health?.api_configured && (health?.vector_store_connected || health?.web_search_enabled))}>{health?.vector_store_connected ? t('status_rag_connected') : (health?.api_configured && health?.web_search_enabled) ? t('status_web_configured') : t('status_demo_no_rag')}</StatusBadge><InterfaceSwitch value={uiLang} onChange={changeUiLang} busy={uiBusy} label={t('interface_language')} t={t} /><button className="icon-action mobile-menu-button" onClick={() => setMenuOpen(v => !v)} aria-label={t('open_menu')}><Menu size={18} /></button></div>
      </header>
      {menuOpen && <div className="mobile-menu">{MODULES.map(({ id, icon: Icon, titleKey }) => <button key={id} type="button" onClick={() => { setActiveTab(id); setMenuOpen(false); }}><Icon size={16} />{t(titleKey)}</button>)}</div>}
      {showLangNote && <div className="language-note"><Info size={15} /><span>{t('ui_qu_note')}</span><button onClick={() => setShowLangNote(false)} aria-label={t('close_notice')}><X size={14} /></button></div>}
      {uiError && <div className="error-callout app-error"><AlertTriangle size={16} />{uiError}</div>}
      {apiError && <div className="error-callout app-error"><AlertTriangle size={16} />{apiError}<span>{t('api_backend_notice')}</span></div>}
      <div className="workspace-inner">
        <div className="page-topline"><div><span className="page-eyebrow">{t('choose_module')}</span><p>{t('module_subtitle')}</p></div><div className="page-topline-right"><span className="variety-display"><Globe2 size={14} /> {t('variety_line')}</span></div></div>
        <div className="team-supernova-ribbon"><span className="team-ribbon-mark">✦</span><strong>{t('developed_by_team')}</strong><span className="team-ribbon-divider"/><span>Khipu Legal · Innovación para el acceso lingüístico a la justicia</span></div>
        {activeTab === 'orienta' && <OrientaView t={t} health={health} examples={examples} defaultVariety="chanka" />}
        {activeTab === 'documentos' && <DocumentView t={t} examples={examples} />}
        {activeTab === 'live' && <LiveView t={t} examples={examples} />}
        <footer className="workspace-footer"><div className="footer-brand"><span className="brand-symbol mini"><span /><span /><span /><span /></span><strong>KHIPU LEGAL</strong><span>·</span><span>Team SuperNova</span></div><p className="team-credit">{t('disclaimer')}</p><button type="button" onClick={backToIntro}>{t('start_over')} <ArrowRight size={13} /></button></footer>
      </div>
    </main>
    <nav className="mobile-bottom-nav" aria-label={t('nav_modules')}>{MODULES.map(({ id, icon: Icon, titleKey }) => <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)} type="button"><Icon size={19} /><span>{t(titleKey)}</span></button>)}</nav>
  </div>;
}
