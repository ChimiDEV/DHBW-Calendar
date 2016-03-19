// Global Variables for the list View and Date
var idDiv = 1;
var idInf = -1;
var currDateGlobal = new Date();
var currDayGlobal = currDateGlobal.getDate();
var currYearGlobal = currDateGlobal.getFullYear();
var currMonthGlobal = currDateGlobal.getMonth();
var reqDate = new Date(currDateGlobal);

// Functions
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
            $(".hiddenevent-list").empty();
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
                    startHidden = year + "-" + checkData((month + 1)) + "-" + d,
                    color = ["red border-red", "green border-green", "blue border-blue", "purple border-purple", "orange border-orange", "nocolor border-nocolor"],
                    img = eventProp[i].imageurl;
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
                        var colorID = 5;
                    };
                } else {
                    var colorID = 5;
                }


                //Creates the Eventboxes
                $('<div>').attr("id", title).text(startHidden + "_" + id).addClass(color[colorID]).appendTo(".hiddenevent-list");
                $('<div>').attr("id", "Img-" + id + "").text(img).appendTo(".hiddenevent-list");
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
            $("<div>").addClass("catg-" + i).appendTo(".catg-list");
            $("<div>").addClass("catg-list-color " + color).attr("id", id).text("✖").appendTo(".catg-" + i);
            $("<div>").addClass("catg-list-name").text(name).appendTo(".catg-" + i);
        }

    }, 150);
}

// Event PopUp - Shows all information of the Event
var eventPopUp = function (id, img, e, imgURL) {
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


            // Eventbox Creation
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
            if (img == 0) {
                $(".img-event").show();
                $(".delimg-event").hide();
            } else {
                $(".img-event").hide();
                $(".delimg-event").show();

                $("<img>").attr("src", imgURL).addClass("img-event-prev").appendTo(".event-img a");
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

// Create event
var createEvent = function () {
    var myEvent = $("#create-form :input").serializeArray();
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

    var eventDate = new Date(start);
    var currDate = new Date();
    var intStart = parseInt(myEvent[2].value);
    var intEnd = parseInt(myEvent[3].value);
    if ((intStart > intEnd) && allday == 0) {
        alert("Start cannot be greater than end");

    } else if (eventDate < currDate && allday == 0) {
        alert("Start cannot be in the past");
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
                eventsCall();
            }
        });
        eventsCall();
        $("#today-btn").trigger("click");
    }
}

// Delete Event
var delEvent = function () {
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
        success: function (data) {}
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
        $('.event-time').empty();
        $('.del-event').removeClass(color[1]);
        $('.img-event').removeClass(color[1]);
        $('.delimg-event').removeClass(color[1]);
        $('.catg-event').removeClass(color[1]);
        $('.delcatg-event').removeClass(color[1]);
        $('.edit-event').removeClass(color[1]);
        eventsCall();
        $("#today-btn").trigger("click");

    }, 700);


}

// Edit Event 
var editEvent = function () {
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


    // Editor Creation
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
        $("<input>").attr("type", "submit").attr("value", "Submit").addClass("eventbtn change-event nocolor").appendTo(".event-buttons");
        $(".event-title").toggle();
        $(title).addClass("editable-nocolor").prependTo(".event-header");

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
        var id = $(".eventid").text();
        var title = edEvent[0].value,
            location = edEvent[1].value,
            organizer = edEvent[3].value,
            webpage = edEvent[4].value;
        if (edEvent.length == 8) {
            var status = edEvent[7].value,
                allday = 0;
            var start = edEvent[2].value + "T" + checkData(edEvent[5].value);
            var end = edEvent[2].value + "T" + checkData(edEvent[6].value);
        } else {
            var status = edEvent[8].value,
                allday = 1;
            var start = edEvent[2].value + "T" + "00:00";
            var end = edEvent[2].value + "T" + "23:59";
        }

        var eventDate = new Date(start);
        var currDate = new Date();
        var intStart = parseInt(edEvent[5].value);
        var intEnd = parseInt(edEvent[6].value);
        if ((intStart >= intEnd) && allday == 0) {
            alert("Start cannot be greater than end");
        } else if (eventDate < currDate) {
            alert("Start cannot be in the past");
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
                    $(".eventid").remove();
                    $(".eventdate").remove();
                    $(".show-event").fadeOut(700);
                    $('#overlay').removeClass('blur-in');
                    $('#overlay').addClass('blur-out');
                    eventsCall();
                    $("#today-btn").trigger("click");
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
                        $(".editable-nocolor").remove();

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
        }
    });
}

// Create Category 
var createCatg = function () {
    //Standart Value
    $(".selected").css('border', '2px solid #4e4e4e');

    $('#catg-form button').click(function () {
        $('#color').val($(this).attr('name'));
        $(this).siblings('button').css('border', 'none');
        $(this).css('border', '2px solid #4e4e4e');
    });

    $("#catg-form").submit(function (e) {
        e.preventDefault();
        var catg = $("#catg-form :input").serializeArray();
        catgName = catg[0].value + "_" + catg[1].value;

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
    });
}

// Delete Category
var delCatg = function (catgId) {
    $(".cancel-btn").click(function (e) {
        e.preventDefault();
        $('.del-catg').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
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
}

// Add Category to Event
var fillSelectionCatg = function () {
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
}

var addCatg = function () {
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
                $("#today-btn").trigger("click");
            }
        });
    });
    eventsCall();
    $("#today-btn").trigger("click");
    $("#category-form").trigger("submit");
    $('.close-button').trigger("click");
}

// Remove Category from event 
var delCatgEvent = function () {
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
            eventsCall();
            $("#today-btn").trigger("click");
        }
    });

}

// Upload Image
var preUploadImg = function () {
    $(".edit-event").removeClass().addClass("eventbtn not-active notactive ed");
    $(".del-event").removeClass().addClass("eventbtn not-active1 notactive del");
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
}

var uploadImg = function (eventId) {
    $('#upload-img').click(function (e) {
        e.preventDefault();
        var fileData = $('#img-file').prop('files')[0];
        var sizeFileKB = fileData.size / 1024;
        var nameFile = fileData.name;
        var extension = nameFile.split('.').pop();

        if (sizeFileKB > 500) {
            alert("Maximum file size exceeded (500kb)");
        } else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
            var formData = new FormData();
            formData.append('file', fileData);
            $.ajax({
                url: 'http://host.bisswanger.com/dhbw/calendar.php?action=upload-image&user=6334355&format=json&id=' + eventId,
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                type: 'post',
                success: function (msg) {
                    eventsCall();
                }
            });
            $(".close-button").trigger("click");
        } else {
            alert("Invalid file type! (Only jpg and png)");
        }
    });
    $("#upload-img").trigger("click");

}

// Delete image
var delImg = function (eventId) {
    $.ajax({
        url: "http://host.bisswanger.com/dhbw/calendar.php",
        data: {
            user: "6334355",
            action: "delete-image",
            format: "json",
            id: eventId
        },
        success: function (msg) {
            eventsCall();
        }
    });
    $(".close-button").trigger("click");
}

// Calendar Creation 
var createCalendar = function (y, m, d) {

    // some needed Variables
    var calDaysinMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var calMonthsLabels = ['January', 'February', 'March', 'April',
                            'May', 'June', 'July', 'August', 'September',
                            'October', 'November', 'December'];

    // First day of month
    var fucDate = new Date(y, m, d);
    var fucMonth = fucDate.getMonth();
    var fucYear = fucDate.getFullYear();
    var fucDay = fucDate.getDate();
    var firstDay = new Date(fucYear, fucMonth, 01);
    var startingDay = firstDay.getDay() - 1;
    var monthLength = calDaysinMonth[fucMonth];

    // Compensate for leap year
    if (fucMonth == 1) { // February only!
        if ((fucYear % 4 == 0 && fucYear % 100 != 0) || fucYear % 400 == 0) {
            monthLength = 29;
        }
    }

    var monthName = calMonthsLabels[fucMonth];
    $(".tc-currmonth").text(monthName);
    $(".tc-curryear").text(fucYear);

    // Fill ind the days
    var day = 1;
    var tmp = 0;
    // this loop is for is weeks (rows)
    for (var i = 0; i < 5; i++) {
        // this loop is for weekdays (cells)
        for (var j = 0; j <= 6; j++) {

            if (day <= monthLength && (i > 0 || j >= startingDay)) {
                $("." + tmp).text(day + ".");

                if ((day == currDayGlobal) && (fucYear == currYearGlobal) && (fucMonth == currMonthGlobal)) {
                    $("." + tmp).addClass("currday");
                    $("." + tmp).closest(".tc-daycell").addClass("currday-cell");
                }

                fillCalendar(fucYear, fucMonth, tmp);

                day++;
            }
            tmp++;
        }
    }
}

var clearCalendar = function () {
    $(".tc-day").empty();
    $(".0").empty();
    $(".tc-day").removeClass("currday")
    $(".tc-daycell").removeClass("currday-cell")
}

var fillCalendar = function (y, m, d) {
    setTimeout(function () {
        var size = $(".hiddenevent-list div").length;
        var calDate = new Date(y, m, d);
        for (i = 0; i < size; i++) {
            var str = $(".hiddenevent-list").children().eq(i).text();
            var info = str.split("_");
            var color = $(".hiddenevent-list").children().eq(i).attr("class");
            var eventTitle = $(".hiddenevent-list").children().eq(i).attr("id");
            var eventDate = new Date(info[0]);
            if (calDate.getDate() == eventDate.getDate() && calDate.getMonth() == eventDate.getMonth()) {
                $("<div>").text(eventTitle).addClass("cal-event " + color).attr("id", info[1]).appendTo("." + d);
            }
        }
    }, 200);
}

// Locks Time to 0:00 for allday  
var allDayLocker = function () {
    $("#start").val("00:00").attr("readonly", !$('#start').attr('readonly'));
    $("#end").val("00:00").attr("readonly", !$('#end').attr('readonly'));
    $(".edit-starttime").val("00:00").attr("readonly", !$(".edit-starttime").attr('readonly'));
    $(".edit-endtime").val("00:00").attr("readonly", !$(".edit-endtime").attr('readonly'));
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

// Main Function -> Starts when Document is ready
var main = function () {
    var user = "TimWalter";
    var Mat = 6334355;
    $("#user").append(user + " // Matrikelnummer: " + Mat);

    // Initiliaze Clock
    clock();

    // Activate Eventlistener for alldaylocker
    $("#allday").click(function (e) {
        allDayLocker();
    });

    // Hide Pop Ups
    $('.pop-up ').hide();
    $('.pop-up-catg').hide();
    $('#overlay').removeClass('blur-in');

    // Fade in: Create Event 
    $('#create-event-btn').click(function (e) {
        e.preventDefault();
        $('.create-event').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();
    });

    // Fade in: Add category
    $("#create-category").click(function (e) {
        e.preventDefault();
        $('.add-catg').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
    });

    // Close and hide pop ups
    $('.close-button').click(function (e) {
        e.preventDefault();
        $('.create-event').fadeOut(700);
        $('.show-event').fadeOut(700);
        $('.add-catg').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
    });

    /* SERVER COMMUNICATION */
    // Eventliste und Categories abrufen
    eventsCall();
    listCats();

    // Eventlistener: Event Pop Up
    $("#eventlist").on("click", "li", function (e) {
        e.preventDefault();
        var id = $(this).attr("id");
        var selector = "Img-" + id;
        var imgURL = $("#" + selector).text();
        var img = 0;
        if (imgURL.length > 1) {
            img = 1;
        } else {
            img = 0;
        }
        eventPopUp(id, img, e, imgURL);
    });

    // Eventlistener: Create Event
    $('#create-form').submit(function (e) {
        e.preventDefault();
        createEvent();
    });

    // Eventlistener: Delete Event
    $('.del-event').click(function (e) {
        e.preventDefault();
        delEvent();
    });

    // Eventlistener: Edit Event
    $(".edit-event").click(function (e) {
        e.preventDefault();
        editEvent();
    });

    // Eventlistener: Upload Image
    var action_img = 1;
    $(".img-event").click(function (e) {
        e.preventDefault();
        var eventId = $(".eventid").text();
        if (action_img == 1) {
            action_img++;
            preUploadImg();
        } else {
            uploadImg(eventId);
            setTimeout(function () {
                location.reload(); // Img wouldn't show up...
            }, 100);

        }
    });

    // Eventlistener: Delete Image
    $(".delimg-event").click(function (e) {
        e.preventDefault();
        var eventId = $(".eventid").text();
        delImg(eventId);
    });

    // Eventlistener: Bigger Preview
    $(".event-img a").click(function (e) {
        e.preventDefault();
        var img = $(".img-event-prev").attr("src");
        $("#img-big").attr("src", img);
        $("#overlay-img").fadeIn(700);
        $("#overlay-img-content").fadeIn(700);
    });

    // Eventlistener: Close Preview
    $("#img-big").click(function (e) {
        $("#overlay-img").fadeOut(700);
        $("#overlay-img-content").fadeOut(700);
        setTimeout(function () {
            $("#img-big").attr("src", " ");
        }, 700);
    });


    // Eventlistener: Create Category
    $("#create-category").click(function (e) {
        e.preventDefault();
        createCatg();

    });

    // Fade in and Eventlistener: Delete Category
    setTimeout(function () { // Timeout --- Waits for loading 
        $(".catg-list-color").click(function (e) {
            e.preventDefault();
            $('.del-catg').fadeIn(1000);
            $('#overlay').removeClass('blur-out');
            $('#overlay').addClass('blur-in');

            var catgId = $(this).attr("id");
            delCatg(catgId);
        });
    }, 150);

    // Eventlistener: Add Category to Event
    var action_catg = 1;
    $(".catg-event").click(function (e) {
        e.preventDefault();
        if (action_catg == 1) {
            action_catg++;
            fillSelectionCatg();
        } else {
            addCatg();
        }
    });


    // Eventlistener: Delete Category from event
    $(".delcatg-event").click(function (e) {
        e.preventDefault();
        delCatgEvent();
    });

    // Eventlistener: Removes classes, delayed to fade out
    $('.close-button').click(function (e) {
        e.preventDefault();
        setTimeout(function () {

            $(".change-event").remove();
            $(".edit-event").show();
            $(".event-catg").show();
            $("#category").empty();
            $(".ed").removeClass().addClass("eventbtn edit-event");
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
            $(".editable-nocolor").remove();

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
            $("#statusNew").remove();

            $(".event-img").empty();


            $("#event-web").show();
            $(".edit-page").remove();

            action_catg = 1;
            action_img = 1;
            $(".add-event-catg").hide();
            $(".ed").removeClass().addClass("eventbtn edit-event");
            $(".img").removeClass().addClass("eventbtn img-event");
            $(".dimg").removeClass().addClass("eventbtn delimg-event");
            $(".del").removeClass().addClass("eventbtn del-event");

        }, 700);
    });

    /* CALENDER CREATION */

    // Initialize calendar
    createCalendar(currYearGlobal, currMonthGlobal, currDayGlobal);

    // Eventlistener: Today Button
    // Sets calendar back to current month
    $("#today-btn").click(function (e) {
        e.preventDefault();
        currDateGlobal = new Date();
        reqDate = new Date();
        clearCalendar();
        createCalendar(currYearGlobal, currMonthGlobal, currDayGlobal);
    });

    // Eventlistener: Next or Prev Month
    $("#next-month-btn").click(function (e) {
        e.preventDefault();
        var reqMonth = reqDate.getMonth() + 1;
        var reqYear = reqDate.getFullYear();

        reqDate = new Date(reqYear, reqMonth, currDayGlobal);
        clearCalendar();
        createCalendar(reqYear, reqMonth, reqDate.getDate());

    });

    $("#prev-month-btn").click(function (e) {
        e.preventDefault();
        var reqMonth = reqDate.getMonth() - 1;
        var reqYear = reqDate.getFullYear();

        reqDate = new Date(reqYear, reqMonth, currDayGlobal);
        clearCalendar();
        createCalendar(reqYear, reqMonth, reqDate.getDate());

    });

    // Close pop ups with Escape
    $(document).keyup(function (e) {
        if (e.keyCode == 27) { // Escape key maps to keycode `27`
            $(".close-button").trigger("click");
        }
    });

};

$(document).ready(main);

//$('selector').css('backgroundImage','url(images/example.jpg)');

// first day = day, weekday[day].. after iteration day+1, if-clausle "weekday[day] == "Monday" "