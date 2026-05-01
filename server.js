
console.log("SERVER FILE LOADED");

const express = require('express');
const sql = require('mssql');
const app = express();
const path = require('path');

// Serve frontend
app.use(express.static(path.join(__dirname)));

app.use(express.json());


// DATABASE CONFIG (Windows Auth)


const config = {
    user: 'testuser',          
    password: '1234',      
    server: 'DESKTOP-NBDS0VV',      

    database: 'OfficeDB',

    options: {
        encrypt: false,
        trustServerCertificate: true
    },

    port: 1433
};


//  CONNECT TO DATABASE

sql.connect(config)
    .then(() => console.log("Connected to SQL Server"))
    .catch(err => console.log("DB Connection Error:", err));

/*app.get('/test', (req, res) => {

    console.log("TEST ROUTE HIT");
    
    res.send("Test Working");
});*/

//  ADD EMPLOYEE
app.post('/add', async (req, res) => {
    
    console.log("ADD API HIT");
    console.log("BODY:", req.body);

    const { name, email } = req.body;

    try {
        await sql.query`
            INSERT INTO Employees (name, email)
            VALUES (${name}, ${email})
        `;
    
        console.log("INSERT SUCCESS");

        res.send("Employee Added");
    } catch (err) {
    
        console.log(" INSERT ERROR:", err);
    
        res.send(err.message);
    }
});



//  GET ALL EMPLOYEES

app.get('/employees', async (req, res) => {
    console.log("📥 /employees API HIT");

    try {
        const result = await sql.query`SELECT * FROM Employees`;
    
        console.log("Data from DB:", result.recordset);

        res.json(result.recordset);
    } catch (err) {
  
        console.log(" ERROR:", err);
    
        res.send(err.message);
    }
});



//  DELETE EMPLOYEE

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await sql.query`DELETE FROM Employees WHERE id = ${id}`;
        res.send("✅ Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting employee");
    }
});


//  UPDATE EMPLOYEE

app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    console.log("UPDATE API HIT:", id, name, email);

    try {
        await sql.query`
            UPDATE Employees
            SET name = ${name}, email = ${email}
            WHERE id = ${id}
        `;

        res.send("Employee Updated");
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


//  START SERVER

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});