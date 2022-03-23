var io_client = io();

io_client.emit("CursusPlease");

let Cursus = {};


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

    <h1 class="text-center">Les périodes de stages des Cursus</h1>

    <br/>
    `);
    affichageDesCursus(body);
})
function affichageDesCursus(body) {
  io_client.on("LesCursus", cursus => {
    console.log(cursus)
    Cursus = cursus;

    let cardGroup = `
      <div class="container">
        <div class="row">
    `
    for(cur in Cursus) {
      let card = newCardCursus(Cursus[cur]);

      cardGroup = cardGroup+card;
    }

    cardGroup = cardGroup+"</div></div>";

    console.log(cardGroup);

    body.append(cardGroup);
  })
}
function newCardCursus(cursus) {
  let card_html = `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${cursus.titre}</h5>
        <p class="card-text"><span><i class="bi bi-hospital" style="font-size: 1.5rem; color: black;"></i></span> ${cursus.etablissement}</p>
        <p class="card-text"><span><i class="bi bi-calendar-date" style="font-size: 1.5rem; ccolor: black;"></i></span> ${cursus.periode}</p>
      </div>
      <div class="card-footer">

      <form method="post" action="/Cursus">
        <input name="cursus" type="hidden" value="${cursus.Id_cursus}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
