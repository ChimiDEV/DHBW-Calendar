// Global Variables for the list View
var idDiv = 1;
var idInf = -1;

// Functions
 // Event PopUp - Shows all information of the Event
var eventPopUp = function(id, e){
    console.log(id);
        var index = $('#' + id + '').index();
        var str = $('#' + id + '').children("div").attr("class");
        var color = str.split(" ");
        var classes = "event" + color[1];
        $('.show-event').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();
        
        // Calls Eventinformation and fills the pop up
        $.ajax({    
            url: "http://host.bisswanger.com/dhbw/calendar.php",
            data: {
                user: "6334355",
                action: "list",
                format: "json"
            },
            dataType: "json",
            success: function(data) {
                data.events.events.sort(function(a, b) {
                    a = new Date(a.start);
                    b = new Date(b.start);
                    return a>b ? 1 : a<b ? -1 : 0;
                });
                var eventProp = data.events.events,
                    id = eventProp[index].id,
                    title = eventProp[index].title,
                    eventLocation = eventProp[index].location,
                    eventOrganizer = eventProp[index].organizer,
                    eventStatus = eventProp[index].status,
                    eventAllDay = eventProp[index].allday,
                    eventPage = eventProp[index].webpage,
                    start = new Date(eventProp[index].start),
                    starthour = start.getUTCHours(),
                    startminute = start.getUTCMinutes(),
                    starttime = checkData(starthour) + ":" + checkData(startminute),
                    end = new Date(eventProp[index].end),
                    endHour = end.getUTCHours(),
                    endMinute = end.getUTCMinutes(),
                    endtime = checkData(endHour) + ":" + checkData(endMinute),
                    time = starttime + " - " + endtime,
                    duration = endHour - starthour,
                    d = checkData(start.getDate()),
                    month = start.getUTCMonth(),
                    year = start.getUTCFullYear(),
                    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    date = d + "." + months[month] + " " + year;
        
                $('.event-up').addClass("border-" + color[1]);
                $('<div>').addClass("eventid").text(id).appendTo(".event-up");
                $('.event-header').addClass("border-" + color[1]);
                $('.event-title').text(title + ",").addClass(classes).css("pointer-events", "none");
                $('.event-location').text(eventLocation);
                $('.event-date').text(date);
                $('.event-organizer').text(eventOrganizer);
                $('.event-status').text(eventStatus);
                $('#event-web').text(eventPage).attr("href", eventPage).addClass(classes);
                if (eventAllDay == 1) {
                    $('.event-allday').text("All Day");
                    $('.event-time').hide();
                } else {
                    $('.event-time').text(time + " // " + duration + " Hours");
                    $('.event-allday').hide();
                }
                $('.del-event').addClass(color[1]);
                $('.edit-event').addClass(color[1]);
            }
        });
        
        //Removing classes, delayed to fade out
        $('.close-button').click(function(e) {
            setTimeout(function() {
                $('.eventid').remove();
                $('.event-up').removeClass("border-" + color[1]);
                $('.event-header').removeClass("border-"+color[1]);
                $('.event-title').removeClass(classes);
                $('#event-web').removeClass(classes);
                $('.event-allday').show();
                $('.event-time').show();
                $('.del-event').removeClass(color[1]);
                $('.edit-event').removeClass(color[1]);
            }, 700);
        });
}

// For Dates and Hours below 10: Add a '0'
var checkData = function(i) { 
    return (i < 10) ? "0" + i : i;
};

// Checks if the next/prev Btn is active or disabled
var checkButton = function(sizeLi) {
    console.log(sizeLi);
    if ($("#eventlist li").children().eq(sizeLi-1).is(":visible")){
        $("#next-btn").removeClass("active");
        $("#next-btn").addClass("disabled");
    } else {
        $("#next-btn").removeClass("disabled");
        $("#next-btn").addClass("active");
    }
    
    if ($("#eventlist li").children().eq(0).is(":visible")) {
        $("#prev-btn").removeClass("active");
        $("#prev-btn").addClass("disabled");
    } else {
        $("#prev-btn").removeClass("disabled");
        $("#prev-btn").addClass("active");
    }
    
};

// Hides all li-elements with index over 5 and checks the btns
 var upcomingList = function() {
    var $lis = $("#eventlist li").hide();
        $lis.slice(0, 5).show();
        var sizeLi = $lis.length;
        var x = 5,
            start = 0;
     checkButton(sizeLi);
        $('#next-btn').click(function () {
            if (start + x < sizeLi) {
                $lis.slice(start, start + x).hide();
                start += x;
                $lis.slice(start, start + x).show();
                checkButton(sizeLi);
            }
        });
        $('#prev-btn').click(function () {
            if (start - x >= 0) {
                $lis.slice(start, start + x).hide();
                start -= x;
                $lis.slice(start, start + x).show();
                checkButton(sizeLi);
            }       
        });   
}

// Clock Function
var clock = function() { 
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

// Calls Events and creates the event boxes
var eventsCall = function() {
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
                eventElements = data.events.events.length;
            
            // Sort Events by Date
            data.events.events.sort(function(a, b) {
            a = new Date(a.start);
            b = new Date(b.start);
            return a>b ? 1 : a<b ? -1 : 0;
            });
            
            $('#eventlist li').remove();
            for (i = 0; i < eventElements; i++) {
                var eventProp = data.events.events,
                    id = eventProp[i].id,
                    title = eventProp[i].title,
                    eventLocation = eventProp[i].location,
                    eventAllDay = eventProp[i].allday,
                    start = new Date(eventProp[i].start),
                    startHour = start.getUTCHours(),
                    startMinute = start.getUTCMinutes(),
                    startTime = checkData(startHour) + ":" + checkData(startMinute),
                    end = new Date(eventProp[i].end),
                    endHour = end.getUTCHours(),
                    endMinute = end.getUTCMinutes(),
                    endTime = "until " + checkData(endHour) + ":" + checkData(endMinute) + ", ",
                    d = checkData(start.getUTCDate()),
                    month = start.getUTCMonth(),
                    year = start.getUTCFullYear(),
                    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    date = " | " + d + "." + months[month] + " " + year,
                    color = ["red border-red", "green border-green", "blue border-blue", "purple border-purple", "orange border-orange", "nocolor nocolor-border"],
                    colorID = Math.floor(Math.random() * 6);
                
                //Creates the Eventboxes
                $('<li>').attr('id', id).appendTo('#eventlist');
                $('<div>').attr('class', 'eventbox ' + color[colorID]).attr('id', idDiv).appendTo('#' + id + '');
                if (eventAllDay == 0) {
                    $('<div>').attr('class', 'time-event').text(startTime).appendTo('#' + idDiv + '');
                }
                $('<div>').attr('class', 'seperator-event').appendTo('#' + idDiv + '');
                $('<div>').attr('class', 'information-event').attr('id', idInf).appendTo('#' + idDiv + '');
                $('<span>').attr('class', 'title-event').text(title).appendTo('#' + idInf + '');
                $('<span>').attr('class', 'date-event').text(date).appendTo('#' + idInf + '');
                $('<br>').appendTo('#' + idInf + '');
                if (eventAllDay == 0) {
                    $('<span>').attr('class', 'timeend-event').text(endTime).appendTo('#' + idInf + '');
                } else {
                    $('<span>').attr('class', 'timeend-event').text("All Day, ").appendTo('#' + idInf + '');
                }
                $('<span>').attr('class', 'location-event').text(eventLocation).appendTo('#' + idInf + '');

                idDiv++;
                idInf--;
            }
            upcomingList();
            
        }
    });
}

// Locks Time to 0:00 and 23:59 for allday  
var allDayLocker = function() {
        $("#start").val("00:00").attr("readonly", !$('#start').attr('readonly'));
        $("#end").val("23:59").attr("readonly", !$('#end').attr('readonly'));
        $("edit-starttime").val("00:00").attr("readonly", !$('#start').attr('readonly'));
        $("edit-endtime").val("23:59").attr("readonly", !$('#start').attr('readonly'));
}

// Main Function -> Starts when Document is ready
var main = function() {
    var user = "TimWalter";
    var Mat = 6334355;
    $("#user").append(user + " // Matrikelnummer: " + Mat);
    clock();
    
    $("#allday").click(function () {
        allDayLocker();
    });
    
/* Pop Ups */
    $('.pop-up ').hide();
    $('#overlay').removeClass('blur-in');

    // Create Event PopUp
    $('#create-event-btn').click(function(e) {
        $('.create-event').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();
    });
    
    // Close Pop Ups on Close Btn
    $('.close-button').click(function(e) {
        $('.create-event').fadeOut(700);
        $('.show-event').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });
    
    // Submit should not close the Pop up
    $('#create-form').submit(function(e) {
        e.preventDefault();
    });

    //Calls the Event Pop Up function
    $("#eventlist").on("click", "li", function(e) {
        var id = $(this).attr("id");
        eventPopUp(id, e);
    });

/* SERVER COMMUNICATION */
    // Eventliste abrufen
    eventsCall();

    // Creates a Event on submit
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
                    $('.create-event').fadeOut(700);
                    $('#overlay').removeClass('blur-in');
                    $('#overlay').addClass('blur-out');
            }
        });
        eventsCall();
    });   

    // Delete Event
    $('.del-event').click(function(e) { 
        var eventId = $(".eventid").text();
        var index = $('#' + eventId + '').index();
        var str = $('#' + eventId + '').children("div").attr("class");
        var color = str.split(" ");
        var classes = "event" + color[1];
        $.ajax({
            url: "http://host.bisswanger.com/dhbw/calendar.php",
            data: {
                user: "6334355",
                action: "delete",
                format: "json",
                id: eventId
            },
            success: function (data) {
                console.log(data);
            }
        });
        
        $('.show-event').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        setTimeout(function() {
            $(".eventid").remove();
            $('.event-up').removeClass("border-" + color[1]);
            $('.event-header').removeClass("border-"+color[1]);
            $('.event-title').removeClass(classes);
            $('#event-web').removeClass(classes);
            $('.event-allday').show();
            $('.event-time').show();
            $('.del-event').removeClass(color[1]);
            $('.edit-event').removeClass(color[1]);
        }, 700);
        eventsCall();
    });
    
    // Edit Event
    $(".edit-event").click(function(e) {
        var title = $('<input />', {
            'type': 'text',
            'name': "titleNew",
            'class': 'edit-title',
            'placeholder': $(".event-title").text(),
            'maxlength': 50,
            'required': true
        });
        
        var organizer = $('<input />', {
            'type': 'email',
            'name': "organizerNew",
            'class': 'edit-organizer',
            'placeholder': $(".event-organizer").text(),
            'maxlength': 50,
            'required': true
        });
        
        var location = $('<input />', {
            'type': 'text',
            'name': "locationNew",
            'class': 'edit-location',
            'placeholder': $(".event-location").text(),
            'maxlength': 50,
            'required': true
        });
        
        var date = $('<input />', {
            'type': 'date',
            'name': "dateNew",
            'class': 'edit-date',
            'placeholder': "Doubleclick: Datepicker",
            'required': true
        });
        
        var starttime = $('<input />', {
            'type': 'time',
            'name': "starttimeNew",
            'class': 'edit-starttime',
            'value': "00:00",
            'required': true
        });
        
        var endtime = $('<input />', {
            'type': 'time',
            'name': "endtimeNew",
            'class': 'edit-endtime',
            'value': "00:00",
            'required': true
        });
        
        var status = $('<select />', {
            'id': 'statusNew',
            'name': 'statusNew'
        });
        
        var webpage = $('<input />', {
            'type': 'url',
            'name': "WebpageNew",
            'class': 'edit-page',
            'placeholder': $("#event-web").text(),
            'required': true
        });
        
        
        var str = $(".event-buttons").children("a").attr("class");
        var color = str.split(" ");
        var currStatus = $(".event-status").text();
        $(".edit-event").toggle();
        
        switch (color[2]) {
            case "red":
                $("<input>").attr("type", "submit").attr("value", "Submit").addClass("eventbtn change-event red").appendTo(".event-buttons");
                //$(".event-title").removeClass("eventred red");
                //$(".event-title").attr("contenteditable", "true").addClass("editable-red");
                $(".event-title").toggle();
                $(title).addClass("editable-red").prependTo(".event-header");
                break;
            case "green":
                $("<input>").attr("type", "submit").attr("value", "Submit").addClass("eventbtn change-event green").appendTo(".event-buttons");
                $(".event-title").toggle();
                $(title).addClass("editable-green").prependTo(".event-header");
                break;
            case "blue":
                $("<input>").attr("type", "submit").attr("value", "Submit").addClass("eventbtn change-event blue").appendTo(".event-buttons");
                $(".event-title").toggle();
                $(title).addClass("editable-blue").prependTo(".event-header");
                break;
            case "purple":
                $("<input>").attr("type", "submit").attr("value", "Submit").addClass("eventbtn change-event purple").appendTo(".event-buttons");
                $(".event-title").toggle();
                $(title).addClass("editable-purple").prependTo(".event-header");
                break;
            case "orange":
                $("<input>").attr("type", "submit").attr("value", "Submit").addClass("eventbtn change-event orange").appendTo(".event-buttons");
                $(".event-title").toggle();
                $(title).addClass("editable-orange").prependTo(".event-header");
                break;
            default:    
                
        }
        $(".event-location").toggle();
        $(".event-date").toggle();
        $(location).appendPolyfillTo(".event-header");
        $(date).appendPolyfillTo(".event-header");
        
        $(".event-organizer").toggle();
        $(organizer).appendPolyfillTo("#eventorganizer-span");
        
        $("#event-web").toggle();
        $(webpage).appendPolyfillTo("#eventpage-span");
        
        $(".event-allday").hide();
        $(".event-time").hide();
        $(starttime).appendPolyfillTo("#eventtime-span");
        $(endtime).appendPolyfillTo("#eventtime-span");
        //$("<input>").attr("type", "checkbox").attr("id", "allday").attr("name", "allday").attr("value", "1").appendTo("#eventtime-span");
        
        // Which status should be selected
        $(".event-status").toggle();
        $(status).appendPolyfillTo(".event-information");
        if (currStatus == "Free") {
            $("<option>").attr("selected", true).text("Free").appendTo("#statusNew");
            $("<option>").text("Tentative").appendTo("#statusNew");
            $("<option>").text("Busy").appendTo("#statusNew");
        } else if (currStatus == "Tentative") {
            $("<option>").text("Free").appendTo("#statusNew");
            $("<option>").attr("selected", true).text("Tentative").appendTo("#statusNew");
            $("<option>").text("Busy").appendTo("#statusNew");
        } else {
            $("<option>").text("Free").appendTo("#statusNew");
            $("<option>").text("Tentative").appendTo("#statusNew");
            $("<option>").attr("selected", true).text("Busy").appendTo("#statusNew");
        }
        
        
        
        // Preventing default on dynamic-created Elements causes failures...
        $(document).on("submit",".editor", function(event){
            event.preventDefault();
            $(".eventid").remove();
            $('.show-event').fadeOut(700);
            $('#overlay').removeClass('blur-in');
            $('#overlay').addClass('blur-out');
        });
        
       /* $(".change-event").click( function(e) {
            e.preventDefault(); 
            $(".eventid").remove();
            $('.show-event').fadeOut(700);
            $('#overlay').removeClass('blur-in');
            $('#overlay').addClass('blur-out');
            e.stopPropagation();
            
        }); */
       
        // Removes classes, delayed to fade out
        $('.close-button').click(function(e) {
            setTimeout(function() {
                $(".change-event").remove();
                $(".edit-event").show();
                
                $(".event-title").show();
                $(".editable-red").remove();
                $(".editable-green").remove();
                $(".editable-blue").remove();
                $(".editable-purple").remove();
                $(".editable-orange").remove();
                
                $(".event-organizer").show();
                $(".edit-organizer").remove();
                
                $(".event-location").show();
                $(".edit-location").remove();
                
                $(".event-date").show();
                $(".edit-date").remove();
                
                $(".event-time").show();
                $(".edit-starttime").remove();
                $(".edit-endtime").remove();
                
                $(".event-status").show();
                //$("#statusNew option").remove();
                $("#statusNew").remove();
                
                
                $("#event-web").show();
                $(".edit-page").remove();
                
            }, 700);
        });
        
    });
};

$(document).ready(main);

//$('selector').css('backgroundImage','url(images/example.jpg)');

// add a _color (e.g. _red) to categorie name, split it when showing it to the user. So it's possible to save the color of the event. -6 characters