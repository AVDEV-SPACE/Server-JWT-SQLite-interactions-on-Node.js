import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import initializeDatabase from './db.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

async function startServer() {
    try {
        const db = await initializeDatabase();

        // Pasează db către middleware și rute
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        app.use('/auth', authRoutes(db));
        app.use('/todos', authMiddleware, todoRoutes);

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../public', 'index.html'));
        });

        app.listen(PORT, () => {
            console.log(`Server has started on port: ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to initialize database or start server:", err);
        process.exit(1);
    }
}

startServer();