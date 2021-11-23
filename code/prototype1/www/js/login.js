$(()=> {
  let valeur_connection = {
    mail: '',
    mdp: '',
    type: ''
  }

 /*---- Partie "io" ----*/
io_client.on("good_connection", url =>{
  window.location.href = url;
})

  function Connection(valeur_connection) {
    valeur_connection.mail = document.getElementById("mail").value;
    valeur_connection.mdp = document.getElementById("mdp").value;
    valeur_connection.type = document.getElementById("type_connect").options[document.getElementById('type_connect').selectedIndex].text;

    alert(`${valeur_connection.mail} / ${valeur_connection.mdp}`)

    io_client.emit("Connect", valeur_connection);
  }

  $( "#btn_connect" ).click(function() {
    Connection(valeur_connection);
  });

})
