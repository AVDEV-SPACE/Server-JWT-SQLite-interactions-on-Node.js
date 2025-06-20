// src/server.js
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutesFactory from './routes/authRoutes.js'; // Reține "Factory"
import todoRoutes from './routes/todoRoutes.js'; // Dacă și acesta are nevoie de db, va trebui și el modificat
import dbPromise from './db.js'; // Importă promisiunea

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Așteaptă inițializarea bazei de date înainte de a porni serverul și rutele
async function startServer() {
    try {
        const db = await dbPromise; // Așteaptă aici rezolvarea promisiunii

        // Acum pasezi instanța `db` reală către fabrica de rute
        app.use('/auth', authRoutesFactory(db));

        // app.use('/todos', todoRoutes(db));


        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        app.use(express.static(path.join(__dirname, '../public')));

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        app.listen(PORT, () => {
            console.log(`Server has started on port: ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to initialize database or start server:", err);
        process.exit(1); // Ieși din proces dacă nu se poate inițializa baza de date
    }
}

startServer(); // Apelez funcția asincronă pentru a porni serverul