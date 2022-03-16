var io_client = io();

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
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <h1 class="text-center">Interface Entreprise</h1>

    <div class="container">
      <div class="row">
        <div class="col">
          <a class="text-decoration-none" href="/VosStages">
            <img href="/VosStages" id="dispo" src="../img/carnet.png" alt="logo_carnet" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Ajouter/ Modifier <br/>une proposition de Stage</h2>
          </a>
        </div>
        <div class="col">
          <a class="text-decoration-none" href="/PromoDispo">
            <img href="/PromoDispo" id="dispo" src="../img/calendar.jpg" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Liste des</br>Disponibilités</h2>
          </a>
        </div>
      </div>
    </div>

    `)

})
