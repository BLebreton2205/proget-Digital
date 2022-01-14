module.exports = (arg_get,arg_post, res, tools, pool) => {
  console.log("## reception d'une requete script1 ....");

  let userData = {
    type: '',
    mail: ''
  }

  userData.mail = arg_post['email'];
  let mdp = arg_post['mdp'];
  userData.type = arg_post['type'];

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
              res.cookie("userData", userData, {maxAge: 900000});
              let token = tools.addUser(arg_get['name']); // on notifie l'ajout de l'utilisateur au noyeau du serveur
              tools.sendClientPage(res, "connected",true, "token = 'userData';");
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
