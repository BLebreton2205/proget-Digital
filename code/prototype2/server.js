let CLIENT_BEGIN = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8"/>
        <title> Votre Compte </title>
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

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 2205;

let tools = { //Ensemble des outils de traitement serveur disponible pour les scripts serveurs
  sendClientPage(res, dir_script, send_socket_io, client_code){
  //dir script : dossier des script a transmettre
    res.write(CLIENT_BEGIN);
    if(send_socket_io){
      res.write("\n <script src='/socket.io/socket.io.js'></script>");
    }
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
  }
}

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
      callback(arg_get, arg_post, res, tools);
        /*let body = '';
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          let arg_post;
          try{ arg_post = JSON.parse(body);}
          catch(e) {arg_post = {}; }

          callback(arg_get, arg_post, res, tools);
        });*/
    });
};

/*app.post('/Connection', function(request, response) {
  var mail = request.body.email;
  var mdp = request.body.mdp;
  var type = request.body.type;
  console.log("mail=" + mail);
  console.log("mdp=" + mdp);
  console.log("type=" + type);
});*/
//  MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'projet_digital'
});

/*app.get('/CompteEtudiant.html', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`Connecté à l'id ${connection.threadId}`)

        connection.query('SELECT * from utilisateurs', (err, rows) => {
            connection.release()    // return the connection to pool

            if(!err){
                //res.send(rows)
            } else {
                console.log(err+"1")
            }
        })
    })
})*/

let fs = require("fs");
const { argv } = require("process");
let scripts_file = fs.readdirSync("./script"); //console.log(scripts_file);

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


app.use(express.static('./www'));
app.listen(port, () => console.log(`Ecoute sur le port ${port}`));
