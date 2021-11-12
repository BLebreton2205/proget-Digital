const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extend:false }));

app.use(bodyParser.json());

//  MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'Beer_user',
    password: '123456789',
    database: 'nodejs_beers'
});

// Avoir toutes les bières de la database
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)

        connection.query('SELECT * from beers', (err, rows) => {
            connection.release()    // return the connection to pool

            if(!err){
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})



// Écoute sur le port d'environment ou 5000
app.listen(port, () => console.log(`Ecoute sur le port ${port}`));