 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
    authDomain: "vacationtracker-5d242.firebaseapp.com",
    databaseURL: "https://vacationtracker-5d242.firebaseio.com",
    storageBucket: "vacationtracker-5d242.appspot.com",
  };
 firebase.initializeApp(config);


 /*Get reference*/
 var value;
 var dbRef = firebase.database().ref().child('text');

dbRef.on('value', function(snapshot) {
  console.log(snapshot.val());
});