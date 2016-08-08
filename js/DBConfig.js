 // Initialize Firebase
 var config = {
 	apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
 	authDomain: "vacationtracker-5d242.firebaseapp.com",
 	databaseURL: "https://vacationtracker-5d242.firebaseio.com",
 	storageBucket: "vacationtracker-5d242.appspot.com",
 };
 firebase.initializeApp(config);

var employeeCount = 0;
var teamCount = 0;
var allTeams = [];
var team;
var employee;

var hiddenEmpField = $('#employeeCount');
console.log("Start");


// Implementation of getEmployeeCount
var getEmpCountTest = $.Deferred(getEmployeeCount);
getEmpCountTest.done(function(data){
  console.log("Employee Count: " + employeeCount);
  //hiddenEmpField.value = employeeCount; // use jQuery or we can use document.getElementByID("employeeCount").value = employeeCount
  //console.log("Hidden Emp Field Value: " + employeeCount);
});

// Implementation of getEmployeeCount
var getTeamCountTest = $.Deferred(getTeamCount);
getTeamCountTest.done(function(data){
  console.log("Team Count: " + teamCount);

});

var getAllTeamsCallback = $.Deferred(getAllTeams);
getAllTeamsCallback.done(function(data){
	console.log("All da teams: ");
	console.log(allTeams);
});

var getTeamCallback = $.Deferred(getTeam);
getTeamCallback.done(function(data){
	console.log("Team: " + team);
});

var getEmployeeCallback = $.Deferred(getEmployee);
getEmployeeCallback.done(function(data){
	console.log("Employee: " + employee);
});
 /*Get reference example=*/
 /*var value;
 var dbRef = firebase.database().ref().child('employee');
 dbRef.on('value', function(snapshot) {
 	console.log(snapshot.val());
 });*/

 //example of how to call the getEmployeeCount function
 // getEmployeeCount().then(function(count) {
 // 	console.log(count)
 // });
//deleteEvent(2);
 //saveEmployee("andrew","moawad",15,15,1,["michael.eilers@gm.com"],[1],true,"andrew.moawad@gm.com","1234");
 //saveManager("michael.eilers@gm.com",["zachary.dicino@gm.com"],"michael.eilers@gm.com");
 //saveTeam(1,["zachary.dicino@gm.com"],["michael.eilers@gm.com"]);
 //saveEvent("zachary.dicino@gm.com",3,"08-29-2016","08-31-2016","business","vacation I need time","why");
 //saveHoliday(["01-01-2016","01-18-2016","03-25-2016","03-28-2016","05-30-2016","07-04-2016","09-05-2016","11-08-2016","11-11-2016","11-24-2016","11-25-2016","12-26-2016","12-27-2016","12-28-2016","12-29-2016","12-30-2016"]);
 
// Events //
function addEvent(userID, startDate, endDate, title, description, alert, isBusiness, vacationUsed){
	// Create a new event

	// Remove appropriate vacation days from employee
}
var keyToObject ;

function deleteEvent(eventID){
	
	var ref = firebase.database().ref().child('event');	
	ref.orderByChild("eventID").equalTo(eventID).on('value', function(snapshot) {
 	keyToObject = Object.keys(snapshot.val()).toString();
 	ref.child(keyToObject).remove();
 	//snapshot.ref().remove();
 });
	
	 //ref.remove();
	// Delete the event via the eventID
}

function getEmployeeEvents(userID){
	// Get all the vacation days for a given employee
}

function getTeamEvents(teamID){
	// Get all the vacation days for all employees in a given team
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
 function saveEvent(email, eventID, startDate, endDate, vacationType, 
 					  eventTitle, eventDescription) {
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
function updateEvent(){
	// Update the information for an event
}

// Employee //

function getEmployee(userID, emailAddress){
	// Get the employee from the DB using either email address or userID
	var ref = firebase.database().ref().child('employee');

 	ref.on('value', function(snapshot) {
 			console.log(snapshot.val());
 			snapshot.forEach(function(childSnapshot){
 				console.log("Team ID: " + childSnapshot.child('team').val());
 			});

 		getEmployeeCallback.resolve();
 	});

 	//ref.orderByChild("email").equalTo(emailAddress).on('value', function(snapshot) { console.log(snapshot.val());})
}

// Try this from andrew: ref.orderByChild("eventID").equalTo(2).on('value', function(snapshot) { 

/*
	getEmployeeCount(), this method returns the
	total number of employees in the database 
*/
 function getEmployeeCount(jQueryObject) {
 	var count = 0;
 	var ref = firebase.database().ref().child('employee');
 	ref.on('value', function(snapshot) {
 		count = snapshot.numChildren();
 		employeeCount = count;
 		getEmpCountTest.resolve();
 	});
 }

function getEmployeesOnTeam(teamID){
	// Get all the employees that are on a team
}

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

function updateEmployee(userID, firstName, lastName, emailAddress, totalVacation, usedVacation, manager, isManager, teamID){
	// Update the employee with the given userID
}

// Team //
function addTeam(teamName){

}

function addEmpToTeam(userID, teamID){
	// Add employee to team
}

function getAllTeams(){
	// Get all the teams 
	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {
 		snapshot.forEach(function(childSnapshot){
 				allTeams.push(childSnapshot.child("name").val());
 			});



 		getAllTeamsCallback.resolve();
 	});
}

function getTeam(teamID){
	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {

 		// TODO 


 		getTeamCallback.resolve();
 	});
}

/*
  getTeamCount(), this method returns the
  total number of teams in the database 
*/
 function getTeamCount() {
 	var count = 0;
 	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {
 		count = snapshot.numChildren();
 		teamCount = count;
 		getTeamCountTest.resolve();
 	});
 }

function removeEmpFromTeam(userID, teamID){
	var refs = firebase.database().ref().child('team');
	var parent;	
	var child;
	refs.orderByChild("teamID").equalTo(5).on('value', function(snapshot) {
 	//ref.remove();
 	parent = Object.keys(snapshot.val());
 	console.log(snapshot.val());
 	console.log("this is the parent of that table:" + parent)
 	snapshot.forEach(function(childSnapshot){
 				//console.log("Team ID: " + childSnapshot.child('employee').val());
 				console.log(childSnapshot.val());
 				 	childSnapshot.child('employee').forEach(function(grandchildSnapshot){
 				//console.log("Team ID: " + childSnapshot.child('employee').val());
 				console.log(grandchildSnapshot.val() + " in grand child \n");
 				if(grandchildSnapshot.val().toString() === userID)
 				{
 					child = Object.keys(grandchildSnapshot.val());
 					console.log(grandchildSnapshot);
 					//works but deleted the wrong child 
 					//refs.child(parent.toString()).child("employee").child(child[0].toString()).remove();
 				}
 			});
 			});
 	// keyToObject = Object.keys(snapshot.val()).toString();
 	// ref.child(keyToObject).remove();
 	//snapshot.ref().remove();
 });
	
	 //ref.remove();
	// Delete the event via the eventID
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

function switchTeams(userID, fromTeamID, toTeamID){

}

// Manager //
function getEmpManager(userID){
	// Get the employee info for the user's manager
}

function getTeamManager(teamID){
	// Get the manager for the team
}


// Holiday
function getHolidays(startDate, endDate){
	// Get the holiday events within a given start and end date
}

/*
 	Save holidays in the database
 	holidayArray = array of strings of all base 
 	holidays to not count towards vacation days
 	already hard coded into database
 */
 function saveHoliday(holidayArray) {
 	firebase.database().ref('holiday').push({
 		day: holidayArray
 	});
 }

// User
/*
	 This method will add the user to the User table(firebase),
	 and also store the rest of the information in the database
 */
 function addUser(email, password,firstName,lastName,totalVacationDays
 					,dayslefts,isManager,managers,team,employees,pathToPicture,
 					title) {
 	firebase.auth().createUserWithEmailAndPassword(email, password)
 		.then(function(data) {
 			saveEmployee(firstName, lastName, totalVacationDays, dayslefts, team, managers, "EVENTSSS", isManager, email, "WHY DO WE SAVE PASSWORD??");
 		})
 		.catch(function(error) {
 			var errorCode = error.code;
 			var errorMessage = error.message;

 			if (errorCode == 'auth/weak-password') {
 				console.log(errorCode);
 			} else if (errorCode == 'auth/email-already-in-use') {
 				console.log(errorCode);
 			} else if (errorCode == 'auth/invalid-email') {
 				console.log(errorCode);
 			} else {
 				console.log(errorMessage);
 			}
 		});
 }

 function saveUsertoDatabase(mail, password,firstName,lastName,totalVacationDays
 					,dayslefts,isManager,managers,team,employees,pathToPicture,
 					title){

 	console.log(email,password);
 }

 // Misc
function calculateVacationDays(startDate, endDate){

}