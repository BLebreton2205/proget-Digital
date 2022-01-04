module.exports = (arg_get,arg_post, res, tools, pool) => {
  console.log("## reception d'une requete script1 ....");

  let valeur_connect = {
    type: '',
    mail: ''
  }

  valeur_connect.mail = arg_post['email'];
  let mdp = arg_post['mdp'];
  valeur_connect.type = arg_post['type'];

  var selectQuery = `SELECT * FROM ${valeur_connect.type} WHERE mail = '${valeur_connect.mail}'`;

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
          switch(valeur_connect.type){
            case "etudiants":
              console.log("Send Page");
              tools.sendClientPage(res, "connected",true, valeur_connect);
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
