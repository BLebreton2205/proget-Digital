var io_client = io();

let valeur_info = {
  type: '',
  nom: '',
  mail: '',
  description: '',
  siteweb: '',
  linkedin: '',
  twitter: '',
  facebook: ''
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
        <a href="/VosCursus" class = "navbar-brand d-flex align-items-center">
          <h2>Cursus</h2>
        </a>
        <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Propositions</h2>
        </a>
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
      </div>
    </nav>


    <!--        Titre       -->
    <div class = "container-fluid img">
      <img src="img/ENTETE_Logicells.png" style="width:100%;">
      <div class="centered">
        <h1>Compte Etablissement</h1>
      </div>
      <div class="parent-div bottom-left">
        <button class="btn btn-success">Modifier l'image</button>
        <input type="file" name="image" />
      </div>
      <div class="pdp">
        <img src="img/company_connected.png"/>
        <div class="parent-div">
          <button class="btn btn-success">Modifier la photo</button>
          <input type="file" name="photo" />
        </div>
      </div>
    </div>

    <!--    Informations    -->
    <div class="container">
      <h2 class="sous_titre">Infomations</h2>
      <form id ="form_info" method="post">
        <div class="form-group">
          <label for="nom" id="medium">Nom de votre école : <FONT color=red>*</FONT></label>
          <input type="text" class="form-control" id="nom" placeholder="Nom de l'entreprise" required>
        </div><br/>
        <div class="form-group">
          <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
          <input type="email" class="form-control" id="mail" placeholder="Email" required>
        </div><br/>
      </form>
      <div class="form-group">
        <label for="nom" id="medium">Description de votre école : <FONT color=red>*</FONT></label>
        <div id="description"></div>
        <button id="modif_desp" class="btn btn-primary">Modifier votre description</button>
        <div id="edit"></div>
      </div><br/>
      <div class="col text-center">
        <button id="info_submit" type="submit" class="btn btn-success" form="form_info">Modifier votre profil</button>
      </div>
    </div>

    <br/><hr/><br/>

    <!--        Lien Web    -->
    <div class="container">
      <h2 class="sous_titre">Lien Web</h2>
      <form id ="form_lien" method="post" action="/Compte">
        <div class="form-group">
          <label for="site" id="medium">Site Internet :</label>
          <div class="input-group">
            <input type="url" class="form-control" id="siteweb" placeholder="Ajouter ou modifier votre lien">
            <button class="btn btn-outline-secondary"id="del_web" type="button">Supprimer</button>
          </div>
        </div><br/>
        <div class="form-group">
          <label for="site" id="medium">LinkedIn :</label>
          <div class="input-group">
            <input type="url" class="form-control" id="linkedin" placeholder="Ajouter ou modifier votre lien">
            <button class="btn btn-outline-secondary" id="del_lkd" type="button">Supprimer</button>
          </div>
        </div><br/>
        <div class="form-group">
          <label for="twitter" id="medium">Twitter :</label>
          <div class="input-group">
            <input type="url" class="form-control" id="twitter" placeholder="Ajouter ou modifier votre lien">
            <button class="btn btn-outline-secondary" id="del_tw" type="button">Supprimer</button>
          </div>
        </div><br/>
        <div class="form-group">
          <label for="fb">Facebook : </label>
          <div class="input-group">
            <input type="url" class="form-control" id="facebook" placeholder="Ajouter ou modifier">
            <button class="btn btn-outline-secondary" id="del_fb" type="button">Supprimer</button>
          </div>
        </div><br/>
        <div class="col text-center">
          <button id="change_lien" type="submit" class="btn btn-success">Modifier</button>
        </div>
      </form>
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
              case "description":
                document.getElementById(arg).innerHTML = valeur_info[arg];
                break
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

    $( "#modif_desp" ).click(function() {
      if(hide){
        document.getElementById('edit').innerHTML = (`<textarea class="form-control" id="descriptionEdit" rows="5" form="form_info">${valeur_info.description}</textarea>`);
        new FroalaEditor('#descriptionEdit');
        hide = !hide;
        //console.log(hide)
      }else {
        $('#edit').empty();
        hide = !hide;
        //console.log(hide)
      }
    });

    $( "#info_submit" ).click(function() {
      changeInfo(valeur_info);
    });

    $( "#change_lien" ).click(function() {
      changeLien(valeur_info);
    });

    $( "#del_web" ).click(function() {
      document.getElementById("siteweb").value = "";
    });

    $( "#del_lkd" ).click(function() {
      document.getElementById("linkedin").value = "";
    });

    $( "#del_twitter" ).click(function() {
      document.getElementById("twitter").value = "";
    });

    $( "#del_fb" ).click(function() {
      document.getElementById("facebook").value = "";
    });

    $( "#change_password" ).click(function() {
      change_password(valeur_info);
    });

    function changeInfo(valeur_info) {
      valeur_info.nom = document.getElementById("nom").value;
      if(!hide) valeur_info.description = document.getElementById("descriptionEdit").value;
      io_client.emit("modifie", valeur_info);
    }

    function changeLien(valeur_info) {
      valeur_info.siteweb = document.getElementById("siteweb").value;
      valeur_info.linkedin = document.getElementById("linkedin").value;
      valeur_info.twitter = document.getElementById("twitter").value;
      valeur_info.facebook = document.getElementById("facebook").value;
      io_client.emit("modifie", valeur_info);
    }

    function change_password(valeur_info) {
      let new_mdp = document.getElementById("newMdp").value;
      let conf_New_Mdp = document.getElementById("confNewMdp").value;
      if(new_mdp == conf_New_Mdp) io_client.emit("change_password", new_mdp, valeur_info);
      else alert("Les mots de passe ne sont pas les mêmes");
    }

})
