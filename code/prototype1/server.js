//un sereur complet en l'utilisant le module express

let express = require("express");
let app = express(); //on crée une application expresse (moteur web serveur)

let http = require("http");
let serveur = http.Server(app); //on crée un serveur http géré apar l'application express

let socket_io = require("socket.io");
let io_server = socket_io(serveur);

let bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

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

  socket_client.on("Connect", valeur_info => {

    //const hash_mdp = bcrypt.hash(valeur_info.mdp,10);

    var selectQuery = `SELECT * FROM etudiants WHERE mail = '${valeur_info.mail}'`;

    pool.getConnection((err, connection) => {
    if(err) throw err
    console.log(`Connecté à l'id ${connection.threadId}`)

    connection.query(selectQuery, (err, rows) => {
      var Result = rows[0];
      connection.release()
      if(Result){
          //res.writeHead(301,{Location: 'http://w3docs.com/' + pathname})
          console.log("Mail verifié !");
          /*console.log(hash_mdp);
          console.log(Result['mdp']);*/
          //if (bcrypt.compareSync(hash_mdp, Result['mdp'])){
          if (valeur_info.mdp == Result['mdp']){
            console.log("Mot de passe verifié");
            switch(valeur_info.mail){
              case "Étudiant":
              io_server.emit("good_connection", "http://localhost:8090/VotreCompte");
              break
            }

            //res.redirect('/VotreCompte');
          }else{
            console.log("Mauvais mot de passe");
            io_server.emit("wrong_mdp")
          }
        }else{
          console.log("Mauvaise addresse mail");
          io_server.emit("wrong_mail")
        };
      });
    })
  })

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
app.get('/Log', (req, res) => {
  res.sendFile("./login.html", {root: dir});

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
