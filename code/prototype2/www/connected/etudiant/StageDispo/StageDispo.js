var io_client = io();

let Stages = {
  "Stage1": {
    "titre": "Déploiement d'une architecture d'automatisation de test dans une usine logicielle",
    "entreprise": "Logicells",
    "periode" : "Juin 2021 - Aout 2021",
    "motCle" : ["CI/CD", "GitLab", "Génie Logiciel"]
  }

}

$(()=>{

  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="intEtud" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
          </a>
        <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Proposition</h2>
        </a>
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
      </div>
    </nav>

    <h1 class="text-center"> Proposition de stage</h1>
    `);

    body.append(ajouterLesStages(Stages))


})

function ajouterLesStages(Stages) {
  let cardGroup = `
    <div class="card-group">
  `
  for(stage in Stages) {
    let card = newCardStage(Stages[stage]);
    cardGroup = cardGroup+card;
  }
  return cardGroup+"</div>"
}

function newCardStage(stage) {
  let card_html = `
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${stage.titre}</h5>
        <p class="card-text">${stage.entreprise}</p>
        <p class="card-text">${stage.periode}</p>
        <p class="card-text">${stage.motCle}</p>
        <a href="#" class="btn btn-primary">Lire plus</a>
      </div>
    </div>
  `
  return card_html
}
