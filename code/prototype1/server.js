//un serveur complet en l'utilisant le module express

/*function aleString(length){ // code temporaire, à remplacer par le bon code
  return(""+fake_aleString);
};*/

let express = require("express");
let app = express(); //on crée une application expresse (moteur web serveur)

let http = require("http");
let serveur = http.Server(app); //on crée un serveur http géré apar l'application express

let socket_io = require("socket.io");
let io_server = socket_io(serveur);

/*let bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';*/

let dir = './www';

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'Admin',
    password: 'admin',
    database: 'projet_digital'
});

//let all_users = [];

/*let tools = {
  sendClientPage(res, dir_script, send_socket_io, client_code){
  //dir script : dossier des script a transmettre
  res.write(CLIENT_BEGIN);
  //injection du code client
  res.write("\n <script>"+client_code+"</script>");

  let all_script_client =  fs.readdirSync("./www/" + dir_script); //console.log(scripts_file);

  for (let name of all_script_client) {
    if(name.endsWith('.js')){
      res.write("\n <script src=/"+dir_script+"/"+name+"></script>");
  }
  }
    res.write(CLIENT_END);
    res.end();
  },
  addUser : (name) => {
    let token = aleString(32)
    waiting_user.push({
      name: name,
      token : token //genere une chaine aléatoire de 32 caractères
    });
    return(token);
  }
}*/

io_server.on("connection" , socket_client => {

  console.log("Un client se connecte en websocket");

  /*socket_client.on("my_token_is",(token)=>{
      //on va recherche ce token dans le tableau des users en attentes
      let find = null; //contiendra le descripteur trouve
      for(let i=0; i<waiting_user.length; i++ ){
        let desc = waiting_user[i];
          if( desc.token == token){
          find = desc;
          waiting_user.splice(i,1); //on supprime la position i dans waiting liste
          break; // on sort du for
        }
      }
      if(find){ //on a bien trouver une corrspondance, on valide la connexion
        connected_users[find.name]={
          socket : socket_client
        };
        all_users.push(find.name);
        io_server.emit("all_users",all_users); // on diffuse la modification vers tous les interface deja connecté
      }else{
        console.log("... erreur de token sur une nouvelle connexion websocket...");
        socket_client.emit("bad_socket");
        //on ignore ce client
      }
    });*/

  socket_client.on("Connect", valeur_info => {
    console.log("tout va bien");
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
            switch(valeur_info.type){
              case "Étudiant":
                console.log("Send Page");
              io_server.emit("good_connection", "/VotreCompte");
              break
            }
          }else{
            console.log("Mauvais mot de passe");
            io_server.emit("wrong_mdp", valeur_info)
          }
        }else{
          console.log("Mauvaise addresse mail");
          io_server.emit("wrong_mail", valeur_info)
        };
      });
    })
  })

  socket_client.on("getInfo", num => {
    console.log("tout va bien");
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

app.use(express.static(dir)); //on indique à l'application de diffuser le contenur du sdossier www

serveur.listen(8090);
console.log("Serveur 2 lancé ....");
