$(document).ready(function() {

    var popup = new Foundation.Reveal($('#createProfileModal'));

    $("#createCloseBtn").on("click", function (ev) {
        ev.preventDefault();
        toggleRequiredOff();
        popup.close();
    });

    $(document).foundation();

    $('#newUserBtn').on("click", function(ev){
        toggleRequiredOn();
    });

    $("#createProfileForm").on("submit", function(ev) {
        ev.preventDefault();
        createProfile();
        $('#createProfileModal').foundation('close');
    });
});

var isNewAccount = false;
var validInput = false;

function toggleRequiredOff(){
    document.getElementById('profileFirstName').required = false;
    document.getElementById('profileLastName').required = false;
    document.getElementById('emailAddress').required = false;
    document.getElementById('emailAddressVerify').required = false;
    document.getElementById('profilePassword').required = false;
    document.getElementById('profilePasswordVerify').required = false;
    document.getElementById('noMan').required = false;
    document.getElementById('selectedManager').required = false;
    document.getElementById('selectedTeam').required = false;
    document.getElementById('vacationDaysTotal').required = false;
    document.getElementById('vacationDaysLeft').required = false;
}

function toggleRequiredOn(){
    document.getElementById('profileFirstName').required = true;
    document.getElementById('profileLastName').required = true;
    document.getElementById('emailAddress').required = true;
    document.getElementById('emailAddressVerify').required = true;
    document.getElementById('profilePassword').required = true;
    document.getElementById('profilePasswordVerify').required = true;
    document.getElementById('noMan').required = true;
    document.getElementById('selectedManager').required = true;
    document.getElementById('selectedTeam').required = true;
    document.getElementById('vacationDaysTotal').required = true;
    document.getElementById('vacationDaysLeft').required = true; 
}

function createProfile() {
    isNewAccount = true;
    var email = document.getElementById('emailAddress').value;
    var emailVerify = document.getElementById('emailAddressVerify').value;
    var firstName = document.getElementById('profileFirstName').value;
    var lastName = document.getElementById('profileLastName').value;
    var password = document.getElementById('profilePassword').value;
    var passwordVerify = document.getElementById('profilePasswordVerify').value;
    var isManager = $("#yesMan").is(":checked");
    var manager = $("#selectedManager :selected").val();
    var team = $("#selectedTeam :selected").val();
    var totalVacationDays = document.getElementById('vacationDaysTotal').value;
    var vacationDaysLeft = document.getElementById('vacationDaysLeft').value;

    
    /*match passwords and emails*/
    if (password == "") {
        alertify.alert("Enter a password");
        return;
    } else if (password != passwordVerify) {
        alertify.alert("Password does not match");
        return;
    } else if (email != emailVerify) {
        alertify.alert("Email does not match");
        return;
    } else if(totalVacationDays < 0 || vacationDaysLeft < 0){
        alertify.alert("Vacation Days cannot be negative");
        return;
    }
    else if(totalVacationDays < vacationDaysLeft){
        alertify.alert("Remaining vacation days cannot be greater than total vacation days");
        return;
    }
    else {
        validInput = true;
        addUser(email, password, firstName, lastName, totalVacationDays, vacationDaysLeft, isManager, manager, team, "ALL EMPLOYEES", "URL", "Title")
    }
}

// User
//This method will add the user to the User table(firebase), and also store the rest of the information in the database [UNTESTED]
function addUser(email, password, firstName, lastName, totalVacationDays, dayslefts, isManager, managers, team, employees, pathToPicture, title) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(data) {
            saveEmployee(firstName, lastName, totalVacationDays, dayslefts, team, managers, isManager, email, "No save");
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

function saveEmployee(firstname, lastname, totalVacation, daysleft, teamName, managers, isManager, email, password) {
    var tempEmail = fixsEmail(email);
    firebase.database().ref('employee/' + tempEmail).set({
        firstName: firstname,
        lastName: lastname,
        totalVacationDays: totalVacation,
        daysLeft: daysleft,
        team: teamName,
        managers: managers,
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
    addEmpToManager(managers, email);

    /**
     *	Now we must add the employee to their team
     */
    if (isManager) {
        addManagerToTeam(email, teamName);
    } else {
        addEmpToTeam(email, teamName);
    }



}

function addEmpToManager(managerEmail, email) {
    var tempEmail = fixsEmail(managerEmail);
    firebase.database().ref().child('employee').child(tempEmail.toLowerCase()).child('employees').push(email);
}


function addEmpToTeam(email, teamName) {
    var tempEmail = fixsEmail(email);
    firebase.database().ref().child('team').child(teamName.toLowerCase()).child('employee').push(email);
}

function addManagerToTeam(email, teamName) {
    var tempEmail = fixsEmail(email);
    firebase.database().ref().child('team').child(teamName.toLowerCase()).child('manager').push(email);
}
// TRakes an email and returns the email with no special characters [DONE]
function fixsEmail(tempEmail) {
    var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
    return result;
}

var allManagers = [];
var managerObject = {};

var getAllManagersCallback = $.Deferred(getAllManagers);
getAllManagersCallback.done(function(data) {
    var select = document.getElementById("selectedManager");
    for (var i = 0; i < allManagers.length; i++) {
        // var el = document.createElement("option");
        // el.textContent = allmanagers[i].firstName + " " allmanagers[i].lastName;
        // el.value = allmanagers[i].email;
        // select.appendChild(el);
        //var managerName = allManagers[i].firstName + " " + allManagers[i].lastName;


        select[select.length] = new Option((allManagers[i].firstName + " " + allManagers[i].lastName), allManagers[i].email);

        //console.log(allManagers[i].email);
        //managerObject[allManagers[i].firstName + " " + allManagers[i].lastName] = allManagers[i].email;
    }
});

function getAllManagers() {
    var ref = firebase.database().ref().child('employee');
    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.child("isManager").val() == true) {
                allManagers.push(childSnapshot.val());
            }
        });
        getAllManagersCallback.resolve();
    });
}

var allTeams = [];

var getAllTeamsCallback = $.Deferred(getAllTeams);
getAllTeamsCallback.done(function(data) {
    var select = document.getElementById("selectedTeam");

    for (var i = 0; i < allTeams.length; i++) {
        select[select.length] = new Option(allTeams[i].name, allTeams[i].name);
        //console.log(allTeams[i]);
    }
});

function getAllTeams() {
    var ref = firebase.database().ref().child('team');
    ref.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            allTeams.push(childSnapshot.val());
        });
        getAllTeamsCallback.resolve();
    });
}