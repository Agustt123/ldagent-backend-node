# LD-Agent Backend (Node.js)

Backend minimal para orquestar comandos hacia la app Android (LD‑Agent) vía WebSocket, con un **skill** inicial: `torch` (linterna).

## Setup
```bash
cp .env.example .env
# editá AUTH_TOKEN y WS_TOKEN
npm install
npm run start
```

## API
- `GET /v1/devices` (Bearer AUTH_TOKEN)
- `POST /v1/torch` → `{ deviceId, state:on|off|blink, times?, intervalMs? }`
- `POST /v1/intent` → `{ deviceId, text }` → mapea texto a comando torch

## Probar rápido
```bash
# simular device
npm i -g wscat
WS_TOKEN=CHANGE_ME_DEVICE_TOKEN
wscat -H "Authorization: Bearer $WS_TOKEN" -c "ws://localhost:13000/ws?deviceId=dev1"

# en otra terminal
AUTH_TOKEN=CHANGE_ME_BACKEND_TOKEN
curl -s http://localhost:13000/v1/devices -H "Authorization: Bearer $AUTH_TOKEN"
curl -s -X POST http://localhost:13000/v1/torch -H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json" -d '{"deviceId":"dev1","state":"on"}'
```


---
## Docker (opcional)
```bash
cp .env.example .env
docker compose up -d --build
docker compose logs -f
```
- Expuesto en `http://localhost:13000/` y WS `ws://localhost:13000/ws`.
