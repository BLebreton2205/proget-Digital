var io_client = io();

io_client.emit("MesCursus", token);

let Stages = {};

$(() => {

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
          <h2>Propositions</h2>
        </a>
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <h1 class="text-center">Vos Cursus</h1>

    <div class="text-center">
      <a href="/Cursus/edit">
        <button class="btn btn-success">Nouveau cusus</button>
      </a>
    </div><br/>
    `);
    affichageDeVosCursus(body);
})
function affichageDeVosCursus(body) {
  io_client.on("LesCursus", cur => {
    console.log("AG")
    Cursus = cur;

    let cardGroup = `
      <div class="container">
        <div class="row">
    `
    for(cur in Cursus) {
      let card = newCardCursus(Cursus[cur]);

      cardGroup = cardGroup+card;
    }

    cardGroup = cardGroup+"</div></div>";

    body.append(cardGroup);
    console.log(cardGroup)
  })
}
function newCardCursus(cur) {
  let card_html = `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${cur.titre}</h5>
        <p class="card-text">${cur.entreprise}</p>
      </div>
      <div class="card-footer">

      <form method="post" action="/Cursus">
        <input name="cursus" type="hidden" value="${cur.Id_cursus}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
