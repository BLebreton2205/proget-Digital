var io_client = io();

io_client.emit("InfoCursusPlease", (Id_cursus));

$(()=>{
  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="/interface" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
          </a>
        <a href="/VosStages" class = "navbar-brand d-flex align-items-center">
          <h2>Propositions</h2>
        </a>
        <a href="/PromoDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Disponibilités</h2>
        </a>
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
      </div>
    </nav>

    `);

    leStage(body);
})

function leStage(body) {
  io_client.on("LeCursus", cursus => {
    console.log(cursus.Id_cursus)
    let cardGroup = `
    <h1 class="text-center">${cursus.titre}</h1>
    <h2 class="text-center sous_titre_Stage">${cursus.etablissement}</h2>

    <h2 class=sous_titre>Description :</h2>
    <div class="container">
      <p id="d">${cursus.description}</p>
    </div>

    <br/><hr/><br/>

    <h2 class="sous_titre">Plus d'information :</h2>
    <div class="text-center">
      <a href="http://www.google.com">
        <button class="btn btn-success">Mon site</button>
      </a>
    </div>

    <br/><hr/><br/>

    <h2 class="sous_titre">Listes des élèves :</h2>
    <div class="text-center">
      <form method="post" action="/ListeEtudiants">
        <input name="cursus" type="hidden" value="${cursus.Id_cursus}"/>
        <button class="btn btn-success">Liste des Étudiants</button>
      </form>
    </div>
    `

    body.append(cardGroup);
  })
}
