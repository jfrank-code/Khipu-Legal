# Khipu Legal · Team SuperNova — derechos que se comprenden

**Desarrollado por Team SuperNova · Prototipo de comprensión jurídica accesible en español y quechua** para demostración en navegador, pensado para que el jurado pueda recorrer los casos sin descargar documentos.

> Todo el material de demostración es ficticio. La traducción al quechua es experimental y no certificada. La aplicación no sustituye asesoría jurídica, defensa pública ni interpretación acreditada.

## Versión 1.4.0 — correcciones de experiencia y robustez

- Respuestas bilingües separadas correctamente en dos tarjetas; los párrafos que comienzan con “Runasimi” ya no se confunden con encabezados.
- Texto de respuesta de 17 px aprox., párrafos breves y negrita para la conclusión principal.
- La conversación muestra un único cuadro de seguimiento tras responder y desplaza la vista hacia el resultado.
- La traducción del documento se guarda antes del análisis jurídico; un fallo del análisis no borra la traducción. La vista quechua ya no muestra el original en español si la traducción falta.
- La grabación crea archivos de audio independientes de aproximadamente 10 segundos, con MIME/extensión emparejados y un modelo alternativo de transcripción.
- Las fuentes recuperadas aparecen con enlaces cuando el origen permite resolver uno; la búsqueda web oficial se ejecuta como etapa separada y los fallos se comunican.

## Qué incluye el proyecto

- **Identidad y presentación:** Khipu Legal, desarrollado por Team SuperNova, con portada animada generativa inspirada en textiles y geometría andina, paleta tierra/verde y diseño responsive.
- **Cambio global de interfaz ES ↔ QU:** selector visible en la portada y en la aplicación. La traducción automática de la interfaz es experimental y requiere validación de hablantes de quechua chanka.
- **Documento Claro en tres pasos:** 1) escoger un documento ficticio y leerlo en pantalla; 2) ver original y traducción lado a lado con fragmentos importantes subrayados; 3) explorar hallazgos, estado de verificación y fuentes recuperadas.
- **Seis tipos de documentos demostrativos:** contrato de arrendamiento, contrato laboral, prestación de servicios, préstamo entre particulares, citación administrativa simulada y notificación municipal simulada. Incluyen datos inventados y advertencias visibles de que no son documentos oficiales.
- **Orienta con ocho casos precargados:** reputación/difamación, citación, alquiler, trabajo, préstamo, servicio no entregado, notificación municipal y asistencia lingüística ante autoridades.
- **Voz en vivo:** captura continua mientras la persona quiera, contador de duración y botón “Terminar consulta”. El audio se procesa en archivos independientes de unos 10 segundos; el procesamiento puede ir con retraso y no es interpretación certificada.
- **Tecnología visible por módulo:** OpenAI API, RAG/File Search, mapa de evidencia, MediaRecorder, transcripción por segmentos y extracción de documentos/OCR.
- **Contraste responsable:** las etiquetas son “respaldada por fuente”, “contradicha por fuente”, “requiere contexto” y “no verificable con el corpus”. La ausencia de evidencia no se trata como falsedad.
- **Vista de navegador:** los documentos de demostración se muestran en pantalla; no hace falta descargar nada para explorar el recorrido.

## Tecnologías

- Frontend: React 19, Vite, Three.js, lucide-react.
- Backend: Python 3.10+, FastAPI, Pydantic.
- IA: OpenAI Responses API; File Search para RAG cuando hay un vector store configurado; transcripción de audio por segmentos.
- Documentos: extracción de PDF/DOCX/TXT e imágenes mediante OCR/visión según el formato y la configuración.

## Requisitos

- Windows 10/11.
- Python 3.10.
- Node.js 20 o superior y npm.
- Una clave de OpenAI API con acceso y facturación habilitados para funciones de IA.
- El ID del vector store jurídico ya creado, si se quiere recuperar evidencia del corpus.

## Inicio en Windows

1. Descomprime el ZIP.
2. Abre `backend/.env.example`, crea `backend/.env` y añade tu clave a `OPENAI_API_KEY`.
3. Opcionalmente, configura `OPENAI_VECTOR_STORE_ID` con el ID del índice jurídico ya creado. También se busca `rimay_config.json` en el proyecto, su carpeta padre y `Downloads` para mantener compatibilidad con tu configuración anterior.
4. Ejecuta `start_khipu.bat` o `start_khipu.ps1`.
5. Abre `http://localhost:5173`.

### Inicio manual

Backend, en una terminal PowerShell:

```powershell
cd .\Khipu-Legal-Team-SuperNova\backend
py -3.10 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend, en otra terminal:

```powershell
cd .\Khipu-Legal-Team-SuperNova\frontend
npm install
npm run dev
```

Comprobación de salud: `http://127.0.0.1:8000/api/health`.

## Despliegue para que el jurado lo abra sin descargar nada

La carpeta local no crea por sí sola un sitio público. Para una demo accesible desde los teléfonos del jurado, publica el frontend y el backend:

1. **Backend (Railway):** crea un servicio desde la carpeta `backend/` y usa el comando de inicio `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (también está en `backend/Procfile`). Configura `OPENAI_API_KEY`, `OPENAI_VECTOR_STORE_ID`, `KHIPU_ENABLE_WEB_SEARCH=true` y `KHIPU_ALLOWED_ORIGINS` (se acepta también el nombre anterior por compatibilidad) con el dominio HTTPS del frontend de Vercel. La búsqueda web consume uso adicional de la API.
2. **Frontend (Vercel):** importa el repositorio, establece `Root Directory` en `frontend`, y configura `VITE_API_BASE_URL` con la URL pública del backend de Railway, sin una barra final. `frontend/vercel.json` define el build de Vite y el fallback de la SPA.
3. Espera a que ambos servicios estén listos y prueba la URL pública desde una ventana privada o un teléfono, no solo desde tu sesión de administrador.
4. Comprueba `/api/health` en el backend y verifica que la interfaz muestre el estado real del corpus. No incluyas la clave de OpenAI en variables `VITE_*`.

Para preparar la presentación, sigue `GUIA_DEMO_JURADO.md`. Si el servicio backend está en una URL pública, el CORS debe permitir exactamente el origen del frontend publicado. No uses `localhost` como URL del backend en Vercel.

## Recuperación ampliada y citas

Orienta y Documento Claro combinan File Search sobre el vector store configurado con búsqueda web de OpenAI restringida a dominios institucionales peruanos cuando esté habilitada (`KHIPU_ENABLE_WEB_SEARCH=true`). Los resultados web se muestran como enlaces clicables; los archivos del índice y las fuentes web se distinguen en la interfaz. El módulo de voz prioriza el índice local para reducir latencia y coste por fragmento; no ejecuta búsqueda web por cada segmento. La búsqueda web usa consumo adicional de la API y puede aumentar el coste; desactívala con `KHIPU_ENABLE_WEB_SEARCH=false` si quieres reducirlo. Si la búsqueda web no está disponible para la cuenta/modelo, el backend intenta continuar con File Search. Esto no garantiza encontrar todas las normas aplicables ni acredita por sí solo la vigencia legal.

## KHIPU Evidence Engine (v1.0.0)

Khipu Legal incorpora un motor propio de trazabilidad determinista en `backend/app/evidence_engine.py`. Este módulo no es otro LLM ni un detector de verdad: registra las fuentes realmente recuperadas, identifica menciones de referencias jurídicas en el texto y calcula vínculos orientativos mediante coincidencias de términos entre afirmaciones, consultas y fragmentos. En Orienta y Voz en vivo, el rastro muestra el texto de respuesta en español y quechua; en Documento Claro, muestra cada hallazgo con los campos en ambos idiomas cuando el modelo los devuelve.

El panel reporta cuatro señales: fuentes recuperadas, elementos revisados, elementos con vínculo textual y fuentes sin vínculo textual claro. También permite inspeccionar citas o referencias mencionadas y si su mención se localizó en el material recuperado. **Una coincidencia léxica o una mención encontrada no prueba que una fuente respalde jurídicamente una conclusión, ni confirma la vigencia de una norma.** Las fuentes enlazadas son pistas para revisar, y todo enlace debe abrirse y leerse en su contexto.

Las etiquetas de la interfaz del motor se incorporan al cambio global español ↔ quechua. La traducción de contenido al quechua —incluidos títulos y explicaciones nuevas de hallazgos— es experimental y debe validarse con hablantes competentes de la variedad seleccionada. Si falta una cita traducida exacta, el motor lo declara en vez de fabricar una equivalencia literal.

## Cómo se utiliza el índice jurídico (RAG)

- `GET /api/health` indica si hay clave e ID de vector store configurados.
- `GET /api/sources` intenta listar los archivos del índice y presenta además un catálogo de fuentes oficiales.
- Orienta, Documento Claro y Voz en vivo llaman al flujo de File Search si hay un vector store configurado.
- La interfaz distingue si se recuperaron fragmentos pertinentes; no afirma que el catálogo esté indexado ni que todos los documentos estén consolidados y vigentes.

**Importante:** antes de una demostración jurídica, revisa la vigencia y procedencia del corpus. En el contexto previo se advirtió que el PDF constitucional inicial podía ser una versión anterior. No presentes una fuente del catálogo como si se hubiera recuperado en una respuesta si no aparece en los resultados.

## Límites y seguridad

- El quechua tiene variedades. La demo usa por defecto quechua chanka/Ayacucho; las otras variedades disponibles son experimentales y no validadas.
- “Respaldada” o “contradicha” solo debe mostrarse cuando el análisis vincule una fuente recuperada pertinente. “No verificable” no significa falso.
- Un hallazgo no determina que una cláusula sea ilegal, nula o abusiva, ni indica si se debe firmar.
- El audio se envía por segmentos independientes de aproximadamente 10 segundos a la API. Si tu `backend/.env` fija `OPENAI_TRANSCRIPTION_MODEL` a un modelo antiguo, cambia a `gpt-transcribe` y reinicia el backend. El código mantiene `gpt-4o-mini-transcribe` como alternativa para errores de formato compatibles. Inicia el micrófono solo con consentimiento de las personas participantes.
- No subas expedientes confidenciales, DNI reales ni datos sensibles. Usa los casos ficticios para la demo.
- Nunca pongas la clave de API en React ni la subas a GitHub.

## Estructura

```text
Khipu-Legal-Team-SuperNova/
  backend/app/main.py
  backend/examples/
  backend/data/legal_docs/
  backend/requirements.txt
  backend/.env.example
  frontend/src/App.jsx
  frontend/src/components/AndeanIntro.jsx
  frontend/src/lib/api.js
  frontend/src/styles.css
  start_khipu.bat
  start_khipu.ps1
```

La carpeta raíz del paquete es `Khipu-Legal-Team-SuperNova`. Los scripts `start_rimay.*` se incluyen únicamente como alias de compatibilidad; la marca visible y el nombre de la API son **Khipu Legal · Team SuperNova**.


## v1.4.0: trazabilidad jurídica y correcciones de búsqueda

- La búsqueda web se ejecuta sin el parámetro `filters` que generó un error 400 en algunas configuraciones. Se aplica además una lista blanca de dominios oficiales a los resultados recuperados. Si la herramienta falla, el sistema intenta opciones compatibles y comunica la limitación; no presenta el catálogo como si se hubiera consultado.
- La interfaz en quechua usa un nuevo caché v8 y acepta un catálogo amplio de etiquetas, evitando quedar bloqueada por etiquetas nuevas. La traducción automática sigue siendo experimental.
- Documento Claro muestra campos de base jurídica, autoridad competente y pasos siguientes en tarjetas paralelas español/quechua, siempre sujetos a respaldo y traducción disponible.
- Las citas crudas del API se normalizan para que no se vean marcadores técnicos como `【1:1-6†archivo.pdf】`.
- Documento Claro y Live conservan un campo de preguntas de seguimiento; estas consultas disparan un nuevo flujo de Orienta, que puede realizar búsqueda web cuando está habilitada. Los segmentos de voz siguen priorizando RAG local para evitar búsquedas costosas cada pocos segundos.
- El objetivo es recuperar 5–6 fuentes oficiales pertinentes cuando existan, no fabricar referencias: si hay menos, la interfaz lo advierte.

Tras actualizar, detén y reinicia el backend y el frontend. Si la interfaz traduce con datos antiguos, borra las claves de almacenamiento local `khipu-legal-ui-copy-chanka-v7` y `khipu-legal-ui-language-v7` del navegador o utiliza una ventana privada.
