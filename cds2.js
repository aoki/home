const rpio = require('rpio')
const { LOW, HIGH } = require('rpio')

// rpio.init({
//     mock: 'raspi-2',
// })
const CHIP_SELECT_PIN = 24

const readValue = () => {
    rpio.open(19, rpio.OUTPUT); // GPIO10 SPI MOSI: Master Out Slave In
    rpio.open(21, rpio.INPUT); // GPIO09 SPI MISO: Master In Slave Out
    rpio.open(23, rpio.OUTPUT); // GPIO11 SPI SCLK: Serial Clock

    rpio.open(CHIP_SELECT_PIN, rpio.OUTPUT, rpio.PULL_UP); // GPIO08 SPI CS0
    const CHIP_SELECT = (d) => {rpio.write(CHIP_SELECT, d);}

    const clock = (count) => {
        for (var i = 0; i < count; i++) {
            rpio.write(23, HIGH);
            rpio.write(23, LOW);
        }
    }

    // process.on('SIGINT', () => {
    //     console.log('SIG')
    //     rpio.close(19)
    //     rpio.close(21)
    //     rpio.close(23)
    //     rpio.close(24)
    //     rpio.exit();
    // });

    rpio.write(CHIP_SELECT, LOW);

    const ch = 0; // 0 ch. (0~7)
    var cmd = (ch | 0x18) << 3;
    for (var i = 0; i < 5; i++) {
        rpio.write(19, (cmd & 0x80) ? HIGH : LOW);
        cmd <<= 1;
        clock(1);
    }

    var result = 0;
    for (var i = 0; i < 13; i++) { // one null bit and 12 ADC bits.
        result <<= 1;
        clock(1);
        if (rpio.read(21)) { // === 1
            result |= 0x1;
        }
    }

    rpio.write(CHIP_SELECT, HIGH);
    console.log('result : ', result);


    rpio.close(19)
    rpio.close(21)
    rpio.close(23)
    rpio.close(24)
}
setInterval(readValue, 1000);

