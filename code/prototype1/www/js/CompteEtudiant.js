$(()=> {
  let valeur_info = {
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
    sof: ''
  }

  io_client.emit("getInfo");

  function setValeur() {
    console.log("test");
    io_client.on("setInfo", msg =>{
      console.log(msg.numero);
      if(msg){
        valeur_info.genre = msg.genre;
        valeur_info.nom = msg.nom;
        valeur_info.prenom = msg.prenom;
        valeur_info.mail = msg.mail;
        valeur_info.num = msg.numero;

      console.log(`
        - Genre : ${valeur_info.genre};
        - Nom : ${valeur_info.nom};
        - Prénom : ${valeur_info.prenom};
        - Mail : ${valeur_info.mail};
        - Numéro : ${valeur_info.num};
        `);
        document.getElementById("genre_select").value = valeur_info.genre;
        document.getElementById("nom").value = valeur_info.nom;
        document.getElementById("prenom").value = valeur_info.prenom;
        document.getElementById("email").value = valeur_info.mail;
        document.getElementById("numero").value = valeur_info.num;
      }
    })
  }

  setValeur();

  let btn_prop = document.getElementById("prop");

  $( "#prop" ).click(function() {
    alert( "Cliquez" );
  });


  function sendValeur(valeur_info) {
    valeur_info.genre = document.getElementById("genre_select").options[document.getElementById('genre_select').selectedIndex].text;
    valeur_info.nom = document.getElementById("nom").value;
    valeur_info.prenom = document.getElementById("prenom").value;
    valeur_info.mail = document.getElementById("email").value;
    valeur_info.num = document.getElementById("numero").value
    alert(`
      - Genre : ${valeur_info.genre};
      - Nom : ${valeur_info.nom};
      - Prénom : ${valeur_info.prenom};
      - Mail : ${valeur_info.mail};
      - Numéro : ${valeur_info.num};
      `);

      io_client.emit("modifie", valeur_info);
  }

  $( "#info_submit" ).click(function() {
    sendValeur(valeur_info);
  });


});
