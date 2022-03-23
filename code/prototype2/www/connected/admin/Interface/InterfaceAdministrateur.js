var io_client = io();

$(()=>{

  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="/interface" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
          </a>
        <!-- <a href="/VosStages" class = "navbar-brand d-flex align-items-center">
          <h2>Stages</h2>
        </a>
        <a href="/PromoDispo" class = "navbar-brand d-flex align-items-center">
          <h2>Disponibilités</h2>
        </a> -->
        <div class="navbar-brand d-flex align-items-center">
          <a href="/Compte" class="btn btn-outline-secondary" style="color:white"><strong>Mon Compte</strong></a>
          <a href="/login" class="btn btn-outline-secondary"><i class="bi-power" style="color: white;"></i></a>
        </div>
      </div>
    </nav>

    <h1 class="text-center">Interface Administrateur</h1>

    <div class="container">
      <div class="row">
        <div class="col">
          <a class="text-decoration-none" href="/ListeEtudiants">
            <img href="/ListeEtudiants" id="dispo" src="../img/etudiant.png" alt="logo_carnet" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les étudiants</h2>
          </a>
        </div>
        <div class="col">
          <a class="text-decoration-none" href="/ListeEntreprise">
            <img href="/ListeEntreprise" id="dispo" src="../img/entreprise.png" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les entreprises</h2>
          </a>
        </div>
        <div class="col">
          <a class="text-decoration-none" href="/ListeEtablissement">
            <img href="/ListeEtablissement" id="dispo" src="../img/etablissement.png" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les établissements</h2>
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <a class="text-decoration-none" href="/PromoDispo">
            <img href="/PromoDispo" id="dispo" src="../img/cursus.png" alt="logo_carnet" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les cursus</h2>
          </a>
        </div>
        <div class="col">
          <a class="text-decoration-none">
            <img href="/PromoDispo" id="dispo" src="../img/calendar.jpg" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les stages</h2>
          </a>
        </div>
      </div>
    </div>

    `)

})
