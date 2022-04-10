var io_client = io();

let valeur_info = {
  type: '',
  genre: '',
  nom: '',
  prenom: '',
  mail: '',
  numero: '',
  cv: '',
  siteweb: '',
  linkedin: '',
  twitter: '',
  facebook: '',
  github: '',
  gitlab: ''
}

io_client.emit("InfoPlease", token); // on informe le serveur de son identité sur le canal websocket

$(()=>{

  let body = $('body').append(`
      <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
        <div class="container d-flex justify-content-between">
          <a href="interface" class="navbar-brand d-flex align-items-center">
            <strong>DIGISTAGE.RE</strong>
            </a>
          <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
            <h2>Stages</h2>
          </a>
          <div class="navbar-brand d-flex align-items-center">
            <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
            <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
          </div>
      </nav>
  <!--        Titre       -->
  <div class = "container-fluid img">
    <img src="img/ENTETE_IT.png" style="width:100%;">
    <div class="centered">
      <h1>Compte Étudiant</h1>
    </div>
    <div class="parent-div bottom-left">
      <button class="btn btn-success">Modifier l'image</button>
      <input type="file" name="image" />
    </div>
    <div class="pdp">
      <img src="img/user_connected.png"/>
      <div class="parent-div">
        <button class="btn btn-success">Modifier la photo</button>
        <input type="file" name="photo" />
      </div>
    </div>
  </div>
  <!--        Form        -->
  <div class="container">
    <h2 class="sous_titre">Infomations personnelles</h2>
    <form id ="form_info" method="post" action="/Compte">
      <div class="form-group">
      <label for="genre-selector" id="medium">Civilité : <FONT color=red>*</FONT></label><br/>
      <select class="form-select genre" name="genre" id="genre_select">
        <option value="non_precis">Ne souhaite pas précisez</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
        <option value="Autre">Autre</option>
      </select>
      </div><br/>
      <div class="form-group">
        <label for="nom" id="medium">Nom : <FONT color=red>*</FONT></label>
        <input type="text" class="form-control" id="nom" placeholder="Nom de l'élève" required>
      </div><br/>
      <div class="form-group">
        <label for="prenom" id="medium">Prénom : <FONT color=red>*</FONT></label>
        <input type="text" class="form-control" id="prenom" placeholder="Prénom de l'élève" required>
      </div><br/>
      <div class="form-group">
        <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
        <input type="email" class="form-control" id="mail" placeholder="Email" required>
      </div><br/>
      <div class="form-group" id="medium">
        <label for="numero">Numéro de téléphone : <FONT color=red>*</FONT></label>
        <input type="tel" class="form-control" id="numero" placeholder="Numéro" pattern="[0-9]{10}" required>
      </div><br/>
      <div class="col text-center">
        <button id="info_submit" type="submit" class="btn btn-success">Modifier votre profil</button>
      </div>
    </form>
  </div>

  <br/><hr/><br/>

  <!--        CV          -->
  <div class="container">
    <h2 class="sous_titre">CV</h2>
    <div class="row">
      <p id="medium">Pour postuler, veuillez importer votre CV</p>
    </div>
      <div class="text-center">
        <form id ="form_cv" method="post" action="/Compte/new_cv" enctype="multipart/form-data">
            <input class="form-control" type="file" name="resume" accept=", .pdf"/>
            <p class="text-center verySmallText">Le fichier doit être un PDF</p>
            <input name="token" type="hidden" value=${token} />
        </form>
      <div class="row">
        <div class="col">
          <button id="Add_cv" type="submit" class="btn btn-success" form="form_cv">Ajouter le CV</button>
        </div>
        <div class="col">
          <form action="/Compte">
            <button id="Del_cv" type="submit" class="btn btn-danger">Supprimer le CV</button>
          </form>
        </div>
        <div class="col">
          <form action="/Compte/dl_cv" method="post">
            <input name="cvEtudiant" id="cv" type="hidden" />
            <button type="submit" class="btn btn-primary">Prévisualiser le CV</button>
          </form>
        </div>
      </div>
      <div class="text-center">
        <p class="verySmallText">L'ajout d'un nouveau CV supprimera l'ancien</p>
      </div>
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
          <span class="input-group-text"><i class="bi bi-globe2" style="color: black;"></i></span>
          <input type="url" class="form-control" id="siteweb" placeholder="Ajouter ou modifier votre lien">
          <button class="btn btn-outline-secondary"id="del_web" type="button">Supprimer</button>
        </div>
      </div><br/>
      <div class="form-group">
        <label for="site" id="medium">LinkedIn :</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-linkedin" style="color: black;"></i></span>
          <input type="url" class="form-control" id="linkedin" placeholder="Ajouter ou modifier votre lien">
          <button class="btn btn-outline-secondary" id="del_lkd" type="button">Supprimer</button>
        </div>
      </div><br/>
      <div class="form-group">
        <label for="twitter" id="medium">Twitter :</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-twitter" style="color: black;"></i></span>
          <input type="url" class="form-control" id="twitter" placeholder="Ajouter ou modifier votre lien">
          <button class="btn btn-outline-secondary" id="del_tw" type="button">Supprimer</button>
        </div>
      </div><br/>
      <div class="form-group">
        <label for="fb">Facebook : </label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-facebook" style="color: black;"></i></span>
          <input type="url" class="form-control" id="facebook" placeholder="Ajouter ou modifier">
          <button class="btn btn-outline-secondary" id="del_fb" type="button">Supprimer</button>
        </div>
      </div><br/>
      <div class="form-group">
        <label for="gitlab" id="medium">GitLab :</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-git" style="color: black;"></i></span>
          <input type="url" class="form-control" id="gitlab" placeholder="Ajouter ou modifier">
          <button class="btn btn-outline-secondary" id="del_gitlab" type="button">Supprimer</button>
        </div>
      </div><br/>
      <div class="form-group">
        <label for="github" id="medium">Github :</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-github" style="color: black;"></i></span>
          <input type="url" class="form-control" id="github" placeholder="Ajouter ou modifier">
          <button class="btn btn-outline-secondary" id="del_github" type="button">Supprimer</button>
        </div>
      </div><br/>
      <div class="col text-center">
        <button id="change_lien" type="submit" class="btn btn-success">Ajouter</button>
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
  <br/>
    `)

  setValeur();

  $( "#info_submit" ).click(function() {
    changeInfo(valeur_info);
  });

  $( "#Del_cv" ).click(function() {
    var old_cv = valeur_info.cv;
    valeur_info.cv = "";
    io_client.emit("del_cv", old_cv, valeur_info);
  });

  $( "#del_web" ).click(function() {
    document.getElementById("siteweb").value = "";
    valeur_info.siteweb = "";
    io_emit("del_lien", valeur_info, "siteweb")
  });

  $( "#del_lkd" ).click(function() {
    document.getElementById("linkedin").value = "";
    valeur_info.linkedin = "";
    io_emit("del_lien", valeur_info, "linkedin")
  });

  $( "#del_tw" ).click(function() {
    document.getElementById("twitter").value = "";
    valeur_info.twitter = "";
    io_emit("del_lien", valeur_info, "twitter")
  });

  $( "#del_fb" ).click(function() {
    document.getElementById("facebook").value = "";
    valeur_info.facebook = "";
    io_emit("del_lien", valeur_info, "facebook")
  });

  $( "#del_gitlab" ).click(function() {
    document.getElementById("gitlab").value = "";
    valeur_info.gitlab = "";
    io_emit("del_lien", valeur_info, "gitlab")
  });

  $( "#del_github" ).click(function() {
    document.getElementById("github").value = "";
    valeur_info.github = "";
    io_emit("del_lien", valeur_info, "github")
  });

  $( "#change_lien" ).click(function() {
    changeLien(valeur_info);
  });

  $( "#change_password" ).click(function() {
    change_password(valeur_info);
  });

  function setValeur() {
    io_client.on("setInfo", msg =>{
      if(msg){
        for(arg in valeur_info) {
          valeur_info[arg] = msg[arg];
          switch (arg) {
            case "genre":
              document.getElementById("genre_select").value = valeur_info[arg];
            break
            /*case "cv":
            console.log(msg[arg]);*/
            case "type":
              break
            default:
              console.log(arg)
              console.log(valeur_info[arg])
              document.getElementById(arg).value = valeur_info[arg];

              break
          }
        };
      }
      console.log(valeur_info)
    })
  }

  function changeInfo(valeur_info) {
    valeur_info.genre = document.getElementById("genre_select").options[document.getElementById('genre_select').selectedIndex].text;
    valeur_info.nom = document.getElementById("nom").value;
    valeur_info.prenom = document.getElementById("prenom").value;
    valeur_info.mail = document.getElementById("mail").value;
    valeur_info.numero = document.getElementById("numero").value
    io_client.emit("modifie", valeur_info);
  }

  function changeLien(valeur_info) {
      valeur_info.siteweb = document.getElementById("siteweb").value;
      valeur_info.linkedin = document.getElementById("linkedin").value;
      valeur_info.twitter = document.getElementById("twitter").value;
      valeur_info.facebook = document.getElementById("facebook").value;
      valeur_info.gitab = document.getElementById("gitlab").value;
      valeur_info.github = document.getElementById("github").value
      valeur_info.sof = document.getElementById("sof").value
      io_client.emit("modifie", valeur_info);
  }

  function change_password(valeur_info) {
    let new_mdp = document.getElementById("newMdp").value;
    let conf_New_Mdp = document.getElementById("confNewMdp").value;
    if(new_mdp == conf_New_Mdp) io_client.emit("change_password", new_mdp, valeur_info);
    else alert("Les mots de passe ne sont pas les mêmes");
  }
});
