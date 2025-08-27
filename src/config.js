import dotenv from 'dotenv';
dotenv.config();
export const CONFIG = {
  PORT: parseInt(process.env.PORT || '13000', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  AUTH_TOKEN: process.env.AUTH_TOKEN || 'CHANGE_ME_BACKEND_TOKEN',
  WS_PATH: process.env.WS_PATH || '/ws',
  WS_AUTH_HEADER: process.env.WS_AUTH_HEADER || 'Authorization',
  WS_AUTH_SCHEME: process.env.WS_AUTH_SCHEME || 'Bearer',
  WS_TOKEN: process.env.WS_TOKEN || 'CHANGE_ME_DEVICE_TOKEN',
};
