/*
* Get team information from session
*/


/*
* Keeps track the events that are currently visible on the calendar.
*/
var activeEvents = [];
var activeEmployees = [];

function test(teamData){
	$('ul').on('click', 'li', function(e){
		e.stopPropagation();
		var bgID = $(this).css("background-color");
		var manager;
		var employees;

		if ($.inArray(this.id.toString(), activeEmployees) != -1) {
			/*
			* If the manager is selected then remove all events from the calendar.
			*/
			if ($(this).attr('class').indexOf('manager') > -1) {
				manager = document.getElementById(this.id);
				employees = manager.getElementsByTagName("li");
				for (var i =0; i < employees.length; i++) {
					removeEmployeeEvents(teamData[employees[i].id].email);
				}
			}
			activeEmployees.splice(activeEmployees.indexOf(this.id.toString(), 1));
			removeEmployeeEvents(teamData[this.id].email);
		}
		else {
			/*
			* If the manager is selected populate the calendar with everyones events.
			*/
			if ($(this).attr('class').indexOf('manager') > -1) {
				manager = document.getElementById(this.id);
				employees = manager.getElementsByTagName("li");
				for (var i =0; i < employees.length; i++) {
					renderEmployeeEvents(teamData[employees[i].id].email);
				}
			}
			activeEmployees.push(this.id.toString());
			renderEmployeeEvents(teamData[this.id].email);
		}
	});
}

/*
* Generate the HTML elements needed to create the tree and populate them with the json data.
*/
$(document).ready(function() {
	/*
	* Call the function that creates the HTML objects and adds the json data to them.
	*/

	/*
	* Populate calendar with the current users events.
	*/
	/*
	* Get the HTML object were we want to create the tree.
	*/


    // $("#container").bind("select_node.jstree", function (e, data) {
 	// 	$("#container").jstree("toggle_node", data.rslt.obj);
 	// 	$("#container").jstree("deselect_node", data.rslt.obj);
	// })

	/*
	* This changed the background color of the items in the tree to make them appear selected
	*/

});

/*
* This function removed the events from a calendar belonging to the employee that was deselected.
* It takes that persons employeeID as an argument.
*/
function removeEmployeeEvents(employeeID) {
	// Local Variables
	var promise;
	var event;
	/*
	* The promise is used to make sure that we have data back from the database before we continue
	* with the function.
	*/
	promise = getEmployeeEvents(employeeID.toString()).then(function (data) {
		/*
		* We iterate over the events belonging to an employee.
		*/
		for (var currentEvent in data) {
			/*
			* These events are then checked against the local array and if its there it is removed.
			*/
			if ($.inArray(data[currentEvent].eventID.toString(), activeEvents) != -1) {
				activeEvents.splice(activeEvents.indexOf(data[currentEvent].eventID.toString()), 1);
				$('#calendar').fullCalendar('removeEvents', data[currentEvent].eventID.toString());
			}
		}
	}).catch(function(error){
		console.log(error);
	});
}

/*
* This function displays all of the events belonging to a given employee. It takes the employeeID
* as an argument.
*/
function renderEmployeeEvents(employeeID) {
	// Local variables.
	var promise;
	var event;
	var dataResult;
	/*
	* The promise is used to make sure that we have data back from the database before we continue
	* with the function.
	*/
	getEmployeeEvents(employeeID.toString()).then(function (data) {
		dataResult = JSON.stringify(data);
		realData = JSON.parse(dataResult);
		/*
		* Every event returned from the database is added into our local array.
		*/
		for (var currentEvent in realData) {
			/*
			* If the event is already in the array we don't save it again.
			*/
			if ($.inArray(realData[currentEvent].eventID.toString(), activeEvents) == -1) {
				/*
				* The event is saved as a key-pair value array.
				*/
				event = {
					owner: employeeID,
					id:  realData[currentEvent].eventID,
					title: realData[currentEvent].title,
					start: realData[currentEvent].startDate,
					end: realData[currentEvent].endDate,
					description: realData[currentEvent].description
				};
				/*
				* We use the eventID to keep track of currently rendered events so that is 
				* saved into the array.
				*/
				activeEvents.push(realData[currentEvent].eventID.toString());
				/*
				* The current event is then rendered using the information in the event 
				* variable.
				*/
				$('#calendar').fullCalendar('renderEvent', event, true);
			}
			
		}
	}).catch(function (data) {
		console.log("No events found for: " + employeeID);
	});
};

/*
* This function takes json data as an argument and uses that data to populate the tree dynamically.
*/
function populateList(teamData) {
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
			manager.appendChild(document.createTextNode(capitalize(teamData[key].firstName) + " " + capitalize(teamData[key].lastName)));
			manager.setAttribute('id', key.toString());
			manager.setAttribute('class', 'manager');
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
