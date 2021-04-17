clockIN = function ( options ) {

	if ( typeof options == 'undefined' || typeof options.ele == 'undefined' )
		throw "Element Required";

	var _this = this;

	this.Options = {
		order: 'up',
		audio: {},
		muted: false
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
	            <span class="clockin-hour">00</span>
	            <span class="clockin-separator">:</span>
	            <span class="clockin-min">00</span>
	            <span class="clockin-separator">:</span>
	            <span class="clockin-sec">00</span>
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
            
            if ( ! _this.Options.muted ) audio.pause();
    
            ele.querySelector('.clockin-btn-pause').style.display = 'none';
            ele.querySelector('.clockin-btn-start').style.display = 'table-cell';

        });

	    ele.querySelector('.clockin-btn-reset').addEventListener('click', function( e ) {

            seconds = 0;
			minutes = 0;
			hours = 0;
			_this.Options.ele.querySelector('.clockin-sec').innerHTML = minTwoDigits( 0 );
			_this.Options.ele.querySelector('.clockin-min').innerHTML = minTwoDigits( 0 );
			_this.Options.ele.querySelector('.clockin-hour').innerHTML = minTwoDigits( 0 );

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

		  			_this.Options.ele.querySelector('.clockin-hour').innerHTML = minTwoDigits( hours );

		  		}
		  		
		  		_this.Options.ele.querySelector('.clockin-min').innerHTML = minTwoDigits( minutes );

		  	}
		  	
		  	_this.Options.ele.querySelector('.clockin-sec').innerHTML = minTwoDigits( seconds );

		  	if ( ! _this.Options.muted ) {
	            audio = new Audio( 'assets/audio/' + seconds + '.mp3' );
	            audio.play();	
		  	}
	
		}, 1000 );
	
	}

	function minTwoDigits( number ) {
		return ( number < 10 ? '0' : '' ) + number;
	}

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