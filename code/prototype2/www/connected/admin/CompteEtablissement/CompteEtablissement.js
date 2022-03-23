var io_client = io();

io_client.emit("InfoEtablissementPlease", (Id_ecole));

$(()=>{
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
    <div class="text-center">
      <h1>Compte Etablissement</h1>
    </div>
    `);

    Entreprise(body);
})

function Entreprise(body) {
  io_client.on("Etablissement", etablissement => {
    let cardGroup = `
    <div class="container">
      <h2 class="sous_titre">Infomations personnelles</h2>
        <label for="nom" id="medium">Nom de l'établissement:</label>
        <p>${etablissement.nom}</p><br/>
        <label for="nom" id="medium">Description de votre établissement : <FONT color=red>*</FONT></label>
        <div id="description">${etablissement.description}</div>
    </div>

    <br/><hr/><br/>

    <!--        Lien Web    -->
    <div class="container">
      <div class="row text-center">
    `
    if(etablissement.siteweb) {

      cardGroup = cardGroup+ `
        <div class="col">
          <a href="${etablissement.siteweb}">
            <i class="bi bi-globe2" style="font-size: 2rem; color: black;"></i>
          </a>
        </div>
          `;
    }
    if(etablissement.linkedin) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${etablissement.linkedin}">
            <i class="bi-linkedin" style="font-size: 2rem; color: black;"></i>
          </a>
        </div>
      `;
    }
    if(etablissement.twitter) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${etablissement.twitter}" style="font-size: 2rem; color: black;">
            <i class="bi-twitter"></i>
          </a>
        </div>`
    }
    if(etablissement.facebook) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${etablissement.facebook}" style="font-size: 2rem; color: black;">
            <i class="bi-facebook"></i>
          </a>
        </div>
      `
    }

    cardGroup = cardGroup + `
      </div>
    </div><br/>`;

    body.append(cardGroup);
  })
}
