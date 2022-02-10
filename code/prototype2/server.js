let CLIENT_BEGIN = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="css/style.css"></link>
        <script src="jquery-3.6.0.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"></script>
`
let CLIENT_END = `
    </head>
    <body>
    </body>
</html>
`;

let fake_aleString = 0;

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
let http = require("http");
var cookieParser = require('cookie-parser');
const app = express();
let serveur = http.Server(app);
const port = process.env.PORT || 2205;
var nodemailer = require('nodemailer');
var formidable = require('formidable');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'baptiste.lebreton@esiroi.re',
    pass: 'JeSu1s3mmerd!!'
  }
});

app.use(cookieParser());

//  MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'Admin',
    password: 'admin',
    database: 'digistage'
});

let waiting_user = [];

let tools = { //Ensemble des outils de traitement serveur disponible pour les scripts serveurs
  sendClientPage(res, dir_script, titre, send_socket_io, client_code){
  //dir script : dossier des script a transmettre
    res.write(CLIENT_BEGIN);
    res.write(`<title>${titre}</title>`)
    if(send_socket_io){
      res.write("\n<script src='/socket.io/socket.io.js'></script>");
    }
    //injection du code client

    if(client_code){
      //res.write("\n <script>"+client_code+"</script>");
      for(arg in client_code){
        res.write("\n <script>"+client_code[arg]+"</script>");
      }
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
  addUser : (name, data) =>{ //un client aa valider son formulaire d'identification er demande l'activation de son IHM
  console.log(waiting_user);
    waiting_user.push({
      name: name,
      info : data
    });
    console.log(waiting_user);
  }
}

let socket_io = require("socket.io");
let io_server = socket_io(serveur);

io_server.on("connection", socket_client => {
    console.log("Un client se connecte en websocket !");

    socket_client.on("StagePlease", token => {
      var selectQuery = 'SELECT `Id_stage`, `titre`, `nom`, `periode`, `motcle` FROM `stage`, `entreprise` WHERE stage.Id_entreprise=entreprise.Id_entreprise';
      pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)
        connection.query(selectQuery, (err, rows) => {
            connection.release();
            let Stages = {};
            let nb = 0;
            for( let stage in rows ){
              nb++
              Stages["Stage"+nb] = {
                'Id_stage' : rows[nb-1].Id_stage,
                'titre': rows[nb-1].titre,
                'entreprise': rows[nb-1].nom,
                'periode': rows[nb-1].periode,
                'motcle':rows[nb-1].motcle
              };
            }
            if(!err){
              io_server.emit("LesStages", Stages)
            }
        })
      })
    })

    socket_client.on("InfoStagePlease", (stage) => {
      console.log(stage);
      if(stage){ //on a bien trouver une corrspondance
        var selectQuery = `SELECT Id_stage, titre, nom, periode, motcle, stage.description, info FROM stage, entreprise WHERE Id_stage = '${stage}' AND stage.Id_entreprise=entreprise.Id_entreprise`;
        console.log(selectQuery);
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)

          connection.query(selectQuery, (err, rows) => {
          console.log("okey")
              var Result = {
                'Id_stage' : rows[0].Id_stage,
                'titre': rows[0].titre,
                'entreprise': rows[0].nom,
                'periode': rows[0].periode,
                'motcle':rows[0].motcle,
                'description': rows[0].description,
                'info': rows[0].info
              };

              connection.release()    // return the connection to pool
              if(!err){
                console.log(Result)
                io_server.emit("LeStage", Result)
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

    socket_client.on("InfoPlease", (token) => {
      let find = null; //contiendra le descripteur trouve
      let info = {};
      for(let i=0; i<waiting_user.length; i++ ){
        let desc = waiting_user[i];
          if(desc.name == token){
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

    socket_client.on("change_password", (new_mdp, info) => {
      var selectQuery = `UPDATE ${info.type} SET mdp='${new_mdp}' WHERE mail = '${info.mail}'`;
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

app.all(["/login"], (req, res) => {
  res.clearCookie('user');
  tools.sendClientPage(res, "public", "Se connecter | DigiStage");
})

app.all("/Connect", (req, res) => {
  console.log("## reception d'une requete script1 ....");

  let userData = {
    type: '',
    mail: ''
  }

  console.log(req.body)

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
              res.cookie("user", userData, {maxAge: 3600000});
              tools.addUser("user", userData); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              res.redirect("/interface");
            break
          }
        }else{
          console.log("Mauvais mot de passe");
          res.redirect("/login");
        }
      }else{
        console.log("Mauvaise addresse mail");
        res.redirect("/login");
      };
    });
  })
})

app.all("/interface", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "etudiants") tools.sendClientPage(res, "connected/etudiant/Interface", "Interface | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.all("/Stage", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "etudiants"){
    var stage = req.body[stage];
    tools.sendClientPage(res, "connected/etudiant/Stage", "Stage | DigiStage", true, ["token = 'user';", "Id_stage = "+req.body.stage]);
  }
  else res.redirect("/login");
})

app.all("/Postule", (req, res, next) => {
  console.log("Envoie d'une CoverLetter");

  const form = new formidable.IncomingForm();
  const uploadFolder = __dirname + "\\files";
  console.log(uploadFolder);

  // Basic Configuration
  form.multiples = true;
  form.uploadDir = uploadFolder;

  form.parse(req, async (err, fields, files) => {
  console.log(fields);
  console.log(files);
  if (err) {
    console.log("Error parsing the files");
    return res.status(400).json({
      status: "Fail",
      message: "There was an error parsing the files",
      error: err,
    });
  }
});

  /*form.parse(req, function (err, fields, files) {
    console.log(files);
    var oldpath = files.formFile.filepath;
    var newpath = '/files' + files.formFile.originalFilename;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      console.log('File uploaded and moved!');
    });
  })*//*
  let mailOptions = {
    from: 'baptiste.lebreton@esiroi.re',
    to: '',
    subject: 'Postulation',
    text: req.body["question-text"],
    attachments : {
      path: "/files/"+req.body.formFile
    }
  }
  var selectQuery = `SELECT email FROM entreprise, stage WHERE stage.Id_stage = '${req.body['Id_stage']}' AND entreprise.Id_entreprise = stage.Id_entreprise`;

  console.log(req.body)
  pool.getConnection((err, connection) => {
  if(err) throw err
  console.log(`Connecté à l'id ${connection.threadId}`)

  connection.query(selectQuery, (err, rows) => {
    var Result = rows[0];
    mailOptions.to = Result.email;
    console.log(mailOptions)
    connection.release()
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
  })
});*/

})

app.all("/StageDispo", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "etudiants") tools.sendClientPage(res, "connected/etudiant/StageDispo", "Disponibilité des stages | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.all("/Compte", (req, res) => {
  //console.log(req.cookies);
  if(req.cookies.user && req.cookies.user.type == "etudiants") tools.sendClientPage(res, "connected/etudiant/Compte", "Compte | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.use(express.static('./www'));

serveur.listen(port, () => console.log(`Ecoute sur le port ${port}`));
