var io_client = io();

io_client.emit("InfoStagePlease", (Id_stage));

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

    <div class="container-fluid">
    <h1 class="text-center" id="titre"></h1>
    <h2 class="text-center sous_titre_Stage" id="nom_entreprise"></h2>
    <h2 class="sous_titre">Description :</h2>
    <div class="container">
      <p id="d"></p>
    </div>

    <h2 class="sous_titre">Période de stage :</h2>
    <p class="text-center" id="periode"></p>

    <br/><hr/><br/>

    <h2 class="sous_titre">Plus d'information :</h2>
    <div class="text-center">
      <a href="" id="lien">
        <button class="btn btn-primary">Mon site</button>
      </a>
    </div>
    <br/>

    <br/><hr/><br/>

    <div class="text-center">
      <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#Postule">
        Postuler
      </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="Postule" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"> <!-- Modal-Dialog -->
        <div class="modal-content"> <!-- Modal-Content -->
          <div class="modal-header"> <!-- Modal-header -->
            <h2 class="modal-title">Vous postulez :</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div> <!-- Modal-header -->
          <div class="modal-body"> <!-- Modal-body -->

            <form method='POST' action='/Postule' id='postuleForm' name="postuleForm" enctype="multipart/form-data">
              <div class="mb-3">
                <label> Des questions ?</label>
                <textarea class="form-control" name="question-text"></textarea>
              </div>
              <br/><hr/><br/>
              <div class="mb-3">
                <label>Proposez une lettre de motivation ?</label>
                <input class="form-control" type="file" name="CoverLetter" accept=".pdf"/>
                <p class="text-center verySmallText">Le fichier doit être un PDF</p>
                <input name="Id_stage" type="hidden" value=${Id_stage} />
                <input name="token" type="hidden" value=${token} />
              </div>
            </form>

          </div> <!-- Modal-body -->
          <div class="modal-footer"> <!-- Modal-footer -->
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success" form="postuleForm">Postuler</button>
          </div> <!-- Modal-footer -->
        </div><!-- Modal-Content -->
      </div> <!-- Modal-Dialog -->
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
