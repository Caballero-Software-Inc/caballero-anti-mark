'use strict';

const version = "1.1.0-beta";

let userLang = localStorage.getItem("userLang");
if (userLang == null) {
  userLang = 0;
} else {
  userLang = parseInt(userLang);
}

const lang = ["English", "Français"];
const currentPage = ["adminMenu", "intro", "openAccount", "existingUser", "forgotIdentifier", "userMenu", "searchMenu", "addOffer", "myOffers", "proceedSearch"];

const locUpdateTime = 1000; // update of location (in the server)


// In case of problem, re-start the local storage
/*
localStorage.setItem("page", "");
localStorage.setItem("userId", "");
localStorage.setItem("userEmail", "");
localStorage.setItem("providers", "");
*/

let page = localStorage.getItem("page");
let userId = localStorage.getItem("userId");
let userEmail = localStorage.getItem("userEmail");
let providers = localStorage.getItem("providers");
let newMap = true;
let myMap;



let checkOpen = true; // check to open an account

let checkAdd = true; // check to add new offer

// it is not cryptographically secure
function makeId(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


/* I am new */

function openAccount() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('webcontent').innerHTML = "<h2>Open a new account</h2>";
      document.getElementById('webcontent').innerHTML += "<p><input type='checkbox' id='myCheck' onclick='insertButton();'> I accept the <a href='PrivacyPolicy.html'>Privacy Policy</a> and the <a href='TermsandConditions.html'>Terms and Conditions</a>.</p>";
      document.getElementById('webcontent').innerHTML += "<Br></Br>";
      document.getElementById('webcontent').innerHTML += "<div id='confirmButtonId'></div>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML += "<h2>Ouvrir un nouveau compte</h2>";
      document.getElementById('webcontent').innerHTML += "<p><input type='checkbox' id='myCheck' onclick='insertButton();'> J'accepte la <a href='PrivacyPolicyfr.html'>Politique de Confidentialité</a> et les <a href='TermsandConditionsfr.html'>Termes et Conditions</a>.</p>";
      document.getElementById('webcontent').innerHTML += "<Br></Br>";
      document.getElementById('webcontent').innerHTML += "<div id='confirmButtonId'></div>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}


function mainOpen() {
  const newUser = {
    identifier: "",
    email: document.getElementById('emailId').value,
    language: userLang,
    recovery: "",
    offers: []
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  };
  fetch('/newaccount', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      switch (userLang) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h2>To ensure that this email is yours, Caballero Software Inc. will send you an email with your identifier.</h2>";
          document.getElementById('webcontent').innerHTML += "<h3>This email will be sent from: caballerosoftwareinc at gmail dot com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h2>Pour s'assurer que cet e-mail est le vôtre, Caballero Software Inc. vous enverra un courrier électronique avec votre identifiant.</h2>";
          document.getElementById('webcontent').innerHTML += "<h3>Cet courrier électronique sera envoyé par : caballerosoftwareinc at gmail dot com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    } else {
      switch (userLang) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h2>There is already a user with this email.</h2>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h2>Il y a déjà un utilisateur avec cet email.</h2>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    }
  })
}


function insertButton() {
  if (checkOpen) {
    switch (userLang) {
      case 0:
        document.getElementById("confirmButtonId").innerHTML = "<h2>Email</h2>";
        document.getElementById("confirmButtonId").innerHTML += "<p><input type='text' id='emailId'></p>";
        document.getElementById("confirmButtonId").innerHTML += "<br><button onclick='mainOpen();'>Register</button><Br></Br>";
        break;
      case 1:
        document.getElementById("confirmButtonId").innerHTML = "<h2>Courrier Électronique</h2>";
        document.getElementById("confirmButtonId").innerHTML += "<p><input type='text' id='emailId'></p>";
        document.getElementById("confirmButtonId").innerHTML += "<br><button onclick='mainOpen();'>Enregistre-moi</button><Br></Br>";
        break;
      default:
        document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
        break;
    };
    checkOpen = false;
  } else {
    document.getElementById("confirmButtonId").innerHTML = "";
    checkOpen = true;
  }
}

/* I have an account */
function goToPage(i) {
  localStorage.setItem('page', currentPage[i]);
  location.reload();
}


function uploadProviders(file) {
  const reader = new FileReader();
  reader.onload = function (evt) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file: evt.target.result })
    };
    fetch('/apiupdatedata', options);
  };
  reader.readAsText(file.files[0]);
}

function adminMenu() {
  // admin only in English (for simplicity)
  document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
  document.getElementById('subtitleId').innerHTML = "<p class='w3-large'>Administrator at Caballero Software Inc.</p>";
  document.getElementById('authcontent').innerHTML = "<h2>Main Menu</h2>";
  document.getElementById('authcontent').innerHTML += "<br><br><p>Download providers.</p>";
  document.getElementById('authcontent').innerHTML += "<button onclick='downloadProviders();'>Download</button><br><br>";
  document.getElementById('authcontent').innerHTML += '<input id="json-file" type="file" onchange="uploadProviders(this)"><br><br>';
  document.getElementById('authcontent').innerHTML += "<br><br><p>Logout this service.</p>";
  document.getElementById('authcontent').innerHTML += "<button onclick='logoutAdmin();'>Logout</button>";
}

function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function downloadProviders() {
  const data = JSON.parse(providers);
  let print = "";
  for (let x of data) {
    x["_id"] = makeId(16);
    print += JSON.stringify(x) + "\n"
  }
  download('providers.txt', print);
}

function authentication() {
  userEmail = document.getElementById('emailId').value;
  userId = document.getElementById('identifierId').value;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, email: userEmail })
  };
  fetch('/apiauthentication', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", userEmail);
      if (userEmail == "caballero@caballero.software") {
        providers = respo.providers;
        localStorage.setItem("providers", JSON.stringify(providers));
        goToPage(0);
      } else {
        goToPage(5)
      }
    } else {
      switch (userLang) {
        case 0:
          document.getElementById('webcontent').innerHTML += "<p>Authentication error. Try again.</p>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML += "<p>Erreur d'authentification. Réessayer.</p>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    };
  })
}

function existingUser() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('webcontent').innerHTML += "<h3>Email</h3><br>";
      document.getElementById('webcontent').innerHTML += '<p><input type="text" id="emailId"></p>';
      document.getElementById('webcontent').innerHTML += "<h3>Identifier</h3><br>";
      document.getElementById('webcontent').innerHTML += "<input type='text' id='identifierId'><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='authentication()'>Login</button><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(4);'>I forgot my Identifier</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML += "<h3>Courrier Électronique</h3><br>";
      document.getElementById('webcontent').innerHTML += '<p><input type="text" id="emailId"></p>';
      document.getElementById('webcontent').innerHTML += "<h3>Identifier</h3><br>";
      document.getElementById('webcontent').innerHTML += "<input type='text' id='identifierId'><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='authentication()'>Connexion</button><Br></Br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(4);'>J'ai oublié mon identifiant</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function forgotIdentifier() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('webcontent').innerHTML += "<h4>To retrieve your identifier, enter your email</h4>";
      document.getElementById('webcontent').innerHTML += "<h3>Email</h3><br>";
      document.getElementById('webcontent').innerHTML += '<input type="text" id="emailId">';
      document.getElementById('webcontent').innerHTML += "<h4>and click the next button</h4><br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='retrieveIdentifier()'>Send me my identifier</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1)'>Home</button>";
      document.getElementById('webcontent').innerHTML += "<Br></Br><p>To request identifier retrieval, you must wait at least 24 hours from the last email retrieval or account opening.</p><br>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML += "<h4>Pour récupérer votre identifiant, entrez votre courrier électronique</h4>";
      document.getElementById('webcontent').innerHTML += "<h3>Courrier Électronique</h3><br>";
      document.getElementById('webcontent').innerHTML += '<input type="text" id="emailId">';
      document.getElementById('webcontent').innerHTML += "<h4>et cliquez sur le bouton suivant</h4><br>";
      document.getElementById('webcontent').innerHTML += "<button onclick='retrieveIdentifier()'>Envoyez-moi mon identifiant</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1)'>Accueil</button>";
      document.getElementById('webcontent').innerHTML += "<Br></Br><p>Pour demander la récupération d'identifiant, vous devez attendre au moins 24 heures à compter de la dernière récupération d'email ou ouverture de compte.</p><br>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function retrieveIdentifier() {
  userEmail = document.getElementById('emailId').value;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: userEmail })
  };
  fetch('/apiretrieveidentifier', options).then(async response => {
    let respo = await response.json();
    if (respo.ok) {
      switch (userLang) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h3>An email containing your identifier was sent to you from: caballerosoftwareinc at gmail dot com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h3>Un courrier électronique contenant votre identifiant vous a été envoyé depuis: caballerosoftwareinc à gmail point com</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };

    } else {
      switch (userLang) {
        case 0:
          document.getElementById('webcontent').innerHTML = "<h3>It was not possible to request the recovery of the identifier.</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button>";
          break;
        case 1:
          document.getElementById('webcontent').innerHTML = "<h3>Il n'a pas été possible de demander la récupération de l'identifiant.</h3>";
          document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button>";
          break;
        default:
          document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
          break;
      };
    }
  })
}


function logoutUser() {
  localStorage.setItem("userId", "");
  localStorage.setItem("userEmail", "");
  localStorage.setItem("page", "");
  location.reload();
}

function logoutAdmin() {
  localStorage.setItem("userId", "");
  localStorage.setItem("userEmail", "");
  localStorage.setItem("providers", "");
  localStorage.setItem("page", "");
  location.reload();
}

function deleteUser() {
  switch (userLang) {
    case 0:
      if (confirm("Are you sure you want to delete your account?")) {

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, userEmail })
        };

        fetch('/apidelete', options).then(async response => {
          let respo = await response.json();
          localStorage.setItem("userId", "");
          localStorage.setItem("userEmail", "");
          localStorage.setItem("userLang", 0);
          confirm("Your account has been deleted");
          localStorage.setItem("page", "");
          location.reload();
        });
      } else {
        alert("Your account is fine.");
      }
      break;
    case 1:
      if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, userEmail })
        };

        fetch('/apidelete', options).then(async response => {
          let respo = await response.json();
          localStorage.setItem("userId", "");
          localStorage.setItem("userEmail", "");
          localStorage.setItem("userLang", 0);
          confirm("Votre compte a été supprimé");
          localStorage.setItem("page", "");
          location.reload();
        });
      } else {
        alert("Votre compte va bien.");
      }
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
};



function introMenu() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('titlePageId').innerHTML = "Caballero|AntiMark";
      document.getElementById('allId').lang = 'en';
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">Welcome to Caballero|AntiMark</h1>';
      document.getElementById('subtitleId').innerHTML = '<p class="w3-large">An anti-discrimination service provided by Caballero Software Inc.</p>';
      document.getElementById('subtitleId').innerHTML += '<p class="w3-large">In particular, this project aims to help people who may feel discriminated against for not being vaccinated.</p>';
      document.getElementById('subtitleId').innerHTML += '<p class="w3-large">version: ' + version + '</p>';
      document.getElementById('subtitleId').innerHTML += "<p class='w3-large'>Disclaimer: This version of Caballero|AntiMark is not a service but a test of the prototype. Caballero Software Inc. does not enter into any contracts with users regarding this test. Participation in this test is at the risk and peril of the participant.</p>";
      document.getElementById('webcontent').innerHTML += "<br><p>I am looking for a non-essential service, and I am not vaccinated:</p>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(6)'>Search</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><p>I offer a non-essential service, and I accept unvaccinated people:</p>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(2)'>Register</button>";
      document.getElementById('webcontent').innerHTML += '<br><br><button onclick="goToPage(3);">Sign in</button><br><br>';
      document.getElementById('webcontent').innerHTML += "<br><a href='contribution.html'>How to contribute to this open-source project?</a>";
      document.getElementById('webcontent').innerHTML += "<br><p>Open-source contributors:</p>";
      document.getElementById('webcontent').innerHTML += "<br><a href='https://josephcmac.github.io/'>José Manuel Rodríguez Caballero</a>";
      document.getElementById('footerId').innerHTML = "<h1>Contact</h1>";
      document.getElementById('footerId').innerHTML += "<h4>Caballero Software Inc.</h4>";
      document.getElementById('footerId').innerHTML += '<p style="white-space: pre-line">Address: 2-34 Columbia St W, Waterloo, ON, Canada, N2L 3K5 <br>';
      document.getElementById('footerId').innerHTML += 'Email: caballero@caballero.software <br><br>';
      document.getElementById('footerId').innerHTML += 'Phone: +1 (438) 993-2054 <br><br>';
      document.getElementById('footerId').innerHTML += 'Website: <a href="https://caballero.software/">https://caballero.software/</a></p>';
      document.getElementById('footerId').innerHTML += "<br><img src='logo3.png' style='width:30%'></img>";
      break;
    case 1:
      document.getElementById('titlePageId').innerHTML = "Caballero|AntiMarque";
      document.getElementById('allId').lang = 'fr';
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">Bienvenue chez Caballero|AntiMarque</h1>';
      document.getElementById('subtitleId').innerHTML = "<p class='w3-large'>Un service anti-discrimination fourni par Caballero Software Inc.</p>";
      document.getElementById('subtitleId').innerHTML += "<p class='w3-large'>Ce projet vise notamment à aider les personnes qui peuvent se sentir discriminées parce qu'elles ne se font pas vacciner.</p>";
      document.getElementById('subtitleId').innerHTML += '<p class="w3-large">version: ' + version + '</p>';
      document.getElementById('subtitleId').innerHTML += "<p class='w3-large'>Avis de non-responsabilité : Cette version de Caballero|AntiMark n'est pas un service mais un test du prototype. Caballero Software Inc. ne conclut aucun contrat avec les utilisateurs concernant ce test. La participation à ce test est aux risques et périls du participant.</p>";
      document.getElementById('webcontent').innerHTML += "<br><p>Je recherche une prestation non essentielle, et je ne suis pas vacciné :</p>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(6)'>Chercher</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><p>Je propose un service non essentiel, et j'accepte les personnes non vaccinées :</p>";
      document.getElementById('webcontent').innerHTML += "<button onclick='goToPage(2)'>Inscrivez-moi</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(3);'>Identifiez-moi</button><br><br>";
      document.getElementById('webcontent').innerHTML += "<br><a href='contributionfr.html'>Comment contribuer à ce projet open source ?</a>";
      document.getElementById('webcontent').innerHTML += "<br><p>Contributeurs open source :</p>";
      document.getElementById('webcontent').innerHTML += "<br><a href='https://josephcmac.github.io/'>José Manuel Rodríguez Caballero</a>";
      document.getElementById('footerId').innerHTML = "<h1>Nous joindre</h1>";
      document.getElementById('footerId').innerHTML += "<h4>Caballero Software Inc.</h4>";
      document.getElementById('footerId').innerHTML += '<p style="white-space: pre-line">Adresse: 2-34 Columbia St W, Waterloo, ON, Canada, N2L 3K5 <br>';
      document.getElementById('footerId').innerHTML += 'Courrier Électronique: caballero@caballero.software <br><br>';
      document.getElementById('footerId').innerHTML += 'Téléphone: +1 (438) 993-2054 <br><br>';
      document.getElementById('footerId').innerHTML += 'Site Internet: <a href="https://caballero.software/">https://caballero.software/indexfr.html</a></p>';
      document.getElementById('footerId').innerHTML += "<br><img src='logo3.png' style='width:30%'></img>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function changeLang(i) {
  userLang = i;
  localStorage.setItem("userLang", userLang);
  location.reload();
}

function languageChoice() {
  document.getElementById('langId').innerHTML = '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
  if (0 == userLang) {
    document.getElementById('langId').innerHTML += '<button style = "background-color: #04AA6D" onclick="changeLang(' + 0 + ')">' + lang[0] + '</button>';
  } else {
    document.getElementById('langId').innerHTML += '<button style = "background-color: #C0C0C0" onclick="changeLang(' + 0 + ')">' + lang[0] + '</button>';
  };
  for (let i = 1; i < lang.length; i++) {
    if (i == userLang) {
      document.getElementById('langId').innerHTML += '<br><br><button style = "background-color: #04AA6D" onclick="changeLang(' + i + ')">' + lang[i] + '</button>';
    } else {
      document.getElementById('langId').innerHTML += '<br><br><button style = "background-color: #C0C0C0" onclick="changeLang(' + i + ')">' + lang[i] + '</button>';
    };
  };
  document.getElementById('langId').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';

}


// Caballero|AntiMark



function userMenu() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('titleId').innerHTML += "<h2>Provider account</h2>";
      document.getElementById('authcontent').innerHTML += "<Br></Br>";
      document.getElementById("authcontent").innerHTML += "<br><button onclick='goToPage(8);'>My offers</button><Br></Br>";
      document.getElementById("authcontent").innerHTML += "<br><button onclick='goToPage(7);'>Add offer</button><Br></Br>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById("authcontent").innerHTML += "<br><button onclick='logoutUser()'>Logout</button><Br></Br>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById("authcontent").innerHTML += "<br><button onclick='deleteUser()'>Delete my account</button><Br></Br>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      break;
    case 1:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('titleId').innerHTML += "<h2>Compte fournisseur</h2>";
      document.getElementById('authcontent').innerHTML += "<Br></Br>";
      document.getElementById("authcontent").innerHTML += "<br><button onclick='goToPage(8);'>Mes offres</button><Br></Br>";
      document.getElementById("authcontent").innerHTML += "<br><button onclick='goToPage(7);'>Ajouter une offre</button><Br></Br>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById("authcontent").innerHTML += "<br><button onclick='logoutUser()'>Sortir</button><Br></Br>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById("authcontent").innerHTML += "<br><button onclick='deleteUser()'>Supprimer mon compte</button><Br></Br>";
      document.getElementById('authcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}



function insertButtonAdd() {
  if (checkAdd) {
    switch (userLang) {
      case 0:
        document.getElementById("confirmButtonAddId").innerHTML = "<Br></Br><button onclick='addOfferMain();'>Add</button><Br></Br>";
        break;
      case 1:
        document.getElementById("confirmButtonAddId").innerHTML = "<Br></Br><button onclick='addOfferMain();'>Ajouter</button><Br></Br>";
        break;
      default:
        document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
        break;
    };
    checkAdd = false;
  } else {
    document.getElementById("confirmButtonAddId").innerHTML = "";
    checkAdd = true;
  }
}

function addOffer() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('titleId').innerHTML += "<h2>Add offer</h2>";
      document.getElementById('authcontent').innerHTML += "<Br></Br><h4>Non-essential service</h4>";
      document.getElementById('authcontent').innerHTML += "<p>Kind of service (max 100 characters)</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 100 type="text" id="serviceNameId">';
      document.getElementById('authcontent').innerHTML += "<p>Examples: gym, casino, bingo hall, fitness centre, restaurant, bar, etc.</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Short description (max 500 characters)</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceDescriptionId">';
      document.getElementById('authcontent').innerHTML += "<p>Example: Cuban restaurant, live Cuban music, vegan offers, student discounts.</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Website (max 500 characters, starting as https://)</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceWebId">';
      document.getElementById('authcontent').innerHTML += "<p>Example: https://caballero.software/</p>";
      document.getElementById('authcontent').innerHTML += "<br><h4>Coordinates</h4>";
      document.getElementById('authcontent').innerHTML += "<br><p><a href='https://www.latlong.net/convert-address-to-lat-long.html'>https://www.latlong.net/convert-address-to-lat-long.html</a> is a web app external to our service (not controlled by Caballero Software Inc.) to find the coordinates of a place from the address.</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Latitude</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLatitudeId">';
      document.getElementById('authcontent').innerHTML += "<p>Example: 43.481050</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Longitude</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLongitudeId">';
      document.getElementById('authcontent').innerHTML += "<p>Example: -80.529250</p>";
      document.getElementById('authcontent').innerHTML += "<p><input type='checkbox' id='myCheck' onclick='insertButtonAdd();'> I will not ask for a vaccination passport or any other mark to discriminate between people as a condition for entering the place where I offer my service. My service meets my local legal regulations and the legal regulations of Ontario, Canada; if not, Caballero Software Inc. will delete my account. If my service involves anything that may be illegal, Caballero Software Inc. will contact the relevant authorities.</p>";
      document.getElementById('authcontent').innerHTML += "<div id='confirmButtonAddId'></div>";
      document.getElementById("authcontent").innerHTML += "<Br></Br><button onclick='goToPage(5);'>Back to Main</button><Br></Br>";
      break;
    case 1:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">' + userEmail + '</h1>';
      document.getElementById('titleId').innerHTML += "<h2>Ajouter une offre</h2>";
      document.getElementById('authcontent').innerHTML += "<Br></Br><h4>Service non essentiel</h4>";
      document.getElementById('authcontent').innerHTML += "<p>Type de service (max 100 caractères)</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 100 type="text" id="serviceNameId">';
      document.getElementById('authcontent').innerHTML += "<p>Exemples : gymnase, casino, salle de bingo, centre de fitness, restaurant, bar, etc.</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Brève description (max 500 caractères)</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceDescriptionId">';
      document.getElementById('authcontent').innerHTML += "<p>Exemple : restaurant cubain, musique cubaine en direct, offres végétaliennes, rabais étudiants.</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Site Web (max 500 caractères, commençant par https://)</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceWebId">';
      document.getElementById('authcontent').innerHTML += "<p>Exemple : https://caballero.software/</p>";
      document.getElementById('authcontent').innerHTML += "<br><h4>Coordonnées</h4>";
      document.getElementById('authcontent').innerHTML += "<br><p><a href='https://www.latlong.net/convert-address-to-lat-long.html'>https://www.latlong.net/convert-address-to-lat-long.html</a> est une application web externe à notre service (non contrôlé par Caballero Software Inc.) pour trouver les coordonnées d'un lieu à l'adresse.</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Latitude</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLatitudeId">';
      document.getElementById('authcontent').innerHTML += "<p>Exemple : 43.481050</p>";
      document.getElementById('authcontent').innerHTML += "<br><p>Longitude</p>";
      document.getElementById('authcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLongitudeId">';
      document.getElementById('authcontent').innerHTML += "<p>Exemple : -80.529250</p>";
      document.getElementById('authcontent').innerHTML += "<p><input type='checkbox' id='myCheck' onclick='insertButtonAdd();'> Je ne demanderai pas de passeport de vaccination ou toute autre marque pour discriminer entre les personnes comme condition d'entrée dans le lieu où j'offre mon service. Mon service respecte mes réglementations légales locales et les réglementations légales de l'Ontario, Canada ; sinon, Caballero Software Inc. supprimera mon compte. Si mon service implique quelque chose qui peut être illégal, Caballero Software Inc. contactera les autorités compétentes.</p>";
      document.getElementById('authcontent').innerHTML += "<div id='confirmButtonAddId'></div>";
      document.getElementById("authcontent").innerHTML += "<Br></Br><button onclick='goToPage(5);'>Retour à la page principale</button><Br></Br>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function addOfferMain() {
  const newOffer = {
    kind: document.getElementById('serviceNameId').value,
    description: document.getElementById('serviceDescriptionId').value,
    website: document.getElementById('serviceWebId').value,
    location: { lat: parseFloat(document.getElementById('serviceLatitudeId').value), lon: parseFloat(document.getElementById('serviceLongitudeId').value) }
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userEmail, newOffer })
  };

  fetch('/newoffer', options);
  goToPage(5);
}

function deleteOffer(i) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userEmail, index: parseInt(i) })
  };

  fetch('/deloffer', options).then(async response => {
    let respo = await response.json();
    goToPage(5);
  });
}

function myOffers() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userEmail })
  };

  fetch('/seeoffers', options).then(async response => {
    let respo = await response.json();

    languageChoice();
    switch (userLang) {
      case 0:
        document.getElementById('webcontent').innerHTML = "<h2>My offers</h2>";
        for (let i = 0; i < respo.offers.length; i++) {
          document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
          document.getElementById('webcontent').innerHTML += "<p>Offer number: " + (i + 1) + "</p>";
          document.getElementById('webcontent').innerHTML += "<p>Kind: " + respo.offers[i].kind + "</p>";
          document.getElementById('webcontent').innerHTML += "<p>Description: " + respo.offers[i].description + "</p>";
          document.getElementById('webcontent').innerHTML += "<p>Website: <a href = '" + respo.offers[i].website + "'>" + respo.offers[i].website + "</a></p>";
          document.getElementById('webcontent').innerHTML += "<p>Location: latitude = " + respo.offers[i].location.lat + ", longitude = " + respo.offers[i].location.lon + "</p>";
          document.getElementById("webcontent").innerHTML += "<Br></Br><button onclick='deleteOffer(" + i + ");'>Delete this offer</button><Br></Br>";
        }
        document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
        document.getElementById("authcontent").innerHTML += "<Br></Br><button onclick='goToPage(5);'>Back to Main</button><Br></Br>";
        break;
      case 1:
        document.getElementById('webcontent').innerHTML = "<h2>Mes offres</h2>";
        for (let i = 0; i < respo.offers.length; i++) {
          document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
          document.getElementById('webcontent').innerHTML += "<p>Numéro de l'offre : " + (i + 1) + "</p>";
          document.getElementById('webcontent').innerHTML += "<p>Type : " + respo.offers[i].kind + "</p>";
          document.getElementById('webcontent').innerHTML += "<p>Description : " + respo.offers[i].description + "</p>";
          document.getElementById('webcontent').innerHTML += "<p>Site Internet : <a href = '" + respo.offers[i].website + "'>" + respo.offers[i].website + "</a></p>";
          document.getElementById('webcontent').innerHTML += "<p>Emplacement: latitude = " + respo.offers[i].location.lat + ", longitude = " + respo.offers[i].location.lon + "</p>";
          document.getElementById("webcontent").innerHTML += "<Br></Br><button onclick='deleteOffer(" + i + ");'>Supprimer cette offre</button><Br></Br>";
        }
        document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
        document.getElementById("authcontent").innerHTML += "<Br></Br><button onclick='goToPage(5);'>Retour à la page principale</button><Br></Br>"; break;
      default:
        document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
        break;
    };
  });
}


function showSearch() {
  let offers = JSON.parse(localStorage.getItem("offersList"));
  let lat = parseFloat(localStorage.getItem("myLat"));
  let lon = parseFloat(localStorage.getItem("myLon"));
  let dist = parseFloat(localStorage.getItem("maxDist"));

  document.getElementById('authcontent').innerHTML += "<div id='mapid'></div>";
  languageChoice();

  let zoom;
  let center;

  if (newMap) {
    center = [lat, lon];
    newMap = false;
    zoom = 18;
  } else {
    zoom = myMap.getZoom();
    center = myMap.getCenter();
    myMap.remove();

  }
  myMap = L.map('mapid').setView(center, zoom);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(myMap);


  L.marker([lat, lon]).addTo(myMap);

  switch (userLang) {
    case 0:
      document.getElementById('webcontent').innerHTML = "<h2>Non-essential services accepting unvaccinated people</h2>";
      for (let i = 0; i < offers.length; i++) {
        document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
        document.getElementById('webcontent').innerHTML += "<p>Offer number: " + (i + 1) + "</p>";
        document.getElementById('webcontent').innerHTML += "<p>Kind: " + offers[i].kind + "</p>";
        document.getElementById('webcontent').innerHTML += "<p>Description: " + offers[i].description + "</p>";
        document.getElementById('webcontent').innerHTML += "<p>Website: <a href = '" + offers[i].website + "'>" + offers[i].website + "</a></p>";
        document.getElementById('webcontent').innerHTML += "<p>Location: latitude = " + offers[i].location.lat + ", longitude = " + offers[i].location.lon + "</p>";
        L.circle([offers[i].location.lat, offers[i].location.lon], {
          color: 'black',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 8
        }).addTo(myMap).bindPopup("" + (i + 1), { noHide: true })
      }
      document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(6);'>New Search</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Home</button><Br></Br>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML = "<h2>Services non essentiels acceptant des personnes non vaccinées</h2>";
      for (let i = 0; i < offers.length; i++) {
        document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
        document.getElementById('webcontent').innerHTML += "<p>Numéro de l'offre : " + (i + 1) + "</p>";
        document.getElementById('webcontent').innerHTML += "<p>Type : " + offers[i].kind + "</p>";
        document.getElementById('webcontent').innerHTML += "<p>Description : " + offers[i].description + "</p>";
        document.getElementById('webcontent').innerHTML += "<p>Site Internet : <a href = '" + offers[i].website + "'>" + offers[i].website + "</a></p>";
        document.getElementById('webcontent').innerHTML += "<p>Emplacement: latitude = " + offers[i].location.lat + ", longitude = " + offers[i].location.lon + "</p>";
      }
      document.getElementById('webcontent').innerHTML += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(6);'>Nouvelle recherche</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='goToPage(1);'>Accueil</button><Br></Br>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}

function proceedSearch() {
  let lat = document.getElementById('serviceLatitudeId').value;
  let lon = document.getElementById('serviceLongitudeId').value;
  let dist = document.getElementById('serviceMaxDistId').value;
  fetch('/seealloffers?lat='+lat+'&lon='+lon+'&dist='+dist).then(async response => {
    let respo = await response.json();
    let offersList = await respo.offers;
    localStorage.setItem('offersList', JSON.stringify(offersList));
    localStorage.setItem('myLat', lat);
    localStorage.setItem('myLon', lon);
    localStorage.setItem('maxDist', dist);
    goToPage(9)
  });
}

function searchMenu() {
  languageChoice();
  switch (userLang) {
    case 0:
      document.getElementById('webcontent').innerHTML = "<h2>Parameters of the search</h2>";
      document.getElementById('webcontent').innerHTML += "<br><h4>My Coordinates</h4>";
      document.getElementById('webcontent').innerHTML += "<br><p><a href='https://www.latlong.net/convert-address-to-lat-long.html'>https://www.latlong.net/convert-address-to-lat-long.html</a> is a web app external to our service (not controlled by Caballero Software Inc.) to find the coordinates of a place from the address.</p>";
      document.getElementById('webcontent').innerHTML += "<br><p>Latitude</p>";
      document.getElementById('webcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLatitudeId">';
      document.getElementById('webcontent').innerHTML += "<p>Example: 43.481050</p>";
      document.getElementById('webcontent').innerHTML += "<br><p>Longitude</p>";
      document.getElementById('webcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLongitudeId">';
      document.getElementById('webcontent').innerHTML += "<p>Example: -80.529250</p>";
      document.getElementById('webcontent').innerHTML += "<br><h4>Maximum distance from me in km</h4>";
      document.getElementById('webcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceMaxDistId">';
      document.getElementById('webcontent').innerHTML += "<p>Example: 5</p>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='myLocation();'>My location</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='proceedSearch();'>See offers</button>";
      break;
    case 1:
      document.getElementById('webcontent').innerHTML = "<h2>Paramètres de la recherche</h2>";
      document.getElementById('webcontent').innerHTML += "<br><h4>Mes Coordonnées</h4>";
      document.getElementById('webcontent').innerHTML += "<br><p><a href='https://www.latlong.net/convert-address-to-lat-long.html'>https://www.latlong.net/convert-address-to-lat-long.html</a> est une application web externe à notre service (non contrôlé par Caballero Software Inc.) pour trouver les coordonnées d'un lieu à l'adresse.</p>";
      document.getElementById('webcontent').innerHTML += "<br><p>Latitude</p>";
      document.getElementById('webcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLatitudeId">';
      document.getElementById('webcontent').innerHTML += "<p>Exemple : 43.481050</p>";
      document.getElementById('webcontent').innerHTML += "<br><p>Longitude</p>";
      document.getElementById('webcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceLongitudeId">';
      document.getElementById('webcontent').innerHTML += "<p>Exemple : -80.529250</p>";
      document.getElementById('webcontent').innerHTML += "<br><h4>Distance maximale de moi en km</h4>";
      document.getElementById('webcontent').innerHTML += '<input maxlength = 500 type="text" id="serviceMaxDistId">';
      document.getElementById('webcontent').innerHTML += "<p>Exemple : 5</p>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='myLocation();'>Ma position</button>";
      document.getElementById('webcontent').innerHTML += "<br><br><button onclick='proceedSearch();'>Voir les offres</button>";
      break;
    default:
      document.getElementById('titleId').innerHTML = '<h1 class="w3-margin w3-xlarge">???</h1>';
      break;
  };
}


function myLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    document.getElementById('serviceLatitudeId').value = position.coords.latitude;
    document.getElementById('serviceLongitudeId').value = position.coords.longitude;
    document.getElementById('serviceMaxDistId').value = 5;
  });
}

switch (page) {
  case "adminMenu":
    adminMenu();
    break;
  case "openAccount":
    openAccount();
    break;
  case "existingUser":
    existingUser();
    break;
  case "forgotIdentifier":
    forgotIdentifier();
    break;
  case "userMenu":
    userMenu();
    break;
  case "searchMenu":
    searchMenu();
    break
  case "addOffer":
    addOffer();
    break;
  case "myOffers":
    myOffers();
    break;
  case "proceedSearch":
    showSearch();
    break;
  default:
    introMenu();
    break;
};
