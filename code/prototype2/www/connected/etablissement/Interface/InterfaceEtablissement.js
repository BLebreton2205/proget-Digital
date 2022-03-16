var io_client = io();
console.log("ah")

$(()=>{

  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="/interface" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
          </a>
        <a href="/VosCursus" class = "navbar-brand d-flex align-items-center">
          <h2>Cursus</h2>
        </a>
        <a href="/StageDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Propositions</h2>
        </a>
        <a href="/Compte" class="btn btn-outline-secondary navbar-brand">Mon Compte</a>
        <a href="/login" class="btn btn-outline-secondary navbar-brand"><i class="bi-power"></i></a>
      </div>
    </nav>

    <h1 class="text-center">Interface etablissement</h1>

    <div class="container">
      <div class="row">
        <div class="col">
          <a class="text-decoration-none" href="/VosCursus">
            <img href="/VosStages" id="dispo" src="../img/cursus.png" alt="logo_carnet" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Ajouter / Modifier <br/>des cursus</h2>
          </a>
        </div>
        <div class="col">
          <a class="text-decoration-none" href="/StageDispo">
            <img href="/PromoDispo" id="dispo" src="../img/calendar.jpg" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Liste des</br>propositions de stages</h2>
          </a>
        </div>
      </div>
    </div>

    `)

})
