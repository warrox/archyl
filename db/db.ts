import { Pool } from 'pg'

const pool = new Pool({
  user: 'Warren',
  password: 'LikeSugarOnMyTongue',
  host: 'db',
  port: 5432,
  database: 'Archyl_db'
})



export const db = (text: string, params?: any) => pool.query(text, params)
