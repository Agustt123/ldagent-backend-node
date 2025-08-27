export function mapTextToCommand(text) {
  const t = (text || '').toString().trim().toLowerCase();
  const onPat = /(prend[eé]|encend[eé]|activar|enciende|turn on|encender).*(linterna|flash|linternita|torch)|^(linterna|flash)\s*on$/i;
  const offPat = /(apag[aá]|desactiv[aá]|off|turn off).*(linterna|flash|torch)|^(linterna|flash)\s*off$/i;
  const blinkPat = /(parpade(a|e)r|blink|titilar).*(linterna|flash|torch)/i;
  if (blinkPat.test(t)) {
    const times = parseInt((t.match(/\b(\d{1,2})\b/)||[])[1]||'3',10);
    const intervalMs = parseInt((t.match(/(\d{2,4})\s*ms/)||[])[1]||'300',10);
    return { op: 'torch', state: 'blink', times, intervalMs };
  }
  if (onPat.test(t)) return { op: 'torch', state: 'on' };
  if (offPat.test(t)) return { op: 'torch', state: 'off' };
  return null;
}
