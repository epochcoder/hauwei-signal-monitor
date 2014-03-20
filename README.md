hauwei-signal-monitor
=====================

Simple NodeJS application to monitor signal status from a Huawei E5331 3G modem and report it to an Arduino

____
Steps:

* Install NodeJS
* Install Arduino
* Install Python 2.7.x (_required for serial-port_)
* Install Visual Studio 2013 (_required for serial-port_)
* Upload StandardFirmata to Arduino
* `npm install request`, `npm install xml2js`, `npm install johnny-five`
* `node signal-monitor.js`

The scematics for setting up the arduino are quite easy, it uses 5 pwm pins at `3, 5, 6, 9` and `10`, LED's share a common ground, each LED anode is connected to a resistor which in turn is connected to its respective pin.

Note:

The polling url, interval and serial-port is currently hardcoded in `signal-monitor.js`
