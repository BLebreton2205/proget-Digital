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
          <h2>Stages</h2>
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
        <p class="card-text"><span><i class="bi bi-building" style="font-size: 1.5rem; color: black;"></i></span> ${stage.entreprise}</p>
        <p class="card-text"><span><i class="bi bi-calendar-date" style="font-size: 1.5rem; ccolor: black;"></i></span> ${stage.periode}</p>
        <p class="card-text"><span><i class="bi bi-tags" style="font-size: 1.5rem; ccolor: black;"></i></span> ${stage.motcle}</p>
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
