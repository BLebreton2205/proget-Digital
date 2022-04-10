var io_client = io();

io_client.emit("InfoDemandePlease", (Id_demande));

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
      <h1>Nouvelle demande</h1>
    </div>
    <div class="container">
      <h2 class="sous_titre">Infomations personnelles</h2>
        <label id="medium">Nom de l'entreprise:</label>
        <p id='nom'></p>
          <label id="medium">Mail:</label>
        <p id="mail"></p>
      <br/><hr/><br/>
        <div class="row">
          <div class="col text-center">
            <form method="post" action="/NewCompte/Valid">
              <input name="type" type="hidden" value="${type}"/>
              <input name="id" type="hidden" value=${Id_demande} />
              <button type="submit" class="btn btn-success" id="editStage">Valider</button>
            </form>
          </div>
          <div class="col text-center">
            <form action="/NewCompte/Refus" method="post">
              <input name="type" type="hidden" value="${type}"/>
              <input name="id" type="hidden" value=${Id_demande} />
              <button type="submit" class="btn btn-danger" id="supprim">Refuser</button>
            </form>
          </div>
        </div>
    </div>
    `);

    Demande();
})

function Demande() {
  io_client.on("Demande", demande => {
    document.getElementById("nom").innerHTML = demande.nom;
    document.getElementById("mail").innerHTML = demande.mail;
  })
}
