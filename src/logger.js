import morgan from 'morgan';
export const httpLogger = morgan(':method :url :status :res[content-length] - :response-time ms');
export const log = {
  info: (...a) => console.log('[INFO]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  error: (...a) => console.error('[ERROR]', ...a),
};
