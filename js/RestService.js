
// Vacation //
function addEvent(userID, startDate, endDate, title, description, alert, isBusiness, vacationUsed){
	// Create a new event

	// Remove appropriate vacation days from employee
}
function getEmployeeEvents(userID){
	// Get all the vacation days for a given employee
}

function getTeamEvents(teamID){
	// Get all the vacation days for all employees in a given team
}
function deleteEvent(eventID){
	// Delete the event via the eventID
}
	// Give the employee back their vacation days
function updateEvent(){
	// Update the information for an event
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

function getEmployeesOnTeam(teamID){
	// Get all the employees that are on a team
}

function updateEmployee(userID, firstName, lastName, emailAddress, totalVacation, usedVacation, manager, isManager, teamID){
	// Update the employee with the given userID
}

// Team //
function addNewTeam(teamName){

}

function addEmployeeToTeam(userID, teamID){
	// Add employee to team
}

function removeFromTeam(userID, teamID){
	// Remove employee from a team
}

function switchTeams(userID, fromTeamID, toTeamID){

}

function getAllTeams(){
	// Get all the teams 
}

function getTeam(){

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

// Misc
function calculateVacationDays(startDate, endDate){

}