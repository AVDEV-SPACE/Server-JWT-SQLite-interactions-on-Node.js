// src/routes/authRoutes.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Aceasta este o "factory function" care creează și returnează un router
const authRoutesFactory = (db) => { // Primește instanța db ca argument
    const router = express.Router()

    // Register a new user endpoint /auth/register
// src/routes/authRoutes.js
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
        return res.status(400).json({ message: "Username and password (min 6 chars) are required." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const checkUserStmt = await req.db.prepare('SELECT id FROM user WHERE username = ?');
        const existingUser = await checkUserStmt.get(username);
        await checkUserStmt.finalize();

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const insertUserStmt = await req.db.prepare('INSERT INTO user (username, password) VALUES (?, ?)');
        const result = await insertUserStmt.run(username, hashedPassword);
        await insertUserStmt.finalize();

        const userId = result.lastID;

        const defaultTodo = 'Hello :) Add your first todo!';
        const insertTodoStmt = await req.db.prepare('INSERT INTO todos (user_id, task, completed) VALUES (?, ?, 0)');
        await insertTodoStmt.run(userId, defaultTodo, 0);
        await insertTodoStmt.finalize();

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

    // Login user endpoint /auth/login
    router.post('/login', async (req, res) => { // Funcția rutei trebuie să fie async
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        try {
            const getUserStmt = await db.prepare('SELECT * FROM user WHERE username = ?');
            const user = await getUserStmt.get(username);
            await getUserStmt.finalize();

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token }); // Status implicit 200 OK
        } catch (err) {
            console.error("Error during login:", err.message);
            res.status(500).json({ message: 'Server error during login' });
        }
    });

    return router; // Returnează routerul configurat
};

export default authRoutesFactory;