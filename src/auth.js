import { CONFIG } from './config.js';
export function requireBearer(req, res, next) {
  const hdr = req.get('Authorization') || '';
  const [scheme, token] = hdr.split(' ');
  if (scheme !== 'Bearer' || token !== CONFIG.AUTH_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}
