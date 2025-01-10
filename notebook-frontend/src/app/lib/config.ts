// app/lib/config.ts
export const getApiUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? 'http://127.0.0.1:8000'
    : 'https://api.trycosmic.ai';
};
