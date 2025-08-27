import { Router } from 'express';
import { requireBearer } from './auth.js';
import { mapTextToCommand } from './nlu.js';
import { z } from 'zod';

export function buildRoutes(registry) {
  const r = Router();
  //r.use(requireBearer);

  r.get('/', (req, res) => { res.json({ ok: true, mensage: 'LD-Agent Backend ALEEEE' }); });

  r.get('/devices', (req, res) => { res.json({ devices: registry.list() }); });

  const CmdSchema = z.object({
    id: z.string().optional(),
    op: z.enum(['torch']),
    state: z.enum(['on', 'off', 'blink']).optional(),
    times: z.number().int().min(1).max(20).optional(),
    intervalMs: z.number().int().min(50).max(5000).optional(),
  });

  r.post('/command', (req, res) => {
    const { deviceId, command } = req.body || {};
    if (!deviceId) return res.status(400).json({ error: 'missing deviceId' });
    const parsed = CmdSchema.safeParse(command);
    if (!parsed.success) return res.status(400).json({ error: 'invalid command', details: parsed.error.flatten() });
    try {
      const payload = { id: command.id || String(Date.now()), ...parsed.data };
      registry.send(deviceId, payload);
      res.json({ ok: true, sent: payload });
    } catch (e) { res.status(400).json({ error: e.message }); }
  });

  r.post('/torch', (req, res) => {
    const { deviceId, state, times, intervalMs, id } = req.body || {};
    if (!deviceId || !state) return res.status(400).json({ error: 'missing deviceId/state' });
    const payload = { id: id || String(Date.now()), op: 'torch', state, ...(times ? { times } : {}), ...(intervalMs ? { intervalMs } : {}) };
    try { registry.send(deviceId, payload); res.json({ ok: true, sent: payload }); }
    catch (e) { res.status(400).json({ error: e.message }); }
  });

  r.post('/intent', (req, res) => {
    const { deviceId, text, id } = req.body || {};
    if (!deviceId || !text) return res.status(400).json({ error: 'missing deviceId/text' });
    const cmd = mapTextToCommand(text);
    if (!cmd) return res.status(422).json({ error: 'no_intent_detected' });
    try { const payload = { id: id || String(Date.now()), ...cmd }; registry.send(deviceId, payload); res.json({ ok: true, sent: payload }); }
    catch (e) { res.status(400).json({ error: e.message }); }
  });


  return r;
}
