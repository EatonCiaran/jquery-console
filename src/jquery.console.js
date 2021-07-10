/*!
 * jQuery Console
 * version: 1.0.0
 * Known to work with jQuery v3.x.x
 * Project repository: https://github.com/EatonCiaran/jquery-console
 * 
 * Copyright 2021 Ciarán Eaton
 * 
 * Licensed under GPLv3
 * https://github.com/EatonCiaran/jquery-console#license
 * 
 */

(function ( $ ) {
    $.fn.console = function( options ) {
      var settings = $.extend({
        showTimestamp: true,
        msgDirection: "down",
        history: 10000,
        timeout: 0
      }, options );
  
      var flags = {
        scrollbarMoved: false       // denote if user has positioned scrollbar
      }
      var $this = $( this );
  
      this.each(function() {
        $this.addClass( "jquery-console" );
      });
  
      this._getCssLevel = function( level ) {
        /*
          Takes a level in the form of integer in the range 0-7
          or string of a valid level and Returns a string representing
          that level's CSS labal.
        */
  
        var levels = [
          "emergency", "alert", "critical", "error",
          "warning", "notice", "info", "debug"
        ];
        var css_base = "jquery-console-lvl-";
        var index = 6;                      // Default level
  
        // If level is a number check its a valid index
        if ( level >= 0 && level < levels.length ) {
          index = level;
        }
  
        // If level is a string validate it
        for (var i = 0; i < levels.length; i++) {
          if ( level == levels[i] ) {
            index = i;
          }
        }
  
        return css_base + levels[index];
      };
  
      this._setScrollBar = function() {
        /*
          Set scrollbar position based on message direction and if
          user has moved the scrollbar
        */
  
        if ( settings.msgDirection == "down" && !flags.scrollbarMoved) {
          var h = $this.prop("scrollHeight");
          var c = $this.prop("clientHeight");
          $this.scrollTop( h-c );
        }
      }
  
      this._createEntry = function( msg, level ) {
        // Create skeleton
        var $newElement = $( "<div class='jquery-console-entry'></div>" );
        $( "<span class='jquery-console-msg'></span>" ).appendTo( $newElement );
  
        // Add CSS for Severity Level
        var c_level = this._getCssLevel(level);
        $newElement.addClass(c_level);
  
        // Add message
        var $msgElement = $newElement.children( ".jquery-console-msg" );
        $msgElement.text( msg );
  
        // Add timestamp
        if ( settings.showTimestamp ) {
          var d = new Date();
          d = d.toLocaleTimeString();
  
          $msgElement.addClass( "jquery-console-msg-nots" );
  
          $( "<span class='jquery-console-timestamp'></span>" ).appendTo( $newElement );
          $newElement.children( ".jquery-console-timestamp" ).text( d );
        }
  
        return $newElement;
      };
  
      this._adjustHeight = function( $newElement ) {
        var $msgElement = $newElement.children( ".jquery-console-msg" );
        $newElement.height( $msgElement.height() );
      };
  
      this._insertMsg = function( $newElement ) {
        if ( settings.msgDirection == "up" ) {
          $newElement.prependTo( this );       // Insert at the top
        }
        else {
          // Set flag if scrollbar was moved by user.
          flags.scrollbarMoved = false;
          var h = $this.prop("scrollHeight") - $this.prop("clientHeight");
          if ( $this.scrollTop() != h ) {
            flags.scrollbarMoved = true;
          }
  
          $newElement.appendTo( this );       // Insert at the bottom
        }
      };
  
      this._kullHistory = function() {
        /*
          Delete old messages if history size exceeded.
        */
  
        if ( settings.history == 0 ) {
          return;   // Do nothing
        }
  
        var queueSize = $this.children(".jquery-console-entry").length;
        if ( queueSize > settings.history ) {
          if ( settings.msgDirection == "up" ) {
            $this.children(".jquery-console-entry").last().remove();
          }
          else {
            $this.children(".jquery-console-entry").first().remove();
          }
        }
      };
  
      this._attachTimeout = function( $msgElement ) {
        if ( settings.timeout > 0 ) {
          $msgElement.delay( settings.timeout ).fadeOut( 400, function() {
            $( this ).remove();
          });
        }
      };
  
      this.log = function( msg, level ) {
        /*
          Add message entry to jquery-console panel
        */
  
        // Create
        var $newElement = this._createEntry( msg, level );    // Create HTML
        this._insertMsg( $newElement );                       // Insert to DOM
  
        // Cleanup
        this._attachTimeout( $newElement );   // Attach a timeout to the message
        this._kullHistory();                  // Delete old history
        this._setScrollBar();                 // Set Scrollbar position
        this._adjustHeight( $newElement );    // Correct the message height
      }
  
      return this;
    };
  }( jQuery ));  