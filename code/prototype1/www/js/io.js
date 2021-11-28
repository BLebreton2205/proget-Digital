let io_client = io();

io_client.on("connect", ()=>{
  console.log("Connexion avec le serveur active !!");
});

io_client.on("disconnect", ()=>{
  console.log("Perte de la Connexion avec le serveur !!");
});

Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
},false;
