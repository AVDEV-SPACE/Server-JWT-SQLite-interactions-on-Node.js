// ? IMPORTS Express within the app
const express = require('express')

//! INVOCES Express as a function 
const app = express()

// ? DECLARES THE CHANELL where express will run on 
const PORT = 8383

let data = [
    { id: 1, name: 'james' } // Adăugăm un ID inițial
];
let nextId = 2;


// * --- MIDDLEWARE
app.use(express.json())

//! 1-ENDPOINT  -- HTTP VERBS (method) && Routes (or paths)
app.get( '/' , (req,res) => {
    console.log("i reached this endpoint",req.method);


        res.send(`
        <body style="background:pink; color: blue;">
        <h1>DATA</h1>
        <h3>${JSON.stringify(data)} </h3>
        <a href="/dashboard">Dashboard</a>
        </body>
    `);
})

app.get('/dashboard', (req, res) => {
    res.send(`
        <body>
        <h1>dashboard</h1>
        <a href="/">home</a>
        </body>       
        `)
})



app.get( '/api/data' , (req,res) => {
console.log('an demo for a data api endpoint');
res.send(data)
})

app.post('/api/data', (req, res) => {
    const newEntry = req.body;

    if (!newEntry || !newEntry.name) {
        return res.status(400).json({ message: '🚩Name and Id🚩 is required' });
    }
    
    const newItem = { id: nextId++, name: newEntry.name }; //! -- Creează un obiect cu ID
    data.push(newItem); //! --   Adaugă obiectul complet
    console.log('New data added:', newItem);
    res.status(201).json(newItem); // Răspunde cu elementul creat
});

// Modifică ruta DELETE pentru a șterge un element specific după ID
app.delete('/api/data/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id); // Extrage ID-ul din URL

    // Folosește filter pentru a crea un nou array fără elementul cu ID-ul specificat
    const initialLength = data.length;
    data = data.filter(item => item.id !== idToDelete);

    if (data.length < initialLength) {
        console.log(`Element with ID ${idToDelete} deleted.`);
        res.status(204).send(); // 204 No Content - șters cu succes, fără corp
    } else {
        console.log(`Element with ID ${idToDelete} not found.`);
        res.status(404).json({ message: 'Item not found' }); // 404 Not Found - nu s-a găsit elementul
    }
});


//! 2-API-ENDPONTS
//? --CRUD-METHODS  
//?  --CREATE-POST , READ-GET, UPRDATE-PUT, DELETE-DELTETE 
// * telling the hardware to listen for the requests 
app.listen(PORT, () =>  console.log(`Server has starter 🏃🏻‍♀️ on : ${PORT}`));



