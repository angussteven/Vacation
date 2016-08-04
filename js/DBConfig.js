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
 function getEmployeeCount() {
 	return 0;
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
	everything else string	
*/

function saveEmployee(firstname, lastname, totalVacation, daysleft, 
						teamID, managers, events, isManager, email, password){
	firebase.database().ref('employee').push({
		firstName: firstname,
		lastName: lastname,
		totalVacationDays: totalVacation,
		daysLeft: daysleft,
		team: teamID,
		manager: managers,
		event: events,
		isManager: isManager,
		email: email,
		empID: email,
		password: password
	});

	//if you are a manager, save the employee as a manager in the database
	//setting the employee array to null for now
	if(isManager){
		saveManager(email, email, null);
	}

	/**
	*	Now we must add this employee in their manager's employees list
	*	Do a get Manager call based on each manager in the managers array
	* 	insert this employee in the manager's employee list
	*/
}

/*
	Save a manager into the database
	email = string
	employees = array of strings (emails) 
	managerID = string (email)
*/
function saveManager(managerID, email, employees){
	firebase.database().ref('manager').push({
		email: email,
		employee: employees,
		manID: managerID
	});
}

/*
	Save a team into the database
	teamID = int 
	employees = array of strings (emails)
	managers = array of strings (emails)
*/
function saveTeam(teamID, employees, managers){
	firebase.database().ref('team').push({
		teamID: teamID,
		employee: employees,
		manager: managers
	});
}

/*
	Save an event into the database
	employeeID: string (email)
	eventID: int
	startDate: string (ex. "08-29-2016")
	endDate: string (ex. "08-31-2016")
*/
function saveEvent(employeeID, eventID, startDate, endDate){
	firebase.database().ref('event').push({
		empID: employeeID,
		evID: eventID,
		startDate: startDate,
		endDate: endDate
	});
}

/*
	Save holidays in the database
	holidayArray = array of strings of all base holidays to not count towards vacation days
	already hard coded into database
*/
function saveHoliday(holidayArray){
	firebase.database().ref('holiday').push({
		day: holidayArray
	});
}
