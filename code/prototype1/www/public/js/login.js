$(()=> {


  let valeur_info = {
    type: '',
    genre: '',
    nom: '',
    prenom: '',
    mail: '',
    num: '',
    cv: '',
    siteweb: '',
    linkedin: '',
    twitter: '',
    faebook: '',
    github: '',
    gitlab: '',
    sof: '',
    mdp: '',
  }

 /*---- Partie "io" ----*/
  io_client.on("good_connection", url =>{
    console.log(url.path);
    //let token = tools.addUser(url.info.mail);
    document.location = url.path;
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


  function Connection(valeur_info) {
    console.log("Hey oh !");
    valeur_info.mail = document.getElementById("mail").value;
    valeur_info.mdp = document.getElementById("mdp").value;
    valeur_info.type = document.getElementById("type_connect").options[document.getElementById('type_connect').selectedIndex].text;

    //alert(`${valeur_connection.mail} / ${valeur_connection.mdp}`)

    io_client.emit("Connect", valeur_info);
  }

  $( "#bouton" ).click(function() {
    Connection(valeur_info);
  })

  /*$( "#btn_connect" ).click(function() {
    Connection(valeur_connection);
    alert(`Clique`);

  });*/

})
