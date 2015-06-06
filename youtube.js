// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var VIDEO = {player:false};

function onYouTubeIframeAPIReady() {
	VIDEO.player = new YT.Player('player', {
	  height: '390',
	  width: '640',
	  videoId: 'M7lc1UVf-VE',
	  events: {
	  	'onReady' : onPlayerReady
	  }
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
	VIDEO.duration = VIDEO.player.getDuration();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	/*
	if (event.data == YT.PlayerState.PLAYING && !done) {
	  setTimeout(stopVideo, 6000);
	  done = true;
	}
	*/
}
function stopVideo() {
	VIDEO.player.stopVideo();
}

setInterval(function() {
if (typeof VIDEO.player.getCurrentTime === 'function') {
	var duration = VIDEO.player.getDuration();
	var currentTime = VIDEO.player.getCurrentTime();
	//console.log(currentTime/duration*100+'%');

	for (var i in annotations) {
		if (annotations[i].start <= currentTime && annotations[i].stop >= currentTime) {
			//console.log(annotations[i].content);
		}
	}

  //console.log(player.getCurrentTime());
}

}, 1000);


var annotations = [
	{'start':4, 'stop':10, 'content':'hi'},
	{'start':10, 'stop':100, 'content':'second'},
	{'start':6, 'stop':19, 'content':'third'}
];