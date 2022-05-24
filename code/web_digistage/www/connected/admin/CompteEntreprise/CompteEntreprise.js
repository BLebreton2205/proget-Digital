var io_client = io();

io_client.emit("InfoEntreprisePlease", (Id_entreprise));

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
      <h1>Compte Entreprise</h1>
    </div>
    `);

    Entreprise(body);
})

function Entreprise(body) {
  io_client.on("Entreprise", entreprise => {
    let cardGroup = `
    <div class="container">
      <h2 class="sous_titre">Infomations personnelles</h2>
        <label for="nom" id="medium">Nom de l'entreprise:</label>
        <p>${entreprise.nom}</p><br/>
        <label for="nom" id="medium">Description de votre entreprise : <FONT color=red>*</FONT></label>
        <div id="description">${entreprise.description}</div>
    </div>

    <br/><hr/><br/>

    <!--        Lien Web    -->
    <div class="container">
      <div class="row text-center">
    `
    if(entreprise.siteweb) {

      cardGroup = cardGroup+ `
        <div class="col">
          <a href="${entreprise.siteweb}">
            <i class="bi bi-globe2" style="font-size: 2rem; color: black;"></i>
          </a>
        </div>
          `;
    }
    if(entreprise.linkedin) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${entreprise.linkedin}">
            <i class="bi-linkedin" style="font-size: 2rem; color: black;"></i>
          </a>
        </div>
      `;
    }
    if(entreprise.twitter) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${entreprise.twitter}" style="font-size: 2rem; color: black;">
            <i class="bi-twitter"></i>
          </a>
        </div>`
    }
    if(entreprise.facebook) {

      cardGroup = cardGroup+`
        <div class="col">
          <a href="${entreprise.facebook}" style="font-size: 2rem; color: black;">
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
