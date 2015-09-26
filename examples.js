var NumatoLab32ChannelUSBGPIOModule = new (require("./NumatoLab32ChannelUSBGPIOModule.js"))();

NumatoLab32ChannelUSBGPIOModule
    .setDevicePath("/dev/ttyACM0")
    .init();

console.log("Version: " + NumatoLab32ChannelUSBGPIOModule.getVersion());
console.log("Id Set...");
NumatoLab32ChannelUSBGPIOModule.idSet("00000000");
console.log("Id: " + NumatoLab32ChannelUSBGPIOModule.idGet());
console.log("GPIO 1 Clear...");
NumatoLab32ChannelUSBGPIOModule.gpioClear(1);
console.log("GPIO 1 Read: " + NumatoLab32ChannelUSBGPIOModule.gpioRead(1));
console.log("GPIO 1 ADC Read: " + NumatoLab32ChannelUSBGPIOModule.adcRead(1));
console.log("GPIO Read All: " + NumatoLab32ChannelUSBGPIOModule.gpioReadAll());
console.log("GPIO 1 Set...");
NumatoLab32ChannelUSBGPIOModule.gpioSet(1);
console.log("GPIO 1 Read: " + NumatoLab32ChannelUSBGPIOModule.gpioRead(1));
console.log("GPIO Read All: " + NumatoLab32ChannelUSBGPIOModule.gpioReadAll());
console.log("GPIO Write all (2147483647)...");
NumatoLab32ChannelUSBGPIOModule.gpioWriteAll(2147483647);
console.log("GPIO Read All: " + NumatoLab32ChannelUSBGPIOModule.gpioReadAll());
console.log("GPIO I/O Mask(00000000/0)...");
NumatoLab32ChannelUSBGPIOModule.gpioWriteIomask(0);
console.log("GPIO I/O Dir(00000000/0)...");
NumatoLab32ChannelUSBGPIOModule.gpioWriteIodir(0);
console.log("GPIO 1 ADC Read: " + NumatoLab32ChannelUSBGPIOModule.adcRead(1));