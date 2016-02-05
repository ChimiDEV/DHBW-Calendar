var idDiv = 1;
var idInf = -1;


    var checkAllDay = function () {
    if ($('#allday:checked')) {
        $('#start').val("00:00").attr("readonly", true);
        $('#end').val("23:59").attr("readonly", true);
    } else {
        $('#start').attr("readonly", false);
        $('#end').attr("readonly", false);
    }
}
    
var checkData = function (i) {
    return (i < 10) ? "0" + i : i;
};   


var upcomingList = function () {       
    $('#eventlist li:gt(4)').hide();
    var checkButton = function () {
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
    
    
    $('#next-btn').click(function () {
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

var main = function () {

// Eventliste abrufen
var eventsCall = function () {
    $.ajax({
    url: "http://host.bisswanger.com/dhbw/calendar.php",
    data: {user: "6334355", action: "list", format: "json"},
    dataType: "json",
    success: function(data) {
            var i,
                eventElemtens = data.events.events.length;

            $('#eventlist li').remove();
            for (i=0; i < eventElemtens; i++) {
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
                        color = ["red", "green", "blue", "purple", "orange"],
                        colorID = Math.floor((Math.random() * 4) + 1);

                console.log(starthour);
                $('<li>').attr('id', id).appendTo('#eventlist');
                    $('<div>').attr('class','eventbox ' + color[colorID]).attr('id', idDiv).appendTo('#'+id+'');
                    $('<div>').attr('class', 'time-event').text(starttime).appendTo('#'+idDiv+'');
                    $('<div>').attr('class', 'seperator-event').appendTo('#'+idDiv+'');
                    $('<div>').attr('class', 'information-event').attr('id', idInf).appendTo('#'+idDiv+'');
                        $('<span>').attr('class', 'title-event').text(title).appendTo('#'+idInf+'');
                        $('<span>').attr('class', 'date-event').text(date).appendTo('#'+idInf+'');
                        $('<br>').appendTo('#'+idInf+'');
                        $('<span>').attr('class', 'timeend-event').text(endText).appendTo('#'+idInf+'');
                        $('<span>').attr('class', 'location-event').text(eventLocation).appendTo('#'+idInf+'');

                    idDiv++;
                    idInf--;
            }
        upcomingList();
        }
    });
}
        
    var user = "TimWalter";
    var Mat = 6334355;
    $( "#user").append(user+" // Matrikelnummer: "+Mat);
    
/* CLOCK FUNCTION */
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
    clock();
    
//////////////////////////////////////////////////////////////////////////////////////////////
 
/* Create Event */
    $('.pop-up').hide();
    $('#overlay').removeClass('blur-in');
    

    $('#create-event-btn').click(function (e) {
       $('.pop-up').fadeIn(1000);
        $('#overlay').removeClass('blur-out');
        $('#overlay').addClass('blur-in');
        e.stopPropagation();
    });
    
  
    $('.close-button').click(function (e) {
        $('.pop-up').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });
    
    $('#create-form').submit(function (e) {
        e.preventDefault();
        $('.pop-up').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });


//////////////////////////////////////////////////////////////////////////////////////////////
    
/* SERVER COMMUNICATION */ 
  // Eventliste abrufen
    eventsCall();
    
    //Create Event
    $('#create-form').submit(function() {
        var myEvent = $("#create-form :input").serializeArray();
        console.log(myEvent);
        if (myEvent.length == 9)  {   //All-Day is checked
            var title = myEvent[0].value,
                location = myEvent[5].value,
                organizer = myEvent[6].value,
                start = myEvent[1].value + "T" + checkData(myEvent[2].value),
                end = myEvent[1].value + "T" + checkData(myEvent[3].value),
                status = myEvent[8].value,
                allday = myEvent[4].value,
                webpage = myEvent[7].value;
        } else {                    //All-Day is unchecked
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
                data:{
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

//////////////////////////////////////////////////////////////////////////////////////////////
    
    /* Upcoming Events List */ 
//var upcomingList = function () {
    //var recheckSize = function () {
    var size_li = $('#eventlist li').size();
    
    $('#eventlist li:gt(4)').hide();
    var checkButton = function () {
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
    
    
    $('#next-btn').click(function () {
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
//};
//////////////////////////////////////////////////////////////////////////////////////////////
 
    
/* APPEND EVENT TO  */

        
 /*   $('#today-btn').click(function() {
        var start = "2015-03-30T08:00";
        function b(str) {
            var parts = str.split('-');
            return parts;
        }
        test = b(start);
        var test2 = new Date(start); 
        month = test2.getMonth();
        console.log(month);
        
    });   */         
};

$(document).ready(main);

//$('selector').css('backgroundImage','url(images/example.jpg)');
