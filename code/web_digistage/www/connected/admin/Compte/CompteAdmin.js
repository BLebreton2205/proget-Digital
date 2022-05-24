var io_client = io();

let valeur_info = {
  type: '',
  mail: ''
}

io_client.emit("InfoPlease", token); // on informe le serveur de son identité sur le canal websocket

$(()=>{

  var hide = true;

  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="/interface" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
        </a>
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <!--        Titre       -->
    <div class="text-center">
      <h1>Compte Administrateur</h1>
    </div>

    <!--    Informations    -->
    <div class="container">
      <h2 class="sous_titre">Infomations</h2>
      <form id ="form_info" method="post">
        <div class="form-group">
          <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
          <input type="email" class="form-control" id="mail" placeholder="Email" required>
        </div><br/>
      </form>
      <div class="col text-center">
        <button id="info_submit" type="submit" class="btn btn-success" form="form_info">Modifier votre profil</button>
      </div>
    </div>

    <br/><hr/><br/>

    <!--        MDP         -->
    <div class="container">
        <h2 class="sous_titre">Mot de passe :</h2>
        <form method="post" action="/Compte">
            <div class="form-group" id="medium">
                <label for="newMdp">Nouveau mot de passe : </label>
                <input type="password" class="form-control" id="newMdp">
            </div><br/>
            <div class="form-group" id="medium">
                <label for="confNewMdp">Confirmer le nouveau mot de passe : </label>
                <input type="password" class="form-control" id="confNewMdp">
            </div><br/>
            <div class="col text-center">
                <button id="change_password" class="btn btn-success">Enregistrer</button>
            </div>
          </form>
    </div>
    `)
    setValeur();

    function setValeur() {
      io_client.on("setInfo", msg =>{
        if(msg){
          for(arg in valeur_info) {
            //console.log(arg)
            //console.log(msg[arg])
            valeur_info[arg] = msg[arg];
            switch (arg) {
              case "type":
                break
              default:
                document.getElementById(arg).value = valeur_info[arg];
                break
            }
          };
        }
      })
    }


    $( "#info_submit" ).click(function() {
      changeInfo(valeur_info);
    });

    function changeInfo(valeur_info) {
      valeur_info.mail = document.getElementById("mail").value;
      io_client.emit("modifie", valeur_info);
    }
    function change_password(valeur_info) {
      let new_mdp = document.getElementById("newMdp").value;
      let conf_New_Mdp = document.getElementById("confNewMdp").value;
      if(new_mdp == conf_New_Mdp) io_client.emit("change_password", new_mdp, valeur_info);
      else alert("Les mots de passe ne sont pas les mêmes");
    }

})
