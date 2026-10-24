> Desarrollado por **Team SuperNova**. Traducción al quechua experimental y no certificada.

# Guion breve para presentar Khipu Legal al jurado

## Antes de la presentación

- Comprueba `http://127.0.0.1:8000/api/health` y confirma que `api_configured` sea `true`.
- Si la demo debe abrirse en los teléfonos del jurado, despliega primero frontend y backend. `localhost` solo funciona en el equipo donde corre la aplicación.
- Si quieres mostrar evidencia RAG, confirma que `vector_store_connected` sea `true` y que `/api/sources` liste archivos con estado correcto. Un catálogo de fuentes por sí solo no demuestra que estén indexadas.
- Comprueba la vigencia del corpus legal. La Constitución que se usó inicialmente podría ser una versión anterior; no presentes el corpus como plenamente actualizado sin verificarlo.
- Utiliza únicamente los documentos ficticios de la demo y revisa que el micrófono del navegador tenga permiso.

## Recorrido sugerido (2–3 minutos)

### 1. Portada — 15 segundos

1. Enseña la animación generativa inspirada en textiles andinos.
2. Pulsa el selector visible **ES ↕ QU** para mostrar el cambio de idioma de interfaz. Explica que la traducción de la interfaz y del contenido al quechua sigue siendo experimental y necesita validación humana.
3. Entra en la aplicación.

### 2. Orienta — 30–40 segundos

1. Selecciona un caso precargado, por ejemplo **“Citación que no entiendo”** o **“Contrato de alquiler”**.
2. Elige el idioma de entrada **Español** o **Quechua**. La respuesta de Orienta aparece en dos paneles paralelos: español y quechua experimental.
3. Pulsa **Analizar mi situación**.
4. Enseña el plan de búsqueda, el mapa de evidencia y las fuentes recuperadas.
5. Muestra **KHIPU Evidence Engine**. Explica que es una capa propia de trazabilidad determinista: conecta la respuesta con fragmentos recuperados y comprueba si las menciones jurídicas aparecen en ellos.
6. Abre un vínculo y muestra términos coincidentes o una referencia localizada/no localizada. Aclara que coincidencia textual no demuestra que la norma respalde jurídicamente la conclusión.
7. Señala el indicador de corpus: si aparece **Sin índice**, explica que ese resultado no está fundamentado en el vector store; solo puede usar fuentes que la búsqueda web haya devuelto realmente.

### 3. Documento Claro — 60–75 segundos

1. Selecciona **Contrato de arrendamiento**. El documento ficticio se ve en pantalla; no hay que descargar nada.
2. Señala que contiene cláusulas realistas: renta, depósito, renovación y penalidad. El ejemplo incluye condiciones deliberadamente contradictorias para demostrar el flujo de revisión.
3. Pulsa **Paso 2: traducir y revisar** (también está en la tarjeta lateral). Espera a que termine el análisis.
4. Enseña el original y la traducción en columnas paralelas, con fragmentos subrayados.
5. Pulsa **Paso 3: ver hallazgos**. Explica la diferencia entre “respaldada”, “contradicha”, “requiere contexto” y “no verificable con el corpus”.
6. Abre las fuentes. Recalca que una alerta automática no declara ilegal una cláusula y que la ausencia de evidencia no significa que una afirmación sea falsa.

### 4. KHIPU Evidence Engine — 20 segundos

1. Enseña el mismo panel de trazabilidad en Orienta, Documento Claro o Live.
2. Señala las dos columnas ES/QU y una fuente enlazada.
3. Explica que el motor es código propio y determinista (coincidencia de texto + presencia de referencias), no otro modelo ni un detector de verdad. Las fuentes enlazadas son pistas para revisión, no una sentencia automática.

### 5. Voz en vivo — 30–40 segundos

1. Elige español o quechua y la variedad objetivo.
2. Marca el consentimiento e inicia el micrófono.
3. Di una frase breve de prueba; deja que se procesen algunos segmentos.
4. Pulsa **Terminar consulta** cuando quieras. La duración no está fijada; los fragmentos se procesan secuencialmente y pueden tardar en aparecer.

## Mensaje clave

**Khipu Legal no es solo un traductor:** combina comprensión lingüística, lectura documental guiada, recuperación de fuentes y KHIPU Evidence Engine para que la persona pueda rastrear la relación textual entre una explicación y el material que realmente se recuperó. La relación es una ayuda de revisión, no una verificación automática de verdad jurídica.

No afirmes que ofrece traducción certificada, asesoría jurídica, verificación infalible ni corpus legal actualizado sin validación.


## Recorrido nuevo en v1.4.0

1. En Orienta, formula una pregunta concreta y revisa los dos cuadros de idioma, las fuentes realmente recuperadas y sus enlaces. Si el sistema no consigue cinco fuentes oficiales pertinentes, debe advertirlo en vez de añadir referencias de relleno.
2. En Documento Claro, analiza un ejemplo ficticio y revisa el nuevo apartado de base jurídica, autoridad y pasos siguientes, siempre que el corpus aporte evidencia suficiente. Continúa haciendo preguntas desde el asistente inferior.
3. En Live, prueba primero el guion integrado. Para profundizar en un segmento, usa el asistente de seguimiento, que puede realizar una búsqueda web nueva; la transcripción por sí sola no es evidencia jurídica.
4. Para cambiar toda la interfaz, usa el selector ES/QU. Si había un caché de una versión anterior, borra la clave v7 y vuelve a solicitar la traducción.
