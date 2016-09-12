

$(document).ready(function() {

var emailAddress;
var eventOwner;

firebase.auth().onAuthStateChanged(function (user) {
  if(user) {
    emailAddress = user.email;
    //emailAddress = fixEmail(emailAddress);
  }
});
    
function checkDate(date) {
  var today = new Date().toJSON().slice(0,10);
  if(date < today) {
    return false;
  }
  return true;
}

// date1 is start date, date2 is end date
function compareDates(date1, date2) {
  date1 = parseInt(date1.replace(/-/g,''));
  date2 = parseInt(date2.replace(/-/g,''));
  if (date1 > date2) {
    return false;
  }
  return true;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() +
    s4() + s4() + s4() + s4();
}

function getEmail() {
  return emailAddress;
}


function fixEmail(tempEmail){
  var result = tempEmail.replace(/[^a-zA-Z0-9]/g, '');
  return result;
}

function createICSFile(managerEmail, userName, userEmail, startDate, endDate, isVacation, alert) {
  startDate = startDate.split('-');
  startDate = startDate[0] + startDate[1] + startDate[2];
  endDate = endDate.split('-');
  endDate = endDate[0] + endDate[1] + endDate[2];
  switch (alert) {
    case "alertFour":
      alert = "-PT5760M";
      break;

    case "alertWeek":
      alert = "-PT10080M";
      break;

    default:
      alert = "-P1D";
      break;
  }
  switch (isVacation) {
    case "vacation":
      isVacation = "Vacation";
      break;
    case "travel":
      isVacation = "Business Travel";
      break;
  }
  var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=" + userName + " ;RSVP=TRUE:MAILTO:" + userEmail + "\nATTENDEE;CN= ;RSVP=TRUE:MAILTO:" + managerEmail + "\nORGANIZER;CN=Me:MAILTO:" + userEmail + "\nDTSTART:" + startDate +"\nDTEND:" + endDate +"\nLOCATION:OOO\nSUMMARY:"+ isVacation + "\nX-MICROSOFT-CDO-BUSYSTATUS:OOF\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Vacation\nTRIGGER:" + alert + "\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR";
  return icsMSG;
}

function updateTotals(){
    vacationDays = 0;

    $("#daysSelected").val(vacationDays);

}

function removeTime(date) {
  var dateArray = date.split('T');
  return dateArray[0];
}

function enoughVacationDays(newStart, newEnd){
  var originalStart = clickedEventDates[0];
  var originalEnd = clickedEventDates[1];
  var originalFixedStart = originalStart.slice(-5) + "-" + originalStart.slice(0,4);
  var originalFixedEnd = originalEnd.slice(-5) + "-" + originalEnd.slice(0,4);
  var originalDaysUsed = calculateVacationDays(originalFixedStart, originalFixedEnd);

  // Get the amount of days the new event would be using
  var newFixedStart = newStart.slice(-5) + "-" + newStart.slice(0,4);
  var newFixedEnd = subtractDay(newEnd); 
  newFixedEnd = newFixedEnd.slice(-5) + "-" + newFixedEnd.slice(0,4);
  var newDaysUsed = calculateVacationDays(newFixedStart, newFixedEnd);

  var difference = newDaysUsed - originalDaysUsed;
  var data = sessionStorage.getItem('user');
  var dataResult = JSON.parse(data);
  var vacationRemaining = dataResult.daysLeft-difference;

  if(vacationRemaining > -1){
    return true;
  } else{
    return false;
  }
}
  function Account(GMIN, First, Last, Email, Manager, TotalVacation, UsedVacation) {
    this.GMIN = GMIN;
    this.First = First;
    this.Last = Last;
    this.Email = Email;
    this.Manager = Manager;
    this.TotalVacation = TotalVacation;
    this.UsedVacation = UsedVacation;
  }

  function loadProfile(account) {
    $("#GMIN").val(account.GMIN);
    $("#firstName").val(account.First);
    $("#lastName").val(account.Last);
    $("#emailAddress").val(account.Email);
    $("#manager").val(account.Manager);
    $("#totalVacationDays").val(account.TotalVacation);
    $("#usedVacationDays").val(account.UsedVacation);
  }

    var popup2 = new Foundation.Reveal($('#viewProfileModal'));
    var popup3 = new Foundation.Reveal($('#addEventModal'));
    var popup4 = new Foundation.Reveal($("#viewEventModal"));
    var createTeamModal = new Foundation.Reveal($("#createTeamModal"));
    var eventData;
    var title;
    var clickedID;
    var clickedEventDates;
    var origStartDate;
    var origEndDate;

		$('#calendar').fullCalendar({
			header: {
				left: '',
				center: 'title',
				right: 'prev,next today'
			},
      height: "parent",
      theme: false,
      weekends: false,
			selectable: true,
			selectHelper: true,
      fixedWeekCount: false,

			select: function(start, end) {
        var check = start._d.toJSON().slice(0,10);
        var today = new Date().toJSON().slice(0,10);
        var start1 = start.toISOString();
        var end1 = subtractDay(end.toISOString());
        var data = sessionStorage.getItem('user');
        var dataResult = JSON.parse(data);
        var startDate = start1.slice(-5) + "-" + start1.slice(0,4);
        endDate = subtractDay(end1); 
        var endDate = end1.slice(-5) + "-" + end1.slice(0,4);
        var vacation = calculateVacationDays(startDate,endDate);
        var vacationRemaining = dataResult.daysLeft-vacation;
        var newEnd = end._d.toJSON().slice(0,10);
        if(check < today) {
          $('#calendar').fullCalendar('unselect');
          alertify.alert("Please select a start date on or after today's date.");
        }
        else if(vacationRemaining < 0){
          alertify.alert("Not enough remaining vacation days.");
        }
        else if (isDateHasEvent(start,end)) {
            $('#calendar').fullCalendar('unselect');
            alertify.alert("You already have vacation on this day!");
        }
        else {
          title = $("#firstName").val() + ' ' + $("#lastName").val();
          if (title) {
            popup3.open();
            $("#startDate").val(start.toISOString());
            $("#endDate").val(subtractDay(end.toISOString()));
            $("#alertOne").prop("checked", true);
            $("#vacationRadio").prop("checked", true);
            $("#downloadICSCheckbox").prop("checked", false);
            $("#createEventDescription").val("");
            $("#createEventTitle").val(dataResult.firstName + " " + dataResult.lastName);
            $("#daysSelected").val(vacation);
            $("#daysLeft").val(vacationRemaining);
            //$("#createEventTitle").val("Variable for your name");//update to include name dynamically
          }
          $('#calendar').fullCalendar('unselect');
        }
			},
      eventClick: function(event, element) {
        clickedID = event.id;
        $("#eventTitle").val(event.title);
        $("#eventDescription").val(event.description);
        $("#viewStartDate").val(removeTime(event.start.toISOString()));
        var tempEnd = removeTime(event.end.toISOString());
        $("#viewEndDate").val(subtractDay(tempEnd));
        clickedEventDates = [$("#viewStartDate").val(), $("#viewEndDate").val()];
        var today = new Date().toJSON().slice(0,10);
        /*
        * If the user is not the owner of the event they will not be able to modify it.
        */
        eventOwner = event.owner;
        if (event.owner != emailAddress) {
          $("#eventTitle, #eventDescription, #viewStartDate, #viewEndDate, #downloadICSCheckbox_viewModal").prop("disabled", true);
          $("#changeEventBtn, #deleteBtn").prop("disabled", true);
          $('input[name=alert_viewModal]').attr('disabled', true);
          $('input[name=isVacation_viewModal]').attr('disabled', true);
          popup4.open();
        } else if (tempEnd < today) { 
          $("#eventTitle, #eventDescription, #viewStartDate, #viewEndDate, #downloadICSCheckbox_viewModal").prop("disabled", true);
          $("#changeEventBtn, #deleteBtn").prop("disabled", true);
          $('input[name=alert_viewModal]').attr('disabled', true);
          $('input[name=isVacation_viewModal]').attr('disabled', true);
          popup4.open();
        } else {
          $("#eventTitle, #eventDescription, #viewStartDate, #viewEndDate, #downloadICSCheckbox_viewModal").prop("disabled", false);
          $("#changeEventBtn, #deleteBtn").prop("disabled", false);
          $('input[name=alert_viewModal]').attr('disabled', false);
          $('input[name=isVacation_viewModal]').attr('disabled', false);
          popup4.open();
        }
        return false;
      },
			editable: false,
			eventLimit: true, // allow "more" link when too many events

      dayClick: function(date) {

        $("#daysSelected").val(1);//Should be added to vacation balance calculator
      },
        eventAfterAllRender: function (view) {
        //Use view.intervalStart and view.intervalEnd to find date range of holidays
        //Make ajax call to find holidays in range.
        var newYearsDay = moment("2016-01-01","YYYY-MM-DD");
        var mlkDay = moment("2016-01-18","YYYY-MM-DD");
        var goodFriday = moment("2016-03-25","YYYY-MM-DD");
        var dayAfterEaster = moment("2016-03-28","YYYY-MM-DD");
        var fourthOfJuly = moment('2016-07-04','YYYY-MM-DD');
        var laborDay = moment("2016-09-05","YYYY-MM-DD");
        var electionDay = moment("2016-11-08","YYYY-MM-DD");
        var veteransDay = moment("2016-11-11","YYYY-MM-DD");
        var thanksgiving1 = moment("2016-11-24","YYYY-MM-DD");
        var thanksgiving2 = moment("2016-11-25","YYYY-MM-DD");
        var christmas1 = moment("2016-12-26","YYYY-MM-DD");
        var christmas2 = moment("2016-12-27","YYYY-MM-DD");
        var christmas3 = moment("2016-12-28","YYYY-MM-DD");
        var christmas4 = moment("2016-12-29","YYYY-MM-DD");
        var christmas5 = moment("2016-12-30","YYYY-MM-DD");


        var holidays = [newYearsDay, mlkDay, goodFriday, dayAfterEaster, fourthOfJuly, laborDay, electionDay, veteransDay, thanksgiving1, thanksgiving2, christmas1, christmas2, christmas3, christmas4, christmas5];
        var holidayMoment;
        for(var i = 0; i < holidays.length; i++) {
          holidayMoment = holidays[i];
          if (view.name == 'month') {
            $("td[data-date=" + holidayMoment.format('YYYY-MM-DD') + "]").addClass('holiday');
          } else if (view.name =='agendaWeek') {
            var classNames = $("th:contains(' " + holidayMoment.format('M/D') + "')").attr("class");
            if (classNames !== null) {
              var classNamesArray = classNames.split(" ");
              for(var j = 0; j < classNamesArray.length; j++) {
                if(classNamesArray[i].indexOf('fc-col') > -1) {
                  $("td." + classNamesArray[i]).addClass('holiday');
                  break;
                }
              }
            }
          } else if (view.name == 'agendaDay') {
            if(holidayMoment.format('YYYY-MM-DD') == $('#calendar').fullCalendar('getDate').format('YYYY-MM-DD')) {
              $("td.fc-col0").addClass('holiday');
            }
          }
        }
      }
		});

    $("#addCloseBtn").click(function () {
      popup3.close();
    });

    $("#addTeamCloseBtn, #cancelTeamBtn").click(function () {
      createTeamModal.close();
    });

    $("#notifyBtn").click(function() {
      var id = guid();
      // checks for start date following end date; if event ends before start, it will be set to a one-day event on the start date
      var startd = $("#startDate").val();
      var endd = addDay($("#endDate").val());
      var newStart = new Date(startd);
      var newEnd = new Date(endd);
      var newMomentStart = moment(newStart);
      var newMomentEnd = moment(newEnd);
      if (!checkDate(startd)) {
        alertify.alert("Please select a valid start date.");
      }
      else if (!checkDate(endd)) {
        alertify.alert("Please select a valid end date.");
      }
      else if (!compareDates(startd, endd)) {
        alertify.alert("The end date cannot be before the start date.");
      }else if (isDateHasEvent(newMomentStart,newMomentEnd)){
         alertify.alert("You already have vacation on this day!");
      }
      else if ($("#daysLeft").val() < 0){
      	alertify.alert("You do not have enough vacation days left for this request.");
      }
      else {
        if(Date.parse(startd) >= Date.parse(endd)) {
          endd = addDay(startd);
        }
        eventData = {
          owner: emailAddress,
          id: id,
          title: $("#createEventTitle").val(),
          start: startd,
          end: endd,
          description: $("#createEventDescription").val(),
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true);

        activeEvents.push(eventData.id.toString());

        alert = $('input:radio[name=alert]:checked').val();
        isVacation = $('input:radio[name=isVacation]:checked').val();
        saveEvent(emailAddress, id, $("#startDate").val(), addDay($("#endDate").val()), isVacation, $("#createEventTitle").val(), $("#createEventDescription").val());
        popup3.close();
        if ($("#downloadICSCheckbox").is(':checked') === true) {
          var data = sessionStorage.getItem('user');
          var dataResult = JSON.parse(data);
          var fullName = dataResult.firstName + " " + dataResult.lastName;
          var icsFile = createICSFile(dataResult.managers, fullName, dataResult.email, $("#startDate").val(), addDay($("#endDate").val()), isVacation, alert);
          window.open( "data:text/calendar;charset=utf8," + escape(icsFile));
        }
      }
    });

    $("#deleteBtn").click(function() {
      alertify.confirm("Are you sure you want to remove this event?", function(){
        $("#calendar").fullCalendar('removeEvents',clickedID);
        activeEvents.splice(activeEvents.indexOf(clickedID), 1);
        updateDeleteEvent(clickedID);
        deleteEvent(clickedID);
        popup4.close();
      });
    });

    $("#viewEventCloseBtn").click(function () {
      if (eventOwner == emailAddress) {
        alertify.confirm("Are you sure you want to exit? All progress will be lost.", function(){
          popup4.close();
        });
      } else {
        popup4.close();
      }

    });

    $("#changeEventBtn").click(function () {
      // Get the amount of days the new event would be using
      var eventID;
      var newStart = $("#viewStartDate").val();
      var newEnd = addDay($("#viewEndDate").val());

      if (!checkDate(newStart)) {
        alertify.alert("Please select a valid start date.");
      }
      else if (!checkDate(newEnd)) {
        alertify.alert("Please select a valid end date.");
      }
      else if (!compareDates(newStart, newEnd)) {
        alertify.alert("The end date cannot be before the start date.");
      }
      else if (!enoughVacationDays(newStart, newEnd)){
        alertify.alert("Not enough vacation days for this request.");
      }
      else {
        $("#calendar").fullCalendar('removeEvents',clickedID);
        activeEvents.splice(activeEvents.indexOf(clickedID), 1);
        updateDeleteEvent(clickedID);
        deleteEvent(clickedID);

        if(Date.parse(newStart) >= Date.parse(newEnd))
        {
          newEnd = addDay(newStart);
        }
        eventID = guid();

        changedEvent = {
          owner: emailAddress,
          id: eventID,
          title: $("#eventTitle").val(),
          start: newStart,
          end: newEnd,
          description: $("#eventDescription").val(),
        };
        alert = $('input:radio[name=alert_viewModal]:checked').val();
        isVacation = $('input:radio[name=isVacation_viewModal]:checked').val();
        $('#calendar').fullCalendar('renderEvent', changedEvent, true);
        saveEvent(emailAddress, eventID, newStart, newEnd, isVacation, $("#eventTitle").val(), $("#createEventDescription").val());
        popup4.close();

        if ($("#downloadICSCheckbox_viewModal").is(':checked') === true) {
          var data = sessionStorage.getItem('user');
          var dataResult = JSON.parse(data);
          var fullName = dataResult.firstName + " " + dataResult.lastName;
          var icsFile = createICSFile(dataResult.managers, fullName, dataResult.email, $("#viewStartDate").val(), addDay($("#viewEndDate").val()), isVacation, alert);
          window.open( "data:text/calendar;charset=utf8," + escape(icsFile));
        }
      }
    });

    document.getElementById('exampleFileUpload').addEventListener('change', function(){
      var file = this.files[0];
      if(file) {
        uploadImage(file);
        getImage(file.name);
        sessionStorage.setItem('image',file.name);
      }
    }, false);

	});

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
	var tempMonth;
	switch (eventDay[1]) {
		case '01': case '03': case '05': case '07': case '08': case '10':
			if (eventDay[2] === '31') {
				eventDay[2] = '0';
				tempMonth = parseInt(eventDay[1]);
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
			if ((testYear % 4 === 0) && (testYear % 100 !== 0) || (testYear % 400 === 0)) {
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
				if ((day[0] % 4 === 0) && (day[0] % 100 !== 0) || (day[0] % 400 === 0)) {
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
}

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
}

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
}