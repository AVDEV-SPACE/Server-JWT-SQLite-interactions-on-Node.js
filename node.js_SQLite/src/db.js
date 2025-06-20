import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Variabila `db` este globală în acest modul, dar este reutilizată intern în initializeDatabase
// Aceasta este o funcție asincronă care returnează o promisiune
async function initializeDatabase() {
    const dbInstance = await open({ // Redenumit pentru claritate
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Crearea tabelelor
    // NOTĂ: Ai folosit 'user' aici, ceea ce este corect, dar verifică și în authRoutes.js să folosești tot 'user'
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task TEXT,
            completed BOOLEAN DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )
    `);

    return dbInstance; // Această funcție returnează instanța bazei de date deschise
}

// Aici exportăm direct rezultatul apelului funcției initializeDatabase(), care este o Promisiune.
// Acest lucru înseamnă că `db` în alte fișiere va fi o Promisiune, nu direct instanța bazei de date.
export default initializeDatabase();