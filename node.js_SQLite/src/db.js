import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Inițializarea bazei de date
async function initializeDatabase() {
    const db = await open({
        filename: ':memory:',
        driver: sqlite3.Database
    });

    // Crearea tabelelor
    await db.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task TEXT,
            completed BOOLEAN DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )
    `);

    return db;
}

export default initializeDatabase();