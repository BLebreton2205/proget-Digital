var io_client = io();

io_client.emit("EntreprisesPlease");

let msg_receive = false;
let Entreprises;
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
      <h1 class="text-center">Les entreprises du site</h1>

      <div class="text-center">
        <div class="form-check form-switch form-check-inline" >
          <input class="form-check-input " id="test" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="transform: scale(1.5);">
          <label class="form-check-label" for="flexSwitchCheckDefault"> Afficher ques les demandes</label>
        </div>
      </div>

      <br/>
    `);
  affichageDesEntreprises(body);
  $(function(){
    $('#test').change(function() {
      if(document.getElementById('test').checked) {
        for(entreprise in Entreprises) {
          $(`#${entreprise}`).remove();
        }
      } else {
        if(msg_receive){
          console.log(msg_receive)
          $(`#AllCard`).remove();
          affichageDesEntreprises(body);
        }
      }
    })
  })
});


function affichageDesEntreprises(body) {
  if(msg_receive){
      console.log("Ho")
      let cardGroup = `
        <div id="AllCard" class="container" style="border: solid black 1px">
          <div class="row">
      `
      for(entreprise in Entreprises) {
        let card = newCardEntreprise(entreprise);

        cardGroup = cardGroup+card;
      }

      for(demande in Demandes) {
        let card = newCardDemande(demande);

        cardGroup = cardGroup+card;
      }

      cardGroup = cardGroup+"<br/></div></div></div>";


      body.append(cardGroup);
  } else {
    msg_receive = true;
    console.log("Hey")
    io_client.on("LesEntreprises", result => {
      Entreprises = result[0];
      if(Entreprises){
        console.log(Entreprises)
        Demandes = result[1];

        let t = `
          <div id="AllCard" class="container" style="border: solid black 1px">
            <div class="row">
        `
        console.log(t)
        for(entreprise in Entreprises) {
          let card = newCardEntreprise(entreprise);

          t += card;
        }

        for(demande in Demandes) {
          let card = newCardDemande(demande);

          t += card;
        }

        t += "<br/></div></div></div>";


        body.append(t);
      }

    })
  }
}
function newCardEntreprise(entreprise) {
  let card_html = `
  <div id="${entreprise}" class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
    <div class="card" style="margin:2%">
      <img class="card-img-top" src="../img/téléchargement.svg" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title text-center">${Entreprises[entreprise].nom}</h5>
      </div>
      <div class="card-footer">

      <form method="post" action="/Compte">
        <input name="entreprise" type="hidden" value="${Entreprises[entreprise].Id_entreprise}"/>
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

      <form method="post" action="/Compte">
        <input name="demande" type="hidden" value="${Demandes[demande].Id_demande}"/>
        <button type="submit" class="btn btn-primary">Lire plus</button>
      </form>
      </div>
    </div>
  </div>
  `
  return card_html
}
