var io_client = io();

io_client.emit("InfoEtudiantPlease", (Id_etudiant));

$(()=>{
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
    <div class="text-center">
      <h1>Compte Etudiant</h1>
    </div>
    `);

    Etudiant(body);
})

function Etudiant(body) {
  io_client.on("Etudiant", eleve => {
    let cardGroup = `
    <div class="container">
      <h2 class="sous_titre">Infomations personnelles</h2>
        <label for="genre-selector" id="medium">Civilité :</label>
        <p>${eleve.genre}</p><br/>
        <label for="nom" id="medium">Nom :</label>
        <p>${eleve.nom}</p><br/>
        <label for="prenom" id="medium">Prénom : </label>
        <p>${eleve.prenom}</p><br/>
        <label for="email" id="medium">Email :</label>
        <p>${eleve.mail}</p><br/>
        <label for="numero" id="medium">Numéro de téléphone :</label>
        <p>${eleve.numero}</p><br/>
    </div>

    <br/><hr/><br/>

    <!--        CV    -->
    <div class="container">
      <h2 class="sous_titre">CV</h2>
      <div class="row">
        <div class="text-center">
          <form action="/Compte/dl_cv" method="post">
            <input name="cvEtudiant" type="hidden" value=${eleve.cv} />
            <button type="submit" class="btn btn-success"><i class="bi-download" style="font-size: 1rem;"></i> | Consulter le CV</button>
          </form>
        </div>
      </div>
    </div>

    <br/><hr/><br/>

    <!--        Lien Web    -->
    <div class="container">
      <div class="row text-center">
    `
    if(eleve.siteweb) {

      cardGroup = cardGroup+ `
        <div class="col">
          <a href="${eleve.siteweb}">
            <i class="bi-info-circle" style="font-size: 2rem; color: black;"></i>
          </a>
        </div>
          `;
    }
    if(eleve.linkedin) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${eleve.linkedin}">
            <i class="bi-linkedin" style="font-size: 2rem; color: black;"></i>
          </a>
        </div>
      `;
    }
    if(eleve.twitter) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${eleve.twitter}" style="font-size: 2rem; color: black;">
            <i class="bi-twitter"></i>
          </a>
        </div>`
    }
    if(eleve.facebook) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${eleve.facebook}" style="font-size: 2rem; color: black;">
            <i class="bi-facebook"></i>
          </a>
        </div>
      `
    }
    if(eleve.github) {

      cardGroup = cardGroup + `
        <div class="col">
          <a href="${eleve.github}" style="font-size: 2rem; color: black;">
            <i class="bi-github"></i>
          </a>
        </div>
      `
    }
    if(eleve.gitlab) {

      cardGroup = cardGroup + `
        <div class="col">
          <a href="${eleve.gitlab}" style="font-size: 2rem; color: black;">
            <i class="bi-git"></i>
          </a>
        </div>`
    }

    cardGroup = cardGroup + `
      </div>
    </div><br/>`;

    body.append(cardGroup);
  })
}
