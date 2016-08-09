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
var teamsEmployees;
var keyToObject ;

// Implementation of getEmployeeCount
var getEmpCountTest = $.Deferred(getEmployeeCount);
getEmpCountTest.done(function(data){
  console.log("Employee Count: " + employeeCount);
});

// Implementation of getEmployeeCount
var getTeamCountTest = $.Deferred(getTeamCount);
getTeamCountTest.done(function(data){
  console.log("Team Count: " + teamCount);
});

// Implementation of getAllTeams
var getAllTeamsCallback = $.Deferred(getAllTeams);
getAllTeamsCallback.done(function(data){
	console.log("All da teams: ");
	console.log(allTeams);
});

// Implementation of getEmployee
var getEmployeeCallback = $.Deferred(getEmployee("andrew.moawad@gm.com"));
getEmployeeCallback.done(function(data){
	if(employee == null){
		console.log("No employee found");
	}else{
		console.log("Name: " + employee.firstName + " " + employee.lastName);
		console.log("Email: " + employee.email);
		console.log("Total Vacation Days: " + employee.totalVacationDays);
		console.log("Remaining Vacation Days: " + employee.daysLeft);
	}
});

// Implementation of getEmployeesOnTeam
var getEmployeesOnTeamCallback = $.Deferred(getEmployeesOnTeam("quantum"));
getEmployeesOnTeamCallback.done(function(data){
	if(teamsEmployees == null){
		console.log("Team has no employees");
	}else{
		console.log(teamsEmployees);
	}
});

// Implementation of getTeam
var getTeamCallback = $.Deferred(getTeam("quantum"));
getTeamCallback.done(function(data){
	if(team == null){
		console.log("No team found.");
	}else{
		console.log(team);
	}
})



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
 //saveEmployee("zach","dicino",15,15,"quantum",["michael.eilers@gm.com","manager2@gm.com"],[1],false,"zachary.dicino@gm.com","1234");
 //saveEmployee("manager","manager",15,15,1,["managersboss@gm.com"],[1],true,"manager2@gm.com","1234");
 //saveManager("michael.eilers@gm.com",["zachary.dicino@gm.com"],"michael.eilers@gm.com");
 //saveTeam(1,["zachary.dicino@gm.com"],["michael.eilers@gm.com"],"Quantum");
 //saveEvent("zachary.dicino@gm.com",3,"08-29-2016","08-31-2016","business","vacation I need time","why");
 //saveHoliday(["01-01-2016","01-18-2016","03-25-2016","03-28-2016","05-30-2016","07-04-2016","09-05-2016","11-08-2016","11-11-2016","11-24-2016","11-25-2016","12-26-2016","12-27-2016","12-28-2016","12-29-2016","12-30-2016"]);

// Events //

// Adds a new event [TODO]
function addEvent(userID, startDate, endDate, title, description, alert, isBusiness, vacationUsed){
	// Create a new event

	// Remove appropriate vacation days from employee
}

// Deletes an event [UNKNOWN]
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

// Gets all the events for a given employee [TODO]
function getEmployeeEvents(userID){
	// Get all the vacation days for a given employee
	var ref = firebase.database().ref.child('event');
	ref.on('value', function(snapshot){
		console.log(snapshot.val());
	});
}

// Get all the events for the employees of a given team [TODO]
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
 // Add a new employee to the db [UNTESTED]
 function saveEvent(email, eventID, startDate, endDate, vacationType,
 					  eventTitle, eventDescription) {
 	var tempEmail = fixEmail(email);
 	firebase.database().ref('event/' + tempEmail).set({
 		email: email,
 		eventID: eventID,
 		startDate: startDate,
 		endDate: endDate,
 		type: vacationType,
 		title: eventTitle,
 		description: eventDescription
 	});
 }

 // Updates a given event [TODO]
function updateEvent(){
	// Update the information for an event
}



// Get the employee with matching email
 	/*ref.orderByChild("email").equalTo(emailAddress).once('value', function(snapshot) {

	// Get the employee with matching email
 	ref.orderByChild("email").equalTo(emailAddress).once('value', function(snapshot) {
 		if(snapshot.val() != null){
 			console.log(snapshot.val());
 			var id = Object.keys(snapshot.val()).toString();
 			console.log(id);
 			var empObject = snapshot.child(id).val();
 			employee = empObject;
 		}else{
 			console.log("No Employee Returned");
 		}
 		getEmployeeCallback.resolve();
 	})*/

// Gets the total number of employees in a database (included managers) [DONE]
 function getEmployeeCount() {
 	var count = 0;
 	var ref = firebase.database().ref().child('employee');
 	ref.on('value', function(snapshot) {
 		employeeCount = snapshot.numChildren();
 		getEmpCountTest.resolve();
 	});
 }

// Gets all the employees that are on a given team
function getEmployeesOnTeam(teamName){
	// Get all the employees that are on a team

	var ref = firebase.database().ref().child('employee');
	ref.orderByChild("team").equalTo(teamName.toLowerCase()).once('value', function(snapshot){
		if(snapshot.exists()){
			teamsEmployees = snapshot.val();
		} else{
			teamEmployees = null;
		}
		getEmployeesOnTeamCallback.resolve();
	})

}

/*
 	Save an employee into the database [DONE]
 	totalVacation = int
 	daysLeft = int
 	teamName = string 
 	managers = array of strings
 	events = array of ints (ids)
 	isManager = bool
 	employees = array of strings (emails) default null for now
 	everything else string
 */
 function saveEmployee(firstname, lastname, totalVacation, daysleft,
 						teamName, managers, events, isManager, email, password) {
 	var tempEmail = fixEmail(email);
 	firebase.database().ref('employee/' + tempEmail).set({
 		firstName: firstname,
 		lastName: lastname,
 		totalVacationDays: totalVacation,
 		daysLeft: daysleft,
 		team: teamName,
 		managers: managers,
 		events: events,
 		isManager: isManager,
 		email: email,
 		password: password,
 		employees: null
 	});

 	/**
 	 *	Now we must add this employee in their manager's employees list
 	 *	Do a get Manager call based on each manager in the managers array
 	 * 	insert this employee in the manager's employee list
 	 */
	for(var i = 0; i < managers.length; i++){
		addEmpToManager(managers[i],email);
	}

	/**
	*	Now we must add the employee to their team 
	*/
	if(isManager){
		addManagerToTeam(email, teamName);
	}else{
		addEmpToTeam(email, teamName);
	}


 }

 function addEmpToManager(managerEmail, email){
	var tempEmail = fixEmail(managerEmail);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('employees').push(email);
 }


function addEmpToTeam(email, teamName){
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('team').child(teamName.toLowerCase()).child('employee').push(email);
}

function addManagerToTeam(email, teamName){
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('team').child(teamName.toLowerCase()).child('manager').push(email);
}


// Update the employee with the given userID [UNKNOWN]
function updateEmployee(userID, firstName, lastName, emailAddress, totalVacation, usedVacation, manager, isManager, teamID){

  //managers[managers.length()] = manager;
  var tempData = {
    firstName: firstName,
    lastName: lastName,
    email: emailAddress,
    totalVacationDays: totalVacation,
    daysLeft: totalVacation - usedVacation,
    //managers: managers,
    isManager: isManager,
    team: teamID
  };
  var updates = {};
  updates[userID] = tempData;
  return firebase.database().ref('employee').update(updates);

  // Test for updateEmployee (successful):
  //	updateEmployee("andrewmoawadgmcom", "andrew", "moawad", "andrew.moawad@gm.com", 100, 50, "michael.eilers@gm.com", true, 1);
}

// Team //
// Add a new team to the database [TODO]
function addTeam(teamName){

}



// Pushes all team names to a string array [DONE]
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

// Returns a team with a given name [DONE]
function getTeam(teamName){
	var ref = firebase.database().ref().child('team/' + teamName);
	ref.once('value', function(snapshot){
		if(snapshot.exists()){
			team = snapshot.val();
		}
		else{
			team = null;
		}
		getTeamCallback.resolve();
	})
}

// Gets the total number of teams in the database [DONE]
function getTeamCount() {
 	var ref = firebase.database().ref().child('team');
 	ref.on('value', function(snapshot) {
 		teamCount = snapshot.numChildren();
 		getTeamCountTest.resolve();
 	});
}

// Removes employee from team [Andrew]
	function removeEmpFromTeam(userID, teamName){
	var refs = firebase.database().ref().child('team').child(teamName);
	var employeeIndex;
	refs.child('employee').once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot){
			 	if(childSnapshot.val().toString() === userID)
 				{
 				
 					employeeIndex = childSnapshot.getKey();
 				}
 			});	
		refs.child('employee').child(employeeIndex).remove();
	});
	var userIDWithoutSpecial = userID.replace(/[^a-zA-Z ]/g, "");
	var empRef = firebase.database().ref().child('employee').child(userIDWithoutSpecial).child('team');
	empRef.remove();


}


/*
 	Save a team into the database [UNTESTED]
 	teamID = int
 	employees = array of strings (emails)
 	managers = array of strings (emails)
 */
function saveTeam(teamID, employees, managers, teamName) {
	firebase.database().ref('team/' + teamName).set({
		teamID: teamID,
		employee: employees,
		manager: managers,
		name: teamName
	});
}

// Does all the necessary steps to move employee from one team to another [TODO]
function switchTeams(emailAddress, fromTeamID, toTeamID){

}

// Manager //
// Get the manager that oversees given employee email [TODO]
function getEmpManager(emailAddress){
	// Get the employee info for the user's manager
}

// Get the managet that oversees a given team [TODO]
function getTeamManager(teamName){
	// Get the manager for the team
}

// User
//This method will add the user to the User table(firebase), and also store the rest of the information in the database [UNTESTED]
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

// Saves a user in the database [TODO]
function saveUsertoDatabase(mail, password,firstName,lastName,totalVacationDays
					,dayslefts,isManager,managers,team,employees,pathToPicture,
					title){

	console.log(email,password);
}

// Misc
// Function takes 2 dates and returns inclusive number of business days (no weekends/holidays)
function calculateVacationDays(start_date, end_date){
  /*
  Based off of Suitoku's formula.js library NETWORKDAYS function, license info:
  Copyright (c) 2014 Sutoiku, Inc. - MIT License (below)
  Other libraries included:
  BESSELI, BESSELJ, BESSELK, BESSELY functions:
  Copyright (c) 2013 SheetJS - MIT License (below)
  The MIT License (MIT)
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

    // call parseData to take inputs and convert to Date object
    start_date = parseDate(start_date);
    start_date = validStart(start_date);
    end_date = parseDate(end_date);

    // contants for weekends and holidays; holiday array should include all company holidays in string format "MM-DD-YYYY"
    weekend = [6,0]; // don't change this
    holidays = ["09-05-2016","11-08-2015","11-11-2016","11-24-2016","11-25-2016","12-26-2016","12-27-2016","12-28-2016","12-29-2016","12-30-2016"];

    // for loop parses holiday array into Date objects
    for (var i = 0; i < holidays.length; i++) {
      var h = parseDate(holidays[i]);
      holidays[i] = h;
    }

    // variables used in calculations
    var days = (end_date - start_date) / (1000 * 60 * 60 * 24) + 1;
    var total = days;
    var day = start_date;

    // for loop iterates for each day and decrements the total for each holiday or weekend day
    for (i = 0; i < days; i++) {
      var d = (new Date().getTimezoneOffset() > 0) ? day.getUTCDay() : day.getDay();
      var dec = false;
      if (d === weekend[0] || d === weekend[1]) {
        dec = true;
      }
      for (var j = 0; j < holidays.length; j++) {
        var holiday = holidays[j];
        if (holiday.getDate() === day.getDate() &&
          holiday.getMonth() === day.getMonth() &&
          holiday.getFullYear() === day.getFullYear()) {
          dec = true;
          break;
        }
      }
      if (dec) {
        total--;
      }
      day.setDate(day.getDate() + 1);
    }
    return total;
  };

  // function checks if start date has passed; if so, today's date is returned
  function validStart(date) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    if(day < 10)
      day = '0' + day;
    if(month < 10)
      month = '0' + month;
    today = month + '-' + day + '-' + year;
    today = parseDate(today);

    if(date.getTime() < today.getTime())
      return today;
    else
      return date;
  }

  // function takes input and returns a Date object
  function parseDate(date) {
    if (!isNaN(date)) {
      if (date instanceof Date) {
        return new Date(date);
      }
      var d = parseInt(date, 10);
      if (d < 0) {
        return null;
      }
      if (d <= 60) {
        return new Date(d1900.getTime() + (d - 1) * 86400000);
      }
      return new Date(d1900.getTime() + (d - 2) * 86400000);
    }
    if (typeof date === 'string') {
      date = new Date(date);
      if (!isNaN(date)) {
        return date;
      }
    }
    return null;
  };


// TRakes an email and returns the email with no special characters [DONE]
function fixEmail(tempEmail){
	var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
	return result;
}
