import { db } from "./dbTelegram.ts";

async function createUsersTableTel() {
  const query = `
    CREATE TABLE IF NOT EXISTS usersTelegram (
      id integer NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      username VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    console.log("⏳ Connecting and creating table...");
    await db(query);
    console.log('✅ Table "users" created successfully (if not exists)');
  } catch (err) {
    console.error("❌ Error creating table:", err);
  } finally {
    process.exit();
  }
}

createUsersTableTel();
