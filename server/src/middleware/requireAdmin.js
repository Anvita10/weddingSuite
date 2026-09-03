import { env } from '../config/env.js';

// Minimal shared-secret auth for the internal sales dashboard / admin actions.
// For a real production deployment with multiple staff logins, swap this for
// proper session/JWT auth — this keeps the starter simple and dependency-light.
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!env.adminToken || env.adminToken === 'change-me') {
    return res.status(500).json({
      error: 'Server misconfiguration: ADMIN_TOKEN is not set. Refusing to authorize.',
    });
  }

  if (token !== env.adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
