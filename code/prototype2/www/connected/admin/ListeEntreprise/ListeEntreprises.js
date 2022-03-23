var io_client = io();

io_client.emit("EntreprisesPlease");

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

    <h1 class="text-center">Les entreprises du site</h1>

    <br/>
    `);
    affichageDesEntreprises(body);
})
function affichageDesEntreprises(body) {
  io_client.on("LesEntreprises", entreprise => {
    Entreprises = entreprise;

    let cardGroup = `
      <div class="container">
        <div class="row">
    `
    for(entreprise in Entreprises) {
      let card = newCardEntreprise(Entreprises[entreprise]);

      cardGroup = cardGroup+card;
    }

    cardGroup = cardGroup+"</div></div><br/>";


    body.append(cardGroup);
  })
}
function newCardEntreprise(entreprise) {
  let card_html = `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${entreprise.nom}</h5>
      </div>
      <div class="card-footer">

      <form method="post" action="/Compte">
        <input name="entreprise" type="hidden" value="${entreprise.Id_entreprise}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
