var io_client = io();

io_client.emit("attenteNewCompte", token); // on informe le serveur de son identité sur le canal websocket

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

    <h1 class="text-center">Interface Administrateur</h1>

    <div class="container">
      <div class="row">
        <div class="col">
          <a class="text-decoration-none" href="/ListeEtudiants">
            <img href="/ListeEtudiants" id="dispo" src="../img/etudiant.png" alt="logo_carnet" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les étudiants</h2>
          </a>
        </div>

        <div id="test" name="notifEntreprise" class="col" style="position: relative">
          <a class="text-decoration-none" href="/ListeEntreprise">
            <img href="/ListeEntreprise" id="dispo" src="../img/entreprise.png" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les entreprises</h2>
          </a>
        </div>
        <div name="notifEtablissement" class="col" style="position: relative">
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
          <a class="text-decoration-none" href="/StageDispo">
            <img href="/StageDispo" id="dispo" src="../img/calendar.jpg" alt="logo_calendar" width="150" height="150" class="mx-auto d-block">
            <h2 id= "dispo" class="text-center" style= "color : black">Les stages</h2>
          </a>
        </div>
      </div>
    </div>

    `)

    setNotif();

})

function setNotif() {
  console.log(document.getElementsByName("notifEntreprise"))
  io_client.on("setNotif", notif =>{
    console.log(notif.nbEntreprise)
    if(notif.nbEntreprise){
      $('[name="notifEntreprise"]').append('<a class="text-decoration-none" href="/ListeEntreprise?notif_click=yes"><div class="notif d-flex justify-content-center align-items-center"><form <span class="number">'+notif.nbEntreprise+'</span></div></a>')
      console.log(notif.nbEntreprise)
    }
    if(notif.nbEtablissement){
      $('[name="notifEtablissement"]').append('<a class="text-decoration-none" href="/ListeEtablissement?notif_click=yes"><div class="notif d-flex justify-content-center align-items-center"><span class="number">'+notif.nbEtablissement+'</span></div></a>');
    }
  })
}
