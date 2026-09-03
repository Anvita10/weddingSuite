import 'dotenv/config';

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`[config] Missing env var ${name} — using empty string. Set it in .env for production.`);
    return '';
  }
  return value;
}

export const env = {
  port: Number(required('PORT', '4000')),
  nodeEnv: required('NODE_ENV', 'development'),
  clientOrigin: required('CLIENT_ORIGIN', 'http://localhost:5173').split(',').map((s) => s.trim()),
  dbPath: required('DB_PATH', './data/wedding-suite.db'),
  adminToken: required('ADMIN_TOKEN', 'change-me'),
  whatsappNumber: required('WHATSAPP_NUMBER', ''),
  hotelName: required('HOTEL_NAME', 'The Grand Aranya'),
  isProd: (process.env.NODE_ENV || 'development') === 'production',
};
