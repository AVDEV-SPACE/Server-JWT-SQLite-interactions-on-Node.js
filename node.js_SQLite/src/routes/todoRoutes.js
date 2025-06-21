// src/routes/todoRoutes.js
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('User ID:', req.userId);
    try {
        const stmt = await req.db.prepare('SELECT * FROM todos WHERE user_id = ?');
        const todos = await stmt.all([req.userId]); // Folosește stmt.all cu await
        console.log('Todos fetched:', todos);
        res.json(todos || []);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { task } = req.body;
    try {
        const stmt = await req.db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
        const result = await stmt.run([req.userId, task]);
        res.json({ id: result.lastID, task, completed: 0 });
    } catch (err) {
        console.error('Error creating todo:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
    try {
        const stmt = await req.db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
        await stmt.run([completed, id]);
        res.json({ message: 'Todo completed' });
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const stmt = await req.db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
        await stmt.run([id, req.userId]);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;