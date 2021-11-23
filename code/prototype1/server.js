//un sereur complet en l'utilisant le module express

let express = require("express");
let app = express(); //on crée une application expresse (moteur web serveur)

let http = require("http");
let serveur = http.Server(app); //on crée un serveur http géré apar l'application express

let socket_io = require("socket.io");
let io_server = socket_io(serveur);

let dir = './www';

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'Admin',
    password: 'admin',
    database: 'projet_digital'
});

io_server.on("connection" , socket_client => {

  console.log("Un client se connecte");

  socket_client.on("getInfo", num => {
    var selectQuery = "SELECT * FROM `etudiants`";
    pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)

      connection.query(selectQuery, (err, rows) => {
          var Result = rows[0];
          connection.release()    // return the connection to pool

          if(!err){
            io_server.emit("setInfo",{
              genre: Result['genre'],
              nom: Result['nom'],
              prenom: Result['prenom'],
              mail: Result['mail'],
              numero: Result['numero'],
              cv: Result['cv'],
              siteweb: Result['siteweb'],
              linkedin: Result['linkedin'],
              twitter: Result['twitter'],
              facebook: Result['facebook'],
              github: Result['github'],
              gitlab: Result['gitlab'],
              sof: Result['sof']
            });
          } else {
              console.log(err+"1")
          }
      })
    });
  });

  socket_client.on("modifie", newVal => {
    let critere = ["genre", "nom", "prenom", "mail", "numero", "siteweb", "linkedin", "twitter", "facebook", "github", "gitlab", "sof"];
    var selectQuery = 'UPDATE etudiants SET '
    let i = 0;
    for(let value in newVal){
      if(newVal[value] != ''){
        selectQuery = selectQuery + critere[i] + "='" + newVal[value] + "', ";
      }
      console.log(selectQuery);
      i++;
    }
    selectQuery = selectQuery.slice(0, -1);
    selectQuery = selectQuery.slice(0, -1);
    selectQuery = selectQuery + " WHERE 1";
    pool.getConnection((err, connection) => {
    if(err) throw err
    console.log(`Connecté à l'id ${connection.threadId}`)

    connection.query(selectQuery, (err, result) => {
      if(err){
          console.log(err+"1")
        };
      });
    })
  })

  socket_client.on("disconnect", ()=>{
    console.log("le client se déconnect !");
  });
});

app.all('/VotreCompte', (req, res) => {
  res.sendFile("./CompteEtudiant.html", {root: dir});

})

//traitement spécifique de certain irl
/*app.all("/VotreCompte", (req, res)=>{
  res.write("CompteEtudiant.html");
  res.end();
})

*/


app.use(express.static(dir)); //on indique à l'application de diffuser le contenur du sdossier www

serveur.listen(8090);
console.log("Serveur 2 lancé ....");
