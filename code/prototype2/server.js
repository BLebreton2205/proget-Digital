let CLIENT_BEGIN = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8"/>
        <title> Votre Comptes </title>
        <link rel="stylesheet" href="css/bootstrap.min.css"></link>
        <link rel="stylesheet" href="css/style.css"></link>
        <script src="jquery-3.6.0.slim.min.js"></script>
`
let CLIENT_END = `
    </head>
    <body>
    </body>
</html>
`;

let fake_aleString = 0;
function aleString(length){ // code temporaire, à remplacer par le bon code
  return(""+fake_aleString);
};

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
let http = require("http");
var cookieParser = require('cookie-parser');
const app = express();
let serveur = http.Server(app);
const port = process.env.PORT || 2205;

app.use(cookieParser());

//  MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'Admin',
    password: 'admin',
    database: 'projet_digital'
});
let waiting_user = [];
let connected_users = {};

let tools = { //Ensemble des outils de traitement serveur disponible pour les scripts serveurs
  sendClientPage(res, dir_script, send_socket_io, client_code){
  //dir script : dossier des script a transmettre
    res.write(CLIENT_BEGIN);
    if(send_socket_io){
      res.write("\n<script src='/socket.io/socket.io.js'></script>");
    }
    //injection du code client
    if(client_code){
      res.write("\n <script>"+client_code+"</script>");
      /*for(arg in client_code){
        res.write("\n <script>"+arg+"='"+client_code[arg]+"'</script>");
      }*/
    }

    let all_script_client =  fs.readdirSync("./www/" + dir_script); //console.log(scripts_file);

    for (let name of all_script_client) {
      if(name.endsWith('.js')){
        res.write("\n <script src=/"+dir_script+"/"+name+"></script>");
      }
    }
    res.write(CLIENT_END);
    res.end();
  },
  addUser : (req, name) =>{ //un client aa valider son formulaire d'identification er demande l'activation de son IHM
  console.log(waiting_user);
  let info = {};
  let token = aleString(32)
  for (let cookie in req.cookies) if (cookie == name) info = req.cookies[cookie]
    waiting_user.push({
      name: name,
      info : info
    });
    console.log(waiting_user);
  }
}

let socket_io = require("socket.io");
let io_server = socket_io(serveur);

io_server.on("connection", socket_client => {
    console.log("Un client se connecte en websocket !");
    socket_client.on("InfoPlease", (token) => {
      let find = null; //contiendra le descripteur trouve
      let info = {};
      for(let i=0; i<waiting_user.length; i++ ){
        let desc = waiting_user[i];
          if( desc.name == token){
          find = desc;
          info = desc.info;
        }
      }
      if(find){ //on a bien trouver une corrspondance
        var selectQuery = `SELECT * FROM ${info.type} WHERE mail = '${info.mail}'`;
        console.log(selectQuery);
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)

          connection.query(selectQuery, (err, rows) => {
          console.log("okey")
              var Result = rows[0];
              connection.release()    // return the connection to pool
              if(!err){
                io_server.emit("setInfo",{
                  type: info.type,
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
                  console.log("Info envoyer");
              } else {
                  console.log(err+"1")
              }
          })
        });
      }else{
        console.log("... erreur de token sur une nouvelle connexion websocket...");
        socket_client.emit("bad_socket");
        //on ignore ce client
      }
    })

    socket_client.on("modifie", newVal => {
      let critere = ["genre", "nom", "prenom", "mail", "numero", "siteweb", "linkedin", "twitter", "facebook", "github", "gitlab", "sof"];
      var selectQuery = `UPDATE ${newVal.type} SET `;
      let i = 0;
      for(let value in newVal){
        for (let crit of critere) {
          if (value == crit && newVal[value] != '') selectQuery = selectQuery + crit + "='" + newVal[value] + "', ";
        }
        i++;
      }
      selectQuery = selectQuery.slice(0, -1);
      selectQuery = selectQuery.slice(0, -1);
      selectQuery = selectQuery + ` WHERE mail = '${newVal.mail}'`;
      console.log(selectQuery);
      pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)

      connection.query(selectQuery, (err, result) => {
        console.log("Modifier");
        if(err){
            console.log(err+"1")
          };
        });
      })
    })

    socket_client.on("disconnect", () => {
        console.log("Le client se déconnecte !");
    });
});

app.use(bodyParser.urlencoded({ extend:false }));

app.use(bodyParser.json());

app.recordScript = function (url, callback) {
    //avec : arg : l'objet argument fourni par le client dans le corps de sa requête
    //                  au format json

    if (url.charAt(0) != '/') url = '/' + url; //auto injection du slash en début d'url
    //ou:  if( !url.startsWith('/') ) ...
    this.all(url,(req, res) =>{
    let url_brute = req.url;
    let uri = url_brute.substr( url_brute.indexOf('?') +1);
    let tab_param = uri.split('&');
    let arg_get = {};
    for(let couple of tab_param){
      let tab = couple.split("=");
      arg_get[tab[0]] = encodeURIComponent(tab[1]);
    }
    //NB: ici this est l'application express (app en fait)
        //extraction du body
      let arg_post;
      arg_post = req.body;
      callback(arg_get, arg_post, res, tools, pool);
    });
};

let fs = require("fs");
const { argv } = require("process");
let scripts_file = fs.readdirSync("./script");

for (let name of scripts_file) {
  if(name.endsWith('.js')){
      let url = name.substr(0, name.indexOf(".")); //on isole le nom du fichier sans l'extension .js
      console.log("... enregistrement du script : url = " + url + " , fichier  = " + "./script/" + name);
      app.recordScript(url, require("./script/" + name));
  }
}

app.all(["/","index.htlml"], (req, res) => {
    tools.sendClientPage(res, "public");
})

app.post("/Connected", (req, res) => {
  console.log("## reception d'une requete script1 ....");

  let userData = {
    type: '',
    mail: ''
  }

  userData.mail = req.body['email'];
  let mdp = req.body['mdp'];
  userData.type = req.body['type'];

  var selectQuery = `SELECT * FROM ${userData.type} WHERE mail = '${userData.mail}'`;

  pool.getConnection((err, connection) => {
  if(err) throw err
  console.log(`Connecté à l'id ${connection.threadId}`)

  connection.query(selectQuery, (err, rows) => {
    var Result = rows[0];
    connection.release()
    if(Result){
        console.log("Mail verifié !");
        if (mdp == Result['mdp']){
          console.log("Mot de passe verifié");
          switch(userData.type){
            case "etudiants":
              console.log("Send Page");
              res.cookie("user", userData, {maxAge: 900000});
              tools.addUser(req, "user"); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              res.redirect('/Compte');
            break
          }
        }else{
          console.log("Mauvais mot de passe");
          res.redirect("/");
        }
      }else{
        console.log("Mauvaise addresse mail");
        res.redirect("/");
      };
    });
  })
})

app.get("/Compte", (req, res) => {
  tools.sendClientPage(res, "connected", true, "token = 'user';");
})

app.post("/Compte", (req, res) => {
  tools.sendClientPage(res, "connected", true, "token = 'user';");
})

app.use(express.static('./www'));

serveur.listen(port, () => console.log(`Ecoute sur le port ${port}`));
