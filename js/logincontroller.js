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
});

function setData(){
    var select = document.getElementById('gmin');
    var gmin = select.options[select.selectedIndex].value;
    document.accountSelection.action = "index.html?gmid=" + gmin;
    accountSelection.submit();
};
