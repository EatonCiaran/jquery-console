/**
 * jQuery Console
 * 
 * @file A jQuery plugin to create a non-interactive console within a page.
 * 
 * @author Ciarán Eaton
 * @version: 1.1.0
 * Project repository: https://github.com/EatonCiaran/jquery-console
 * 
 * Known to work with jQuery v3.x.x
 * 
 * @license Licensed under GPLv3
 * https://github.com/EatonCiaran/jquery-console#license
 * 
 * @copyright Copyright 2021 Ciarán Eaton
 * 
 */

(function ($) {
    $.fn.console = function (options) {
        // validate options
        if (options.defaultLevel) {
            let levels = settings.levels;
            if (options.levels) {
                levels = options.levels;
            }

            if (typeof (options.defaultLevel) == "number") {
                if (options.defaultLevel < 0 || options.defaultLevel > levels.length) {
                    throw "Invalid index value for defaultLevel: " + options.defaultLevel;
                }
            }
            if (typeof (options.defaultLevel) == "string" && !levels.contains(options.defaultLevel)) {
                throw "Invalid name for defaultLevel: " + options.defaultLevel;
            }
            else {
                throw "Invalid type for defaultLevel: " + typeof (options.defaultLevel);
            }
        }

        // default settings
        let settings = $.extend({
            showTimestamp: true,        // Display timestamp or not
            timestampOnLeft: false,     // Display timestamp on the left or right
            msgDirection: "down",       // Control whether messages are added to the top or bototm of the stack
            history: 10000,             // Number of messages to keep
            timeout: 0,                 // Time in ms beofre message is deleted
            fadeOutTime: 400,           // Time in ms it takes for the animation of timeout message removal to complete
            levels: [                   // Severity levels
                "emergency", "alert", "critical", "error",
                "warning", "notice", "info", "debug"
            ],
            defaultLevel: 6,            // Default severity level of a message
            tagOddEven: false,          // Tagging of odd and even entries to aid styling
        }, options);

        // internal flags to denote state
        let flags = {
            scrollbarMoved: false,      // denote if user has positioned scrollbar
            odd: true                   // track whether next message is odd or even.
        }

        // setup
        let $this = $(this);
        this.each(function () {
            $this.addClass("jquery-console");
        });

        /**
         * Returns the CSS label for a given severity level. 
         * @param {int or string} level Severity level of the message. Can either be an index into 
         *                              or value from settings.levels
         * @returns {string}
         */
        this._getCssLevel = function (level) {
            function getName(val, arr) {
                // if level is a number and a valid index
                if (typeof (val) == "number" && val >= 0 && val < arr.length) {
                    return arr[val];
                }
                // if level is a string and a valid value
                else if (typeof (val) == "string" && arr.includes(val)) {
                    return val;
                }
                return false;
            }

            const css_base = "jquery-console-lvl-";
            let level_name = getName(0, settings.levels);    // default

            let name = getName(level, settings.levels);
            if (name) {
                level_name = name;
            }
            else if (typeof(level) == "undefined") {
                level_name = getName(settings.defaultLevel, settings.levels);    // override default with custom default
            }
            // else anything other than being undefined is bad. Default level will be used eitherway
            else {
                console.log("jQuery Console: Invalid severity level. Level: " + level);
            }

            return css_base + level_name;
        };

        /**
         * Force scrollbar to the bottom position if message direction is down, thus preventing the bar 
         * auto scrolling up when messages are added.
         */
        this._setScrollBar = function () {
            if (settings.msgDirection == "down" && !flags.scrollbarMoved) {
                let h = $this.prop("scrollHeight");
                let c = $this.prop("clientHeight");
                $this.scrollTop(h - c);
            }
        }

        /**
         * Rteurns message wrapped in HTML.
         * @param {string} msg The content of the message
         * @param {int or string} level Severity level of the message. Can either be an index into 
         *                              or value from settings.levels
         * @returns {selector}
         */
        this._createEntry = function (msg, level) {
            // create skeleton
            let $msgEntry = $("<div class='jquery-console-entry'></div>");
            $("<span class='jquery-console-msg'></span>").appendTo($msgEntry);

            // add CSS for Severity Level
            let c_level = this._getCssLevel(level);
            $msgEntry.addClass(c_level);

            // if feature enabled, add CSS tags to denote odd even ness
            if (settings.tagOddEven) {
                if (flags.odd) {
                    $msgEntry.addClass("jquery-console-odd");
                    $msgEntry.addClass(c_level + "-odd");
                }
                else {
                    $msgEntry.addClass("jquery-console-even");
                    $msgEntry.addClass(c_level + "-even");
                }
                flags.odd = !flags.odd;
            }

            // add message
            let $msg = $msgEntry.children(".jquery-console-msg");
            $msg.text(msg);

            // add timestamp
            if (settings.showTimestamp) {
                let timestamp = new Date();
                timestamp = timestamp.toLocaleTimeString();

                $("<span class='jquery-console-timestamp'></span>").appendTo($msgEntry);
                $msgEntry.children(".jquery-console-timestamp").text(timestamp);

                // tag the message content to it's styled to accomate the timestamp
                if (settings.timestampOnLeft) {
                    $msg.addClass("jquery-console-msg-ts-left");
                    $msgEntry.children(".jquery-console-timestamp").addClass("jquery-console-timestamp-left");
                }
                else {
                    $msg.addClass("jquery-console-msg-ts");
                }
            }

            return $msgEntry;
        };

        /**
         * Sets message entry's height to the content's height.
         * @param {selector} $msgEntry Selector of message entry
         */
        this._adjustHeight = function ($msgEntry) {
            let $meg = $msgEntry.children(".jquery-console-msg");
            $msgEntry.height($meg.height());
        };

        /**
         * Inserts message entry into the DOM
         * @param {selector} $msgEntry The message entry to be inserted
         */
        this._insertMsg = function ($msgEntry) {

            if (settings.msgDirection == "up") {
                $msgEntry.prependTo(this);       // Insert at the top
            }
            else {
                // consdier the scrollbar user moved if it's not at the bottom position
                flags.scrollbarMoved = false;
                let h = $this.prop("scrollHeight") - $this.prop("clientHeight");
                if ($this.scrollTop() != h) {
                    flags.scrollbarMoved = true;
                }

                $msgEntry.appendTo(this);       // Insert at the bottom
            }
        };

        /**
         * Delete old messages if history size exceeded.
         * @returns None
         */
        this._cullHistory = function () {
            if (settings.history == 0) {
                return;   // Do nothing
            }

            let queueSize = $this.children(".jquery-console-entry").length;
            if (queueSize > settings.history) {
                if (settings.msgDirection == "up") {
                    $this.children(".jquery-console-entry").last().remove();
                }
                else {
                    $this.children(".jquery-console-entry").first().remove();
                }
            }
        };

        /**
         * Attach timeout event to messages if timeout is set.
         * @param {selector} $msgEntry Selector of the message entry
         */
        this._attachTimeout = function ($msgEntry) {
            if (settings.timeout > 0) {
                let timeout = settings.timeout;
                let fadeout = settings.fadeOutTime;

                // after delay, fadeout the message then remove.
                $msgEntry.delay(timeout).fadeOut(fadeout, function () {
                    $(this).remove();
                });
            }
        };

        /**
         * Log message entry to jquery-console panel
         * @param {string} msg The content of the message
         * @param {int or string} level Severity level of the message. Can either be an index into 
         *                              or value from settings.levels
         */
        this.log = function (msg, level) {
            // Create
            let $msgEntry = this._createEntry(msg, level);    // Create HTML
            this._insertMsg($msgEntry);                       // Insert to DOM

            // Finalise and cleanup
            this._attachTimeout($msgEntry);     // Attach a timeout to the message
            this._cullHistory();                // Delete old history
            this._setScrollBar();               // Set Scrollbar position
            this._adjustHeight($msgEntry);      // Correct the message height
        }

        return this;
    };
}(jQuery));