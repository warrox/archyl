import { Pool } from "pg";
import * as dotenv from "dotenv";

import type { QueryResult, QueryResultRow } from "pg"; // <-- only type import
dotenv.config({ path: ".env" });
export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 5432,
  database: "Archyl_dbTelegram",
});

export const db = async <T extends QueryResultRow>(
  text: string,
  params?: any,
): Promise<T[]> => {
  const result: QueryResult<T> = await pool.query(text, params);
  return result.rows;
};
