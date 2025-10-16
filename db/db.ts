import { Pool } from 'pg'
import * as dotenv from "dotenv"

dotenv.config({ path: '.env' });
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 5432,
  database: 'Archyl_db'
})



export const db = (text: string, params?: any) => pool.query(text, params)
