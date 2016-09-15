var sideBarOpen = true;
var settingsMenuOpen = false;

function toggleSideBar(burgerBar) {
    var sidebar = document.getElementById("sidebar");
    var settingsButton = document.getElementById("settingsButton");

    if (sideBarOpen) {
        sidebar.style.left = "-1000px";
        sideBarOpen = false;
    } else {
        if (settingsMenuOpen) {
            toggleProfileSettings(settingsButton);
        }

        sidebar.style.left = "0";
        sideBarOpen = true;
    }
    animateButton(burgerBar);
}

function toggleProfileSettings(settings) {
    var settingsMenu = document.getElementById("profileSettings");
    var burgerBar = document.getElementById("burgerMenu");

    if (settingsMenuOpen) {
        settingsMenu.style.right = "-2000px";
        settingsMenuOpen = false;
    } else {
        if (sideBarOpen) {
            toggleSideBar(burgerBar);
        }
        settingsMenu.style.right = "0";
        settingsMenuOpen = true;
    }

}

function animateButton(burgerBar) {
    burgerBar.classList.toggle("animate");
}

function populateProfileSettings() {
    document.getElementById("firstName").value = localStorage.getItem("firstName");
    document.getElementById("lastName").value = localStorage.getItem("lastName");
    document.getElementById("email").value = localStorage.getItem("profileEmail");
    document.getElementById("manager").value = capitalizeName(localStorage.getItem("managerFirstName")) + " " + capitalizeName(localStorage.getItem("managerLastName"));
    document.getElementById("totalVacationDays").value = localStorage.getItem("vacationDays");
    document.getElementById("userDays").value = localStorage.getItem("daysLeft");
}
