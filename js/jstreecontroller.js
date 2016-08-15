/*
* Get team information from session
*/
var data = sessionStorage.getItem('user');
var userData = JSON.parse(data);
var team = sessionStorage.getItem('teamEmployees');
var teamData = JSON.parse(team);

/*
* Generate the HTML elements needed to create the tree and populate them with the json data
*/
$(document).ready(function() {
	/*
	* Call the function that creates the HTML objects and adds the json data to them.
	*/
	populateList();
	//renderEmployeeEvents();
	/*
	* Get the HTML object were we want to create the tree
	*/
	$('#container').jstree();

	/*
	* This changed the background color of the items in the tree to make them appear selected
	*/
	$('ul').on('click', 'li', function(e){
		e.stopPropagation();
		var id = $(this).css("background-color");
		if (id == 'rgba(194, 218, 218, 0.458824)') {
			$(this).css('background-color', 'rgba(0, 0, 0, 0)');
		}
		else {
			$(this).css('background-color', 'rgba(194, 218, 218, 0.46)');
			console.log('Selected: ' + this.id);
			renderEmployeeEvents(teamData[this.id].email);

		}
	});
});

/*
* This function renders the event for an employee whose name is selected in the node tree.
*/
function renderEmployeeEvents(employeeID) {
	var promise;
	var event;

	//.log("Current Employee: " + employeeID);
	/*
	* Get the events that belong to the employee selected.
	*/
	promise = getEmployeeEvents(employeeID.toString());
	/*
	* When the data is received iterate over the events and render them in the calendar.
	*/
	promise.done(function (data) {
		//console.log(data);
		for (var currentEvent in data) {
			event = {
				id:  data[currentEvent].eventID,
				title: data[currentEvent].title,
				start: data[currentEvent].startDate,
				end: data[currentEvent].endDate,
				description: data[currentEvent].description
			};
			$('#calendar').fullCalendar('renderEvent', event, true);
        	//alert = $('input:radio[name=alert]:checked').val();
        	//isVacation = $('input:radio[name=isVacation]:checked').val();
		}
	});
	/*
	* If no data is received log it.
	*/
	promise.fail(function (data) {
		console.log("Error: " + data);
	});
};

/*
* This function takes json data as an argument and uses that data to populate the tree dynamically.
*/
function populateList() {
	/*
	* These vaiables hold the different HTML objects that we insert into the HTML file.
	*/
	var unorderedList = document.createElement('ul');
	var manager;
	var employee;
	var nestedList;

	/*
	* The first for loop gets the manager and addes it as a child of the container div. 
	*/
	manager = document.createElement('li');
	for (var key in teamData) {
		if(teamData[key].isManager) {
			console.log("Key: " + key);
			manager.appendChild(document.createTextNode(capitalize(teamData[key].firstName) + " " + capitalize(teamData[key].lastName)));
			manager.setAttribute('id', key.toString());
		}
	}
	nestedList = document.createElement('ul');
	manager.appendChild(nestedList);

	/*
	* This second for loop creates an HTML element for every team member which are then added
	* as a child of the manager.
	*/
	for (var key in teamData) {
		if (!teamData[key].isManager) {
			employee = document.createElement('li');
			employee.appendChild(document.createTextNode(capitalize(teamData[key].firstName) + " " + capitalize(teamData[key].lastName)));
			employee.setAttribute('id', key.toString());
			nestedList.appendChild(employee);
		}
	}
	/*
	* The current is then added as a child to thye root unorderded list.
	*/
	unorderedList.appendChild(manager);

	/* 
	* The unordered list is added as a child of the container div.
	*/
	document.getElementById("container").appendChild(unorderedList);
};

/*
* This function capilizes the first letter of the string passed in.
*/
function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}
