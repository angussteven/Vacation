$(document).ready(function () {

    var popup = new Foundation.Reveal($('#createProfileModal'));
    $("#createCloseBtn").on("click", function (ev) {
        ev.preventDefault();
        popup.close();
    });

    $("#createProfileForm").on("submit", function (ev) {
        ev.preventDefault();
        createProfile();
        if(validInput){
            $('#createProfileModal').foundation('close');
        }
    });
});

var validInput = false;

function createProfile() {
    var email = document.getElementById('emailAddress').value;
    var emailVerify = document.getElementById('emailAddressVerify').value;
    var firstName = document.getElementById('profileFirstName').value;
    var lastName = document.getElementById('profileLastName').value;
    var password = document.getElementById('profilePassword').value;
    var passwordVerify = document.getElementById('profilePasswordVerify').value;
    var isManager = $("#yesMan").is(":checked");
    var manager = $("#selectedManager :selected").val();
    var team = $("#selectedTeam :selected").val();
    var totalVacationDays = parseInt(document.getElementById('vacationDaysTotal').value);
    var vacationDaysLeft = parseInt(document.getElementById('vacationDaysLeft').value);

    /*match passwords and emails*/
    if (password === "") {
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
        addUser(email, password, firstName, lastName, totalVacationDays, vacationDaysLeft, isManager, manager, team, "ALL EMPLOYEES", "URL", "Title");
    }
}

getAllManagers().then(function(allManagers){
    var select = document.getElementById("selectedManager");
    var select2 = document.getElementById("newManager");
    for (var i = 0; i < allManagers.length; i++) {
        select[select.length] = new Option((allManagers[i].firstName + " " + allManagers[i].lastName), allManagers[i].email);
        select2[select2.length] = new Option((allManagers[i].firstName + " " + allManagers[i].lastName), allManagers[i].email);
    }
}).catch(function(error){
    console.log(error);
});

getAllTeams().then(function(allTeams) {
    var select = document.getElementById("selectedTeam");
    var select2 = document.getElementById("newTeam");
    for (var i = 0; i < allTeams.length; i++) {
        select[select.length] = new Option(allTeams[i].name, allTeams[i].name);
        select2[select2.length] = new Option(allTeams[i].name, allTeams[i].name);
    }
}).catch(function(error){
    console.log(error);
});
