import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRoutesFactory = (db) => {
    const router = express.Router();

    router.post('/register', async (req, res) => {
        console.log("Received body:", req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        try {
            const existingUser = await db.get('SELECT * FROM user WHERE username = ?', [username]);
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const hashedPassword = bcrypt.hashSync(password, 8);

            let userId;
            await db.run('BEGIN TRANSACTION');
            const userResult = await db.run('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashedPassword]);
            userId = userResult.lastInsertRowid;

            const defaultTodo = 'Hello :) Add your first todo!';
            await db.run('INSERT INTO todos (user_id, task) VALUES (?, ?)', [userId, defaultTodo]);

            await db.run('COMMIT');

            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.status(201).json({ token });
        } catch (err) {
            await db.run('ROLLBACK');
            console.error("Error during registration:", err.message);
            res.status(500).json({ message: 'Server error during registration' });
        }
    });

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        try {
            const user = await db.get('SELECT * FROM user WHERE username = ?', [username]);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token });
        } catch (err) {
            console.error("Error during login:", err.message);
            res.status(500).json({ message: 'Server error during login' });
        }
    });

    return router;
};

export default authRoutesFactory;