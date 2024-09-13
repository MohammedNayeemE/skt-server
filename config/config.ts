import dotenv from 'dotenv';
dotenv.config();
import {Pool , PoolConfig} from 'pg';

const poolConfig: PoolConfig = {
  user: process.env.DB_USER || '', 
  host: process.env.DB_HOST || '',
  password: process.env.DB_PASSWORD || 'punda',
  database: process.env.DB_DATABASE || 'AIML',
  port: 5432,
  idleTimeoutMillis: 20000,
  max: 12
};

export const pool = new Pool(poolConfig);
