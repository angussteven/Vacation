$(document).foundation();


function updateTotals(){
    vacationDays = 0;

    $("#daysSelected").val(vacationDays);

}

  function subtractDay(day) {
    day = day.split('-');
    endOriginal = day[0] + day[1] + day[2];
    console.log(endOriginal + " endOriginal");

    if (day[2] === "01"){//if the day is 1 it is actually the last day of the previous month
        console.log(day + "day[2] === 01");
        switch (day[1]){//switching on month
          case 01:
              day = (day[0] - 1) + '-' + "12" + '-' + "31";
            break;

          case 03:
            if ((day[0] % 4 == 0) && (day[0] % 100 != 0) || (day[0] % 400 == 0)){
              day = day[0] + '-' + "02" + '-' + "29";
            } else {
              day = day[0] + '-' + "02" + '-' + "28";
            }

            break;

          case 05: case 07: case 08: case 10:
            day = day[0] + '-0' + (day[1] - 1) + '-' + "30";
            break;

          case 12:
            day = day[0] + '-' + (day[1] - 1) + '-' + "30";
            break;

            case 02: case 04: case 06: case 09:
          default:
            day = day[0] + '-0' + (day[1] - 1) + '-' + "31";
            break;
        }
        console.log("if");
      } else {
        console.log("else");
        day[2]-='1';
        if (day[2] <= 9){ day[2] = "0" + day[2];}
        day = day[0] + '-' + day[1] + '-' + day[2];
      }

    console.log(day + " taken away");
    return day;
  }

  function Account(GMIN, First, Last, Email, Manager, TotalVacation, UsedVacation) {
    this.GMIN = GMIN;
    this.First = First;
    this.Last = Last;
    this.Email = Email;
    this.Manager = Manager;
    this.TotalVacation = TotalVacation;
    this.UsedVacation = UsedVacation;
  };

  function loadProfile(account) {
    $("#GMIN").val(account.GMIN);
    $("#firstName").val(account.First);
    $("#lastName").val(account.Last);
    $("#emailAddress").val(account.Email);
    $("#manager").val(account.Manager);
    $("#totalVacationDays").val(account.TotalVacation);
    $("#usedVacationDays").val(account.UsedVacation);
  };

  var id = 0;
	$(document).ready(function() {
    var popup2 = new Foundation.Reveal($('#viewProfileModal'));
    var popup3 = new Foundation.Reveal($('#addEventModal'));
    var popup4 = new Foundation.Reveal($("#viewEventModal"));
    var eventData;
    var title;
    var clickedID;
		$('#calendar').fullCalendar({
			header: {
				left: '',
				center: 'title',
				right: 'prev,next today'
			},
      theme: false,
      weekends: false,
			selectable: true,
			selectHelper: true,
      fixedWeekCount: false,
			select: function(start, end) {
				title = $("#firstName").val() + ' ' + $("#lastName").val();
				if (title) {
          popup3.open();
          console.log(end);
          console.log(start);
          $("#startDate").val(start.toISOString());
          $("#endDate").val(subtractDay(end.toISOString()));
				}
				$('#calendar').fullCalendar('unselect');
			},
      eventClick: function(event) {
        if (event.url) {
          clickedID = event.id;
          $("#eventTitle").val(event.title);
          $("#viewStartDate").val(event.start.toISOString());
          $("#viewEndDate").val(event.end.toISOString());

          popup4.open();
          return false;
        }
      },
			editable: false,
			eventLimit: true, // allow "more" link when too many events

      dayClick: function(date) {
        $("#daysSelected").val(1);//Should be added to vacation balance calculator
      }
//			events: [
//				{
//					title: 'All Day Event',
//					start: '2016-06-01'
//				},
//				{
//					title: 'Long Event',
//					start: '2016-06-07',
//					end: '2016-06-10'
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: '2016-06-09T16:00:00'
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: '2016-06-16T16:00:00'
//				},
//				{
//					title: 'Conference',
//					start: '2016-06-11',
//					end: '2016-06-13'
//				},
//				{
//					title: 'Meeting',
//					start: '2016-06-12T10:30:00',
//					end: '2016-06-12T12:30:00'
//				},
//				{
//					title: 'Lunch',
//					start: '2016-06-12T12:00:00'
//				},
//				{
//					title: 'Meeting',
//					start: '2016-06-12T14:30:00'
//				},
//				{
//					title: 'Happy Hour',
//					start: '2016-06-12T17:30:00'
//				},
//				{
//					title: 'Dinner',
//					start: '2016-06-12T20:00:00'
//				},
//				{
//					title: 'Birthday Party',
//					start: '2016-06-13T07:00:00'
//				},
//				{
//					title: 'Click for Google',
//					url: 'http://google.com/',
//					start: '2016-06-28'
//				}
//			]
		});
		$("#viewProfileBtn").click(function () {
			popup2.open();
		});
		$("#viewCloseBtn").click(function () {
			popup2.close();
		});
    $("#cancelBtn").click(function() {
      var ans = confirm("Are you sure you want to cancel? All progress will be reset.");
      if (ans == true)
        popup2.close();
    });
    $("#addCloseBtn").click(function () {
      popup3.close();
    });
    $("#notifyBtn, #changeEventBtn").click(function() {
      id+=1;
      eventData = {
        id: id,
        title: title,
        start: $("#startDate").val(),
        end: endOriginal,
        url: 'click'
      };
      $('#calendar').fullCalendar('renderEvent', eventData, true);
      popup3.close();

      //ICS File
      startDay = $("#startDate").val().split('-');
      startDay = startDay[0] + startDay[1] + startDay[2];
      //endDay = $("#endDate").val().split('-');
      //endDay = endDay[0] + endDay[1] + endDay[2];
      endDay = endOriginal;

      console.log("startDay right before ICS: " + startDay + "   endDay right before ICS: " + endDay);
      //dtstamp autogenerated?
      var icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=Steven Angus ;RSVP=TRUE:MAILTO:steven.angus@gm.com\nATTENDEE;CN=Robert Kasper IV ;RSVP=TRUE:MAILTO:robert.kasperiv@gm.com\nORGANIZER;CN=Me:MAILTO:steven.angus@gm.com\nDTSTART:" + startDay +"\nDTEND:" + endDay +"\nLOCATION:OOO\nSUMMARY:Vacation - Steven Angus\nX-MICROSOFT-CDO-BUSYSTATUS:OOF\nBEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Vacation\nTRIGGER:-P1D\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR";
        window.open( "data:text/calendar;charset=utf8," + escape(icsMSG));
    });
    $("#deleteBtn").click(function() {
      var ans = confirm("Are you sure you want to remove this event?");
      if (ans == true)
        $("#calendar").fullCalendar('removeEvents',clickedID);
        popup4.close();
    });
    $("#viewEventCloseBtn").click(function () {
      var ans = confirm("Are you sure you want to exit? All progress will be lost.");
      if (ans == true)
        popup4.close();
    });
    $("#changeEventBtn").click(function () {
      var clickedEvent = $("#calendar").fullCalendar('clientEvents', clickedID);
      console.log(clickedEvent);
      //clickedEvent.start = $("#viewStartDate").val();
      //clickedEvent.end = $("#viewEndDate").val();
      //$("#calendar").fullCalendar('updateEvent',clickedEvent);
      popup4.close();
    });
    $("#createEventBtn").click(function () {
      var moment = $('#calendar').fullCalendar('getDate');
      moment.stripTime();
      $("#startDate").val(moment.format());
      $("#endDate").val(moment.format());
      popup3.open();
    })
	});
