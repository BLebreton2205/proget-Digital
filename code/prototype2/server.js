let CLIENT_BEGIN = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="../css/tagin.min.css"></link>
        <link rel="stylesheet" href="../css/style.css"></link>
        <link href="https://cdn.jsdelivr.net/npm/froala-editor@3.1.0/css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">

        <script src="../jquery-3.6.0.slim.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/froala-editor@3.1.0/js/froala_editor.pkgd.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="../script/tagin.min.js"></script>
`
let CLIENT_END = `
    </head>
    <body>
    </body>
</html>
`;

/*  Importation des différents packages NodeJS  */
/*region*/
const express = require('express');
const url = require('url');
const mysql = require('mysql');
const http = require("http");
const cookieParser = require('cookie-parser');
const app = express();
const serveur = http.Server(app);
const port = process.env.PORT || 2205; //Définition du port du serveur
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
let fs = require("fs");
const { argv } = require("process");
app.use(bodyParser.urlencoded({ extend:false }));
app.use(bodyParser.json());
/*endregion*/

/*Création du stockages des fichiers temporaire */
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/temp/")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const tempUpload = multer({ storage: tempStorage })

/*  Création du stockages des fichiers permanant  */
const PermStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/perm/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const permUpload = multer({ storage: PermStorage })

/*  Création du transporteur de mail  */
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'baptiste.lebreton@esiroi.re',
    pass: 'JeSu1s3mmerd!!'
  }
});

app.use(cookieParser());

/*  Configuration de MySQL  */
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'Admin',
    password: 'admin',
    database: 'digistage'
});

let waiting_user = []; //Listes des utilisateurs

/*  Ensemble des outils de traitements du serveur */
let tools = {
  /*  Fonction permettant d'envoyer la page au client */
  sendClientPage(res, dir_script, titre, send_socket_io, client_code, arg_get){

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

    if(arg_get){
      for(arg in arg_get){
        console.log(arg_get[arg])
        res.write("\n <script>"+arg+"='"+arg_get[arg]+"'</script>");
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
    /*  Fonction permettant d'ajouter un client */
    addUser : (name, data) =>{
      waiting_user.push({
        name: name,
        info : data
      });
    }
}

/*  Partie Socket.io : Permet les échanges d'informations client-serveur sur une même page  */
let socket_io = require("socket.io");
let io_server = socket_io(serveur);

io_server.on("connection", socket_client => {
    console.log("   --- Un client se connecte en websocket ! ---");

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

    socket_client.on("CursusPlease", () => {
      console.log('Hey oh !')
      var selectQuery = 'SELECT `Id_cursus`, `titre`, `nom`, `periode` FROM `cursus`, `etablissement` WHERE cursus.ID_ecole=etablissement.ID_ecole';
      pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)
        connection.query(selectQuery, (err, rows) => {
          console.log(err)
            connection.release();
            let Cursus = {};
            let nb = 0;
            for( let cur in rows ){
              nb++
              Cursus["cursus"+nb] = {
                'Id_cursus' : rows[nb-1].Id_cursus,
                'titre': rows[nb-1].titre,
                'etablissement': rows[nb-1].nom,
                'periode': rows[nb-1].periode
              };
            }
            if(!err){
              io_server.emit("LesCursus", Cursus)
            }
        })
      })
    })

    socket_client.on("EtudiantsPlease", (Id_cursus) => {
      console.log('Hey oh !')
      var selectQuery = 'SELECT `Id_etudiant`, etudiants.nom AS nom, `prenom`, `titre`, etablissement.nom AS nomEcole FROM `etudiants`, `cursus`, `etablissement` WHERE etudiants.Id_cursus='+Id_cursus+' AND cursus.Id_cursus = '+Id_cursus;
      console.log(selectQuery)
      pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)
        connection.query(selectQuery, (err, rows) => {
          console.log(err)
            connection.release();
            let Etudiants = {};
            let nb = 0;
            for( let etudiant in rows ){
              nb++
              Etudiants["etudiant"+nb] = {
                'Id_etudiant' : rows[nb-1].Id_etudiant,
                'nom': rows[nb-1].nom,
                'prenom': rows[nb-1].prenom,
                'cursus': rows[nb-1].titre,
                'etablissement': rows[nb-1].nomEcole
              };
            }
            if(!err){
              io_server.emit("LesEtudiants", Etudiants)
            }
        })
      })
    })

    socket_client.on("MesStages", token => {
      let find = null; //contiendra le descripteur trouve
      let info = {};
      for(let i=0; i<waiting_user.length; i++ ){
        let desc = waiting_user[i];
          if(desc.name == token){
          find = desc;
          info = desc.info;
        }
      }
      if(find){
        var selectQuery = `SELECT Id_stage, titre, nom, periode, motcle FROM entreprise, stage WHERE mail='${info.mail}' AND stage.Id_entreprise=entreprise.Id_entreprise`;
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
      }
    })

    socket_client.on("MesCursus", token => {
      let find = null; //contiendra le descripteur trouve
      let info = {};
      for(let i=0; i<waiting_user.length; i++ ){
        let desc = waiting_user[i];
          if(desc.name == token){
          find = desc;
          info = desc.info;
        }
      }
      if(find){
        var selectQuery = `SELECT Id_cursus, titre, nom FROM etablissement, cursus WHERE mail='${info.mail}' AND cursus.Id_ecole=etablissement.Id_ecole`;
        console.log(selectQuery)
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)
          connection.query(selectQuery, (err, rows) => {
              connection.release();
              let Cursus = {};
              let nb = 0;
              for( let cur in rows ){
                nb++
                Cursus["cur"+nb] = {
                  'Id_cursus' : rows[nb-1].Id_cursus,
                  'titre': rows[nb-1].titre,
                  'entreprise': rows[nb-1].nom
                };
              }
              console.log(Cursus)
              if(!err){
                io_server.emit("LesCursus", Cursus)
              }
          })
        })
      }
    })

    socket_client.on("InfoStagePlease", (stage) => {
      //console.log(stage);
      if(stage){ //on a bien trouver une corrspondance
        var selectQuery = `SELECT Id_stage, titre, nom, periode, motcle, stage.description, infos FROM stage, entreprise WHERE Id_stage = '${stage}' AND stage.Id_entreprise=entreprise.Id_entreprise`;
        console.log(selectQuery);
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)

          connection.query(selectQuery, (err, rows) => {
          //console.log("okey")
              var Result = {
                'Id_stage' : rows[0].Id_stage,
                'titre': rows[0].titre,
                'entreprise': rows[0].nom,
                'periode': rows[0].periode,
                'motCle':rows[0].motcle,
                'description': rows[0].description,
                'infos': rows[0].infos
              };

              connection.release()    // return the connection to pool
              if(!err){
              //  console.log(Result)
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

    socket_client.on("InfoCursusPlease", (cursus) => {
      if(cursus){ //on a bien trouver une corrspondance
        var selectQuery = `SELECT Id_cursus, titre, nom, periode, cursus.description, infos FROM cursus, etablissement WHERE Id_cursus = '${cursus}' AND cursus.Id_ecole=etablissement.Id_ecole`;
        console.log(selectQuery);
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)

          connection.query(selectQuery, (err, rows) => {
              var Result = {
                'Id_cursus' : rows[0].Id_cursus,
                'titre': rows[0].titre,
                'etablissement': rows[0].nom,
                'periode': rows[0].periode,
                'description': rows[0].description,
                'infos': rows[0].infos
              };

              connection.release()    // return the connection to pool
              if(!err){
              //  console.log(Result)
                io_server.emit("LeCursus", Result)
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

    socket_client.on("InfoEtudiantPlease", (eleve) => {
      if(eleve){ //on a bien trouver une corrspondance
        var selectQuery = `SELECT Id_etudiant, genre, nom, prenom, Id_cursus, mail, numero, cv, siteweb, linkedin, twitter, facebook, github, gitlab FROM etudiants WHERE Id_etudiant = ${eleve}`;
        console.log(selectQuery);
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)

          connection.query(selectQuery, (err, rows) => {
              var Result = {
                'Id_etudiant' : rows[0].Id_etudiant,
                'genre': rows[0].genre,
                'nom': rows[0].nom,
                'prenom': rows[0].prenom,
                'Id_cursus': rows[0].Id_cursus,
                'mail': rows[0].mail,
                'numero': rows[0].numero,
                'cv': rows[0].cv,
                'siteweb': rows[0].siteweb,
                'linkedin': rows[0].linkedin,
                'twitter': rows[0].twitter,
                'facebook': rows[0].facebook,
                'github': rows[0].github,
                'gitlab': rows[0].gitlab
              };

              connection.release()    // return the connection to pool
              if(!err){
              //  console.log(Result)
                io_server.emit("Etudiant", Result)
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
      //console.log(waiting_user)
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
        pool.getConnection((err, connection) => {
          if(err) throw err
          console.log(`Connecté à l'id ${connection.threadId}`)

          connection.query(selectQuery, (err, rows) => {
              var Result = rows[0];
              //console.log(Result)
              connection.release()    // return the connection to pool
              if(!err){
                switch (info.type) {
                  case "etudiants":
                    io_server.emit("setInfo",{type: info.type, genre: Result['genre'], nom: Result['nom'], prenom: Result['prenom'], mail: Result['mail'], numero: Result['numero'], cv: Result['cv'], siteweb: Result['siteweb'], linkedin: Result['linkedin'], twitter: Result['twitter'], facebook: Result['facebook'], github: Result['github'], gitlab: Result['gitlab']});
                    break;
                  default:
                    io_server.emit("setInfo",{type: info.type, nom: Result['nom'], mail: Result['mail'], description: Result['description'], siteweb: Result['siteweb'], linkedin: Result['linkedin'], twitter: Result['twitter'], facebook: Result['facebook']});
                    break;
                }
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
      let critere;
      var selectQuery;
      let i = 0;
      switch (newVal.type) {
        case "etudiants":
          critere = ["genre", "nom", "prenom", "mail", "numero", "siteweb", "linkedin", "twitter", "facebook", "github", "gitlab"];
          selectQuery = `UPDATE ${newVal.type} SET `;
          for(let value in newVal){
            for (let crit of critere) {
              if (value == crit && newVal[value] != '') selectQuery = selectQuery + crit + "=`" + newVal[value] + "`, ";
            }
            i++;
          }
          selectQuery = selectQuery.slice(0, -1);
          selectQuery = selectQuery.slice(0, -1);
          selectQuery = selectQuery + ` WHERE mail = '${newVal.mail}'`;
          break;
        case "entreprise":
          critere = ["nom", "mail", "description", "siteweb", "linkedin", "twitter", "facebook"];
          selectQuery = `UPDATE ${newVal.type} SET `;
          for(let value in newVal){
            for (let crit of critere) {
              if (value == crit && newVal[value] != '') selectQuery = selectQuery + crit + "='" + newVal[value] + "', ";
            }
            i++;
          }
          selectQuery = selectQuery.slice(0, -1);
          selectQuery = selectQuery.slice(0, -1);
          selectQuery = selectQuery + ` WHERE mail = '${newVal.mail}'`;
          break;
        default:

      }
      console.log(selectQuery)
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

    socket_client.on("del_cv", (old_cv, info) => {
      console.log("Supression du cv")
      var selectQuery = `UPDATE ${info.type} SET cv='${info.cv}' WHERE mail = '${info.mail}'`;
      console.log(__dirname+old_cv)
      fs.unlinkSync(__dirname+old_cv);
      pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)

      connection.query(selectQuery, (err, result) => {
        console.log("Cv supprimer !");
        if(err){
            console.log(err+"1")
          };
        });
      })
    })

    socket_client.on("del_lien", (info, lien_supp) => {
      console.log("Supression du lien")
      var selectQuery = `UPDATE ${info.type} SET ${lien_supp}='' WHERE mail = '${info.mail}'`;
      pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)

      connection.query(selectQuery, (err, result) => {
        console.log("Lien supp !");
        if(err){
            console.log(err+"1")
          };
        });
      })
    })

    socket_client.on("change_password", (new_mdp, info) => {
      var selectQuery = `UPDATE ${info.type} SET mdp='${new_mdp}' WHERE mail = '${info.mail}'`;
      //console.log(selectQuery);
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

function URItoArg(url){
  let uri = url.substr( url.indexOf('?')+1 );
  let tab_param = uri.split('&');
  let arg_get = {};
  for(let couple of tab_param){
    let tab = couple.split("=");
    if(tab[1]) arg_get[tab[0]] = decodeURIComponent(tab[1]);
    else {
      return false;
    }
  }
  return arg_get
}

/*  Partie Pages : Prend en compte l'URL pour choisir quel page montrer au client */
/*region*/
app.all(["/login"], (req, res) => {
  for(cookie in req.cookies) {
    waiting_user.splice(waiting_user.indexOf(cookie), 1);
    console.log(cookie + " effacer !")
    res.clearCookie(cookie);
  }
  let arg_get = URItoArg(req.url);
  //console.log(req.url)
  if(arg_get) tools.sendClientPage(res, "public", "Se connecter | DigiStage", false, null, arg_get);
  else tools.sendClientPage(res, "public", "Se connecter | DigiStage");
})

app.all("/Connect", (req, res) => {
  console.log("\n========== Tentative de connexion ==========");

  let userData = {
    type: '',
    id: '',
    mail: ''
  }

  userData.mail = req.body['email'];
  let mdp = req.body['mdp'];
  userData.type = req.body['type'];

  var selectQuery = `SELECT * FROM ${userData.type} WHERE mail = '${userData.mail}'`;
  //console.log(selectQuery)

  pool.getConnection((err, connection) => {
  if(err) throw err
  console.log(`Connecté à l'id ${connection.threadId}`)
  let name_cookie, i;

  connection.query(selectQuery, (err, rows) => {
    var Result = rows[0];
    connection.release()
    if(Result){
        console.log("   Mail verifié !");
        if (mdp == Result['mdp']){
          console.log("      Mot de passe verifié");
          switch(userData.type){
            case "etudiants":
              console.log("         Send Page - Etudiant");
              userData.id = Result['Id_etudiant'];
              name_cookie = "etudiant-"+Math.floor(Math.random() * 1000);
              i = 0;
              //console.log("userData")
              while (i < waiting_user.length){
                if (waiting_user[i] == name_cookie){
                  name_cookie = "etudiant-"+Math.floor(Math.random() * 1000);
                  i = 0;
                }
              }

              res.cookie(name_cookie, userData, {maxAge: 24 * 60 * 60 * 1000});
              tools.addUser(name_cookie, userData); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              res.redirect("/interface");
              break
            case "entreprise":
              console.log("         Send Page - Entreprise");
              userData.id = Result['Id_entreprise'];
              name_cookie = "entreprise-"+Math.floor(Math.random() * 1000);
              i = 0;
              while (i < waiting_user.length){
                if (waiting_user[i] == name_cookie){
                  name_cookie = "entreprise-"+Math.floor(Math.random() * 1000);
                  i = 0;
                }
              }
              res.cookie(name_cookie, userData, {maxAge: 24 * 60 * 60 * 1000});
              tools.addUser(name_cookie, userData); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              res.redirect("/interface");
              break

            case "etablissement":
              console.log("         Send Page - Etablissement");
              userData.id = Result['Id_ecole'];
              name_cookie = "etablissement-"+Math.floor(Math.random() * 1000);
              i = 0;
              while (i < waiting_user.length){
                if (waiting_user[i] == name_cookie){
                  name_cookie = "etablissement-"+Math.floor(Math.random() * 1000);
                  i = 0;
                }
              }
              res.cookie(name_cookie, userData, {maxAge: 24 * 60 * 60 * 1000});
              tools.addUser(name_cookie, userData); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              res.redirect("/interface");
              break
          }
        }else{
          console.log("      Mauvais mot de passe");
          res.redirect(url.format({
            pathname:'/login',
            query: {
              "error":"mdp",
              "mail":encodeURI(req.body.email),
              "mdp":encodeURI(req.body.mdp),
              "type":encodeURI(req.body.type)
            }
          }))
        }
      }else{
        console.log("   Mauvaise addresse mail");
        res.redirect(url.format({
          pathname:'/login',
          query: {
            "error":"mail",
            "mail":encodeURI(req.body.email),
            "mdp":encodeURI(req.body.mdp),
            "type":encodeURI(req.body.type)
          }
        }))
      };
    });
  })
})

app.all("/interface", (req, res) => {
  //console.log(req.cookies)
  console.log("\n========== Interface ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      //console.log(req.cookies[cookie])
      if(req.cookies[cookie] && req.cookies[cookie].type == "etudiants") tools.sendClientPage(res, "connected/etudiant/Interface", "Interface | DigiStage", true, ["token = '"+cookie+"';"]);
      else if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise") tools.sendClientPage(res, "connected/entreprise/Interface", "Interface | DigiStage", true, ["token = '"+cookie+"';"]);
      else if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement") tools.sendClientPage(res, "connected/etablissement/Interface", "Interface | DigiStage", true, ["token = '"+cookie+"';"]);
      else res.redirect("/login");
    }
  }else res.redirect("/login");

})

app.post("/Stage", (req, res) => {
  console.log("\n========== Stage ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "etudiants"){
        var stage = req.body[stage];
        tools.sendClientPage(res, "connected/etudiant/Stage", "Stage | DigiStage", true, ["token = '"+cookie+"';", "Id_stage = "+req.body.stage]);
      }
      else if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise"){
        var stage = req.body[stage];
        tools.sendClientPage(res, "connected/entreprise/Stage", "Votre stage | DigiStage", true, ["token = '"+cookie+"';", "Id_stage = "+req.body.stage]);
      }
      else if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement"){
        var stage = req.body[stage];
        tools.sendClientPage(res, "connected/etablissement/Stage", "Stage | DigiStage", true, ["token = '"+cookie+"';", "Id_stage = "+req.body.stage]);
      }
      else res.redirect("/login");
    }
}else res.redirect("/login");

})

app.post("/Cursus", (req, res) => {
  console.log("\n========== Cursus ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise"){
        tools.sendClientPage(res, "connected/entreprise/Cursus", "Cursus | DigiStage", true, ["token = '"+cookie+"';", "Id_cursus = "+req.body.cursus]);
      } else if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement"){
        console.log(req.body)
        tools.sendClientPage(res, "connected/etablissement/Cursus", "Cursus | DigiStage", true, ["token = '"+cookie+"';", "Id_cursus = "+req.body.cursus]);
      }
      else res.redirect("/login");
    }
}else res.redirect("/login");

})

app.all("/Stage/edit", (req, res) => {
  console.log("\n========== Edition de votre stage ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise"){
          if(req.body.id) tools.sendClientPage(res, "connected/entreprise/EditStage", "Modifier votre stage | DigiStage", true, ["token = '"+cookie+"';", "Id_stage = "+req.body.id]);
          else{
            //console.log("Nouveau");
            tools.sendClientPage(res, "connected/entreprise/EditStage", "Créer votre stage | DigiStage", true, ["token = '"+cookie+"'; Id_stage = false" ]);
          }
        }
      else res.redirect("/login");
    }
}else res.redirect("/login");

})

app.post("/Stage/save", (req, res) => {
  console.log("\n========== Sauvegarde de l'édition du stage ==========")
  var jsonInfo = {};
  //console.log(req.body.id_stage)
  if(req.body.id_stage!="false") {
    console.log(`   Modification du stage ${req.body.id_stage}`);
    selectQuery = `UPDATE stage SET titre="${req.body.saveTitre}", periode="${req.body.savePeriode}", motCle="${req.body.saveMotCle}",description="${req.body.saveDescription}"`;
    if (req.body.saveLien) {
      var key = "info1";
      jsonInfo[key] = {
        type: 'lien',
        info: req.body.saveLien,
      }
    }
    selectQuery = selectQuery+`, infos='${JSON.stringify(jsonInfo)}' WHERE Id_stage='${req.body.id_stage}'`
    //console.log(selectQuery);
    pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)
      connection.query(selectQuery, (err, rows) => {
          connection.release();
          if(!err){
              res.redirect("/VosStages");
          }
      })
    })
  }
  else {
    console.log("   Création du stage");
    //console.log(req.body.token);
    let find = null;
    let info = {};
    for(let i=0; i<waiting_user.length; i++ ){
      let desc = waiting_user[i];
        if(desc.name == req.body.token){
        find = desc;
        info = desc.info;
      }
    }
    //console.log(waiting_user);
    if(find){
      //INSERT INTO `stage`(`Id_entreprise`, `titre`, `periode`, `motcle`, `description`, `infos`) VALUES (1,'test','test','test','test','{"info1":{"type":"lien","info":"https://Test.test"}}')
      selectQuery = `INSERT INTO stage(Id_entreprise, titre, periode, motCle, description, infos) VALUES (${info.id},'${req.body.saveTitre}','${req.body.savePeriode}', '${req.body.saveMotCle}','${req.body.saveDescription}',`;
      if (req.body.saveLien) {
        var key = "info1";
        jsonInfo[key] = {
          type: 'lien',
          info: req.body.saveLien,
        }
      }
      selectQuery = selectQuery+`'${JSON.stringify(jsonInfo)}')`;
      //console.log(selectQuery);
      pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)
        connection.query(selectQuery, (err, rows) => {
            connection.release();
            if(!err){
                res.redirect("/VosStages");
            } else console.log(err)
        })
      })
    }
  };
})

app.post("/Stage/suppression", (req, res) => {
  console.log("\n========== Suppression du stage ==========")
    selectQuery = `Delete FROM stage WHERE Id_stage="${req.body.id}"`;
    //console.log(selectQuery);
    pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)
      connection.query(selectQuery, (err, rows) => {
          connection.release();
          if(!err){
              res.redirect("/VosStages");
          }
      })
    })
})

app.all("/Cursus/edit", (req, res) => {
  console.log("\n========== Edition du Cursus ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement"){
          if(req.body.id) tools.sendClientPage(res, "connected/etablissement/EditCursus", "Modifier votre cursus | DigiStage", true, ["token = '"+cookie+"';", "Id_cursus = "+req.body.id]);
          else{
            //console.log("Nouveau");
            tools.sendClientPage(res, "connected/etablissement/EditCursus", "Créer votre cursus | DigiStage", true, ["token = '"+cookie+"'; Id_cursus = false" ]);
          }
        }
      else res.redirect("/login");
    }
}else res.redirect("/login");

})

app.post("/Cursus/save", (req, res) => {
  console.log("\n========== Sauvegarde de l'édition du cursus ==========")
  var jsonInfo = {};
  //console.log(req.body.id_cursus)
  if(req.body.id_cursus!="false") {
    console.log(`   Modification du stage ${req.body.id_cursus}`);
    selectQuery = `UPDATE stage SET titre="${req.body.saveTitre}", periode="${req.body.savePeriode}", motCle="${req.body.saveMotCle}",description="${req.body.saveDescription}"`;
    if (req.body.saveLien) {
      var key = "info1";
      jsonInfo[key] = {
        type: 'lien',
        info: req.body.saveLien,
      }
    }
    selectQuery = selectQuery+`, infos='${JSON.stringify(jsonInfo)}' WHERE Id_stage='${req.body.id_cursus}'`
    //console.log(selectQuery);
    pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)
      connection.query(selectQuery, (err, rows) => {
          connection.release();
          if(!err){
              res.redirect("/VosCursus");
          }
      })
    })
  }
  else {
    console.log("   Création du stage");
    //console.log(waiting_user);
    let find = null;
    let info = {};
    for(let i=0; i<waiting_user.length; i++ ){
      let desc = waiting_user[i];
        if(desc.name == req.body.token){
          //console.log(waiting_user[i])
        find = desc;
        info = desc.info;
      }
    }
    //console.log(info);
    if(find){
      //INSERT INTO `stage`(`Id_entreprise`, `titre`, `periode`, `motcle`, `description`, `infos`) VALUES (1,'test','test','test','test','{"info1":{"type":"lien","info":"https://Test.test"}}')
      selectQuery = `INSERT INTO cursus(Id_ecole, titre, periode, motCle, description, infos) VALUES (${info.id},'${req.body.saveTitre}','${req.body.savePeriode}', '${req.body.saveMotCle}','${req.body.saveDescription}',`;
      if (req.body.saveLien) {
        var key = "info1";
        jsonInfo[key] = {
          type: 'lien',
          info: req.body.saveLien,
        }
      }
      selectQuery = selectQuery+`'${JSON.stringify(jsonInfo)}')`;
      //console.log(selectQuery);
      pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)
        connection.query(selectQuery, (err, rows) => {
            connection.release();
            if(!err){
                res.redirect("/VosCursus");
            } else console.log(err)
        })
      })
    }
  };
})

app.post("/Cursus/suppression", (req, res) => {
  console.log("\n========== Suppression du cursus ==========")
  selectQuery = `Delete FROM cursus WHERE Id_cursus="${req.body.id}"`;
  //console.log(selectQuery);
  pool.getConnection((err, connection) => {
    if(err) throw err
    console.log(`Connecté à l'id ${connection.threadId}`)
    connection.query(selectQuery, (err, rows) => {
        connection.release();
        if(!err){
            res.redirect("/VosCursus");
        }
    })
  })
})

app.post('/Postule', tempUpload.single('CoverLetter'), function (req, res) {
  console.log("\n========== Postule ==========")
  let find = null; //contiendra le descripteur trouve
  let info = {};
  for(let i=0; i<waiting_user.length; i++ ){
    let desc = waiting_user[i];
      if(desc.name == req.body['token']){
      find = desc;
      info = desc.info;
    }
  }
  console.log(info)
  if(find) {
    var selectQuery;
    console.log(req.body)

    let mailOptions = {
      from: 'baptiste.lebreton@esiroi.re',
      to: '',
      subject: '[Digistage] Postulation pour votre stage ',
      attachments : []
    }
    if(req.file) mailOptions.attachments.push({path: req.file.path})

    //Recherche du mail de l'expéditeur
    selectQuery = `SELECT etudiants.nom AS nom, prenom, cv, titre, entreprise.mail AS mail FROM etudiants, entreprise, stage WHERE Id_etudiant=${info.id} AND stage.Id_stage = '${req.body['Id_stage']}' AND entreprise.Id_entreprise = stage.Id_entreprise`;
    console.log(selectQuery)
    pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)

      connection.query(selectQuery, (err, rows) => {
        var Result = rows[0];
        mailOptions.attachments.push({path: __dirname+Result.cv});
        mailOptions.to = Result.mail;
        mailOptions.subject += `"${Result.titre}"`;
        mailOptions.text = `Vous avez une nouvelle postulation d'un étudiant : ${Result.nom} ${Result.prenom}.`
        if(req.file) mailOptions.text += `Vous trouverez en pièces jointes son cv ainsi que sa lettre de motivation.`
        else mailOptions.text += `Vous trouverez en pièces jointes son cv.`
        if(req.body["question-text"]) mailOptions.text += `De plus, cette étudiant vous poses ces questions :\n«
        ${req.body["question-text"]}\n»`
        mailOptions.text +=`Rendez vous sur Digistage pour accéder à son compte utilisateur.`
        connection.release()
        //console.log(mailOptions)
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('   Email sent: ' + info.response);
            res.redirect("/StageDispo");
          }
        });
      })
    });
  }

})

app.all("/StageDispo", (req, res) => {
  console.log("\n========== Liste des stages disponibilités ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "etudiants") tools.sendClientPage(res, "connected/etudiant/StageDispo", "Disponibilité des stages | DigiStage", true, ["token = '"+cookie+"';"]);
      else if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement") tools.sendClientPage(res, "connected/etablissement/StageDispo", "Disponibilité des stages | DigiStage", true, ["token = '"+cookie+"';"]);
      else res.redirect("/login");
    }
  }else res.redirect("/login");

})

app.all("/PromoDispo", (req, res) => {
  console.log("\n========== Liste des promos ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise") tools.sendClientPage(res, "connected/entreprise/PromoDispo", "Disponibilité des cursus | DigiStage", true, ["token = '"+cookie+"';"]);
      else res.redirect("/login");
    }
  }else res.redirect("/login");

})

app.all("/ListeEtudiants", (req, res) => {
  console.log("\n========== Liste des étudiants ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise") tools.sendClientPage(res, "connected/entreprise/ListeEtudiants", "Liste des étudiants | DigiStage", true, ["token = '"+cookie+"';", " Id_cursus = "+req.body.cursus]);
      if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement") tools.sendClientPage(res, "connected/etablissement/ListeEtudiants", "Liste des étudiants | DigiStage", true, ["token = '"+cookie+"';", " Id_cursus = "+req.body.cursus]);
      else res.redirect("/login");
    }
  }else res.redirect("/login");

})

app.all("/ListeEtudiants/NewEtudiant", (req, res) => {
  console.log("\n========== Création d'un étudiant ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement"){
        let arg_get = URItoArg(req.url);
        //console.log(req.url)
        if(arg_get) tools.sendClientPage(res, "connected/etablissement/AddEtudiant", "Liste des étudiants | DigiStage", true, ["token = '"+cookie+"';", " Id_cursus = "+req.body.cursus], arg_get);
        else tools.sendClientPage(res, "connected/etablissement/AddEtudiant", "Liste des étudiants | DigiStage", true, ["token = '"+cookie+"';", " Id_cursus = "+req.body.cursus]);
      }else res.redirect("/login");
    }
  }else res.redirect("/login");

})

app.all("/ListeEtudiants/AddEtudiant", (req, res) => {
  console.log("\n========== Ajout du nouvelle étudiant ==========")
  if(req.body.newMdp == req.body.confNewMdp) {
    let mailOptions = {
      from: 'baptiste.lebreton@esiroi.re',
      to: req.body.mail,
      subject: '[DigiStage] Création de votre compte',
      text: `Bonjour ${req.body.nom} ${req.body.prenom},
      Un compte sur notre site a été créé. Voici les Identifiants temporaires de votre compte.
          - mail : ${req.body.mail} ;
          - Mot de passe : ${req.body.newMdp}.
      Rendez vous sur Digistage et accéder à votre compte pour pouvoir modifier ces informations.
      `
    }
    selectQuery = `INSERT INTO etudiants(Id_cursus, nom, prenom, mail, mdp) VALUES (${req.body.cursus},'${req.body.nom}','${req.body.prenom}','${req.body.mail}','${req.body.newMdp}')`;
    pool.getConnection((err, connection) => {
      if(err) throw err
      console.log(`Connecté à l'id ${connection.threadId}`)
      connection.query(selectQuery, (err, rows) => {
          connection.release();
          if(!err){
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                res.redirect("/StageDispo");
              }
            });
          } else console.log(err)
      })
    })
  }else {
    console.log("   Mot de passe non identique")
    //res.redirect(`/ListeEtudiants/NewEtudiant?nom=${req.body.nom}`);
    res.redirect(url.format({
      pathname:'/ListeEtudiants/NewEtudiant',
      query: {
        "nom":req.body.nom,
        "prenom":req.body.prenom,
        "mail":req.body.mail
      }
    }))
  }
})

app.all("/VosStages", (req, res) => {
  console.log("\n========== Liste de vos stages ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise") tools.sendClientPage(res, "connected/entreprise/VosStages", "Vos stages | DigiStage", true, ["token = '"+cookie+"';"]);
      else res.redirect("/login");
    }
  }else res.redirect("/login");
})

app.all("/VosCursus", (req, res) => {
  console.log("\n========== Liste de vos Cursus ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement") tools.sendClientPage(res, "connected/etablissement/VosCursus", "Vos cursus | DigiStage", true, ["token = '"+cookie+"';"]);
      else res.redirect("/login");
    }
  }else res.redirect("/login");
})

app.all("/Compte", (req, res) => {
  console.log("\n========== Compte ==========")
  if (req.cookies){
    for(cookie in req.cookies) {
      if(req.cookies[cookie] && req.cookies[cookie].type == "etudiants") tools.sendClientPage(res, "connected/etudiant/Compte", "Compte | DigiStage", true, ["token = '"+cookie+"';"]);
      else if(req.cookies[cookie] && req.cookies[cookie].type == "entreprise"){
        if(req.body.etudiant){
          tools.sendClientPage(res, "connected/entreprise/CompteEtudiant", "Compte étudiant | DigiStage", true, ["token = '"+cookie+"';", "Id_etudiant = "+req.body.etudiant]);
        }else {
          tools.sendClientPage(res, "connected/entreprise/Compte", "Votre compte | DigiStage", true, ["token = '"+cookie+"';"]);
        }
      }
      else if(req.cookies[cookie] && req.cookies[cookie].type == "etablissement"){
        if(req.body.etudiant){
          tools.sendClientPage(res, "connected/etablissement/CompteEtudiant", "Compte étudiant | DigiStage", true, ["token = '"+cookie+"';", "Id_etudiant = "+req.body.etudiant]);
        }else {
          tools.sendClientPage(res, "connected/etablissement/Compte", "Votre compte | DigiStage", true, ["token = '"+cookie+"';"]);
        }
      }
      else res.redirect("/login");
    }
  }else res.redirect("/login");
})

app.all("/Compte/dl_cv", (req, res) => {
  console.log("\n========== Téléchargement du cv ==========")
  res.download(__dirname+req.body.cvEtudiant);
})

app.all("/Compte/new_cv", permUpload.single('resume'), function (req, res) {
  console.log("\n========== Sauvegarde du nouveau CV ==========")
  let find = null; //contiendra le descripteur trouve
  let info = {};
  for(let i=0; i<waiting_user.length; i++ ){
    let desc = waiting_user[i];
      if(desc.name == req.body['token']){
      find = desc;
      info = desc.info;
    }
  }
  if(find){
    //console.log(req.body)
    var selectQuery = `UPDATE ${info.type} SET cv='${"/uploads/perm/"+req.file.filename}' WHERE mail = '${info.mail}'`;
    //console.log(selectQuery)
    pool.getConnection((err, connection) => {
    if(err) throw err
    console.log(`Connecté à l'id ${connection.threadId}`)

    connection.query(selectQuery, (err, result) => {
      console.log("   Modifier");
      if(err){
          console.log(err+"1")
        };
      });
    })
  }
  res.redirect("/Compte");
})
/*endregion*/

app.use(express.static('./www'));

serveur.listen(port, () => console.log(`Ecoute sur le port ${port}`));
