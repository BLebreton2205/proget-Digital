var io_client = io();

io_client.emit("Entreprises_Etablissements_Please", "etablissement");

let msg_receive = false;
let Etablissements = {};
let Demandes;

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

    <div class="container">
      <h1 class="text-center">Les établissements du site</h1>

      <div class="text-center">
        <div class="form-check form-switch form-check-inline" >
          <input class="form-check-input switch" id="test" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="transform: scale(1.5);">
          <label class="form-check-label" for="flexSwitchCheckDefault"> Afficher ques les demandes</label>
        </div>
      </div>

      <br/>
    `);
  affichageDesEtablissements(body);
  $(function(){
    $('#test').change(function() {
      if(document.getElementById('test').checked) {
        for(etablissement in Etablissements) {
          $(`#${etablissement}`).remove();
        }
      } else {
        if(msg_receive){
          $(`#AllCard`).remove();
          affichageDesEntreprises(body);
        }
      }
    })
  })
})
function affichageDesEtablissements(body) {
  if(msg_receive){
      console.log("Ho")
      if(Demande){

        let cardGroup = `
          <div id="AllCard" class="container">
            <div class="row">
        `
        for(demande in Demandes) {
          let card = newCardDemande(demande);

          cardGroup = cardGroup+card;
        }

        cardGroup = cardGroup+"</div><br/><hr/><br/><div class='row'>";

        for(etablissement in Etablissements) {
          let card = newCardEtablissement(etablissement);

          cardGroup = cardGroup+card;
        }

        cardGroup = cardGroup+"<br/><!--</div>--></div></div>";


        body.append(cardGroup);
      } else {

        let cardGroup = `
          <div id="AllCard" class="container">
            <div class="row">
        `

        for(etablissement in Etablissements) {
          let card = newCardEtablissement(etablissement);

          cardGroup = cardGroup+card;
        }

        cardGroup = cardGroup+"<br/><!--</div>--></div></div>";


        body.append(cardGroup);
      }
  } else {
    msg_receive = true;
    console.log("Hey")

    io_client.on("LesEtablissements", result => {
      if(result.length >1){
        Etablissements = result[0];
        Demandes = result[1];

        let cardGroup = `
          <div id="AllCard" class="container">
            <div class="row">
        `

        for(demande in Demandes) {
          let card = newCardDemande(demande);

          cardGroup += card;
        }

        cardGroup += "</div><br/><hr/><br/><div class='row'>";

        for(etablissement in Etablissements) {
          let card = newCardEtablissement(etablissement);

          cardGroup = cardGroup+card;
        }

        cardGroup += "<br/><!--</div>--></div></div>";

        body.append(cardGroup);
      }else{
        Etablissements = result
        console.log(Etablissements)
        let cardGroup = `
          <div id="AllCard" class="container">
            <div class="row">
        `
        for(etablissement in Etablissements) {
          let card = newCardEtablissement(etablissement);

          cardGroup = cardGroup+card;
        }

        cardGroup += "<br/><!--</div>--></div></div>";

        body.append(cardGroup);
      }
    })
  }
}
function newCardEtablissement(etablissement) {
  let card_html = `
  <div id="${etablissement}" class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center"> ${Etablissements[etablissement].nom}</h5>
      </div>
      <div class="card-footer">

      <form method="post" action="/Compte">
        <input name="etablissement" type="hidden" value="${Etablissements[etablissement].Id_ecole}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}

function newCardDemande(demande) {
  let card_html = `
  <div id="${demande}" class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <h5 class="card-header">Demande en attente</h5>
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${Demandes[demande].nom}</h5>
      </div>
      <div class="card-footer">

      <form method="post" action="/NewCompte">
        <input name="type" type="hidden" value="${type}"/>
        <input name="demande" type="hidden" value="${Demandes[demande].Id_demande}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
