var io_client = io();

io_client.emit("StagePlease", token);

let Stages = {};

$(()=>{
  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="interface" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
          </a>
        <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Proposition</h2>
        </a>
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <h1 class="text-center">Proposition de stage</h1>
    `);
    ajouterLesStages(body)
})

function ajouterLesStages(body) {
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
