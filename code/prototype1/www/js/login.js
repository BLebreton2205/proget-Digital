//io_client.emit("my_token_is", token);

$(()=> {
  let valeur_connection = {
    mail: '',
    mdp: '',
    type: ''
  }

 /*---- Partie "io" ----*/
  io_client.on("good_connection", url =>{
    console.log(url);
    document.location = url;
  });
  io_client.on("wrong_mdp", valeur_info =>{
    //document.getElementById("type-selector").value = valeur_info.type;
    document.getElementById("mail").value = valeur_info.mail;
    document.getElementById("mail").className += " is-valid";
    document.getElementById("mdp").className += " is-invalid";
    /*var info_text = document.createElement('div').appendChild(document.getElementById("form_mdp"));
    info_text.className = 'invalid-feedback';
    info_text.innerHTML = 'Saisie du mot de passe incorrect !';*/
    //info_text.appendAfter(document.getElementById("mdp"));
  });
  io_client.on("wrong_mail", valeur_info =>{
    //alert(`Erreur de saisie du mail`);
    //document.getElementById("type-selector").value = valeur_info.type;
    document.getElementById("mail").value = valeur_info.mail;
    document.getElementById("mail").className += " is-invalid";
    document.getElementById("mdp").value = valeur_info.mdp;
  });


  function Connection(valeur_connection) {
    console.log("Hey oh !");
    valeur_connection.mail = document.getElementById("mail").value;
    valeur_connection.mdp = document.getElementById("mdp").value;
    valeur_connection.type = document.getElementById("type_connect").options[document.getElementById('type_connect').selectedIndex].text;

    alert(`${valeur_connection.mail} / ${valeur_connection.mdp}`)

    io_client.emit("Connect", valeur_connection);
  }

  $( "#bouton" ).click(function() {
    Connection(valeur_connection);
  })

  /*$( "#btn_connect" ).click(function() {
    Connection(valeur_connection);
    alert(`Clique`);

  });*/

})
