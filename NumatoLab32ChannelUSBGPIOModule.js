/**
 * Interface for the Numato Lab 32 Channel USB Gpio Module:
 * http://numato.com/32-channel-usb-gpio-module.html
 *
 * Based on:
 * http://numato.com/downloads/dl/file/id/38/product/35/user_manual.pdf
 *
 * Requires: exec-sync (issue "npm install exec-sync" or "npm install" to install).
 *
 * Example usage:
 *
 * var NumatoLab32ChannelUSBGPIOModule = new (require("./NumatoLab32ChannelUSBGPIOModule.js"))();
 * NumatoLab32ChannelUSBGPIOModule.setDevicePath("/dev/ttyACM0").init();
 * console.log("Version: " + NumatoLab32ChannelUSBGPIOModule.getVersion());
 * NumatoLab32ChannelUSBGPIOModule.gpioClear(1);
 * console.log("GPIO 1 Read: " + NumatoLab32ChannelUSBGPIOModule.gpioRead(1));
 *
 * TODO: Add error handling and perform further testing.
 *
 * @constructor
 */
var NumatoLab32ChannelUSBGPIOModule = function() {
    var devicePath,
        sttyCommandPath = "/bin/stty",
        fs = require("fs"),
        execSync = require("exec-sync"),
        disableFlowControl,
        enableRawMode,
        sendCommand;

    /**
     * Sets the Linux device path for Numato Lab 32 Channel USB Gpio Module serial device.
     *
     * I.e.: /dev/ttyACM0
     *
     * @param {String} dev
     * @returns {NumatoLab32ChannelUSBGPIOModule}
     */
    this.setDevicePath = function(dev) {
        devicePath = dev;
        return this;
    };

    /**
     * Returns the set device path.
     *
     * @returns {String}
     */
    this.getDevicePath = function() {
        return devicePath;
    };

    // Convenience method used for issuing an stty command for disabling flow control.
    disableFlowControl = function() {
        execSync(sttyCommandPath + " -F " + this.getDevicePath() + " -ixon -ixoff -crtscts");
    };

    // Convenience method used for issuing an stty command for enabling raw mode.
    enableRawMode = function() {
        execSync(sttyCommandPath + " -F " + this.getDevicePath() + " raw");
    };

    // Convenience method used for sending a command to the serial device.
    // Returns the response string.
    sendCommand = function(command) {
        var fd = fs.openSync(this.getDevicePath(), "r+"),
            buffer = new Buffer(1024),
            bufferString,
            response;

        fs.writeSync(fd, command);
        fs.readSync(fd, buffer, 0, 1024);
        bufferString = buffer.toString();
        response = ((bufferString.split(/\r?\n/))[1]);
        fs.closeSync(fd);

        return response;
    };

    /**
     * Returns the device id.
     *
     * @returns {String}
     */
    this.idGet = function() {
        return (sendCommand.bind(this)("id get\r")).replace(/\W/g, '');
    };

    /**
     * Sets the device id.
     *
     * @param {String} id
     */
    this.idSet = function(id) {
        sendCommand.bind(this)("id set " + id + "\r");
    };

    /**
     * Sets a pin status to low by issuing a 'gpio clear x' command.
     *
     * @param {Number} pin
     */
    this.gpioClear = function(pin) {
        sendCommand.bind(this)("gpio clear " + pin + "\r");
    };

    /**
     * Sets a pin status to high by issuing a 'gpio set x' command.
     *
     * @param {Number} pin
     */
    this.gpioSet = function(pin) {
        sendCommand.bind(this)("gpio set " + pin + "\r");
    };

    /**
     * Reads a pin status by issuing a 'gpio read x' command.
     *
     * @param {Number} pin
     * @return {Number}
     */
    this.gpioRead = function(pin) {
        return parseInt(sendCommand.bind(this)("gpio read " + pin + "\r"), 10);
    };

    /**
     * Read a pin analog voltage by issuing a 'adc cread x' command.
     *
     * @param {Number} pin
     * @return {Number}
     */
    this.adcRead = function(pin) {
        return parseInt(sendCommand.bind(this)("adc read " + pin + "\r"), 10);
    };

    /**
     * Read the status of all pins by issuing a 'gpio readall' command, and returning an integer.
     *
     * @return {Number}
     */
    this.gpioReadAll = function() {
        return parseInt(sendCommand.bind(this)("gpio readall\r"), 16);
    };

    /**
     * Set the status of all pins by issuing a 'gpio writeall' command.
     *
     * @param {Number} value
     */
    this.gpioWriteAll = function(value) {
        sendCommand.bind(this)("gpio writeall " + (value !== 0 ? Number(value).toString(16) : "00000000") + "\r");
    };

    /**
     * Sets the I/O mask of all pins by issuing a 'gpio iomask xxxxxxxx' command.
     *
     * @param {Number} value
     */
    this.gpioWriteIomask = function(value) {
        sendCommand.bind(this)("gpio iomask " + (value !== 0 ? Number(value).toString(16) : "00000000") + "\r");
    };

    /**
     * Sets the I/O direction of all pins by issuing a 'gpio iodir xxxxxxxx' command.
     *
     * @param {Number} value
     */
    this.gpioWriteIodir = function(value) {
        sendCommand.bind(this)("gpio iodir " + (value !== 0 ? Number(value).toString(16) : "00000000") + "\r");
    };

    /**
     * Fetches the device version.
     *
     * @returns {Number}
     */
    this.getVersion = function() {
        return parseInt(sendCommand.bind(this)("ver\r"), 16);
    };

    /**
     * Initializes the module. Must be called before issuing any commands.
     */
    this.init = function() {
        disableFlowControl.bind(this)();
        enableRawMode.bind(this)();
    };
};

module.exports = NumatoLab32ChannelUSBGPIOModule;
// ;-)