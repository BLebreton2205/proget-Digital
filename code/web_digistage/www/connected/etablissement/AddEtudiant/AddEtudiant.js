var io_client = io();

$(()=>{
  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="/interface" class="navbar-brand d-flex align-items-center">
          <h2><strong>DIGISTAGE.RE</strong></h2>
          </a>
        <a href="/VosCursus" class = "navbar-brand d-flex align-items-center">
          <h2>Cursus</h2>
        </a>
        <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Stages</h2>
        </a>
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <div class = "container">
      <div class="text-center">
        <h1>Compte Etudiant</h1>
      </div>


      <form id ="form_info" method="post" action="/ListeEtudiants/AddEtudiant">
        <input name="cursus" type="hidden" value="${Id_cursus}"/>

        <h2 class="sous_titre">Identifiant</h2>
        <div class="form-group">
          <label for="nom" id="medium">Nom : <FONT color=red>*</FONT></label>
          <input type="text" class="form-control" name="nom" placeholder="Nom de l'élève" required>
        </div><br/>
        <div class="form-group">
          <label for="prenom" id="medium">Prénom : <FONT color=red>*</FONT></label>
          <input type="text" class="form-control" name="prenom" placeholder="Prénom de l'élève" required>
        </div><br/>
        <div class="form-group">
          <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
          <input type="email" class="form-control" name="mail" placeholder="Email" required>
        </div><br/>

          <br/><hr/><br/>

        <h2 class="sous_titre">Mot de passe :</h2>
          <div class="form-group" id="medium">
              <label for="newMdp">Nouveau mot de passe : </label>
              <input type="password" class="form-control" name="newMdp">
          </div><br/>
          <div class="form-group" id="medium">
              <label for="confNewMdp">Confirmer le nouveau mot de passe : </label>
              <input type="password" class="form-control" name="confNewMdp">
          </div><br/>
        </form>

        <div class="row" id="lesBoutons">
          <div class="col text-center" >
            <button type="submit" class="btn btn-success" form="form_info" id="valid">Créer</button>
          </div>
          <div class="col text-center">
            <a href="/ListeEtudiant" id="annul">
              <button type="button" class="btn btn-outline-secondary" id="annuler">Annuler</button>
            </a>
          </div>
        </div>
    </div>
    `);
    if(nom){
      document.getElementsByName('nom')[0].value = nom;
      document.getElementsByName('prenom')[0].value = prenom;
      document.getElementsByName('mail')[0].value = mail;
      $("[name='newMdp']").addClass("is-invalid");
      $("[name='confNewMdp']").addClass("is-invalid");
    }

})
