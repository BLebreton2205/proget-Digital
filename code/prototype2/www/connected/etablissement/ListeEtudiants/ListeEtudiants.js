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
        <a href="/VosCursus" class = "navbar-brand d-flex align-items-center">
          <h2>Cursus</h2>
        </a>
        <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Propositions</h2>
        </a>
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
        <a href="/login" class="btn btn-outline-secondary navbar-brand"><i class="bi-power"></i></a>
      </div>
    </nav>

    <h1 class="text-center">Liste des étudiants</h1>

    <div class="text-center">
      <form method="post" action="/ListeEtudiants/NewEtudiant">
        <input name="cursus" type="hidden" value="${Id_cursus}"/>
        <button type="submit" class="btn btn-success">Ajouter</button>
      </form>
    </div><br/>
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
