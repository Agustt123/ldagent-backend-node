import { WebSocketServer } from 'ws';
import { CONFIG } from './config.js';
import { DeviceRegistry } from './registry.js';
import { log } from './logger.js';

export function createWsHub(server) {
  const wss = new WebSocketServer({ noServer: true });
  const registry = new DeviceRegistry();

  server.on('upgrade', (req, socket, head) => {
    if (new URL(req.url, 'http://localhost').pathname !== CONFIG.WS_PATH) { socket.destroy(); return; }
    const auth = req.headers[CONFIG.WS_AUTH_HEADER.toLowerCase()] || '';
    const expected = `${CONFIG.WS_AUTH_SCHEME} ${CONFIG.WS_TOKEN}`;
    if (auth !== expected) { socket.destroy(); return; }
    wss.handleUpgrade(req, socket, head, (ws) => { wss.emit('connection', ws, req); });
  });

  wss.on('connection', (ws, req) => {
    let info = {};
    try {
      const url = new URL(req.url, 'http://localhost');
      info = {
        deviceId: url.searchParams.get('deviceId') || undefined,
        model: req.headers['x-device-model'],
        build: req.headers['x-device-build'],
        user: req.headers['x-user-id'],
      };
    } catch {}
    const added = registry.addConnection(ws, info);
    log.info('device connected', added);

    ws.on('message', (data) => {
      let msg = null;
      try { msg = JSON.parse(data.toString()); } catch { msg = { raw: data.toString() }; }
      log.info('<- device', added.deviceId, msg);
    });

    ws.on('close', () => { registry.removeBySocket(ws); log.info('device disconnected', added.deviceId); });
  });

  return { wss, registry };
}
