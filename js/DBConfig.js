 // Initialize Firebase
 var config = {
 	apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
 	authDomain: "vacationtracker-5d242.firebaseapp.com",
 	databaseURL: "https://vacationtracker-5d242.firebaseio.com",
 	storageBucket: "vacationtracker-5d242.appspot.com",
 };
 firebase.initializeApp(config);

 /*Get reference example=*/
 var value;
 var dbRef = firebase.database().ref().child('employee');
 dbRef.on('value', function(snapshot) {
 	console.log(snapshot.val());
 });



 /**
  * getEmployeeCount(), this method returns the
  * total number of employees in the database 
  */
 int getEmployeeCount() {
 	return 0;
 }

 /**
  * getManagerCount(), this method returns the
  * total number of managers in the database 
  */
 int getManagerCount() {
 	return 0;
 }

 /**
  * getTeamCount(), this method returns the
  * total number of teams in the database 
  */
 int getTeamCount() {
 	return 0;
 }