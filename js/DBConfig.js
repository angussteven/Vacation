// Initialize Firebase
var config = {
	apiKey: "AIzaSyAeUUth3tU5auemQujKCmxRE3VS-y4QQxE",
	authDomain: "vacationtracker-5d242.firebaseapp.com",
	databaseURL: "https://vacationtracker-5d242.firebaseio.com",
	storageBucket: "vacationtracker-5d242.appspot.com",
};
firebase.initializeApp(config);

function initialize(profileEmail) {
	getEmployee(profileEmail).then(function (snap) {
		sessionStorage.setItem('user', JSON.stringify(snap));
		document.getElementById("profileName").innerHTML = capitalizeName(snap.firstName) + " " + capitalizeName(snap.lastName);
		document.getElementById("profileTeam").innerHTML = 'Team: ' + snap.team;
		getEmployee(snap.managers).then(function (snapshot) {
			localStorage.setItem("managerFirstName", snapshot.firstName);
			localStorage.setItem("managerLastName", snapshot.lastName);
			document.getElementById("profileManager").innerHTML = 'Manager: ' + capitalizeName(snapshot.firstName) + " " + capitalizeName(snapshot.lastName);
		});
		var vdays = document.getElementById("vacationdays");
		var info = "Total Days: " + snap.totalVacationDays + "<br>Remaining Days: " + snap.daysLeft;
		vdays.innerHTML = info;

		//Update the cache
		localStorage.setItem("firstName", snap.firstName);
		localStorage.setItem("lastName", snap.lastName);
		localStorage.setItem("team", snap.team);
		localStorage.setItem("vacationDays", snap.totalVacationDays);
		localStorage.setItem("daysLeft", snap.daysLeft);
		localStorage.getItem("profileEmail",profileEmail );

		getProfileImage();
	});

	getEmployeeEvents(profileEmail).then(function (snap) {
		employeeEvents = snap;
		sessionStorage.setItem('myEvents', JSON.stringify(employeeEvents));
	}).catch(function (error) {
		console.log(error);
	});

	var dataResult = JSON.parse(data);
	getEmployeesOnTeam(dataResult.team).then(function (snap) {
		sessionStorage.setItem('teamEmployees', JSON.stringify(snap.val()));
	}).catch(function (error) {
		console.log("Team not found.");
	})
}

function capitalizeName(name) {
	try{
		return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	}
	catch(err){
		return name;
	}
}

function getEmployee(emailAddress) {
	return new Promise(function (resolve, reject) {
		var ref = firebase.database().ref().child('employee/' + fixEmail(emailAddress));

		ref.once('value', function (snapshot) {
			if (snapshot.exists()) {
				resolve(snapshot.val());
			}
			else {
				reject();
			}
		})
	})
}

function getEmployeeEvents(emailAddress) {
	return new Promise(function (resolve, reject) {
		var fixedEmail = fixEmail(emailAddress);
		var evRef = firebase.database().ref().child('event');
		evRef.orderByChild("email").equalTo(emailAddress).once('value', function (snapshot) {
			if (snapshot.exists()) {
				resolve(snapshot.val());
			}
			else {
				reject();
			}
		});
	});
}

function getEmployeesOnTeam(teamName) {
	return new Promise(function (resolve, reject) {
		var ref = firebase.database().ref().child('employee');
		ref.orderByChild("team").equalTo(teamName.toLowerCase()).once('value', function (snapshot) {
			if (snapshot.exists()) {
				resolve(snapshot);
			} else {
				reject();
			}
		})
	})
}

// Updates a given event [TODO]
function updateEvent(eventID, email, startDate, endDate, title, type, description) {
	// Update the information for an event
	var tempData = {
		description: description,
		email: email,
		endDate: endDate,
		startDate: startDate,
		title: title,
		type: type
	};
	var updates = {};
	updates[eventID] = tempData;
	return firebase.database().ref('event').update(updates);

}


firebase.auth().onAuthStateChanged(function (user) {
	profileEmail = user.email;

	// // Implementation of getEmployeeCount
	// var getEmpCountTest = $.Deferred(getEmployeeCount);
	// getEmpCountTest.done(function(data){
	// });

	// // Implementation of getEmployeeCount
	// var getTeamCountTest = $.Deferred(getTeamCount);
	// getTeamCountTest.done(function(data){
	// });

	// // Implementation of getAllTeams
	// var getAllTeamsCallback = $.Deferred(getAllTeams);
	// getAllTeamsCallback.done(function(data){
	// });

	// // Implementation of getTeam
	// var getTeamCallback = $.Deferred(getTeam("quantum"));
	// getTeamCallback.done(function(data){
	// 	if(team == null){
	// 		console.log("No team found.");
	// 	}else{
	// 		//console.log(team);
	// 	}
	// });

	// var getEmpManagerCallback = $.Deferred(getEmpManager(profileEmail));
	// getEmpManagerCallback.done(function(data){
	// 	if(employeesManagers == null){
	// 		console.log("Could not find employee's manager");
	// 	}else{
	// 		//console.log("Employee manager:")
	// 		//console.log(employeesManagers);
	// 	}
	// });

	// var getAllEventsCallback = $.Deferred(getAllEvents());
	// getAllEventsCallback.done(function(data){
	// 	console.log("Events:");
	// 	console.log(allEvents);
	// });

	//  /*Get reference example=*/
	//  /*var value;
	//  var dbRef = firebase.database().ref().child('employee');
	//  dbRef.on('value', function(snapshot) {
	//  	console.log(snapshot.val());
	//  });*/


	// // Adds a new event [TODO]
	// function addEvent(userID, startDate, endDate, title, description, alert, isBusiness, vacationUsed){
	// 	// Create a new event

	// 	// Remove appropriate vacation days from employee
	// }


	// // Get all the events for the employees of a given team [DONE]
	// function getAllEvents(){
	// 	// Get all the vacation days for all employees in a given team
	// 	var ref = firebase.database().ref().child('event');
	// 	ref.on('value', function(snapshot){
	// 		if(snapshot.exists()){
	// 			allEvents = snapshot.val();
	// 		}else{
	// 			allEvents = null;
	// 		}
	// 		getAllEventsCallback.resolve();
	// 	});
	// }

	// // Get vacation days for employee
	// function getVacationDays(emailAddress){
	// 	var ref = firebase.database().ref().child('employee/' + fixEmail(emailAddress));
	// 	ref.once('value', function(snapshot){
	// 		if(snapshot.exists()){
	// 			employee = snapshot.val();
	// 		}
	// 		else{
	// 			employee = null;
	// 		}
	// 		getVacationDaysCallback.resolve();
	// 	})
	// }

	// // Gets the total number of employees in a database (included managers) [DONE]
	//  function getEmployeeCount() {
	//  	var count = 0;
	//  	var ref = firebase.database().ref().child('employee');
	//  	ref.on('value', function(snapshot) {
	//  		employeeCount = snapshot.numChildren();
	//  		getEmpCountTest.resolve();
	//  	});
	//  }


	// //Get The employess under manager
	// function getEmployeesByManager(userID){
	// 	userID = fixEmail(userID);
	// 	var ref = firebase.database().ref().child('employee');
	// 	ref.child(userID).once('value', function(snapshot){
	// 		if(snapshot.exists()){
	// 			if(snapshot.child("isManager").val() == true && snapshot.child("employees").val() != null){
	// 				snapshot.child('employees').forEach(function(childSnapshot){
	// 					//console.log("this is the employee requested: " + childSnapshot.val());
	// 				});
	// 			}
	// 		}
	// 	});

	// }

	// Team //
	// Add a new team to the database [TODO]
	// // Pushes all team names to a string array [DONE]
	// function getAllTeams(){
	// 	// Get all the teams
	// 	var ref = firebase.database().ref().child('team');
	//  	ref.on('value', function(snapshot) {
	//  		snapshot.forEach(function(childSnapshot){
	//  			allTeams.push(childSnapshot.child("name").val());
	// 		});
	//  		getAllTeamsCallback.resolve();
	//  	});
	// }

	// // Returns a team with a given name [DONE]
	// function getTeam(teamName){
	// 	var ref = firebase.database().ref().child('team/' + teamName);
	// 	ref.once('value', function(snapshot){
	// 		if(snapshot.exists()){
	// 			team = snapshot.val();
	// 		}
	// 		else{
	// 			team = null;
	// 		}
	// 		getTeamCallback.resolve();
	// 	})
	// }

	// // Gets the total number of teams in the database [DONE]
	// function getTeamCount() {
	//  	var ref = firebase.database().ref().child('team');
	//  	ref.on('value', function(snapshot) {
	//  		teamCount = snapshot.numChildren();
	//  		getTeamCountTest.resolve();
	//  	});
	// }

	// Removes employee from team [Andrew]
	function removeEmpFromTeam(userID, teamName) {
		var refs = firebase.database().ref().child('team').child(teamName);
		var employeeIndex;
		refs.child('employee').once('value', function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				if (childSnapshot.val().toString() === userID) {

					employeeIndex = childSnapshot.getKey();
				}
			});
			refs.child('employee').child(employeeIndex).remove();
		});
		var userIDWithoutSpecial = userID.replace(/[^a-zA-Z ]/g, "");
		var empRef = firebase.database().ref().child('employee').child(userIDWithoutSpecial).child('team');
		empRef.remove();
	}
	//
	// Removes employee from team [Andrew]
	function removeManagerFromTeam(userID, teamName) {
		var refs = firebase.database().ref().child('team').child(teamName);
		var managerIndex;
		refs.child('manager').once('value', function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				if (childSnapshot.val().toString() === userID) {
					managerIndex = childSnapshot.getKey();
				}
			});
			refs.child('manager').child(managerIndex).remove();
		});
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






	// // Does all the necessary steps to move employee from one team to another [TODO]
	// function switchTeams(emailAddress, fromTeamID, toTeamID){

	// }

	// // Manager //
	// // Get the manager that oversees given employee email [TODO]
	// function getEmpManager(emailAddress){
	// 	var ref = firebase.database().ref().child('employee');
	// 	ref.once('value', function(snapshot){
	// 		if(snapshot.exists()){
	// 			snapshot.forEach(function(childSnapshot){
	// 				if(childSnapshot.child("isManager").val() == true && childSnapshot.child("employees").val() != null){
	// 					var employeeArray = childSnapshot.child("employees").val();
	// 					for(var i = 0; i < employeeArray.length; i++){
	// 						if(emailAddress == employeeArray[i]){
	// 							employeesManagers.push(childSnapshot.val());
	// 						}
	// 					}
	// 				}
	// 			});
	// 		}
	// 		getEmpManagerCallback.resolve();
	// 	})
	// }
});
	function createTeam() {
		var teamName = document.getElementById("teamName").value;
		console.log(teamName);
		if(teamName.toString() === "")
		{
			alertify.alert("Please enter a Team Name");
		}else{

		var userID = localStorage.getItem("profileEmail");
		firebase.database().ref('team/' + teamName).set({
			manager: userID,
			name: teamName
		});
		var teamManagerFixedEmail = fixEmail(userID);
		firebase.database().ref('employee/'+ teamManagerFixedEmail).child('isManager').set(true);

		}
		

	}
// Update the employee's manager
function updateManager() {
	var manager = document.getElementById("newManager").value;
	var tempUser = sessionStorage.getItem('user');
	var tempData = JSON.parse(tempUser);
	var tempEmail = fixEmail(tempData.email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('managers').set(manager);
	showChangeManager();
}

function showChangeManager() {
	if (document.getElementById("changeManager").style.display == 'none') {
		document.getElementById("changeManager").style.display = 'inline-block';
		document.getElementById("nodeTreeForm").style.display = 'none';
	}
	else {
		document.getElementById("changeManager").style.display = 'none';
		document.getElementById("nodeTreeForm").style.display = 'inline';
	}
}

function updateTeam() {
    var team = document.getElementById("newTeam").value;
    var tempUser = sessionStorage.getItem('user');
    var tempData = JSON.parse(tempUser);
	var oldTeam = tempData.team;
	var tempAddress = tempData.email;
    var tempEmail = fixEmail(tempData.email);
    firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('team').set(team);
	firebase.database().ref().child('team').child(team.toLowerCase()).child('employee').push(tempAddress);
	var ref = firebase.database().ref().child('team').child(oldTeam);
	ref.child('employee').once('value', function (snapshot) {
		snapshot.forEach(function (childSnapshot) {
			if (childSnapshot.val().toString() === tempAddress) {
				var key = childSnapshot.getKey();
				ref.child('employee').child(key).remove();
			}
		});
	});
    showChangeManager();
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

//saveEvent("zachary.dicino@gm.com",3,"08-29-2016","08-31-2016","business","vacation I need time","why");

function saveEvent(email, eventID, startDate, endDate, vacationType,
	eventTitle, eventDescription) {
	firebase.database().ref('event/' + eventID).set({
		email: email,
		eventID: eventID,
		startDate: startDate,
		endDate: endDate,
		type: vacationType,
		title: eventTitle,
		description: eventDescription
	});

	//add the event id into the employee
	addEventToEmp(email, eventID);

	//getting data from session storage
	var data = sessionStorage.getItem('user');
	var dataResult = JSON.parse(data);

	//switching the dates around
	startDate = startDate.slice(-5) + "-" + startDate.slice(0, 4);
	endDate = subtractDay(endDate);
	endDate = endDate.slice(-5) + "-" + endDate.slice(0, 4);

	//calculate the vacation days
	var vacation = calculateVacationDays(startDate, endDate);


	//changing the session storage object
	dataResult.daysLeft = dataResult.daysLeft - vacation;
	sessionStorage.setItem('user', JSON.stringify(dataResult));

	//updating the vacation in the database
	updateDaysLeft(email, dataResult.daysLeft);

	//repopulating the html fields
	var vdays = document.getElementById("vacationdays");
    var info = "Total Days: " + dataResult.totalVacationDays + "<br>Remaining Days: " + dataResult.daysLeft;
    vdays.innerHTML = info;
}

function addEventToEmp(email, eventID) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('events').push(eventID);
}

function getImage(fileName) {
	var storage = firebase.storage();
	// Create a storage reference from our storage service
	var storageRef = storage.ref();
	var imagesRef = storageRef.child("images/" + fileName);
	var path = imagesRef.fullPath;
	//return path;

	// Get the download URL
	imagesRef.getDownloadURL().then(function (url) {
		// Insert url into an <img> tag to "download"
		var Image = document.getElementById("picture");
		Image.src = url;
	});
}


function updateDaysLeft(email, daysLeft) {
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('daysLeft').set(daysLeft);
}

// Misc
// Function takes 2 dates and returns inclusive number of business days (no weekends/holidays)
function calculateVacationDays(start_date, end_date) {
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
    weekend = [6, 0]; // don't change this
    holidays = ["09-05-2016", "11-08-2016", "11-11-2016", "11-24-2016", "11-25-2016", "12-26-2016", "12-27-2016", "12-28-2016", "12-29-2016", "12-30-2016"];

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
    if (day < 10)
		day = '0' + day;
    if (month < 10)
		month = '0' + month;
    today = month + '-' + day + '-' + year;
    today = parseDate(today);

    if (date.getTime() < today.getTime())
		return today;
    else
		return date;
};

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
function fixEmail(tempEmail) {
	var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
	return result;
}

// Deletes an event [UNKNOWN]
function deleteEvent(eventID) {

	var Key;
	var ref = firebase.database().ref().child('event');
	ref.orderByChild("eventID").equalTo(eventID).once('value', function (snapshot) {
		keyToObject = Object.keys(snapshot.val()).toString();
		if (keyToObject != null) {
			ref.child(keyToObject).remove();
		}

		//snapshot.ref().remove();
	});
	var fixedEmail = fixEmail(profileEmail);
	var empRef = firebase.database().ref().child('employee').child(fixedEmail).child('events');
	empRef.once('value', function (snapshot) {
		if (snapshot.exists()) {
			snapshot.forEach(function (childSnapshot) {
				if (childSnapshot.val().toString() === eventID) {
					key = childSnapshot.getKey();
				}
				//console.log("this is the employee requested: " + childSnapshot.val());
			});

			if (key != null) {
				empRef.child(key).remove()
			}
		}
	});



	//ref.remove();
	// Delete the event via the eventID
}

function updateDeleteEvent(eventID) {
	var startDate;
	var endDate;
	var vacation;
	var ref = firebase.database().ref().child('event');
	ref.child(eventID).once('value', function (snapshot) {
		startDate = snapshot.child("startDate").val();
		endDate = snapshot.child("endDate").val();
		//switching the dates around
		startDate = startDate.slice(-5) + "-" + startDate.slice(0, 4);
		endDate = subtractDay(endDate);
		endDate = endDate.slice(-5) + "-" + endDate.slice(0, 4);
		vacation = calculateVacationDays(startDate, endDate);
		//getting data from session storage
		var data = sessionStorage.getItem('user');
		var dataResult = JSON.parse(data);
		//changing the session storage object
		dataResult.daysLeft = dataResult.daysLeft + vacation;
		sessionStorage.setItem('user', JSON.stringify(dataResult));
		//repopulating the html fields
		var vdays = document.getElementById("vacationdays");
		var info = "Total Days: " + dataResult.totalVacationDays + "<br>Remaining Days: " + dataResult.daysLeft;
		vdays.innerHTML = info;
		updateDeleteEventDatabase(dataResult.email);
	});

	//firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('events').push(eventID);
}

function updateDeleteEventDatabase(email) {
	//getting data from session storage
	var data = sessionStorage.getItem('user');
	var dataResult = JSON.parse(data);
	var tempEmail = fixEmail(email);
	firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('daysLeft').set(dataResult.daysLeft);
}

function subtractDay(day) {

	day = day.split('-');
	console.log(day[1]);
	//endDay = day[0] + day[1] + day[2];

	if (day[2] === '01') {//if the day is 1 it is actually the last day of the previous month
		switch (day[1]) {//switching on month
			case '01':
				day = (day[0] - 1) + '-' + "12" + '-' + "31";
				break;

			case '03':
				if ((day[0] % 4 == 0) && (day[0] % 100 != 0) || (day[0] % 400 == 0)) {
					day = day[0] + '-' + "02" + '-' + "29";
				} else {
					day = day[0] + '-' + "02" + '-' + "28";
				}

				break;

			case '05': case '07': case '10':
				day = day[0] + '-0' + (day[1] - 1) + '-' + "30";
				break;

			case '12':
				day = day[0] + '-' + (day[1] - 1) + '-' + "30";
				break;

			case '11':
				day = day[0] + '-' + (day[1] - 1) + '-' + "31";
				break;

			case '02': case '04': case '06': case '08': case '09':
			default:
				day = day[0] + '-0' + (day[1] - 1) + '-' + "31";
				break;
		}
    } else {
		day[2] -= '1';
		if (day[2] <= 9) { day[2] = "0" + day[2]; }
		day = day[0] + '-' + day[1] + '-' + day[2];
    }
	return day;
}

function dynamicUpdate() {
	var startDate = document.getElementById('startDate').value;
	var endDate = document.getElementById('endDate').value;
	startDate = startDate.slice(-5) + "-" + startDate.slice(0, 4);
	endDate = endDate.slice(-5) + "-" + endDate.slice(0, 4);
	vacation = calculateVacationDays(startDate, endDate);
	var data = sessionStorage.getItem('user');
    var dataResult = JSON.parse(data);
	$("#daysSelected").val(vacation);
    $("#daysLeft").val(dataResult.daysLeft - vacation);
}




function uploadImage(file) {
	var storageRef = firebase.storage().ref();
	//var file = 'img/temp.jpg';
	//file.setAttribute("type", "file");
	var uploadTask = storageRef.child('images/' + file.name).put(file);
	var data = sessionStorage.getItem('user');
    var dataResult = JSON.parse(data);
    firebase.database().ref().child('employee/' + fixEmail(dataResult.email.toLowerCase())).child('image').set(file.name);

}

function getImage(fileName) {
	var storage = firebase.storage();
	// Create a storage reference from our storage service
	var storageRef = storage.ref();
	var imagesRef = storageRef.child("images/" + fileName);
	var path = imagesRef.fullPath;
	//return path;

	// Get the download URL
	imagesRef.getDownloadURL().then(function (url) {
		// Insert url into an <img> tag to "download"
		var Image = document.getElementById("picture");
		Image.src = url;
		console.log(url);
	});
}

function getProfileImage() {
	var data = sessionStorage.getItem('user');
    var dataResult = JSON.parse(data);
    var ref = firebase.database().ref().child('employee/' + fixEmail(dataResult.email.toLowerCase())).child('image');
    var fileName;
    ref.on('value', function (snapshot) {
		fileName = snapshot.val();
		console.log(snapshot.val());
	});
    if (fileName === null) {

    } else {

		var storage = firebase.storage();
		// Create a storage reference from our storage service
		var storageRef = storage.ref();
		var imagesRef = storageRef.child("images/" + fileName);
		sessionStorage.setItem('image', fileName);

		var path = imagesRef.fullPath;
		imagesRef.getDownloadURL().then(function (url) {
			// Insert url into an <img> tag to "download"
			var Image = document.getElementById("picture");
			Image.src = url;
		});

    }
}

function isDateHasEvent(start_d, end_d) {
	var allEvents = [];
	var count = 0;
	allEvents = $('#calendar').fullCalendar('clientEvents');
	var data = sessionStorage.getItem('user');
    var dataResult = JSON.parse(data);
	var event = $.grep(allEvents, function (v) {
		var startDate = v.start._d;
		var endDate = v.end._i;
		var endDate1 = end_d._d.toJSON().slice(0, 10);
		var startDate1 = start_d._d.toJSON().slice(0, 10);
		startDate1 = addDay(startDate1);
		var newStartDate1 = new Date(startDate1);
		endDate1 = subtractDay(endDate1);
		var newEndDate1 = new Date(endDate1);
		endDate = subtractDay(endDate);
		var newEndDate = new Date(endDate);
		var range = moment().range(startDate, newEndDate);
		var range1 = moment().range(newStartDate1, newEndDate1);
		var result = range.contains(start_d._d);
		var result1 = range.contains(newEndDate1);
		var result2 = range.contains(range1);
		var result3 = range1.contains(range);
		if (dataResult.email == v.owner) {
			if (result || result1 || result3) {
				count++;
			}
		}
    });
    return count > 0;
}

function addDay(eventDay) {
	eventDay = eventDay.split('-');
	switch (eventDay[1]) {
		case '01': case '03': case '05': case '07': case '08': case '10':
			if (eventDay[2] === '31') {
				eventDay[2] = '0';
				var tempMonth = parseInt(eventDay[1]);
				eventDay[1] = (tempMonth + 1).toString();
				if (eventDay[1] <= 9) {
					eventDay[1] = '0' + eventDay[1];
				}
			}
			break;

		case '04': case '06': case '09': case '11':
			if (eventDay[2] === '30') {
				eventDay[2] = '0';
				tempMonth = parseInt(eventDay[1]);
				eventDay[1] = (tempMonth + 1).toString();
				if (eventDay[1] <= 9)
					eventDay[1] = "0" + eventDay[1];
			}
			break;

		case '12':
			if (eventDay[2] === '31') {
				eventDay[2] = '0';
				eventDay[1] = '01';
				var tempYear = parseInt(eventDay[0]);
				eventDay[0] = (tempYear + 1).toString();
			}
			break;

		case '02':
			var testYear = parseInt(eventDay[0]);
			if ((testYear % 4 == 0) && (testYear % 100 != 0) || (testYear % 400 == 0)) {
				if (eventDay[2] === '29')
					eventDay[2] = '0';
				eventDay[1] = '03';
			}
			else if (eventDay[2] === '28') {
				eventDay[2] = '0';
				eventDay[1] = '03';
			}
			break;
	}
	num = parseInt(eventDay[2]);
	num += 1;
	eventDay[2] = num.toString();
	if (eventDay[2] <= 9)
		eventDay[2] = "0" + eventDay[2];
	eventDay = eventDay[0] + '-' + eventDay[1] + '-' + eventDay[2];
	return eventDay;
}
