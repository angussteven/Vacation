
// Vacation //
function bookVacation(userID, startDate, endDate){
	// Create a new event

	// Remove appropriate vacation days from employee
}
function getAllVacation(userID){
	// Get all the vacation days for a given employee
}
function deleteVacation(eventID){
	// Delete the event via the eventID

	// Give the employee back their vacation days
}

// Employee //
function addEmployee(firstName, lastName, emailAddress, totalVacation, manager, isManager, teamID){

	// Check the DB to see if the email already exists

	// Create a new employee. Just messing around with creating JSON object right now
	var newEmployee = {
		"firstName": firstName,
		"lastName": lastName,
		"emailAddress": emailAddress,
		"totalVacation": totalVacation,
		"usedVacation": 0,
		"manager": manager,
		"isManager": isManager,
		"teamID": teamID
	}

	if(isManager){
		// Do stuff here if the new employee is a manager
	}
}

function getEmployee(userID, emailAddress){
	// Get the employee from the DB using either email address or userID
}

function updateEmployee(userID, firstName, lastName, emailAddress, totalVacation, usedVacation, manager, isManager, teamID){
	// Update the employee with the given userID
}

// Team //
function addToTeam(userID, teamID){
	// Add employee to team
}

function removeFromTeam(userID, teamID){
	// Remove employee from a team
}

function getTeam(teamID){
	// Get all the employees that are on a team
}

// Manager //
function getEmpManager(userID){
	// Get the employee info for the user's manager
}

function getTeamManager(teamID){
	// Get the manager for the team
}

// Holiday
function getHolidays(year){
	// Get the holiday events for a given year
}