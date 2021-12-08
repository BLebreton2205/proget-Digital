module.exports = (arg_get,arg_post, res, tools, pool) => {
  console.log("## reception d'une requete script1 ....");

  let valeur_connect = {
    type: '',
    genre: '',
    nom: '',
    prenom: '',
    mail: '',
    num: '',
    cv: '',
    siteweb: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    github: '',
    gitlab: '',
    sof: '',
    mdp: '',
  }

  valeur_connect.mail = arg_post['email'];
  valeur_connect.mdp = arg_post['mdp'];
  valeur_connect.type = arg_post['type'];

  //console.log(valeur_connect);

  var selectQuery = `SELECT * FROM ${valeur_connect.type} WHERE mail = '${valeur_connect.mail}'`;

  console.log(selectQuery);

  pool.getConnection((err, connection) => {
  if(err) throw err
  console.log(`Connecté à l'id ${connection.threadId}`)

  connection.query(selectQuery, (err, rows) => {
    var Result = rows[0];
    connection.release()
    if(Result){
      //console.log(Result);
        console.log("Mail verifié !");
        if (valeur_connect.mdp == Result['mdp']){
          console.log("Mot de passe verifié");
          switch(valeur_connect.type){
            case "etudiants":
              console.log("Send Page");
              tools.sendClientPage(res, "connected",true, "mail = '"+valeur_connect.mail+"';");
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

};
