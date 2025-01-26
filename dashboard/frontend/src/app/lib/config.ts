// app/lib/config.ts
export const getApiUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment 
    ? 'http://0.0.0.0:47153'
    : 'https://api.trycosmic.ai';
};
