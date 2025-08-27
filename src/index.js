import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { CONFIG } from './config.js';
import { httpLogger, log } from './logger.js';
import { createWsHub } from './wsHub.js';
import { buildRoutes } from './routes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: CONFIG.CORS_ORIGIN === '*' ? true : CONFIG.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(httpLogger);

const server = http.createServer(app);
const { wss, registry } = createWsHub(server);

app.get('/', (req, res) => res.json({ ok: true, message: 'LD-Agent Backend', wsPath: CONFIG.WS_PATH }));
app.use('/v1', buildRoutes(registry));

server.listen(CONFIG.PORT, () => {
  log.info(`HTTP on :${CONFIG.PORT}`);
  log.info(`WS path ${CONFIG.WS_PATH} with ${CONFIG.WS_AUTH_HEADER}: ${CONFIG.WS_AUTH_SCHEME} ${CONFIG.WS_TOKEN}`);
});
