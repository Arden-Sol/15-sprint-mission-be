import { isDevelopment, isProduction } from '../config/config.js';

export const cors = (req, res, next) => {
  const whiteList = process.env.ALLOWED_ORIGINS;

  const origin = req.get('Origin');

  if (!origin && isDevelopment) {
    return next();
  }

  res.vary('Origin');

  if (isProduction && !whiteList.includes(origin)) {
    return res.status(403).json({
      message: '허용되지 않은 출처입니다.',
    });
  }

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
};
