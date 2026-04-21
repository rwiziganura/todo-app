import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function listDatabases() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    const [rows] = await connection.query("SHOW DATABASES");
    console.log("Databases found:");
    rows.forEach(row => console.log("- " + row.Database));
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("Failed to list databases:", error.message);
    process.exit(1);
  }
}

listDatabases();
