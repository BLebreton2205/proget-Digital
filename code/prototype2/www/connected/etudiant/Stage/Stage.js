var io_client = io();

io_client.emit("InfoStagePlease", (stage));

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
      </div>
    </nav>
    `);

    leStage(body);
})

function leStage(body) {
  io_client.on("LeStage", stage => {

    let cardGroup = `
    <h1 class="text-center">${stage.titre}</h1>
    `

    body.append(cardGroup);
  })
}
