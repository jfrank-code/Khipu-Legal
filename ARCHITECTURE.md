> Desarrollado por **Team SuperNova**. Traducción al quechua experimental y no certificada.

# Arquitectura de Khipu Legal

## Flujo compartido

1. El usuario selecciona español o quechua chanka/Ayacucho (traducción experimental).
2. React presenta el módulo y muestra las tecnologías implicadas.
3. FastAPI valida la petición y usa OpenAI Responses API para comprensión, análisis y traducción.
4. Si hay un vector store configurado, File Search recupera fragmentos jurídicos para fundamentar el resultado.
5. La interfaz separa el contenido original, la traducción, los hallazgos y las fuentes recuperadas.

## Módulos

- **Orienta:** casos guiados precargados → plan de búsqueda → File Search/RAG → explicación y fuentes recuperadas.
- **Documento Claro:** selección de seis documentos ficticios o archivo del usuario → vista del documento en el navegador → análisis estructurado y traducción → comparación en paralelo con fragmentos subrayados → estados de verificación y fuentes.
- **Voz en vivo:** autorización de micrófono → MediaRecorder en fragmentos aproximados de 10 segundos → transcripción → traducción/contraste RAG → secuencia de resultados hasta que el usuario pulsa “Terminar consulta”.

## Contrato de análisis documental

El análisis estructurado debe incluir `translated_document` y, para cada hallazgo, `quote`, `translated_quote`, `verification_status`, `verification_reason`, `source_references`, `explanation`, `why_review` y `questions_to_ask`.

Estados permitidos:

- `respaldada_por_fuente`
- `contradicha_por_fuente`
- `requiere_contexto`
- `no_verificable_con_el_corpus`

La ausencia de fuentes nunca debe convertirse en una conclusión de falsedad. Las citas deben ser literales y las fuentes deben proceder de resultados realmente recuperados.

## Límites

- Traducción al quechua experimental, no certificada; requiere revisión por hablantes y especialistas.
- El mapa de búsqueda muestra el plan, no constituye evidencia jurídica.
- Una inconsistencia textual no implica automáticamente una infracción legal.
- El catálogo oficial de la interfaz no garantiza que todos sus documentos estén en el vector store ni que sean versiones vigentes.


## KHIPU Evidence Engine

- Implementación determinista en `backend/app/evidence_engine.py`; no requiere modelo ni servicio adicional.
- Recibe solo fuentes devueltas por los pasos reales de recuperación. No convierte el catálogo genérico en fuentes consultadas.
- Registra los fragmentos, enlaces y relaciones de texto/mención con el contenido analizado; comprueba si las menciones jurídicas aparecen en el material recuperado.
- Expone campos ES/QU en las afirmaciones cuando están disponibles y declara cuando no puede vincular una cita exacta en quechua.
- La coincidencia de términos y la presencia de una mención son señales de trazabilidad, nunca veredictos de verdad ni certificación de apoyo jurídico.
