import express from 'express' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register', (req, res) => {
    if (!req.body) return res.status(400).json({ error: 'No body' });
    
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8)
    console.log(hashedPassword);
    
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    res.status(201).json({ message: 'Success' });
}); 

router.post('/login', (req, res) => {
    
})

export default router