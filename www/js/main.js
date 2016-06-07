
// The Audio player
var my_media = null;
var mediaTimer = null;
// duration of media (song)
var dur = -1;
// need to know when paused or not
var is_paused = false;
var src = 'http://195.55.74.205/rtve/radio1.mp3'; //intialize to RNE

function init() {
 
   document.addEventListener("deviceready", onDR, false);
}
//Set audio position on page
function setAudioPosition(position) {
    $("#audio_position").html(position + " sec");
}

//onSuccess Callback
function onSuccess() {
    console.log("---I am in onSuccess---")
    setAudioPosition(dur);
    clearInterval(mediaTimer);
    mediaTimer = null;
    // my_media = null;
    is_paused = false;
    dur = -1;
}

//onError Callback 
function onError(error) {
    alert('code: '    + error.code    + '\n' + 
            'message: ' + error.message + '\n');
    clearInterval(mediaTimer);
    mediaTimer = null;
    // my_media = null;
    is_paused = false;
    setAudioPosition("0");
}

var tag = 0;
function playAudio(src) {
    //my_media.stop();
    console.log("Play Audio " + src);
    // if (my_media) {
    //     console.log("---I am in if(my_media)---");
    //     my_media.stop();
    //     console.log(my_media);
    //     my_media = null;
    // } 

    if (my_media == null) {
        console.log("OK I am null");
    } else {
        console.log("---I am in else if(my_media == null)---");
        my_media.stop();
        my_media.release();
        my_media = null;

    }

    // if (tag == 1) {
    //     my_media.stop();
    //     my_media = null;
    // }
   
    // Create Media object from src, and set the onSuccess and onError methods
    my_media = new Media(src, onSuccess, onError);
    console.log(my_media);
    if(my_media) {
        console.log("I am in if my_media");
    }
    // Play audio src
    my_media.play();
    tag = 1;
    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
   // get duration

   // if (dur > 0) , update the interface using 
   // docuement.getElementById('media_dur').innerHTML=(dur) + "sec";	
    // OR 
   
}

//Pause audio
function pauseAudio() {
    console.log('pressed pause audio');
     if (is_paused) {
        if (my_media) {
            is_paused = false;
            my_media.play();
            $("#pauseaudio").text("Pause");
        }
    } else {
        if (my_media) {
            is_paused = true;
            my_media.pause();
            $("#pauseaudio").text("Play");
        }
    }
}

//Stop audio
function stopAudio() {
    if (my_media) {
        // A successful .stop() will call .release()
        my_media.stop();
        my_media.release(); //W
        my_media = null;
    }
    if (mediaTimer) {
        clearInterval(mediaTimer);
        mediaTimer = null;
    }
    is_paused = false;
    dur = 0;
}

/* Concert  */
 
function searchConcerts(nameArtist, nameCity) {
//	var url = http://api.setlist.fm/rest/0.1/search/setlist.json?artistName="nameArtist"&cityName="nameCity";
	var serviceURL = "http://api.setlist.fm/rest/0.1/search/setlists.json?"; 
	var parameter = new String();
    parameter = parameter.concat("artistName=", nameArtist, "&cityName=", nameCity);
    var url = serviceURL + "" + parameter;
    console.log(url);
   
     $.ajax({
        url : serviceURL + "" + parameter,
        type : "GET",
        dataType : "json",
        success : parseConcert,
        error : showError
    });

}

function parseConcert(dataJson){
    console.log("response " + dataJson);
    var theHtml = new String();
    var sl = dataJson.setlists.setlist;
    for(var i in sl) {
        theHtml = theHtml.concat("<p><strong>", sl[i]['@tour'] , "</strong></p>");
        theHtml = theHtml.concat("<p>Date: ", sl[i]['@eventDate'] , "</p>");
        theHtml = theHtml.concat("<p>Artist: ", sl[i].artist['@name'] , "</p>");
        theHtml = theHtml.concat("<p>City: ", sl[i].venue.city['@name'] , "</p>");
        theHtml = theHtml.concat("<p>Venue: ", sl[i].venue['@name'] , "</p>");
        theHtml = theHtml.concat("<br>");
    }
    console.log(theHtml);
    document.getElementById("resultConcert").innerHTML = theHtml;
    // console.local(docuement.getElementById("resultConcert");

}

/* Tour */ 


// function searchTour(nameArtist,nameTour){
function searchTour (cityName) {
    var serviceURL = "http://api.setlist.fm/rest/0.1/search/venues.json?"; 
    var parameter = new String();
    // SEE searchConcert
    parameter = parameter.concat("cityName=", cityName);
    var url = serviceURL + "" + parameter;
    console.log(url);

    $.ajax({
	    url : serviceURL + "" + parameter,
		type : "GET",
		dataType : "json",
		success : parseTour,
		error : showError
		});

}

function parseTour(dataJson){
    console.log("response " + dataJson);
    var theHtml = new String();
    var sl = dataJson.venues.venue;;
    for(var i in sl) {
        theHtml = theHtml.concat("<p><strong>", sl[i]['@name'] , "</strong></p>");
        theHtml = theHtml.concat("<p>City: ", sl[i].city['@name'] , "</p>");
        theHtml = theHtml.concat("<p>State: ", sl[i].city['@state'] , "</p>");
        theHtml = theHtml.concat("<p>Country: ", sl[i].city.country['@name'] , "</p>");
        theHtml = theHtml.concat("<br>");
    }
    console.log(theHtml);
    document.getElementById("resultTours").innerHTML = theHtml;
    
}

/**
 * Callback ajax error
 * @param request
 * @param error
 * @param obj
 */
function showError(request, error, obj) {
        console.log("Error received" + error + " " + request);
        alert("Error contacting remote Server.");
}

$( function() {
		
	/*$('#playaudio').click(function() {
        // Note: two ways to access media file: web and local file        
        //src = 'http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3';
        
        // local (on device): copy file to project's /assets folder:
        //var src = '/android_asset/spittinggames.m4a';
        
        playAudio(src);
    });*/

    // Start with Manual selected and Flip Mode hidden
    $('#nav-manual').focus();
    $('#content-list1').hide();
    $('#content-list2').hide();
    $('#content-list3').hide();
    $('#content-list4').hide();
   
    $('#nav-manual').live('tap', function() {
        console.log("nav-manual taped");
        $('#content-list1').hide();
        $('#content-list2').hide();
        $('#content-list3').hide();
        $('#content-list4').hide();
        $('#content-manual').show();
        stopAudio();
    });
   
    $('#nav-list1').live('tap', function() {
        $('#content-manual').hide();
        $('#content-list2').hide();
        $('#content-list3').hide();
        $('#content-list4').hide();
        $('#content-list1').show();
    });
    $('#nav-list2').live('tap', function() {
        $('#content-manual').hide();
        $('#content-list1').hide();
        $('#content-list3').hide();
        $('#content-list4').hide();
        $('#content-list2').show();
    });
	
    $('#nav-list3').live('tap', function() {
        $('#content-manual').hide();
        $('#content-list2').hide();
        $('#content-list1').hide();
        $('#content-list4').hide();
        $('#content-list3').show();
    });
	
    $('#nav-list4').live('tap', function() {
        $('#content-manual').hide();
        $('#content-list2').hide();
        $('#content-list3').hide();
        $('#content-list1').hide();
        $('#content-list4').show();
    });
		

    $("#pauseaudio").live('click', function() {
        pauseAudio();
    });
    
    $("#stopaudio").live('tap', function() {
        stopAudio();
    });
    
    $('#music1').click(function() {
    	src = 'http://www.universal-soundbank.com/mp3/sounds/10157.mp3';
    	playAudio(src);
    });
    
    $('#music2').click(function() {
    	src = 'http://www.universal-soundbank.com/mp3/sounds/10183.mp3';
    	playAudio(src);
    });
    
    $('#music3').click(function() {
        console.log("---music3 clicked---")
    	src = 'http://www.s1download-universal-soundbank.com/mp3/sounds/11266.mp3';
    	playAudio(src);
    });
    
    $('#music4').click(function() {
        console.log("---music4 clicked---")
        //change radio:

    	//src = 'http://stream1.addictradio.net/addictrock.mp3';
    	playAudio(src);
    });
    
    $("#searchButtonConcert").click(function() {
	    // get the vars : artistName and cityName
	    artistName=$('#artistNameConcert').val();	
	    nameCity=$('#cityName').val();
	    // call the function to make an ajax request
        searchConcerts(artistName, nameCity);
    });
    
    $("#searchButtonTour").click(function() {
	    // searchTour(nameArtist, nameTour);
        cityName=$('#cityNameTour').val();
        searchTour(cityName);
    });


    
    // implement a function to read a file from the sdcard
    
});


var changeRadio = function(n) {
    if (my_media == null) {
        console.log("OK I am null. Go ahead");
    } else {
        console.log("---I am in else if(my_media == null)---");
        my_media.stop();
        my_media.release();
        my_media = null;

    }
    switch (n) {
        case 1:
            src = "http://stream1.addictradio.net/addictrock.mp3";
            break;
        case 2:
            src = "http://195.55.74.205/rtve/radio1.mp3";
            break;
        case 3:
            src = "http://195.142.3.85/power/PowerTurk_mpeg_128_home/icecast.audio";
            break;

    }
    playAudio(src);
};

// RNE: http://195.55.74.205/rtve/radio1.mp3
// Türk FM: http://195.142.3.85/power/PowerTurk_mpeg_128_home/icecast.audio
