var io_client = io();

io_client.emit("InfoStagePlease", (Id_stage));

$(()=>{
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


    <div class="container-fluid">
    <h1 class="text-center" id="titre"></h1>
    <h2 class="text-center sous_titre_Stage" id="nom_entreprise"></h2>
    <h2 class="sous_titre">Description :</h2>
    <div class="container">
      <p id="d"></p>
    </div>

    <h2 class="sous_titre">Plus d'information :</h2> 
    <p class="text-center" id="periode"></p>

    <br/><hr/><br/>

    <h2 class="sous_titre">Plus d'information :</h2>
    <div class="text-center">
      <a href="" id="lien">
        <button class="btn btn-primary">Mon site</button>
      </a>
    </div>
    <br/>
    `);

    leStage(body);
})

function leStage(body) {
  io_client.on("LeStage", stage => {
    document.getElementById('titre').innerHTML = stage.titre;
    document.getElementById('nom_entreprise').innerHTML = stage.entreprise;
    document.getElementById('d').innerHTML = stage.description;
    document.getElementById('periode').innerHTML = stage.periode;
    var infos = JSON.parse(stage.infos);
    console.log(infos);
    for(info in infos){
      console.log(infos[info].type);
      if(infos[info].type == "lien") document.getElementById('lien').href = infos[info].info;
    }
  })
}
