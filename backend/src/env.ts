import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  DATABASE_URI: process.env.DATABASE_URI || 'mongodb://admin:password@localhost:27017/app?authSource=admin',
  THROTTLE_TTL: Number(process.env.THROTTLE_TTL) || 60000,
  THROTTLE_LIMIT: Number(process.env.THROTTLE_LIMIT) || 10, 
};