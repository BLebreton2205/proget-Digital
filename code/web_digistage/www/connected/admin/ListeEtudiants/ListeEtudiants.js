var io_client = io();

io_client.emit("EtudiantsPlease");

let Etudiants = {};

$(() => {

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

    <h1 class="text-center">Les étudiants du site</h1>

    <br/>
    `);
    affichageDesEtudiants(body);
})
function affichageDesEtudiants(body) {
  io_client.on("LesEtudiants", etudiant => {
    Etudiants = etudiant;

    let cardGroup = `
      <div class="container">
        <div class="row">
    `
    for(etudiant in Etudiants) {
      let card = newCardEtudiant(Etudiants[etudiant]);

      cardGroup = cardGroup+card;
    }

    cardGroup = cardGroup+"</div></div>";


    body.append(cardGroup);
  })
}
function newCardEtudiant(etudiant) {
  let card_html = `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${etudiant.nom} ${etudiant.prenom}</h5>
        <p class="card-text"> <span><i class="bi bi-book" style="font-size: 1.5rem; color: black;"></i></span> ${etudiant.cursus}</p>
        <p class="card-text"> <span><i class="bi bi-hospital" style="font-size: 1.5rem; color: black;"></i></span> ${etudiant.etablissement}</p>
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
