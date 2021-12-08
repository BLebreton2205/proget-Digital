let valeur_connect = {
  type: '',
  mail: '',
  mdp: '',
}
module.exports = (arg_get,arg_post, res, tools) => {
  console.log("## reception d'une requete script1 ....");

  valeur_connect.mail = arg_post['email'];
  valeur_connect.mdp = arg_post['mdp'];
  valeur_connect.type = arg_post['type'];

  console.log(valeur_connect);

  

  tools.sendClientPage(res, "connected",true/*, "token = '"+token+"';"*/); //activation socket.io

};
