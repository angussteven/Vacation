var sideBarOpen = true;
var settingsMenuOpen = false;

function toggleSideBar(burgerBar) {
    var sidebar = document.getElementById("sidebar");
    var sidebarContainer = document.getElementById("sidebarContainer");
    var calendarContainer = document.getElementById("wrap");
    var width = sidebarContainer.offsetWidth;
    
    console.log("Menu width: " + width);
    
    if (sideBarOpen) {
        sidebar.style.left = "-500px";
        sideBarOpen = false;
    }
    else {
        sidebar.style.left = "0";
        sideBarOpen = true;
    }
    animateButton(burgerBar);
}

function toggleProfileSettings(settings) {
    var settingsMenu = document.getElementById("profileSettings");
    
    if (settingsMenuOpen) {
        console.log("Moved menu to the left");
        settingsMenu.style.right = "-800px";
        settingsMenuOpen = false;
    }
    else {
        console.log("Moved menu to the right");

        settingsMenu.style.right = "0";
        settingsMenuOpen = true;
    }
    
}

function animateButton(burgerBar) {
    burgerBar.classList.toggle("animate");
}