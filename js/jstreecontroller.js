/*
*	 Test json data used to test the dynamic population of the tree module
*/
var testData = [ {"firstName" : "Michael", "lastName" : "Eilers",
				"team" : [
						{"firstName" : "Jordan", "lastName" : "Boyce"},
						{"firstName" : "Kyle", "lastName" : "Cook"},
						{"firstName" : "Brett", "lastName" : "Reardon"},
						{"firstName" : "Justin", "lastName" : "Valenzuela"},
						{"firstName" : "Nikolas", "lastName" : "Barkley"},
						{"firstName" : "Luis", "lastName" : "Valenzuela"},
						{"firstName" : "Andrew", "lastName" : "Moawad"},
						{"firstName" : "Luis", "lastName" : "Alcantar"},
						{"firstName" : "Zachary", "lastName" : "Dicino"},
						{"firstName" : "Robert", "lastName" : "Kasper"},
						{"firstName" : "Steven", "lastName" : "Angus"}
						]
				},
				{"firstName" : "John", "lastName" : "Rock", 
				"team" : [
						{"firstName" : "Jordan", "lastName" : "Boyce"},
						{"firstName" : "Kyle", "lastName" : "Cook"},
						{"firstName" : "Brett", "lastName" : "Reardon"},
						{"firstName" : "Justin", "lastName" : "Valenzuela"},
						{"firstName" : "Nikolas", "lastName" : "Barkley"},
						{"firstName" : "Luis", "lastName" : "Valenzuela"},
						{"firstName" : "Andrew", "lastName" : "Moawad"},
						{"firstName" : "Luis", "lastName" : "Alcantar"},
						{"firstName" : "Zachary", "lastName" : "Dicino"},
						{"firstName" : "Robert", "lastName" : "Kasper"},
						{"firstName" : "Steven", "lastName" : "Angus"}
						]
				}	
				];
/*
* Generate the HTML elements needed to create the tree and populate them with the json data
*/
$(document).ready(function() {
	/*
	* Call the function that creates the HTML objects and adds the json data to them.
	*/
	populateList(testData);

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
		console.log("color: " + id);
		if (id == 'rgba(194, 218, 218, 0.458824)') {
			$(this).css('background-color', 'rgba(0, 0, 0, 0)');
		}
		else {
			$(this).css('background-color', 'rgba(194, 218, 218, 0.46)');
		}
    	console.log("id: " + this.id);

	});

	
});

/*
* This function takes json data as an argument and uses that data to populate the tree dynamically.
*/
function populateList(data) {
	/*
	* These vaiables hold the different HTML objects that we insert into the HTML file.
	*/
	var unorderedList = document.createElement('ul');
	var manager;
	var employee;
	var nestedList;

	/*
	* The first for loop gets the manager and addes it as a child of the container div. 
	* The id of the div should probably be passed in as an argument instead of having it
	* hardcoded.
	*/
	for (var i = 0; i < data.length; i++) {
		manager = document.createElement('li');
		manager.appendChild(document.createTextNode(data[i].firstName + " " + data[i].lastName));
		nestedList = document.createElement('ul');
		manager.appendChild(nestedList);

		/*
		* This second for loop creates an HTML element for every team member which are then aded
		* as a child to their correspoding manager.
		*/
		for (var j = 0; j < data[i].team.length; j++) {
			employee = document.createElement('li');
			employee.appendChild(document.createTextNode(data[i].team[j].firstName + " " + data[i].team[j].lastName));
			nestedList.appendChild(employee);
		}
		/*
		* The current manager is then added as a child to thye root unorderded list.
		*/
		unorderedList.appendChild(manager);
	}
	/*
	* The unordered list is then added as a child of the container div.
	*/
	document.getElementById("container").appendChild(unorderedList);

};
