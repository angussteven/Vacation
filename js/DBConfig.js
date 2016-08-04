 // Initialize Firebase
 var config = {
 	apiKey: "AIzaSyD9OmNJrHYUapJgcRyqTfaUF6usMRRXYO4",
 	authDomain: "vacationtracker-218b9.firebaseapp.com",
 	databaseURL: "https://vacationtracker-218b9.firebaseio.com",
 	storageBucket: "vacationtracker-218b9.appspot.com",
 };
 firebase.initializeApp(config);


 /*Get reference example=*/
 /*var value;
 var dbRef = firebase.database().ref().child('employee');
 dbRef.on('value', function(snapshot) {
 	console.log(snapshot.val());
 });*/

 /**
  * getEmployeeCount(), this method returns the
  * total number of employees in the database 
  */
 function getEmployeeCount() {
 	//var ref = new Firebase("https://vacationtracker-5d242.firebaseio.com");
 	var ref = firebase.database().ref().child('employee');
 	ref.on('value', function(snapshot) {
 		snapshot.forEach(function(data) {
 			console.log(data.val().firstName);
 		});
 	});
 }

 /**
  * getManagerCount(), this method returns the
  * total number of managers in the database 
  */
 function getManagerCount() {
 	return 0;
 }

 /**
  * getTeamCount(), this method returns the
  * total number of teams in the database 
  */
 function getTeamCount() {
 	return 0;
 }


 //saveEmployee("andrew","moawad",15,15,1,["michael.eilers@gm.com"],[1],true,"andrew.moawad@gm.com","1234");
 //saveManager("michael.eilers@gm.com",["zachary.dicino@gm.com"],"michael.eilers@gm.com");
 //saveTeam(1,["zachary.dicino@gm.com"],["michael.eilers@gm.com"]);
 //saveEvent("zachary.dicino@gm.com",1,"08-29-2016","08-31-2016");
 //saveHoliday(["01-01-2016","01-18-2016","03-25-2016","03-28-2016","05-30-2016","07-04-2016","09-05-2016","11-08-2016","11-11-2016","11-24-2016","11-25-2016","12-26-2016","12-27-2016","12-28-2016","12-29-2016","12-30-2016"]);

 /*
 	Save an employee into the database
 	totalVacation = int
 	daysLeft = int
 	teamID = int
 	managers = array of strings
 	events = array of ints (ids)
 	isManager = bool
 	employees = array of strings (emails) default null for now
 	everything else string	
 */

 function saveEmployee(firstname, lastname, totalVacation, daysleft,
 	teamID, managers, events, isManager, email, password) {
 	firebase.database().ref('employee').push({
 		firstName: firstname,
 		lastName: lastname,
 		totalVacationDays: totalVacation,
 		daysLeft: daysleft,
 		team: teamID,
 		managers: managers,
 		events: events,
 		isManager: isManager,
 		email: email,
 		password: password,
 		employees: null
 	});

 	//if you are a manager, save the employee as a manager in the database
 	//setting the employee array to null for now
 	if (isManager) {
 		//still figuring this out
 	}

 	/**
 	 *	Now we must add this employee in their manager's employees list
 	 *	Do a get Manager call based on each manager in the managers array
 	 * 	insert this employee in the manager's employee list
 	 */
 }


 /*
 	Save a team into the database
 	teamID = int 
 	employees = array of strings (emails)
 	managers = array of strings (emails)
 */
 function saveTeam(teamID, employees, managers) {
 	firebase.database().ref('team').push({
 		teamID: teamID,
 		employee: employees,
 		manager: managers
 	});
 }

 /*
 	Save an event into the database
 	email: string (email)
 	eventID: int
 	startDate: string (ex. "08-29-2016")
 	endDate: string (ex. "08-31-2016")
 	vacationType: stirng (vaction or business)
 	eventTitle: string
 	title: string
 	description: string
 */
 function saveEvent(email, eventID, startDate, endDate, vacationType, eventTitle, eventDescription) {
 	firebase.database().ref('event').push({
 		email: email,
 		eventID: eventID,
 		startDate: startDate,
 		endDate: endDate,
 		type: vacationType,
 		title: eventTitle,
 		description: eventDescription
 	});
 }

 /*
 	Save holidays in the database
 	holidayArray = array of strings of all base holidays to not count towards vacation days
 	already hard coded into database
 */
 function saveHoliday(holidayArray) {
 	firebase.database().ref('holiday').push({
 		day: holidayArray
 	});
 }




 function addUser(email,password) {
 	// [START createwithemail]
 	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
 		// Handle Errors here.
 		var errorCode = error.code;
 		var errorMessage = error.message;
 		// [START_EXCLUDE]
 		if (errorCode == 'auth/weak-password') {
 			alert('The password is too weak.');
 		} else {
 			alert(errorMessage);
 		}
 		console.log(error);
 		// [END_EXCLUDE]
 	});
 	// [END createwithemail]
 }