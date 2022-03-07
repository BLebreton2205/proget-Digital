var io_client = io();

if(Id_stage) io_client.emit("InfoStagePlease", (Id_stage));
console.log(Id_stage)

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
        <input name="id_stage" type="hidden" value=${Id_stage} />
        <input name="token" type="hidden" value=${token} />
        <div class="form-group" id="medium">
          <label for="nom" id="medium">Titre du Stage : <FONT color=red>*</FONT></label>
          <input type="text" class="form-control" name="saveTitre" id="titre" placeholder="Titre du stage" required>
        </div><br/>
        <div class="form-group" id="medium">
          <label for="nom" id="medium">Description : <FONT color=red>*</FONT></label>
          <div id="d">
            <textarea name="saveDescription" id="descriptionEdit" rows="5" form="modif"></textarea>
          </div>
        </div><br/>

        <div class="form-group" id="medium">
          <label for="nom" id="medium">Période du Stage : <FONT color=red>*</FONT></label>
          <input type="text" class="form-control" id="periode" name="savePeriode"/>
        </div><br/>

        <div class="form-group" id="medium">
          <label for="nom" id="medium">Mot Clés du Stage : <FONT color=red>*</FONT></label>
          <input type="text" name="saveMotCle" id="motCle" class="form-control tagin" value="" />
        </div><br/>

        <hr/><br/>

        <div class="form-group" id="medium">
          <label for="nom" id="medium">Plus d'informations : <FONT color=red>*</FONT></label>
          <div class="row text-center">
            <div class="col">
              <div class="input-group">
                <input name="type" type="hidden" value="lien"/>
                <input name="saveLien" type="url" class="form-control" id="lien" placeholder="Ajouter ou modifier votre lien">
                <button class="btn btn-outline-secondary" id="del_lien" type="button">Supprimer</button>
              </div>
            </div>
            <div class="col">
              <p>OU</p>
            </div>
            <div class="col">
              <div class="input-group">
                <input name="type" type="hidden" value="file"/>
                <input name="saveFile" type="file" class="form-control" id="file">
                <button class="btn btn-outline-secondary" id="del_file" type="button">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <br/><hr/><br/>
    </div>
    `);
    if(Id_stage){
      $('body').append(`
        <div class="row" id="lesBoutons">
          <div class="col text-center" >
            <button type="submit" class="btn btn-success" form="modif" id="valid">Modifier</button>
          </div>
          <div class="col text-center">
          <form action="/Stage/suppression" method="post">
            <input name="id" type="hidden" value=${Id_stage} />
            <button type="submit" class="btn btn-danger" id="supprim">Suprimer</button>
          </form>
          </div>
          <div class="col text-center">
            <a href="/VosStages" id="annul">
              <button type="button" class="btn btn-outline-secondary" id="annuler">Annuler</button>
            </a>
          </div>
        </div>
        `);
    } else {
        $('body').append(`
          <div class="row" id="lesBoutons">
            <div class="col text-center" >
              <button type="submit" class="btn btn-success" form="modif" id="valid">Créer</button>
            </div>
            <div class="col text-center">
              <a href="/VosStages" id="annul">
                <button type="button" class="btn btn-outline-secondary" id="annuler">Annuler</button>
              </a>
            </div>
          </div>
          `);
    }
    new FroalaEditor('#descriptionEdit');

    const tagin = new Tagin(document.querySelector('.tagin'), {
      enter:true,
      placeholder:"Placez des mots clés qui définissent votre stage"
    })

    leStage(tagin);
})

function leStage(tagin) {
  io_client.on("LeStage", stage => {
    console.log(stage)
    document.getElementById('titre').value = stage.titre;
    $('#d').empty();
    document.getElementById('d').innerHTML = (`<textarea name="saveDescription" id="descriptionEdit" rows="5" form="modif">${stage.description}</textarea>`);
    document.getElementById('periode').value = stage.periode;
    console.log(stage.motCle);
    document.getElementById('motCle').value = stage.motCle;
    tagin.addTag(stage.motCle)
    console.log(document.getElementById('motCle').value);
    new FroalaEditor('#descriptionEdit');
    var infos = JSON.parse(stage.infos);
    for(info in infos){
      console.log(infos[info].type);
      if(infos[info].type == "lien") document.getElementById('lien').value = infos[info].info;
    }
  })
}
$( "#del_lien" ).click(function() {
  document.getElementById("lien").value = "";
});
$( "#valid" ).click(function() {
    console.log(Id_stage)
});
