// Global Variables for the list View
var idDiv = 1;
var idInf = -1;

// Functions
var checkAllDay = function() { // Checks if "All Day" is enabled and locks time values
    if ($('#allday:checked')) {
        $('#start').val("00:00").attr("readonly", true);
        $('#end').val("23:59").attr("readonly", true);
    } else {
        $('#start').attr("readonly", false);
        $('#end').attr("readonly", false);
    }
}

var checkData = function(i) { // For Dates and Hours below 10: Add a 0
    return (i < 10) ? "0" + i : i;
};


var upcomingList = function() { // Hides all li-elemnts with index over 5 and checks the btns
    $('#eventlist li:gt(4)').hide();
    var checkButton = function() {
        if ($('#eventlist').children().last().is(':visible')) {
            $('#next-btn').removeClass('active');
            $('#next-btn').addClass('disabled');
        } else if ($('#eventlist').children().last().is(':hidden')) {
            $('#next-btn').removeClass('disabled');
            $('#next-btn').addClass('active');
        }

        if ($('#eventlist').children().first().is(':visible')) {
            $('#prev-btn').removeClass('active');
            $('#prev-btn').addClass('disabled');
        } else if ($('#eventlist').children().first().is(':hidden')) {
            $('#prev-btn').removeClass('disabled');
            $('#prev-btn').addClass('active');
        }
    };

    checkButton();


    $('#next-btn').click(function() {
        var last = $('#eventlist').children('li:visible:last');
        last.nextAll(':lt(5)').show();
        last.next().prevAll().hide();
        checkButton();
    });

    $('#prev-btn').click(function() {
        var first = $('#eventlist').children('li:visible:first');
        first.prevAll(':lt(5)').show();
        first.prev().nextAll().hide()
        checkButton();
    });
}

var clock = function() { // Clock Function
    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        d = checkData(date.getDate()),
        day = date.getDay(),
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        h = checkData(date.getHours()),
        m = checkData(date.getMinutes());

    $('#day').text(d);
    $('#time').text(h + ":" + m);
    $('#name-day').text(days[day] + ',');
    $('#month-year').text(months[month] + ' ' + year);

    t = setTimeout(function() {
        clock()
    }, 500);
}


var eventsCall = function() { // Call the Eventlist
    $.ajax({
        url: "http://host.bisswanger.com/dhbw/calendar.php",
        data: {
            user: "6334355",
            action: "list",
            format: "json"
        },
        dataType: "json",
        success: function(data) {
            var i,
                eventElemtens = data.events.events.length;

            $('#eventlist li').remove();
            for (i = 0; i < eventElemtens; i++) {
                var eventProp = data.events.events,
                    id = eventProp[i].id,
                    title = eventProp[i].title,
                    eventLocation = eventProp[i].location,
                    start = new Date(eventProp[i].start),
                    starthour = start.getHours(),
                    startminute = start.getMinutes,
                    starttime = checkData(start.getHours()) + ":" + checkData(start.getMinutes()),
                    d = checkData(start.getDate()),
                    month = start.getMonth(),
                    year = start.getFullYear(),
                    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    date = " | " + d + "." + months[month] + " " + year,
                    end = new Date(eventProp[i].end),
                    endText = "until " + checkData(end.getHours()) + ":" + checkData(end.getMinutes()) + ", ",
                    color = ["red border-red", "green border-green", "blue border-blue", "purple border-purple", "orange border-orange"],
                    colorID = Math.floor(Math.random() * 5);

                //Creates the Eventboxes
                $('<li>').attr('id', id).appendTo('#eventlist');
                $('<div>').attr('class', 'eventbox ' + color[colorID]).attr('id', idDiv).appendTo('#' + id + '');
                $('<div>').attr('class', 'time-event').text(starttime).appendTo('#' + idDiv + '');
                $('<div>').attr('class', 'seperator-event').appendTo('#' + idDiv + '');
                $('<div>').attr('class', 'information-event').attr('id', idInf).appendTo('#' + idDiv + '');
                $('<span>').attr('class', 'title-event').text(title).appendTo('#' + idInf + '');
                $('<span>').attr('class', 'date-event').text(date).appendTo('#' + idInf + '');
                $('<br>').appendTo('#' + idInf + '');
                $('<span>').attr('class', 'timeend-event').text(endText).appendTo('#' + idInf + '');
                $('<span>').attr('class', 'location-event').text(eventLocation).appendTo('#' + idInf + '');

                idDiv++;
                idInf--;
            }
            upcomingList();
        }
    });
}



var main = function() { // Main Function -> Starts when Document is ready
//////////////////////////////////////////////////////////////////////////////////////////////
    var user = "TimWalter";
    var Mat = 6334355;
    $("#user").append(user + " // Matrikelnummer: " + Mat);
    clock();
//////////////////////////////////////////////////////////////////////////////////////////////

    /* Pop Ups */

    $('.pop-up ').hide();
    $('#overlay').removeClass('blur-in');

    // Create Event PopUp
    $('#create-event-btn').click(function(e) {
        $('.createEvent').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();
    });

    $('.close-button').click(function(e) {
        $('.createEvent').fadeOut(700);
        $('.showEvent').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });

    $('#create-form').submit(function(e) {
        e.preventDefault();
        $('.createEvent').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });

    // Event PopUp - Shows all information of the Event
    $("#eventlist").on("click", "li", function(e) {
        var index = $(this).index();
        var str = $('#' + (index + 1) + '').attr("class");
        var color = str.split(" ");
        var classes = "event" + color[1];
        $('.showEvent').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();

        $.ajax({
            url: "http://host.bisswanger.com/dhbw/calendar.php",
            data: {
                user: "6334355",
                action: "list",
                format: "json"
            },
            dataType: "json",
            success: function(data) {
                var eventProp = data.events.events,
                    id = eventProp[index].id,
                    title = eventProp[index].title,
                    eventLocation = eventProp[index].location,
                    eventOrganizer = eventProp[index].organizer,
                    eventStatus = eventProp[index].status,
                    eventAllDay = eventProp[index].allday,
                    eventPage = eventProp[index].webpage,
                    start = new Date(eventProp[index].start),
                    starthour = start.getHours(),
                    startminute = start.getMinutes,
                    starttime = checkData(start.getHours()) + ":" + checkData(start.getMinutes()),
                    end = new Date(eventProp[index].end),
                    endHour = end.getHours(),
                    endtime = checkData(end.getHours()) + ":" + checkData(end.getMinutes()),
                    time = starttime + " - " + endtime,
                    duration = endHour - starthour,
                    d = checkData(start.getDate()),
                    month = start.getMonth(),
                    year = start.getFullYear(),
                    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    date = d + "." + months[month] + " " + year;

                $('.eventUp').addClass("border-" + color[1]);
                $('.eventHeader').addClass("border-" + color[1]);
                $('.eventTitle').text(title + ",").addClass(classes).css("pointer-events", "none");
                $('.eventLocation').text(eventLocation);
                $('.eventDate').text(date);
                $('.eventOrganizator').text(eventOrganizer);
                $('.eventStatus').text(eventStatus);
                $('#eventWeb').text(eventPage).attr("href", eventPage).addClass(classes);
                if (eventAllDay == 1) {
                    $('.eventAllDay').text("All Day");
                    $('.eventTime').hide();
                } else {
                    $('.eventTime').text(time + " // " + duration + " Hours");
                    $('.eventAllDay').hide();
                }

                $('.delEvent').addClass(color[1]);
                $('.editEvent').addClass(color[1]);

                //Removing classes, delayed to fade out
                $('.close-button').click(function(e) {
                    setTimeout(function() {
                        $('.eventUp').removeClass("border-" + color[1]);
                        $('.eventHeader').removeClass("border-" + color[1]);
                        $('.eventTitle').removeClass(classes);
                        $('#eventWeb').removeClass(classes);
                        $('.eventAllDay').show();
                        $('.eventTime').show();
                        $('.delEvent').removeClass(color[1]);
                        $('.editEvent').removeClass(color[1]);
                    }, 700);
                });
            }
        });
    });

    //////////////////////////////////////////////////////////////////////////////////////////////

    /* SERVER COMMUNICATION */
    // Eventliste abrufen
    eventsCall();

    //Create Event
    $('#create-form').submit(function() {
        var myEvent = $("#create-form :input").serializeArray();
        console.log(myEvent);
        if (myEvent.length == 9) { //All-Day is checked
            var title = myEvent[0].value,
                location = myEvent[5].value,
                organizer = myEvent[6].value,
                start = myEvent[1].value + "T" + checkData(myEvent[2].value),
                end = myEvent[1].value + "T" + checkData(myEvent[3].value),
                status = myEvent[8].value,
                allday = myEvent[4].value,
                webpage = myEvent[7].value;
        } else { //All-Day is unchecked
            var title = myEvent[0].value,
                location = myEvent[4].value,
                organizer = myEvent[5].value,
                start = myEvent[1].value + "T" + checkData(myEvent[2].value),
                end = myEvent[1].value + "T" + checkData(myEvent[3].value),
                status = myEvent[7].value,
                allday = 0,
                webpage = myEvent[6].value;
        }

        $.ajax({
            type: "POST",
            url: "http://host.bisswanger.com/dhbw/calendar.php",
            data: {
                user: "6334355",
                action: "add",
                format: "json",
                title: title,
                location: location,
                organizer: organizer,
                start: start,
                end: end,
                status: status,
                allday: allday,
                webpage: webpage
            },
            dataType: "json",
            success: function(msg) {
                console.log(msg);
                console.log(start)
                eventsCall();

            }
        });
    });
};

$(document).ready(main);

//$('selector').css('backgroundImage','url(images/example.jpg)');