var io_client = io();

$(()=>{

  let body = $('body').append(`
    <nav class="navbar navbar-dark bg-dark box-shadow navbar-fixed-top sticky">
      <div class="container d-flex justify-content-between">
        <a href="/interface" class="navbar-brand d-flex align-items-center">
          <strong>DIGISTAGE.RE</strong>
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

    <h1 class="text-center">Interface Étudiant</h1>

    <img href="/StageDispo" id="dispo" src="../img/carnet.png" alt="logo_carnet" width="150" height="150" class="mx-auto d-block">
    <a class="text-decoration-none" href="/StageDispo"> <h2 id= "dispo" class="text-center" style= "color : black">Proposition de Stage</h2> </a>

    `);

    $( "#dispo" ).click(function() {
      alert( "Cliquez" );
    });

})
