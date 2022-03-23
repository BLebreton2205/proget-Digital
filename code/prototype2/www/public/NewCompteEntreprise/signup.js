$(() => {

  let body = $('body').append(`
      <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
        <div class="container d-flex justify-content-between">
          <a href="/interface" class="navbar-brand d-flex align-items-center">
            <strong>DIGISTAGE.RE</strong>
          </a>
          <div class="navbar-brand d-flex align-items-center">
            <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
          </div>
        </div>
      </nav>


      <div class = "container">
        <!--        Titre       -->
        <div class="text-center">
          <h1>Création d'un compte entreprise</h1>
        </div>

        <form id="form_info" method="post" action="/signup/NewDemande">
          <input name="type" type="hidden" value="${type}"/>

          <h2 class="sous_titre">Identifiant</h2>
          <div class="form-group">
            <label for="nom" id="medium">Nom  : <FONT color=red>*</FONT></label>
            <input type="text" class="form-control" name="nom" placeholder="Nom de votre entreprise" required>
          </div><br/>
          <div class="form-group">
            <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
            <input type="email" class="form-control" name="mail" placeholder="Email" required>
          </div><br/>

            <br/><hr/><br/>

          <h2 class="sous_titre">Mot de passe :</h2>
            <div class="form-group" id="medium">
                <label for="newMdp">Mot de passe : </label>
                <input type="password" class="form-control" name="newMdp">
            </div><br/>
            <div class="form-group" id="medium">
                <label for="confNewMdp">Confirmer le mot de passe : </label>
                <input type="password" class="form-control" name="confNewMdp">
            </div><br/>
          </form>

          <div class="row" id="lesBoutons">
            <div class="col text-center" >
              <button type="submit" class="btn btn-success" form="form_info" id="valid">Créer</button>
            </div>
            <div class="col text-center">
              <a href="/login" id="annul">
                <button type="button" class="btn btn-outline-secondary" id="annuler">Annuler</button>
              </a>
            </div>
          </div>
      </div>
    `)

})
