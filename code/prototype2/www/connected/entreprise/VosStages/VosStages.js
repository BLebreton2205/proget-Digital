var io_client = io();

io_client.emit("MesStages", token);

let Stages = {};

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
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
        <a href="/login" class="btn btn-outline-secondary navbar-brand"><i class="bi-power"></i></a>
      </div>
    </nav>

    <h1 class="text-center">Vos propositions de stages</h1>

    <div class="text-center">
      <a href="/Stage/edit">
        <button class="btn btn-success">Nouveau stage</button>
      </a>
    </div><br/>
    `);
    affichageDeVosStages(body);
})
function affichageDeVosStages(body) {
  io_client.on("LesStages", stage => {
    Stages = stage;

    let cardGroup = `
      <div class="container">
        <div class="row">
    `
    for(stage in Stages) {
      let card = newCardStage(Stages[stage]);

      cardGroup = cardGroup+card;
    }

    cardGroup = cardGroup+"</div></div>";

    body.append(cardGroup);
  })
}
function newCardStage(stage) {
  let card_html = `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${stage.titre}</h5>
        <p class="card-text">${stage.entreprise}</p>
        <p class="card-text">${stage.periode}</p>
        <p class="card-text">${stage.motcle}</p>
      </div>
      <div class="card-footer">

      <form method="post" action="/Stage">
        <input name="stage" type="hidden" value="${stage.Id_stage}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
