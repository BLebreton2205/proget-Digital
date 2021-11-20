$(()=>{
//Page de connexion des utilisateurs
  const sep3colonne = "col-xs-4 col-sm-4 col-md-4 col-lg-4";

  let body = $('body');

  let div_parent = $(`<div class="container-fluid"></div>`).appendTo(body);

  let div_header = $(`<div class="row header"></div>`).appendTo(div_parent);

  let art_Logo = $(`<article style='padding:0%' class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      <!--    Ajouter du nom et du logo   -->
      <svg width="300" height="100" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="100" fill="#9D8D9F"/>
          <path d="M34.1309 60H31.3037L20.5664 43.5645V60H17.7393V38.6719H20.5664L31.333 55.1807V38.6719H34.1309V60ZM37.9834 51.9287C37.9834 50.376 38.2861 48.9795 38.8916 47.7393C39.5068 46.499 40.3564 45.542 41.4404 44.8682C42.5342 44.1943 43.7793 43.8574 45.1758 43.8574C47.334 43.8574 49.0771 44.6045 50.4053 46.0986C51.7432 47.5928 52.4121 49.5801 52.4121 52.0605V52.251C52.4121 53.7939 52.1143 55.1807 51.5186 56.4111C50.9326 57.6318 50.0879 58.584 48.9844 59.2676C47.8906 59.9512 46.6309 60.293 45.2051 60.293C43.0566 60.293 41.3135 59.5459 39.9756 58.0518C38.6475 56.5576 37.9834 54.5801 37.9834 52.1191V51.9287ZM40.708 52.251C40.708 54.0088 41.1133 55.4199 41.9238 56.4844C42.7441 57.5488 43.8379 58.0811 45.2051 58.0811C46.582 58.0811 47.6758 57.5439 48.4863 56.4697C49.2969 55.3857 49.7021 53.8721 49.7021 51.9287C49.7021 50.1904 49.2871 48.7842 48.457 47.71C47.6367 46.626 46.543 46.084 45.1758 46.084C43.8379 46.084 42.7588 46.6162 41.9385 47.6807C41.1182 48.7451 40.708 50.2686 40.708 52.251ZM58.3594 44.1504L58.4326 45.9082C59.5947 44.541 61.1621 43.8574 63.1348 43.8574C65.3516 43.8574 66.8604 44.707 67.6611 46.4062C68.1885 45.6445 68.8721 45.0293 69.7119 44.5605C70.5615 44.0918 71.5625 43.8574 72.7148 43.8574C76.1914 43.8574 77.959 45.6982 78.0176 49.3799V60H75.3076V49.541C75.3076 48.4082 75.0488 47.5635 74.5312 47.0068C74.0137 46.4404 73.1445 46.1572 71.9238 46.1572C70.918 46.1572 70.083 46.46 69.4189 47.0654C68.7549 47.6611 68.3691 48.4668 68.2617 49.4824V60H65.5371V49.6143C65.5371 47.3096 64.4092 46.1572 62.1533 46.1572C60.376 46.1572 59.1602 46.9141 58.5059 48.4277V60H55.7959V44.1504H58.3594ZM96.1377 60.293C93.9893 60.293 92.2412 59.5898 90.8936 58.1836C89.5459 56.7676 88.8721 54.8779 88.8721 52.5146V52.0166C88.8721 50.4443 89.1699 49.043 89.7656 47.8125C90.3711 46.5723 91.2109 45.6055 92.2852 44.9121C93.3691 44.209 94.541 43.8574 95.8008 43.8574C97.8613 43.8574 99.4629 44.5361 100.605 45.8936C101.748 47.251 102.319 49.1943 102.319 51.7236V52.8516H91.582C91.6211 54.4141 92.0752 55.6787 92.9443 56.6455C93.8232 57.6025 94.9365 58.0811 96.2842 58.0811C97.2412 58.0811 98.0518 57.8857 98.7158 57.4951C99.3799 57.1045 99.9609 56.5869 100.459 55.9424L102.114 57.2314C100.786 59.2725 98.7939 60.293 96.1377 60.293ZM95.8008 46.084C94.707 46.084 93.7891 46.4844 93.0469 47.2852C92.3047 48.0762 91.8457 49.1895 91.6699 50.625H99.6094V50.4199C99.5312 49.043 99.1602 47.9785 98.4961 47.2266C97.832 46.4648 96.9336 46.084 95.8008 46.084ZM109.146 40.3125V44.1504H112.104V46.2451H109.146V56.0742C109.146 56.709 109.277 57.1875 109.541 57.5098C109.805 57.8223 110.254 57.9785 110.889 57.9785C111.201 57.9785 111.631 57.9199 112.178 57.8027V60C111.465 60.1953 110.771 60.293 110.098 60.293C108.887 60.293 107.974 59.9268 107.358 59.1943C106.743 58.4619 106.436 57.4219 106.436 56.0742V46.2451H103.55V44.1504H106.436V40.3125H109.146ZM125.977 57.7002H136.084V60H123.149V38.6719H125.977V57.7002ZM138.149 51.9287C138.149 50.376 138.452 48.9795 139.058 47.7393C139.673 46.499 140.522 45.542 141.606 44.8682C142.7 44.1943 143.945 43.8574 145.342 43.8574C147.5 43.8574 149.243 44.6045 150.571 46.0986C151.909 47.5928 152.578 49.5801 152.578 52.0605V52.251C152.578 53.7939 152.28 55.1807 151.685 56.4111C151.099 57.6318 150.254 58.584 149.15 59.2676C148.057 59.9512 146.797 60.293 145.371 60.293C143.223 60.293 141.479 59.5459 140.142 58.0518C138.813 56.5576 138.149 54.5801 138.149 52.1191V51.9287ZM140.874 52.251C140.874 54.0088 141.279 55.4199 142.09 56.4844C142.91 57.5488 144.004 58.0811 145.371 58.0811C146.748 58.0811 147.842 57.5439 148.652 56.4697C149.463 55.3857 149.868 53.8721 149.868 51.9287C149.868 50.1904 149.453 48.7842 148.623 47.71C147.803 46.626 146.709 46.084 145.342 46.084C144.004 46.084 142.925 46.6162 142.104 47.6807C141.284 48.7451 140.874 50.2686 140.874 52.251ZM155.332 51.9434C155.332 49.4727 155.903 47.5098 157.046 46.0547C158.188 44.5898 159.702 43.8574 161.587 43.8574C163.521 43.8574 165.029 44.541 166.113 45.9082L166.245 44.1504H168.721V59.6191C168.721 61.6699 168.11 63.2861 166.89 64.4678C165.679 65.6494 164.048 66.2402 161.997 66.2402C160.854 66.2402 159.736 65.9961 158.643 65.5078C157.549 65.0195 156.714 64.3506 156.138 63.501L157.544 61.875C158.706 63.3105 160.127 64.0283 161.807 64.0283C163.125 64.0283 164.15 63.6572 164.883 62.915C165.625 62.1729 165.996 61.1279 165.996 59.7803V58.418C164.912 59.668 163.433 60.293 161.558 60.293C159.702 60.293 158.198 59.5459 157.046 58.0518C155.903 56.5576 155.332 54.5215 155.332 51.9434ZM158.057 52.251C158.057 54.0381 158.423 55.4443 159.155 56.4697C159.888 57.4854 160.913 57.9932 162.231 57.9932C163.94 57.9932 165.195 57.2168 165.996 55.6641V48.4277C165.166 46.9141 163.921 46.1572 162.261 46.1572C160.942 46.1572 159.912 46.6699 159.17 47.6953C158.428 48.7207 158.057 50.2393 158.057 52.251ZM172.104 51.9287C172.104 50.376 172.407 48.9795 173.013 47.7393C173.628 46.499 174.478 45.542 175.562 44.8682C176.655 44.1943 177.9 43.8574 179.297 43.8574C181.455 43.8574 183.198 44.6045 184.526 46.0986C185.864 47.5928 186.533 49.5801 186.533 52.0605V52.251C186.533 53.7939 186.235 55.1807 185.64 56.4111C185.054 57.6318 184.209 58.584 183.105 59.2676C182.012 59.9512 180.752 60.293 179.326 60.293C177.178 60.293 175.435 59.5459 174.097 58.0518C172.769 56.5576 172.104 54.5801 172.104 52.1191V51.9287ZM174.829 52.251C174.829 54.0088 175.234 55.4199 176.045 56.4844C176.865 57.5488 177.959 58.0811 179.326 58.0811C180.703 58.0811 181.797 57.5439 182.607 56.4697C183.418 55.3857 183.823 53.8721 183.823 51.9287C183.823 50.1904 183.408 48.7842 182.578 47.71C181.758 46.626 180.664 46.084 179.297 46.084C177.959 46.084 176.88 46.6162 176.06 47.6807C175.239 48.7451 174.829 50.2686 174.829 52.251ZM196.714 51.9434C196.714 49.5117 197.29 47.5586 198.442 46.084C199.595 44.5996 201.104 43.8574 202.969 43.8574C204.824 43.8574 206.294 44.4922 207.378 45.7617V37.5H210.088V60H207.598L207.466 58.3008C206.382 59.6289 204.873 60.293 202.939 60.293C201.104 60.293 199.604 59.541 198.442 58.0371C197.29 56.5332 196.714 54.5703 196.714 52.1484V51.9434ZM199.424 52.251C199.424 54.0479 199.795 55.4541 200.537 56.4697C201.279 57.4854 202.305 57.9932 203.613 57.9932C205.332 57.9932 206.587 57.2217 207.378 55.6787V48.3984C206.567 46.9043 205.322 46.1572 203.643 46.1572C202.314 46.1572 201.279 46.6699 200.537 47.6953C199.795 48.7207 199.424 50.2393 199.424 52.251ZM224.092 58.4326C223.037 59.6729 221.489 60.293 219.448 60.293C217.759 60.293 216.47 59.8047 215.581 58.8281C214.702 57.8418 214.258 56.3867 214.248 54.4629V44.1504H216.958V54.3896C216.958 56.792 217.935 57.9932 219.888 57.9932C221.958 57.9932 223.335 57.2217 224.019 55.6787V44.1504H226.729V60H224.15L224.092 58.4326ZM247.529 55.7959C247.529 55.0635 247.251 54.4971 246.694 54.0967C246.147 53.6865 245.186 53.335 243.809 53.042C242.441 52.749 241.353 52.3975 240.542 51.9873C239.741 51.5771 239.146 51.0889 238.755 50.5225C238.374 49.9561 238.184 49.2822 238.184 48.501C238.184 47.2021 238.73 46.1035 239.824 45.2051C240.928 44.3066 242.334 43.8574 244.043 43.8574C245.84 43.8574 247.295 44.3213 248.408 45.249C249.531 46.1768 250.093 47.3633 250.093 48.8086H247.368C247.368 48.0664 247.051 47.4268 246.416 46.8896C245.791 46.3525 245 46.084 244.043 46.084C243.057 46.084 242.285 46.2988 241.729 46.7285C241.172 47.1582 240.894 47.7197 240.894 48.4131C240.894 49.0674 241.152 49.5605 241.67 49.8926C242.188 50.2246 243.12 50.542 244.468 50.8447C245.825 51.1475 246.924 51.5088 247.764 51.9287C248.604 52.3486 249.224 52.8564 249.624 53.4521C250.034 54.0381 250.239 54.7559 250.239 55.6055C250.239 57.0215 249.673 58.1592 248.54 59.0186C247.407 59.8682 245.938 60.293 244.131 60.293C242.861 60.293 241.738 60.0684 240.762 59.6191C239.785 59.1699 239.019 58.5449 238.462 57.7441C237.915 56.9336 237.642 56.0596 237.642 55.1221H240.352C240.4 56.0303 240.762 56.7529 241.436 57.29C242.119 57.8174 243.018 58.0811 244.131 58.0811C245.156 58.0811 245.977 57.876 246.592 57.4658C247.217 57.0459 247.529 56.4893 247.529 55.7959ZM256.714 60H254.004V44.1504H256.714V60ZM253.784 39.9463C253.784 39.5068 253.916 39.1357 254.18 38.833C254.453 38.5303 254.854 38.3789 255.381 38.3789C255.908 38.3789 256.309 38.5303 256.582 38.833C256.855 39.1357 256.992 39.5068 256.992 39.9463C256.992 40.3857 256.855 40.752 256.582 41.0449C256.309 41.3379 255.908 41.4844 255.381 41.4844C254.854 41.4844 254.453 41.3379 254.18 41.0449C253.916 40.752 253.784 40.3857 253.784 39.9463ZM264.741 40.3125V44.1504H267.7V46.2451H264.741V56.0742C264.741 56.709 264.873 57.1875 265.137 57.5098C265.4 57.8223 265.85 57.9785 266.484 57.9785C266.797 57.9785 267.227 57.9199 267.773 57.8027V60C267.061 60.1953 266.367 60.293 265.693 60.293C264.482 60.293 263.569 59.9268 262.954 59.1943C262.339 58.4619 262.031 57.4219 262.031 56.0742V46.2451H259.146V44.1504H262.031V40.3125H264.741ZM277.456 60.293C275.308 60.293 273.56 59.5898 272.212 58.1836C270.864 56.7676 270.19 54.8779 270.19 52.5146V52.0166C270.19 50.4443 270.488 49.043 271.084 47.8125C271.689 46.5723 272.529 45.6055 273.604 44.9121C274.688 44.209 275.859 43.8574 277.119 43.8574C279.18 43.8574 280.781 44.5361 281.924 45.8936C283.066 47.251 283.638 49.1943 283.638 51.7236V52.8516H272.9C272.939 54.4141 273.394 55.6787 274.263 56.6455C275.142 57.6025 276.255 58.0811 277.603 58.0811C278.56 58.0811 279.37 57.8857 280.034 57.4951C280.698 57.1045 281.279 56.5869 281.777 55.9424L283.433 57.2314C282.104 59.2725 280.112 60.293 277.456 60.293ZM277.119 46.084C276.025 46.084 275.107 46.4844 274.365 47.2852C273.623 48.0762 273.164 49.1895 272.988 50.625H280.928V50.4199C280.85 49.043 280.479 47.9785 279.814 47.2266C279.15 46.4648 278.252 46.084 277.119 46.084Z" fill="#DDDDDD"/>
      </svg>
  </article>`).appendTo(div_header);

  let art_button = $("<article/>").addClass(sep3colonne).appendTo(div_header);

  let button_prop = $(`<button type="button" class = 'btn btn-primary-outline justify-content-center h-100'>
    <h2>Proposition</h2>
  </button>`).appendTo(art_button);
  button_prop.click(()=>{          // On écoute l'événement click
    console.log("C'est cliqué !");               // On change le contenu de notre élément pour afficher "C'est cliqué !"
  });

  let art_compte = $("<article/>").addClass(sep3colonne).append(`<svg class="position-absolute" style="right: 0.5%; top: 0.5%" width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="37.5" cy="37.5" r="37.5" fill="#6EAC5F"/><g clip-path="url(#clip0_118:2506)"><path d="M37.0594 37.7611C29.1169 37.7611 22.7188 31.3629 22.7188 23.4204C22.7188 15.4779 29.1169 9.07971 37.0594 9.07971C45.0019 9.07971 51.4001 15.4779 51.4001 23.4204C51.4001 31.3629 45.0019 37.7611 37.0594 37.7611ZM37.0594 13.4922C31.5438 13.4922 27.1313 17.9047 27.1313 23.4204C27.1313 28.936 31.5438 33.3485 37.0594 33.3485C42.5751 33.3485 46.9876 28.936 46.9876 23.4204C46.9876 17.9047 42.5751 13.4922 37.0594 13.4922Z" fill="black"/><path d="M17.6438 55.191V64.7141C17.6438 65.8074 13.2317 65.8074 13.2317 64.7141V55.191C13.2317 46.4761 23.9318 39.7476 37.5005 39.7476C51.0692 39.7476 61.7693 46.4761 61.7693 55.191V64.7141C61.7693 65.8074 57.3573 65.8074 57.3573 64.7141V55.191C57.3573 49.2342 48.3111 44.1596 37.5005 44.1596C26.69 44.1596 17.6438 49.2342 17.6438 55.191Z" fill="black"/></g><defs><clipPath id="clip0_118:2506"><rect width="75" height="75" fill="white"/></clipPath></defs></svg>`).appendTo(div_header);

  let div_titre = $(`<div class="container-fluid img"></div>`).append(`
    <img src="img/ENTETE_IT.png" style="width:100%;">
    <h1 class="centered">Compte Étudiant</h1>`).appendTo(div_parent);

  let div_modif_background = $(`<div class="parent-div bottom-left"></div>`).append(`
    <button class="btn btn-success">Modifier l'image</button>
    <input type="file" name="image" />
    `).appendTo(div_titre);

  let div_pdp = $(`<div class="pdp"></div>`).append(`<img src="img/user_connected.png"/>`).appendTo(div_titre);

  let modif_pdp = $(`<div class="parent-div"></div>`).append(`
        <button class="btn btn-success">Modifier la photo</button>
        <input type="file" name="photo" />
    `).appendTo(div_pdp);

  let div_info_pro = $(`<div class="container"></div>`).append(`<h2 id="sous_titre">Infomations personnelles</h2>`).appendTo(div_parent);

  let form_info = $(`<form></form>`).append(`
    <div class="form-group">
    <label for="genre-selector" id="medium">Civilité : <FONT color=red>*</FONT></label><br/>
    <select name="genre" id="genre_select">
        <option value="non_precis">Ne souhaite pas précisez</option>
        <option value="man">Homme</option>
        <option value="woman">Femme</option>
        <option value="other">Autre</option>
    </select>
    </div><br/>
    <div class="form-group">
        <label for="nom" id="medium">Nom : <FONT color=red>*</FONT></label>
        <input type="text" class="form-control" id="nom" placeholder="Nom de l'élève" required>
    </div><br/>
    <div class="form-group">
        <label for="prenom" id="medium">Prénom : <FONT color=red>*</FONT></label>
        <input type="text" class="form-control" id="prenom" placeholder="Prénom de l'élève" required>
    </div><br/>
    <div class="form-group">
        <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
        <input type="email" class="form-control" id="email" placeholder="Email" required>
    </div><br/>
    <div class="form-group" id="medium">
        <label for="numero">Numéro de téléphone : <FONT color=red>*</FONT></label>
        <input type="tel" class="form-control" id="numero" placeholder="Numéro" pattern="[0-9]{10}" required>
    </div><br/>
    `).appendTo(div_info_pro);

    let form_info_div = $(`<div class="col text-center">  </div>`).appendTo(div_info_pro);
    let btn_fom_info = $(`<button type="submit" class="btn btn-success" id="modif_profil">Modifier votre profil</button>`).appendTo(form_info_div);

    btn_fom_info.click(()=>{
      let name = nom.val();

      console.log("name");
    });


  /*body.append(`
            <!--        Form        -->
            <div class="container">
                <h2 id="sous_titre">Infomations personnelles</h2>
                <form>
                    <div class="form-group">
                    <label for="genre-selector" id="medium">Civilité : <FONT color=red>*</FONT></label><br/>
                    <select name="genre" id="genre_select">
                        <option value="non_precis">Ne souhaite pas précisez</option>
                        <option value="man">Homme</option>
                        <option value="woman">Femme</option>
                        <option value="other">Autre</option>
                    </select>
                    </div><br/>
                    <div class="form-group">
                        <label for="nom" id="medium">Nom : <FONT color=red>*</FONT></label>
                        <input type="text" class="form-control" id="nom" placeholder="Nom de l'élève">
                    </div><br/>
                    <div class="form-group">
                        <label for="prenom" id="medium">Prénom : <FONT color=red>*</FONT></label>
                        <input type="text" class="form-control" id="prenom" placeholder="Prénom de l'élève">
                    </div><br/>
                    <div class="form-group">
                        <label for="email" id="medium">Email : <FONT color=red>*</FONT></label>
                        <input type="email" class="form-control" id="email" placeholder="Email">
                    </div><br/>
                    <div class="form-group" id="medium">
                        <label for="numero">Numéro de téléphone : <FONT color=red>*</FONT></label>
                        <input type="tel" class="form-control" id="numero" placeholder="Numéro" pattern="[0-9]{10}">
                    </div><br/>
                    <div class="col text-center">
                        <button type="submit" class="btn btn-success">Modifier votre profil</button>
                    </div>
                </form>
            </div>

            <br/><hr/><br/>

            <!--        CV          -->
            <div class="container">
                <h2 id="sous_titre">CV</h2>
                <div class="row">
                    <p id="medium">Pour postuler, veuillez importer votre CV</p>
                </div>
                <div class="row">
                    <div class="text-center">
                        <input type="file" name="image" accept=".docx, .pdf"/>
                    </div>
                </div>
            </div>

            <br/><hr/><br/>

            <!--        Lien Web    -->
            <div class="container">
                <h2 id="sous_titre">Lien Web</h2>
                <form>
                    <div class="form-group">
                        <label for="site" id="medium">Site Internet :</label>
                        <input type="url" class="form-control" id="site" placeholder="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="form-group">
                        <label for="linkedin" id="medium">LinkedIn :</label>
                        <input type="url" class="form-control" id="linkedin" placeholder="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="form-group">
                        <label for="twitter" id="medium">Twitter :</label>
                        <input type="url" class="form-control" id="twitter" placeholder="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="form-group" id="medium">
                        <label for="fb">Facebook : </label>
                        <input type="url" class="form-control" id="fb" placeholder="Veuillez y mettre votre lien" pattern="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="form-group">
                        <label for="gitlab" id="medium">Github :</label>
                        <input type="url" class="form-control" id="gitlab" placeholder="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="form-group">
                        <label for="github" id="medium">GitLab :</label>
                        <input type="url" class="form-control" id="github" placeholder="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="form-group" id="medium">
                        <label for="sof">StackOverFlow : </label>
                        <input type="url" class="form-control" id="sof" placeholder="Veuillez y mettre votre lien">
                    </div><br/>
                    <div class="col text-center">
                        <button type="submit" class="btn btn-success">Ajouter</button>
                    </div>
                </form>
            </div>

            <br/><hr/><br/>

            <!--        MDP         -->
            <div class="container">
                <h2 id="sous_titre">Mot de passe :</h2>
                <form>
                    <div class="form-group" id="medium">
                        <label for="mdp">Nouveau mot de passe : </label>
                        <input type="password" class="form-control" id="mdp">
                    </div><br/>
                    <div class="form-group" id="medium">
                        <label for="newmdp">Confirmer le nouveau mot de passe : </label>
                        <input type="password" class="form-control" id="newmdp">
                    </div><br/>
                    <div class="col text-center">
                        <button type="submit" class="btn btn-success">Enregistrer</button>
                    </div>
                  </form>
            </div>

        </div>
    `)*/
});
