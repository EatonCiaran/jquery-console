# jQuery Console

## Overview

The jQuery Console plugin allows you to easily create a non-interactive console within a page.


## Compatibility
* Known to work with jQuery v3.x.x

---

## Usage

Initialise the console by attaching it to a `div` tag. `options` is optional.

````javascript
let options = { msgDirection: "up" };
let myConsole = $("div").console(options);
````

Log messages with the `log` method.

````javascript
myConsole.log("message");
````

## Options

### defaultLevel
Integer or string. Set the default severity level of messaages. If an integer it needs to be a valid index of the levels 
array and if it's a string the value needs to be found in that array.

### fadeoutTime
Integer to set how long in milliseconds messages take to fadeout when `timeout` is being used. Default: `400`.

### history
Integer to set how many messages to retain. Set to `0` to retain everything (Not recommended). Default: `10000`.

### levels
Array of severity levels. Modifying this is only useful if the number of default severities is insufficient for your CSS needs. 
Default `["emergency", "alert", "critical", "error", "warning", "notice", "info", "debug"]`

### msgDirection
String to denote whether messages are appended to the top or bottom. Default: `"down"`.
* `"down"`: append to the bottom
* `"up"`: append to the top

### showTimestamp
Boolean to enable displaying of message timestamps. Default: `true`.

### tagOddEven
Boolean to enable messages being tagged odd or even to allow alternating message styling. Default `false`.

### timeout
Integer to set how long in milliseconds until messages are deleted. Set to `0` for no timeout. Default: `0`.

### timestampOnLeft
Boolean to control whether timestamp appears on the left or the right of the message. Default: `false`.

---

## Utility Methods

### log
Logs message to the assigned console. Takes 2 parameters:
* `msg`: String representing the message to be logged. Required.
* `level`: Can either be an integer or string representing the desired visual style / severity. Default determined by the option `defaultLevel`. Assuming the option `levels` is default the following values are accepted:

| Integer | String        |
| ------- | ------------- |
| `0`     | `"emergency"` |
| `1`     | `"alert"`     |
| `2`     | `"critical"`  |
| `3`     | `"error"`     |
| `4`     | `"warning"`   |
| `5`     | `"notice"`    |
| `6`     | `"info"`      |
| `7`     | `"debug"`     |


---

## License

This project is under the GPLv3:

* [GNU General Public License v3](LICENSE)
