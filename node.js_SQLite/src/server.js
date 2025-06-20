import express from 'express' 
import path , {dirname} from  'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import db from './db.js';

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)


//! --  Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
//! --  Get the directory name from the file path
const __dirname = dirname(__filename)

//! -- Tell Express to send all the files from `/public` route
app.use(express.static(path.join(__dirname, '../public'))) 

//* -- sending HTML file from the `/public` directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})

