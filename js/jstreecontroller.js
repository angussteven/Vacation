/*
* Generate the HTML elements needed to create the tree and populate them with the json data
*/
$(document).ready(function() {
	/*
	* Call the function that creates the HTML objects and adds the json data to them.
	*/
	populateList();

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
		}
	});
});

/*
* This function takes json data as an argument and uses that data to populate the tree dynamically.
*/
function populateList() {
	/*
	* Get team information from session
	*/
	var data = sessionStorage.getItem('user');
	var userData = JSON.parse(data);
	var team = sessionStorage.getItem('teamEmployees');
	var teamData = JSON.parse(team);

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
