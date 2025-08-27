import { randomUUID } from 'crypto';
export class DeviceRegistry {
  constructor() { this.byId = new Map(); }
  addConnection(ws, info = {}) {
    const id = info.deviceId || randomUUID();
    const meta = { ws, info: { ...info, deviceId: id }, lastSeen: Date.now() };
    this.byId.set(id, meta); ws._deviceId = id; return meta.info;
  }
  get(id) { return this.byId.get(id); }
  list() { return Array.from(this.byId.values()).map(v => ({ ...v.info, lastSeen: v.lastSeen })); }
  send(id, msgObj) {
    const rec = this.byId.get(id);
    if (!rec) throw new Error('device_not_connected');
    if (rec.ws.readyState !== rec.ws.OPEN) throw new Error('device_ws_not_open');
    rec.ws.send(JSON.stringify(msgObj)); return { ok: true };
  }
  removeBySocket(ws) { const id = ws?._deviceId; if (id && this.byId.has(id)) this.byId.delete(id); }
}
