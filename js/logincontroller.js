$(document).ready(function() {
    var popup = new Foundation.Reveal($('#createProfileModal'));
    $("#newUserBtn").click(function () {
        popup.open();
    });
    $("#createCloseBtn").click(function () {
        var ans = confirm("Are you sure you want to cancel? All progress will be lost.");
      	if (ans == true)
            popup.close();
		});

        //prevent createProfileForm form from posting
    	$("#createProfileForm").submit(function(event){
	     event.preventDefault();
	});
});

var isNew = false;
function createProfile(){
        isNew = true;
    	var email = document.getElementById('emailAddress').value;
	    var emailVerify = document.getElementById('emailAddressVerify').value;
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var password = document.getElementById('firstName').value;
        var passwordVerify = document.getElementById('lastName').value;


}

function setData(){
    var select = document.getElementById('gmin');
    var gmin = select.options[select.selectedIndex].value;
    document.accountSelection.action = "index.html?gmid=" + gmin;
    accountSelection.submit();
};
