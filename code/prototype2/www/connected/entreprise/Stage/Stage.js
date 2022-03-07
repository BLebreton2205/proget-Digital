var io_client = io();

io_client.emit("InfoStagePlease", (Id_stage));

$(()=>{
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
      </div>
    </nav>

    <div class="container-fluid">
    <h1 class="text-center" id="titre"></h1>
    <h2 class="text-center sous_titre_Stage" id="nom_entreprise"></h2>
    <h2 class="sous_titre">Description :</h2>
    <div class="container">
      <p id="d"></p>
    </div>

    <p class="text-center" id="periode"></p>

    <br/><hr/><br/>

    <h2 class="sous_titre">Plus d'information :</h2>
    <div class="text-center">
      <a href="" id="lien">
        <button class="btn btn-primary">Mon site</button>
      </a>
    </div>

    <br/><hr/><br/>
      <div class="row">
        <div class="col text-center">
          <form method="post" action="/Stage/edit">
            <input name="id" type="hidden" value="${Id_stage}"/>
            <button type="submit" class="btn btn-success" id="editStage">Modifier</button>
          </form>
        </div>
        <div class="col text-center">
          <form action="/Stage/suppression" method="post">
            <input name="id" type="hidden" value=${Id_stage} />
            <button type="submit" class="btn btn-danger" id="supprim">Suprimer</button>
          </form>
        </div>
      </div>
    </div>
    `);

    leStage();
})

function leStage() {
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
