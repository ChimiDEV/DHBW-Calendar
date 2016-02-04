var main = function () {
        
    var user = "TimWalter";
    var Mat = 6334355;
    $( "#user").append(user+" // Matrikelnummer: "+Mat);
    
/* CLOCK FUNCTION */
    var checkData = function (i) {
        return (i < 10) ? "0" + i : i;
    };
    
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
    
            document.getElementById('day').innerHTML = d;
            document.getElementById('time').innerHTML = h + ":" + m;
            document.getElementById('name-day').innerHTML = days[day] + ',';
            document.getElementById('month-year').innerHTML = months[month] + ' ' + year;
        
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
        var event = $("#create-form :input").serializeArray();
        console.log(event);
        $('.pop-up').fadeOut(700);
        $('#overlay').removeClass('blur-in');
        $('#overlay').addClass('blur-out');
        e.stopPropagation();
    });

//////////////////////////////////////////////////////////////////////////////////////////////
    
/* SERVER COMMUNICATION  
    $('XX').click(function() {
        $.ajax({
        url: "http://host.bisswanger.com/dhbw/calendar.php",
        data: {user: "ramon", action: "list", format: "json"},
        dataType: "json",
        success: function(data) {
            var event = data.events;
            $('<span>').text(event.events[0].title).appendTo('#calendar');
            
            }
        });
        
    }); */
    
//////////////////////////////////////////////////////////////////////////////////////////////
    
    /* Upcoming Events List */ 
//var upcomingList = function () {
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
    
    var id = 1234,
        idDiv = 1,
        idInfo = -1,
        title = "TEST,",
        eventLocation = "test",
        starttime = "20:00",
        d = 30, 
        month = 'March',
        year = 2016,
        date = d + "." + month + " " + year,
        end = "until 23:00";
        
    $('#today-btn').click(function() {
        $('<li>').attr('id', id).appendTo('#eventlist');
        $('<div>').attr('class','eventbox red').attr('id', idDiv).appendTo('#'+id+'');
        $('<div>').attr('class', 'time-event').text(starttime).appendTo('#'+idDiv+'');
        $('<div>').attr('class', 'seperator-event').appendTo('#'+idDiv+'');
        $('<div>').attr('class', 'information-event').attr('id', idInfo).appendTo('#'+idDiv+'');
            $('<span>').attr('class', 'title-event').text(title).appendTo('#'+idInfo+'');
            $('<span>').attr('class', 'date-event').text(date).appendTo('#'+idInfo+'');
            $('<br>').appendTo('#'+idInfo+'');
            $('<span>').attr('class', 'timeend-event').text(end).appendTo('#'+idInfo+'');
            $('<span>').attr('class', 'location-event').text(eventLocation).appendTo('#'+idInfo+'');
        id++;
        idDiv++;
        idInfo--;
    $('#eventlist li:gt(4)').hide();
    });            
};

$(document).ready(main);

//$('selector').css('backgroundImage','url(images/example.jpg)');