/*
 * Keeps track the events that are currently visible on the calendar.
 */
var activeEvents = [];
var activeEmployees = [];

function test(teamData) {
    $('#container').on('click', 'a', function(e) {
        e.stopPropagation();
        var bgID = $(this).css("background-color");
        var manager;
        var employees;

        console.log("Selected: " + this.parentNode.id);
        if ($.inArray(this.id.toString(), activeEmployees) != -1) {
            /*
			* If the manager is selected then remove all events from the calendar.

			if ($(this).attr('class').indexOf('manager') > -1) {
				manager = document.getElementById(this.parentNode.id);
				employees = manager.getElementsByTagName("li");
				for (var i = 0; i < employees.length; i++) {
					removeEmployeeEvents(teamData[employees[i].id].email);
				}
			}
            */
            document.getElementById(this.id.toString()).style.color = "#ffffff";
            popEmployee(this.id);
            removeEmployeeEvents(teamData[this.parentNode.id].email);
        } else {

            /*
            * If a manager is selected highlight the employees that currently have
            * events in the calendar.
            */
            if (this.parentNode.className.indexOf("manager") != -1) {
                highlightSelected();
            }
            document.getElementById(this.id.toString()).style.color = "#76a1cf";
            renderEmployeeEvents(teamData[this.parentNode.id].email);
            pushEmployee(this.id);
        }
        /*
        console.log("Employee Selected: " + this.parentNode.id.toString());
        cofnsole.log("Active Employees: ");
        console.log(activeEmployees);
        console.log("Active Events: ");
        console.log(activeEvents);
        */
    });
    /*
    * If the arrow is clicked highlight employees with events in the calendar.
    */
    $('#container').on('click', 'i', function(e) {
        highlightSelected();
    });
}
/*
* Highlights every employee in the tree that is currently in the activeEmployees array.
*/
function highlightSelected(currentManager) {
  var currentNode;
  try {
    for (var employee in activeEmployees) {
      currentNode = document.getElementById(activeEmployees[employee]);
      /*
      * If the node selected is under a manager other than the current one it will be null
      * those nodes are ignored.
      */
      if (currentNode != null) {
        currentNode.style.color = "#76a1cf";
      }
    }
  } catch (error) {
    console.log("Error: " + error);
    console.log("Tree may be collapsed");
  }
}
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
    promise = getEmployeeEvents(employeeID.toString()).then(function(data) {
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
    }).catch(function(error) {
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
    getEmployeeEvents(employeeID.toString()).then(function(data) {
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
                    id: realData[currentEvent].eventID,
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
    }).catch(function(data) {
        console.log("No events found for: " + employeeID);
    });
}
/*
 * This function takes json data as an argument and uses that data to populate the tree dynamically.
 */
function populateList(teamData) {
    /*
     * These vaiables hold the different HTML objects that we insert into the HTML file.
     */
    var unorderedList = document.createElement('ul');
    var manager;
    var managerNode;
    var employee;
    var nestedList;
    /*
     * The first for loop gets the manager and addes it as a child of the container div.
     */
    for (var key in teamData) {
        if (teamData[key].isManager) {
            manager = document.createElement('li');
            manager.appendChild(document.createTextNode(capitalize(teamData[key].firstName) + " " + capitalize(teamData[key].lastName)));
            manager.setAttribute('id', key.toString());
            manager.setAttribute('class', 'manager');
            nestedList = document.createElement('ul');
            /*
             * This second for loop creates an HTML element for every team member which are then added
             * as a child of the manager.
             */
            for (var person in teamData) {
                if (!teamData[person].isManager && teamData[person].managers == teamData[key].email) { //$.inArray(teamData[key].employees, != -1)) {
                    employee = document.createElement('li');
                    employee.appendChild(document.createTextNode(capitalize(teamData[person].firstName) + " " + capitalize(teamData[person].lastName)));
                    employee.setAttribute('id', person.toString());
                    nestedList.appendChild(employee);
                }
            }
            /*
             * The current is then added as a child to thye root unorderded list.
             */
            unorderedList.appendChild(manager);
            manager.appendChild(nestedList);
        }
    }
    /*
     * The unordered list is added as a child of the container div.
     */
    document.getElementById("container").appendChild(unorderedList);
}
/*
 * This function capilizes the first letter of the string passed in.
 */
function capitalize(string) {
    try {
        return string[0].toUpperCase() + string.slice(1);
    } catch (error) {
        return "Returned Null";
    }
}
/*
* Inserts an employees dom ID into the active employees array.
*/
function pushEmployee(domID) {
    activeEmployees.push(domID.toString());
}
/*
* Removes an employees dom ID from the active employees array.
*/
function popEmployee(domID) {
  activeEmployees.splice(activeEmployees.indexOf(domID.toString()), 1);
}
