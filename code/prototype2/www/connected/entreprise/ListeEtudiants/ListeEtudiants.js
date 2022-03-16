var io_client = io();

io_client.emit("EtudiantsPlease", Id_cursus);

let Etudiants = {};

$(() => {

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
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <h1 class="text-center">Les périodes de stages des Cursus</h1>

    <br/>
    `);
    affichageDesCursus(body);
})
function affichageDesCursus(body) {
  io_client.on("LesEtudiants", etudiant => {
    Etudiants = etudiant;

    let cardGroup = `
      <div class="container">
        <div class="row">
    `
    for(etudiant in Etudiants) {
      let card = newCardCursus(Etudiants[etudiant]);

      cardGroup = cardGroup+card;
    }

    cardGroup = cardGroup+"</div></div>";


    body.append(cardGroup);
  })
}
function newCardCursus(etudiant) {
  let card_html = `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${etudiant.nom} ${etudiant.prenom}</h5>
        <p class="card-text">${etudiant.cursus}</p>
        <p class="card-text">${etudiant.etablissement}</p>
      </div>
      <div class="card-footer">

      <form method="post" action="/Compte">
        <input name="etudiant" type="hidden" value="${etudiant.Id_etudiant}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
