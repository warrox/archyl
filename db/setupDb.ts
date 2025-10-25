import { db } from './db'

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      refreshToken VARCHAR(1000),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `

  try {
    console.log('⏳ Connecting and creating table...')
    await db(query)
    console.log('✅ Table "users" created successfully (if not exists)')
  } catch (err) {
    console.error('❌ Error creating table:', err)
  } finally {
    process.exit()
  }
}

createUsersTable()
