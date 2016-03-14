// Global Variables for the list View
var idDiv = 1;
var idInf = -1;

// Functions
// Event PopUp - Shows all information of the Event
var eventPopUp = function (id, img, e) {
    //console.log(id);
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
        success: function (data) {
            data.events.events.sort(function (a, b) {
                a = new Date(a.start);
                b = new Date(b.start);
                return a > b ? 1 : a < b ? -1 : 0;
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
            dateHidden = year + "-" + checkData(month + 1) + "-" + d;
            if (eventProp[index].categories.length != 0) {
                var str = eventProp[index].categories[0].name;
                var catg = str.split("_");
                var catgName = catg[0];
                var catgId = eventProp[index].categories[0].id;
            } else {
                var catgName = "None";
                var catgId = 0;
            }



            $('.event-up').addClass("border-" + color[1]);
            $('<div>').addClass("eventid").text(id).appendTo(".event-up");
            $('<div>').addClass("eventdate").text(dateHidden).appendTo(".event-up");
            $('<div>').addClass("eventcatg").text(catgId).appendTo(".event-up");
            $('.event-header').addClass("border-" + color[1]);
            $('.event-title').text(title + ",").addClass(classes).css("pointer-events", "none");
            $('.event-location').text(eventLocation);
            $('.event-date').text(date);
            $("#category").text(catgName);
            $('.event-organizer').text(eventOrganizer);
            $('.event-status').text(eventStatus);
            $('#event-web').text(eventPage).attr("href", eventPage).addClass(classes);
            $(".eventimg-up").hide();
            if (eventAllDay == 1) {
                $('.event-allday').text("All Day");
                $('.event-time').hide();
            } else {
                //$('.event-time').text(time + " // " + duration + " Hours");
                $("<span>").addClass("starttime").text(starttime).appendTo(".event-time");
                $("<span>").text(" - ").appendTo(".event-time");
                $("<span>").addClass("endtime").text(endtime).appendTo(".event-time");
                $("<span>").text(" // " + duration + " Hours").appendTo(".event-time");
                $('.event-allday').hide();
            }
            $('.del-event').addClass(color[1]);
            $('.img-event').addClass(color[1]);
            $('.delimg-event').addClass(color[1]);
            $('.catg-event').addClass(color[1]);
            $('.edit-event').addClass(color[1]);
            //console.log(img);
            if (img == 0) {
                $(".img-event").show();
                $(".delimg-event").hide();
            } else {
                $(".img-event").hide();
                $(".delimg-event").show();
            }

            if ($("#category").text() == "None") {
                $('.catg-event').show();
                $('.delcatg-event').hide();
            } else {
                $('.catg-event').hide();
                $('.delcatg-event').show();
            }

        }
    });

    //Removing classes, delayed to fade out
    $('.close-button').click(function (e) {
        e.preventDefault();
        setTimeout(function () {
            $('.eventid').remove();
            $('.eventdate').remove();
            $('.eventcatg').remove();
            $('.event-up').removeClass("border-" + color[1]);
            $('.event-header').removeClass("border-" + color[1]);
            $('.event-title').removeClass(classes);
            $("#category").empty();
            $('#event-web').removeClass(classes);
            $('.event-allday').show();
            $('.event-time').show();
            $('.event-time').empty();
            $('.event-allday').empty();
            $('.del-event').removeClass(color[1]);
            $('.img-event').removeClass(color[1]);
            $('.delimg-event').removeClass(color[1]);
            $('.catg-event').removeClass(color[1]);
            $('.delcatg-event').removeClass(color[1]);
            $('.edit-event').removeClass(color[1]);

        }, 700);
    });
}

// For Dates and Hours below 10: Add a '0'
var checkData = function (i) {
    return (i < 10) ? "0" + i : i;
};

// Checks if the next/prev Btn is active or disabled
var checkButton = function (sizeLi) {
    if ($("#eventlist li").children().eq(sizeLi - 1).is(":visible")) {
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
var upcomingList = function () {
    var $lis = $("#eventlist li").hide();
    $lis.slice(0, 5).show();
    var sizeLi = $lis.length;
    var x = 5,
        start = 0;
    checkButton(sizeLi);
    $('#next-btn').click(function (e) {
        e.preventDefault();
        if (start + x < sizeLi) {
            $lis.slice(start, start + x).hide();
            start += x;
            $lis.slice(start, start + x).show();
            checkButton(sizeLi);
        }
    });
    $('#prev-btn').click(function (e) {
        e.preventDefault();
        if (start - x >= 0) {
            $lis.slice(start, start + x).hide();
            start -= x;
            $lis.slice(start, start + x).show();
            checkButton(sizeLi);
        }
    });
}

// Clock Function
var clock = function () {
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

    t = setTimeout(function () {
        clock()
    }, 500);
}

// Calls Events and creates the event boxes
var eventsCall = function () {
    $.ajax({
        url: "http://host.bisswanger.com/dhbw/calendar.php",
        data: {
            user: "6334355",
            action: "list",
            format: "json"
        },
        dataType: "json",
        success: function (data) {
            var i,
                eventElements = data.events.events.length;

            // Sort Events by Date
            data.events.events.sort(function (a, b) {
                a = new Date(a.start);
                b = new Date(b.start);
                return a > b ? 1 : a < b ? -1 : 0;
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
                    color = ["red border-red", "green border-green", "blue border-blue", "purple border-purple", "orange border-orange", "nocolor nocolor-border"];
                //colorID = Math.floor(Math.random() * 6);
                if (eventProp[i].categories.length == 1) {
                    var str = eventProp[i].categories[0].name;
                    var catg = str.split("_");
                    var colorCatg = catg[1];
                    switch (colorCatg) {
                    case "red":
                        var colorID = 0;
                        break;
                    case "green":
                        var colorID = 1;
                        break;
                    case "blue":
                        var colorID = 2;
                        break;
                    case "purple":
                        var colorID = 3;
                        break;
                    case "orange":
                        var colorID = 4;
                        break;
                    default:
                        var colorID = 1;
                    };
                } else {
                    var colorID = 0;
                }


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
var allDayLocker = function () {
    $("#start").val("00:00").attr("readonly", !$('#start').attr('readonly'));
    $("#end").val("00:00").attr("readonly", !$('#end').attr('readonly'));
    $(".edit-starttime").val("00:00").attr("readonly", !$(".edit-starttime").attr('readonly'));
    $(".edit-endtime").val("00:00").attr("readonly", !$(".edit-endtime").attr('readonly'));
}

// List categories
var listCats = function () {
    $.ajax({
        type: "GET",
        url: "http://host.bisswanger.com/dhbw/calendar.php",
        data: {
            user: "6334355",
            format: "json",
            action: "list-categories"
        },
        dataType: "json",
        success: function (data) {
            $(".categories-list").empty();
            var catgLength = data.categories.categories.length;
            for (i = 0; i < catgLength; i++) {
                var catgID = data.categories.categories[i].id;
                var str = data.categories.categories[i].name;
                var catg = str.split("_");
                var name = catg[0];
                var color = catg[1];
                $("<div>").attr("id", catgID).addClass(color).text(name).appendTo(".categories-list");
            }
        }
    });

    setTimeout(function () {
        $(".catg-list").empty();
        var children = $(".categories-list").children().length;
        for (i = 0; i < children; i++) {
            var name = $(".categories-list").children().eq(i).text();
            var color = $(".categories-list").children().eq(i).attr("class");
            var id = $(".categories-list").children().eq(i).attr("id");
            /* <div class="catg"><div class="catg-list-color red" ></div><div class="catg-list-name">Important</div></div> */
            $("<div>").addClass("catg " + i).appendTo(".catg-list");
            $("<div>").addClass("catg-list-color " + color).attr("id", id).text("✖").appendTo("." + i);
            $("<div>").addClass("catg-list-name").text(name).appendTo("." + i);
        }

    }, 150);
}

// Main Function -> Starts when Document is ready
var main = function () {
    var user = "TimWalter";
    var Mat = 6334355;
    $("#user").append(user + " // Matrikelnummer: " + Mat);
    clock();

    $("#allday").click(function (e) {
        e.preventDefault();
        allDayLocker();
    });

    /* Pop Ups */
    $('.pop-up ').hide();
    $('.pop-up-catg').hide();
    $('#overlay').removeClass('blur-in');

    // Create Event PopUp
    $('#create-event-btn').click(function (e) {
        e.preventDefault();
        $('.create-event').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();
    });

    // Close and hide pop ups
    $('.close-button').click(function (e) {
        e.preventDefault();
        $('.create-event').fadeOut(700);
        $('.show-event').fadeOut(700);
        $('.add-catg').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });

    // Submit should not close the Pop up
    $('#create-form').submit(function (e) {
        e.preventDefault();
    });

    //Calls the Event Pop Up function
    $("#eventlist").on("click", "li", function (e) {
        e.preventDefault();
        var id = $(this).attr("id");
        var img;
        if ($(this).css('background-image') != 'none') {
            img = 1;
        } else {
            img = 0;
        }
        eventPopUp(id, img, e);
    });

    /* SERVER COMMUNICATION */
    // Eventliste und Categories abrufen
    eventsCall();
    listCats();

    // Create Event
    $('#create-form').submit(function () {
        var myEvent = $("#create-form :input").serializeArray();
        console.log(myEvent);
        if (myEvent.length == 9) { //All-Day is checked
            var title = myEvent[0].value,
                location = myEvent[5].value,
                organizer = myEvent[6].value,
                start = myEvent[1].value + "T" + "00:00",
                end = myEvent[1].value + "T" + "23:59",
                status = myEvent[8].value,
                allday = 1,
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

        var intStart = parseInt(myEvent[2].value);
        var intEnd = parseInt(myEvent[3].value);
        if ((intStart > intEnd) && allday == 0) {
            alert("Start cannot be greater than end");
            intStart = 0;
            intEnd = 0;
        } else {
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
                success: function (msg) {
                    $('.create-event').fadeOut(700);
                    $('#overlay').removeClass('blur-in');
                    $('#overlay').addClass('blur-out');
                }
            });
            eventsCall();
        }
    });

    // Delete Event
    $('.del-event').click(function (e) {
        e.preventDefault();
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
                //console.log(data);
            }
        });

        $('.show-event').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        setTimeout(function () {
            $(".eventid").remove();
            $(".eventdate").remove();
            $('.event-up').removeClass("border-" + color[1]);
            $('.event-header').removeClass("border-" + color[1]);
            $('.event-title').removeClass(classes);
            $("#category").empty();
            $('#event-web').removeClass(classes);
            $('.event-allday').show();
            $('.event-time').show();
            $('.del-event').removeClass(color[1]);
            $('.img-event').removeClass(color[1]);
            $('.delimg-event').removeClass(color[1]);
            $('.catg-event').removeClass(color[1]);
            $('.delcatg-event').removeClass(color[1]);
            $('.edit-event').removeClass(color[1]);
        }, 700);
        eventsCall();
    });

    // Edit Event
    $(".edit-event").click(function (e) {
        e.preventDefault();
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
            'value': $(".eventdate").text(),
            'required': true
        });

        var starttime = $('<input />', {
            'type': 'time',
            'name': "starttimeNew",
            'class': 'edit-starttime',
            'value': $(".starttime").text(),
            'required': true
        });

        var endtime = $('<input />', {
            'type': 'time',
            'name': "endtimeNew",
            'class': 'edit-endtime',
            'value': $(".endtime").text(),
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
        $(".edit-event").hide();
        $(".event-catg").hide();
        //$(".edit-event").removeClass().addClass("eventbtn not-active notactive");
        $(".del-event").removeClass().addClass("eventbtn not-active1 notactive del");
        $(".img-event").removeClass().addClass("eventbtn not-active notactive img");
        $(".delimg-event").removeClass().addClass("eventbtn not-active notactive dimg");
        $(".catg-event").removeClass().addClass("eventbtn not-active notactive ct");



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
        $(organizer).appendTo("#eventorganizer-span");

        $("#event-web").toggle();
        $(webpage).appendTo("#eventpage-span");

        $(".event-allday").hide();
        $(".event-time").hide();
        $("#allday1").show();
        $(starttime).appendPolyfillTo("#eventtime-span");
        $(endtime).appendPolyfillTo("#eventtime-span");
        $("<span>").addClass("info-allday").text("Allday").insertAfter("#allday1");
        //$("<input>").attr("type", "checkbox").attr("id", "allday").attr("name", "allday").attr("value", "1").appendTo("#eventtime-span");
        if ($(".event-allday").text() == "All Day") {
            $("#allday1").attr('checked', true);
            allDayLocker();
        } else {
            $("#allday1").attr('checked', false);
        }

        $("#allday1").click(function () {
            e.preventDefault();
            allDayLocker();
        });

        // Which status should be selected
        $(".event-status").toggle();
        $(status).appendTo(".event-information");
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
        $(document).on("submit", ".editor", function (event) {
            event.preventDefault();
            var edEvent = $("#edit-form :input").serializeArray();
            console.log(edEvent);
            var id = $(".eventid").text();
            var title = edEvent[0].value,
                location = edEvent[1].value,
                organizer = edEvent[3].value,
                start = edEvent[2].value + "T" + checkData(edEvent[5].value),
                end = edEvent[2].value + "T" + checkData(edEvent[6].value),
                webpage = edEvent[4].value;
            if (edEvent.length == 8) {
                var status = edEvent[7].value,
                    allday = 0;
            } else {
                var status = edEvent[8].value,
                    allday = 1;
            }

            var intStart = parseInt(edEvent[5].value);
            var intEnd = parseInt(edEvent[6].value);
            if ((intStart >= intEnd) && allday == 0) {
                alert("Start cannot be greater than end");
                console.log(intStart);
                console.log(intEnd);
            } else {
                $.ajax({
                    type: "POST",
                    url: "http://host.bisswanger.com/dhbw/calendar.php",
                    data: {
                        user: "6334355",
                        action: "update",
                        format: "json",
                        id: id,
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
                    success: function (msg) {
                        console.log("Edit: " + msg);
                        $(".eventid").remove();
                        $(".eventdate").remove();
                        $(".show-event").fadeOut(700);
                        $('#overlay').removeClass('blur-in');
                        $('#overlay').addClass('blur-out');
                        edEvent = [];

                        setTimeout(function () {
                            $(".change-event").remove();
                            $(".edit-event").show();
                            $(".event-catg").show();
                            $("#category").empty();
                            $(".ed").removeClass().addClass("eventbtn editevent-event");
                            $(".img").removeClass().addClass("eventbtn img-event");
                            $(".dimg").removeClass().addClass("eventbtn delimg-event");
                            $(".ct").removeClass().addClass("eventbtn catg-event");
                            $(".del").removeClass().addClass("eventbtn del-event");

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
                            $("#allday1").hide();
                            $(".info-allday").remove();

                            $(".event-status").show();
                            //$("#statusNew option").remove();
                            $("#statusNew").remove();


                            $("#event-web").show();
                            $(".edit-page").remove();

                        }, 700);
                    }
                });

                eventsCall();
            }
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
        $('.close-button').click(function (e) {
            e.preventDefault();
            setTimeout(function () {
                $(".change-event").remove();
                $(".edit-event").show();
                $(".event-catg").show();
                $("#category").empty();
                $(".ed").removeClass().addClass("eventbtn editevent-event");
                $(".img").removeClass().addClass("eventbtn img-event");
                $(".dimg").removeClass().addClass("eventbtn delimg-event");
                $(".ct").removeClass().addClass("eventbtn catg-event");
                $(".del").removeClass().addClass("eventbtn del-event");

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
                $("#allday1").hide();
                $(".info-allday").remove();

                $(".event-status").show();
                //$("#statusNew option").remove();
                $("#statusNew").remove();


                $("#event-web").show();
                $(".edit-page").remove();

            }, 700);
        });

    });

    // Upload Image
    $(".img-event").click(function (e) {
        e.preventDefault();
        $(".edit-event").removeClass().addClass("eventbtn not-active notactive ed");
        $(".del-event").removeClass().addClass("eventbtn not-active1 notactive del");
        $(".img-event").removeClass().addClass("eventbtn not-active notactive img");
        $(".delimg-event").removeClass().addClass("eventbtn not-active notactive dimg");
        $(".catg-event").removeClass().addClass("eventbtn not-active notactive ct");
        $(".eventimg-up").show();

        $('.close-button').click(function (e) {
            e.preventDefault();
            setTimeout(function () {
                $(".eventimg-up").hide();
                $(".ed").removeClass().addClass("eventbtn edit-event");
                $(".img").removeClass().addClass("eventbtn img-event");
                $(".dimg").removeClass().addClass("eventbtn delimg-event");
                $(".ct").removeClass().addClass("eventbtn catg-event");
                $(".del").removeClass().addClass("eventbtn del-event");

            }, 700);
        });
    });

    // Add category
    $("#create-category").click(function (e) {
        e.preventDefault();
        $('.add-catg').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
    });

    // Standart Value
    $(".selected").css('border', '2px solid #4e4e4e');

    $('#catg-form button').click(function () {
        $('#color').val($(this).attr('name'));
        $(this).siblings('button').css('border', 'none');
        $(this).css('border', '2px solid #4e4e4e');
    });

    $("#catg-form").submit(function (e) {
        var catg = $("#catg-form :input").serializeArray();
        catgName = catg[0].value + "_" + catg[1].value;
        console.log(catgName);
        $.ajax({
            type: "POST",
            url: "http://host.bisswanger.com/dhbw/calendar.php",
            data: {
                user: "6334355",
                action: "add-category",
                format: "json",
                name: catgName
            },
            dataType: "json",
            success: function (msg) {
                $('.add-catg').fadeOut(700);
                $('#overlay').removeClass('blur-in');
                $('#overlay').addClass('blur-out');
                // listCats(); --- Page reload, because PopUp didn't work with dynamic created List...
                location.reload();
            }
        });

        e.preventDefault();
    });

    // Waits for completing list. Delete Category
    setTimeout(function () { // Timeout --- Waits for loading 
        $(".catg-list-color").click(function (e) {
            e.preventDefault();
            $('.del-catg').fadeIn(1000);
            var catgId = $(this).attr("id");
            $('#overlay').removeClass('blur-out');
            $('#overlay').addClass('blur-in');

            $(".cancel-btn").click(function (e) {
                $('.del-catg').fadeOut(700);
                $('#overlay').removeClass('blur-in');
                $('#overlay').addClass('blur-out');
                e.preventDefault();
            });

            $(".del-catg-btn").click(function (e) {
                e.preventDefault();
                $.ajax({
                    url: "http://host.bisswanger.com/dhbw/calendar.php",
                    data: {
                        user: "6334355",
                        action: "delete-category",
                        format: "json",
                        id: catgId
                    },
                    success: function (data) {
                        // listCats(); --- Page reload, because PopUp didn't work with dynamic created List...
                        location.reload();
                        $('.del-catg').fadeOut(700);
                        $('#overlay').removeClass('blur-in');
                        $('#overlay').addClass('blur-out');
                    }
                });
            });
        });
    }, 150);

    // Add Category to Event
    var action = 1;

    $(".catg-event").click(function (e) {
        if (action == 1) {
            e.preventDefault();
            action++;
            $(".edit-event").removeClass().addClass("eventbtn not-active notactive ed");
            $(".del-event").removeClass().addClass("eventbtn not-active1 notactive del");
            $(".img-event").removeClass().addClass("eventbtn not-active notactive img");
            $(".delimg-event").removeClass().addClass("eventbtn not-active notactive dimg");
            $(".add-event-catg").show();

            $.ajax({
                type: "GET",
                url: "http://host.bisswanger.com/dhbw/calendar.php",
                data: {
                    user: "6334355",
                    format: "json",
                    action: "list-categories"
                },
                dataType: "json",
                success: function (data) {
                    var size = data.categories.categories.length;
                    $("#input-category").empty();
                    for (i = 0; i < size; i++) {
                        var id = data.categories.categories[i].id;
                        var str = data.categories.categories[i].name;
                        var catg = str.split("_");
                        var name = catg[0];
                        $("<option>").text(name).attr("id", id).appendTo("#input-category");
                    }
                }
            });
        } else {
            e.preventDefault();
            $("#category-form").submit(function (e) {
                e.preventDefault();
                var catg = $("#category-form :input").serializeArray();
                var selectedId = $("#category-form :selected").attr("id");
                var eventId = $(".eventid").text();
                $.ajax({
                    type: "POST",
                    url: "http://host.bisswanger.com/dhbw/calendar.php",
                    data: {
                        user: "6334355",
                        action: "put-category",
                        format: "json",
                        event: eventId,
                        category: selectedId
                    },
                    dataType: "json",
                    success: function (msg) {
                        eventsCall();
                    }
                });
            });
            $("#category-form").trigger("submit");
            $('.close-button').trigger("click");
        }
    });

    $('.close-button').click(function (e) {
        e.preventDefault();
        setTimeout(function () {
            action = 1;
            $(".add-event-catg").hide();
            $(".ed").removeClass().addClass("eventbtn edit-event");
            $(".img").removeClass().addClass("eventbtn img-event");
            $(".dimg").removeClass().addClass("eventbtn delimg-event");
            $(".del").removeClass().addClass("eventbtn del-event");

        }, 700);
    });


    // Delete Category from event
    $(".delcatg-event").click(function (e) {
        e.preventDefault();
        var catgId = $(".eventcatg").text();
        var eventId = $(".eventid").text();

        $.ajax({
            type: "POST",
            url: "http://host.bisswanger.com/dhbw/calendar.php",
            data: {
                user: "6334355",
                action: "remove-category",
                format: "json",
                event: eventId,
                category: catgId
            },
            dataType: "json",
            success: function (msg) {
                $(".close-button").trigger("click");
                // listCats(); --- Page reload, because PopUp didn't work with dynamic created List...
                eventsCall();
            }
        });
    });

    /* ---- Calender Creation --- */

};

$(document).ready(main);

//$('selector').css('backgroundImage','url(images/example.jpg)');

// first day = day, weekday[day].. after iteration day+1, if-clausle "weekday[day] == "Monday" "