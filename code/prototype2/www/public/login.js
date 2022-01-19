$(() => {

  let body = $('body').append(`
      <header>
        <div class="navbar navbar-dark bg-dark box-shadow">
          <div class="container d-flex justify-content-between">
            <a class="navbar-brand d-flex align-items-center">
              <strong>DIGISTAGE.RE</strong>
            </a>
            <a href="/login" class="btn btn-outline-secondary">Se connecter</a>
            </button>
          </div>
        </div>
      </header>
      <br/>
      <div class="container">
      <div class="row">
        <aside class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
          <div class="card">
            <article class="card-body">
              <h2 class="card-title mb-4 mt-1 text-center">Se connecter :</h2>
              <form method='post' action='/Connect'>
                <div class="form-group">
                  <label>Adresse mail :</label>
                  <input name="email" class="form-control" placeholder="Email" type="email" id="mail">
                </div>
                <br/>
                <div class="form-group">
                  <label class="control-label">Mot de passe :</label>
                  <input name="mdp" class="form-control" placeholder="*************" type="password" id="mdp">
                </div>
                <br/>
                <div class="form-group" id="form_mdp">
                  <label for="type-selector" id="medium">Êtes-vous :</label><br/>
                  <select name="type" id="type_connect">
                    <option value="etudiants">Étudiant</option>
                    <option value="entreprise">Entreprise</option>
                    <option value="etablissement">Établissement</option>
                  </select>
                </div>
                <br/>
                <div class="form-group col text-center">
                  <button type="submit" class="btn btn-block btn-success" id="bouton">Se connecter </button>
                </div>
              </form>
            </article>
          </div>
        </aside>
        <aside class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
          <div class="card">
            <article class="card-body">
              <h2 class="card-title mb-4 mt-1 text-center">Créer un compte :</h2>
              <form>
              <div class="form-group">
                <label for="type-selector" id="medium">Êtes-vous :</label><br/>
                <select name="genre" id="type_creer">
                  <option value="entreprise">Entreprise</option>
                  <option value="etablissement">Établissement</option>
                </select>
              </div>
              <br/>
              <div class="form-group col text-center">
                <button type="submit" class="btn btn-success">Créer votre compte </button>
              </div>
              </form>
            </article>
          </div>
        </aside>
      </div>
  </div>`)

})
