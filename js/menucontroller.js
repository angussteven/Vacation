var sideBarOpen = true;
var settingsMenuOpen = false;

function toggleSideBar(burgerBar) {
    var sidebar = document.getElementById("sidebar");
    var settingsButton = document.getElementById("settingsButton");
    
    if (sideBarOpen) {
        sidebar.style.left = "-500px";
        sideBarOpen = false;
    }
    else {
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
        settingsMenu.style.right = "-800px";
        settingsMenuOpen = false;
    }
    else {
        if(sideBarOpen) {
            toggleSideBar(burgerBar);
        }
        settingsMenu.style.right = "0";
        settingsMenuOpen = true;
    }
    
}

function animateButton(burgerBar) {
    burgerBar.classList.toggle("animate");
}