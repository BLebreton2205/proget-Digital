var io_client = io();

if(Id_stage) io_client.emit("InfoStagePlease", (Id_stage));

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

    <h1 class="text-center">Votre Stage</h1>
    <div class="container">
      <form method="post" action="/Stage/save" id="modif">
        <input name="id" type="hidden" value="${Id_stage}"/>
        <div class="form-group" id="medium">
          <label for="nom" id="medium">Titre du Stage : <FONT color=red>*</FONT></label>
          <input type="text" class="form-control" id="titre" placeholder="Titre du stage" required>
        </div>
        <div class="form-group" id="medium">
          <label for="nom" id="medium">Description : <FONT color=red>*</FONT></label>
          <div id="d">
            <textarea class="form-control" id="descriptionEdit" rows="5"></textarea>
          </div>
        </div>

        <br/><hr/><br/>

        <div class="form-group" id="medium">
          <label for="nom" id="medium">Plus d'informations : <FONT color=red>*</FONT></label>
          <div class="row text-center">
            <div class="col">
              <div class="input-group">
                <input name="type" type="hidden" value="lien"/>
                <input type="url" class="form-control" id="lien" placeholder="Ajouter ou modifier votre lien">
                <button class="btn btn-outline-secondary" id="del_lien" type="button">Supprimer</button>
              </div>
            </div>
            <div class="col">
              <p>OU</p>
            </div>
            <div class="col">
              <div class="input-group">
                <input name="type" type="hidden" value="file"/>
                <input type="file" class="form-control" id="file">
                <button class="btn btn-outline-secondary" id="del_file" type="button">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>



    <br/><hr/><br/>
      <div class="row">
        <div class="col text-center" >
          <button type="button" class="btn btn-success" form="modif" id="valid"></button>
        </div>
        <div class="col text-center">
          <a href="/VosStages" id="supp">
            <button type="button" class="btn btn-danger">Suprimer</button>
          </a>
        </div>
      </div>
    </div>
    `);
    if(Id_stage) document.getElementById('valid').innerHTML = "Modifier"; else document.getElementById('valid').innerHTML = "Créer";

    new FroalaEditor('#descriptionEdit');

    leStage();
})

function leStage() {
  io_client.on("LeStage", stage => {
    document.getElementById('titre').value = stage.titre;
    console.log(stage.description);
    $('#d').empty();
    document.getElementById('d').innerHTML = (`<textarea class="form-control" id="descriptionEdit" rows="5" form="form_info">${stage.description}</textarea>`);
    new FroalaEditor('#descriptionEdit');
    var infos = JSON.parse(stage.infos);
    if(infos["type"] == "lien") document.getElementById('lien').value = infos["info"];
  })
}
$( "#del_lien" ).click(function() {
  document.getElementById("lien").value = "";
});
