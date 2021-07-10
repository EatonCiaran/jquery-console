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

### history
Integer to set how many messages to retain. Default: `10000`.

### msgDirection
String to denote whether messages are appended to the top or bottom. Default: `"down"`
* `"down"`: append to the bottom
* `"up"`: append to the top

### showTimestamp
Boolean flag indicating whether the timestamp the message was logged should be shown. Default: `true`

### timeout
Integer to set how long in milliseconds until messages are deleted. Setting to `0` results in no timeout. Default: `0`

---

## Utility Methods

### log
Logs message to the assigned console. Takes 2 parameters:
* `msg`: String representing the message to be logged. Required.
* `level`: Can either be an integer or string representing the desired visual style. Default: `6`

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
