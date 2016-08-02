 // Initialize Firebase
 var config = {
 	apiKey: "AIzaSyD9OmNJrHYUapJgcRyqTfaUF6usMRRXYO4",
 	authDomain: "vacationtracker-218b9.firebaseapp.com",
 	databaseURL: "https://vacationtracker-218b9.firebaseio.com",
 	storageBucket: "vacationtracker-218b9.appspot.com",
 };

 firebase.initializeApp(config);

 /*Get reference*/
 var value;
 var dbRef = firebase.database().ref().child('text');

dbRef.on('value', function(snapshot) {
  console.log(snapshot.val());
});