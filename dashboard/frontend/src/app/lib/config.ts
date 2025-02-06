// app/lib/config.ts
export const getApiUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? 'http://dashboard-backend:47153'
    : 'https://api.trycosmic.ai';
};

export const getWebsocketUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? 'ws://0.0.0.0:47153/ws'
    : 'wss://api.trycosmic.ai/ws';
};

export const getMarimoUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? 'http://localhost:3002'
    : 'https://ide.trycosmic.ai';
};