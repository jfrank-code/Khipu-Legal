const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function interfaceText(key, fallback) {
  try {
    if (typeof localStorage !== 'undefined' && (localStorage.getItem('khipu-legal-ui-language-v8') === 'qu')) {
      const cache = JSON.parse(localStorage.getItem('khipu-legal-ui-copy-chanka-v8') || '{}');
      return (typeof cache[key] === 'string' && cache[key].trim()) ? cache[key] : fallback;
    }
  } catch { /* fall back to Spanish error copy */ }
  return fallback;
}

function userFacingError(detail, status = 0) {
  const message = String(detail || '');
  // In Quechua-interface mode, common backend errors are mapped to the same translated UI dictionary.
  if (typeof localStorage !== 'undefined' && (localStorage.getItem('khipu-legal-ui-language-v8') === 'qu')) {
    let key = 'error_api_status';
    if (/Falta OPENAI_API_KEY/i.test(message)) key = 'error_api_key_missing';
    else if (/Falta el paquete openai/i.test(message)) key = 'error_openai_dependency';
    else if (/No pude leer|No pude extraer|Falló la traducción del documento|documento.*traducción/i.test(message)) key = 'error_document_processing';
    else if (/No se puede conectar con el backend/i.test(message)) key = 'error_backend_connection';
    else if (/No se pudo completar|No se pudo analizar|No se pudo transcribir|Error HTTP/i.test(message) || status) key = 'error_ai_request';
    return interfaceText(key, 'La solicitud no pudo completarse. Revisa la conexión y la configuración de la API.');
  }
  return message || `Error HTTP ${status || 'desconocido'}`;
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, options);
  } catch {
    throw new Error(interfaceText('error_backend_connection', 'No se puede conectar con el backend Khipu Legal · Team SuperNova. Comprueba que la API Python esté ejecutándose en http://127.0.0.1:8000.'));
  }
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : { detail: await response.text() };
  if (!response.ok) throw new Error(userFacingError(payload.detail, response.status));
  return payload;
}

export const api = {
  health: () => request('/api/health'),
  sources: () => request('/api/sources'),
  examples: () => request('/api/examples'),
  uiCopy: (language = 'es', strings = {}) => request('/api/ui-copy', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, variety: 'chanka', strings }),
  }),
  orienta: (body) => request('/api/orienta', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }),
  translateDocument: (file, variety = 'chanka') => {
    const form = new FormData();
    form.append('file', file);
    form.append('variety', variety);
    return request('/api/documentos/translate', { method: 'POST', body: form });
  },
  analyzeDocument: (file, outputLanguage, variety, context, providedTranslation = '') => {
    const form = new FormData();
    form.append('file', file);
    form.append('output_language', outputLanguage);
    form.append('variety', variety);
    form.append('context', context || '');
    if (providedTranslation) form.append('provided_translation', providedTranslation);
    return request('/api/documentos/analyze', { method: 'POST', body: form });
  },
  analyzeLiveText: (text, outputLanguage = 'bi', variety = 'chanka', inputLanguage = 'es') => request('/api/live/analyze-text', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, output_language: outputLanguage, variety, input_language: inputLanguage }),
  }),
  liveSegment: (blob, outputLanguage = 'bi', variety = 'chanka', inputLanguage = 'es') => {
    const form = new FormData();
    const mime = (blob?.type || 'audio/webm').split(';')[0].toLowerCase();
    const ext = ({ 'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/m4a': 'm4a', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/wav': 'wav', 'audio/x-wav': 'wav', 'audio/ogg': 'ogg', 'audio/flac': 'flac' })[mime] || 'webm';
    const normalized = blob.type === mime ? blob : new Blob([blob], { type: mime });
    form.append('file', normalized, `khipu-live-${Date.now()}.${ext}`);
    form.append('output_language', outputLanguage);
    form.append('variety', variety);
    form.append('input_language', inputLanguage);
    return request('/api/live/segment', { method: 'POST', body: form });
  },
};
