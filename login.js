 var firebaseConfig = {
    apiKey: "AIzaSyD3vFhz2lyOHHff37Ug0pVCUasB3t1AA7E",
    authDomain: "mytaxiapp10-b750f.firebaseapp.com",
    databaseURL: "https://mytaxiapp10-b750f.firebaseio.com",
    projectId: "mytaxiapp10-b750f",
    storageBucket: "",
    messagingSenderId: "333287307973",
    appId: "1:333287307973:web:663797bb9c566d39018eac"
  };

firebase.initializeApp(firebaseConfig);

function login(){
		email = document.getElementById("useremail").value;
		password = document.getElementById("userpassword").value;
		firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    alert('Wrong password.');
  } else {
    alert(errorMessage);
  }
  console.log(error);
});
};

firebase.auth().onAuthStateChanged(user => {
  if(user) {
    window.location = 'index.html'; //If User is not logged in, redirect to login page
  }
});