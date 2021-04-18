(function(){

	var mimeType = 'data:audio/mpeg;base64,';
  	const request = new XMLHttpRequest();
  	request.open("GET", "assets/js/resources.json");
  	request.responseType = "json";
  	request.onload = function() {
	    
	    if ( request.status == 200 ) {

	    	for (const [key, value] of Object.entries(request.response)) {

		    	var binary_string = window.atob(value);
			    var len = binary_string.length;
			    var bytes = new Uint8Array(len);
			    for (var i = 0; i < len; i++) {
			        bytes[i] = binary_string.charCodeAt(i);
			    }

		    	var undecodedAudio = bytes.buffer;
		    	clockInAudioCtx.decodeAudioData( undecodedAudio, (data) => clockInBuffer[key] = data );

			}

	    }

  	};
  	request.send();

})();

var clockInAudioCtx = new AudioContext();
var clockInBuffer = [];

clockIN = function ( options ) {

	if ( typeof options == 'undefined' || typeof options.ele == 'undefined' )
		throw "Element Required";

	var _this = this;

	this.Options = {
		type: 'stopwatch',                           //stopwatch, countdown
		muted: false,                                //true, false
		audioSpeed: 1,                               //positive float value
		startFrom: { h: '00', m: '01', s: '00' }     //object
	};

	// Overwriting default values
  	for( var key in options ){
    	this.Options[key] = options[key];
  	}

  	this.Options.ele = document.querySelector(this.Options.ele);

	var interval;

	var seconds = 0;
	var minutes = 0;
	var hours = 0;
	var audio;

	_createUI();
	_bindEvents();

	function _createUI( ele ) {

		_this.Options.ele.innerHTML = `
			<div class="clockin-timer">
	            <div class="clockin-time-wrapper">
	            	<span class="clockin-hour">00</span>
		            <span class="clockin-separator">:</span>
		            <span class="clockin-min">00</span>
		            <span class="clockin-separator">:</span>
		            <span class="clockin-sec">00</span>
		        </div>
	        </div>
	        <div class="clockin-actions">
	            <button class="clockin-btn-start">
	                <i class="clockin-play"></i>
	            </button>
	            <button class="clockin-btn-pause">
	                <i class="clockin-pause"></i>
	            </button>
	            <button class="clockin-btn-reset">
	                <i class="clockin-reload"></i>
	            </button>
	    	</div>`;

	}

	function _bindEvents() {

		var ele = _this.Options.ele;

	    ele.querySelector('.clockin-btn-start').addEventListener('click', function( e ) {
            
            _startTimer();
            ele.querySelector('.clockin-btn-start').style.display = 'none';
            ele.querySelector('.clockin-btn-pause').style.display = 'table-cell';

        });

	    ele.querySelector('.clockin-btn-pause').addEventListener('click', function( e ) {
            
            clearInterval( interval );
            
            if ( ! _this.Options.muted && audio != undefined ) audio.stop(0);
    
            ele.querySelector('.clockin-btn-pause').style.display = 'none';
            ele.querySelector('.clockin-btn-start').style.display = 'table-cell';

        });

	    ele.querySelector('.clockin-btn-reset').addEventListener('click', function( e ) {

            seconds = 0;
			minutes = 0;
			hours = 0;
			_this.Options.ele.querySelector('.clockin-sec').innerHTML = _minTwoDigits( 0 );
			_this.Options.ele.querySelector('.clockin-min').innerHTML = _minTwoDigits( 0 );
			_this.Options.ele.querySelector('.clockin-hour').innerHTML = _minTwoDigits( 0 );

        });
	
	}

	function _startTimer() {

		interval = setInterval( function(){ 

		  	seconds++;

		  	if ( seconds > 59 ) {

		  		seconds = 0;
		  		resetSeconds = true;
		  		
		  		minutes++;

		  		if ( minutes > 59 ) {

		  			minutes = 0;

		  			hours++;

		  			_this.Options.ele.querySelector('.clockin-hour').innerHTML = _minTwoDigits( hours );

		  		}
		  		
		  		_this.Options.ele.querySelector('.clockin-min').innerHTML = _minTwoDigits( minutes );

		  	}
		  	
		  	_this.Options.ele.querySelector('.clockin-sec').innerHTML = _minTwoDigits( seconds );

		  	if ( ! _this.Options.muted ) {

	            _setAudioBuffer( seconds );
			  	audio.playbackRate.value = _this.Options.audioSpeed;
			  	audio.start();

		  	}
	
		}, 1000 );
	
	}

	function _minTwoDigits( number ) {

		return ( number < 10 ? '0' : '' ) + number;

	}

	function _setAudioBuffer( index ) {
		
		if ( clockInAudioCtx.state === 'suspended' ) clockInAudioCtx.resume();

	  	audio = clockInAudioCtx.createBufferSource();
	  	audio.buffer = clockInBuffer[ index ];
	  	audio.connect( clockInAudioCtx.destination );

	};

	this.start = function() {
		this.Options.ele.querySelector('.clockin-btn-start').click();
	}

	this.pause = function() {
		this.Options.ele.querySelector('.clockin-btn-pause').click();
	}

	this.reset = function() {
		this.Options.ele.querySelector('.clockin-btn-reset').click();
	}

}