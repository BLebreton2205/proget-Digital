let CLIENT_BEGIN = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="../css/tagin.min.css"></link>
        <link rel="stylesheet" href="../css/style.css"></link>
        <link href="https://cdn.jsdelivr.net/npm/froala-editor@3.1.0/css/froala_editor.pkgd.min.css" rel="stylesheet" type="text/css" />

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

let fake_aleString = 0;

/*  Importation des différents packages NodeJS  */
/*region*/
const express = require('express');
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
                    io_server.emit("setInfo",{type: info.type, genre: Result['genre'], nom: Result['nom'], prenom: Result['prenom'], mail: Result['mail'], numero: Result['numero'], cv: Result['cv'], siteweb: Result['siteweb'], linkedin: Result['linkedin'], twitter: Result['twitter'], facebook: Result['facebook'], github: Result['github'], gitlab: Result['gitlab'], sof: Result['sof']});
                    break;
                  case "entreprise":
                    io_server.emit("setInfo",{type: info.type, nom: Result['nom'], mail: Result['mail'], description: Result['description'], siteweb: Result['siteweb'], linkedin: Result['linkedin'], twitter: Result['twitter'], facebook: Result['facebook']});
                    break;
                  default:

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
          critere = ["genre", "nom", "prenom", "mail", "numero", "siteweb", "linkedin", "twitter", "facebook", "github", "gitlab", "sof"];
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

/*  Partie Pages : Prend en compte l'URL pour choisir quel page montrer au client */
/*region*/
app.all(["/login"], (req, res) => {
  res.clearCookie('user');
  tools.sendClientPage(res, "public", "Se connecter | DigiStage");
})

app.all("/Connect", (req, res) => {
  console.log("## reception d'une requete script1 ....");

  let userData = {
    type: '',
    id: '',
    mail: ''
  }

  userData.mail = req.body['email'];
  let mdp = req.body['mdp'];
  userData.type = req.body['type'];

  var selectQuery = `SELECT * FROM ${userData.type} WHERE mail = '${userData.mail}'`;
  console.log(selectQuery)

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
              console.log("Send Page - Etudiant");
              userData.id = Result['Id_etudiant'];
              res.cookie("user", userData, {maxAge: 24 * 60 * 60 * 1000});
              tools.addUser("user", userData); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              res.redirect("/interface");
              break
            case "entreprise":
              console.log("Send Page - Entreprise");
              userData.id = Result['Id_entreprise'];
              res.cookie("user", userData, {maxAge: 24 * 60 * 60 * 1000});
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
  else if(req.cookies.user && req.cookies.user.type == "entreprise") tools.sendClientPage(res, "connected/entreprise/Interface", "Interface | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.post("/Stage", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "etudiants"){
    var stage = req.body[stage];
    tools.sendClientPage(res, "connected/etudiant/Stage", "Stage | DigiStage", true, ["token = 'user';", "Id_stage = "+req.body.stage]);
  }
  else if(req.cookies.user && req.cookies.user.type == "entreprise"){
      var stage = req.body[stage];
      tools.sendClientPage(res, "connected/entreprise/Stage", "Stage | DigiStage", true, ["token = 'user';", "Id_stage = "+req.body.stage]);
    }
  else res.redirect("/login");
})

app.all("/Stage/edit", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "entreprise"){
      if(req.body.id) tools.sendClientPage(res, "connected/entreprise/EditStage", "Stage | DigiStage", true, ["token = 'user';", "Id_stage = "+req.body.id]);
      else{
        console.log("Nouveau");
        tools.sendClientPage(res, "connected/entreprise/EditStage", "Stage | DigiStage", true, ["token = 'user'; Id_stage = false" ]);
      }
    }
  else res.redirect("/login");
})

app.post("/Stage/save", (req, res) => {
  var jsonInfo = {};
  console.log(req.body.id_stage)
  if(req.body.id_stage!="false") {
    console.log(`Modification du stage ${req.body.id_stage}`);
    selectQuery = `UPDATE stage SET titre="${req.body.saveTitre}", periode="${req.body.savePeriode}", motCle="${req.body.saveMotCle}",description="${req.body.saveDescription}"`;
    if (req.body.saveLien) {
      var key = "info1";
      jsonInfo[key] = {
        type: 'lien',
        info: req.body.saveLien,
      }
    }
    selectQuery = selectQuery+`, infos='${JSON.stringify(jsonInfo)}' WHERE Id_stage='${req.body.id_stage}'`
    console.log(selectQuery);
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
    console.log("Création du stage");
    console.log(req.body.token);
    let find = null;
    let info = {};
    for(let i=0; i<waiting_user.length; i++ ){
      let desc = waiting_user[i];
        if(desc.name == req.body.token){
        find = desc;
        info = desc.info;
      }
    }
    console.log(waiting_user);
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
      console.log(selectQuery);
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
    selectQuery = `Delete FROM stage WHERE Id_stage="${req.body.id}"`;
    console.log(selectQuery);
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

app.post('/Postule', tempUpload.single('CoverLetter'), function (req, res) {

  let mailOptions = {
    from: 'baptiste.lebreton@esiroi.re',
    to: '',
    subject: 'Postulation',
    text: req.body["question-text"],
    attachments : {
      path: req.file.path
    }
  }
  var selectQuery = `SELECT email FROM entreprise, stage WHERE stage.Id_stage = '${req.body['Id_stage']}' AND entreprise.Id_entreprise = stage.Id_entreprise`;

  pool.getConnection((err, connection) => {
    if(err) throw err
    console.log(`Connecté à l'id ${connection.threadId}`)

    connection.query(selectQuery, (err, rows) => {
      var Result = rows[0];
      mailOptions.to = Result.email;
      //console.log(mailOptions)
      connection.release()
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.redirect("/StageDispo");
        }
      });
    })
  });

})

app.all("/StageDispo", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "etudiants") tools.sendClientPage(res, "connected/etudiant/StageDispo", "Disponibilité des stages | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.all("/VosStages", (req, res) => {
  if(req.cookies.user && req.cookies.user.type == "entreprise") tools.sendClientPage(res, "connected/entreprise/VosStages", "Vos stages | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.all("/Compte", (req, res) => {
  //console.log(req.cookies);
  if(req.cookies.user && req.cookies.user.type == "etudiants") tools.sendClientPage(res, "connected/etudiant/Compte", "Compte | DigiStage", true, ["token = 'user';"]);
  else if(req.cookies.user && req.cookies.user.type == "entreprise") tools.sendClientPage(res, "connected/entreprise/Compte", "Compte | DigiStage", true, ["token = 'user';"]);
  else res.redirect("/login");
})

app.all("/Compte/dl_cv", (req, res) => {
  console.log("Okey tout marche")
  let find = null; //contiendra le descripteur trouve
  let info = {};
  for(let i=0; i<waiting_user.length; i++ ){
    let desc = waiting_user[i];
      if(desc.name == req.body['token']){
      find = desc;
      info = desc.info;
    }
  }
  console.log(req.body)
  if(find){
    var selectQuery = `SELECT cv FROM ${info.type} WHERE mail = '${info.mail}'`;
    console.log(selectQuery)
    pool.getConnection((err, connection) => {
    if(err) throw err
    console.log(`Connecté à l'id ${connection.threadId}`)

    connection.query(selectQuery, (err, result) => {
      console.log(result)
      res.download(__dirname+"\\uploads\\perm\\"+result[0]['cv'])
      if(err){
          console.log(err+"1")
        };
      });
    })
  }
})

app.all("/Compte/new_cv", permUpload.single('resume'), function (req, res) {
  console.log(req.file.filename)
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
    var selectQuery = `UPDATE ${info.type} SET cv='${req.file.filename}' WHERE mail = '${info.mail}'`;
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
  }
  res.redirect("/Compte");
})
/*endregion*/

app.use(express.static('./www'));

serveur.listen(port, () => console.log(`Ecoute sur le port ${port}`));
