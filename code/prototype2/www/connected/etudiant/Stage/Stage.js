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
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
        <a href="/login" class="btn btn-outline-secondary navbar-brand"><i class="bi-power"></i></a>
      </div>
    </nav>
    `);

    leStage(body);
})

function leStage(body) {
  io_client.on("LeStage", stage => {
    let cardGroup = `
    <h1 class="text-center">${stage.titre}</h1>
    <h2 class="text-center sous_titre_Stage">${stage.entreprise}</h2>

    <h2 class=sous_titre>Description :</h2>
    <div class="container">
      <p id="d">${stage.description}</p>
    </div>

    <br/><hr/><br/>

    <h2 class="sous_titre">Plus d'information :</h2>
    <div class="text-center">
      <a href="http://www.google.com">
        <button class="btn btn-success">Mon site</button>
      </a>
    </div>

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
    `

    body.append(cardGroup);
  })
}
