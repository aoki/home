const rpio = require('rpio')
const { LOW, HIGH } = require('rpio')

// rpio.init({
//     mock: 'raspi-2',
// })

const CHIP_SELECT_PIN = 24;
const MASTER_OUT_PIN = 19;
const MASTER_IN_PIN = 21;
const CLOCK_PIN = 23;

const chipSelect = (d) => {rpio.write(CHIP_SELECT_PIN, d);}
const clockForward = (count) => {
    for (var i = 0; i < count; i++) {
        rpio.write(CLOCK_PIN, HIGH);
        rpio.write(CLOCK_PIN, LOW);
    }
}

const readValue = () => {
    rpio.open(MASTER_OUT_PIN, rpio.OUTPUT); // GPIO10 SPI MOSI: Master Out Slave In
    rpio.open(MASTER_IN_PIN, rpio.INPUT); // GPIO09 SPI MISO: Master In Slave Out
    rpio.open(CLOCK_PIN, rpio.OUTPUT); // GPIO11 SPI SCLK: Serial Clock
    rpio.open(CHIP_SELECT_PIN, rpio.OUTPUT, rpio.PULL_UP); // GPIO08 SPI CS0

    // Start
    rpio.write(CHIP_SELECT_PIN, LOW);

    // Ch. (0~7)
    const ch = 0;

    /*
        00011000
        左から4番めから 5bit を利用する
        1bit スタートビット
        2bit Single/Diff
        3-5bit チャンネル
        3bit シフトして左に揃える 11000000
        @see http://hogerian1306.hatenablog.com/entry/2016/05/10/232741
    */
    var cmd = (ch | 0x18) << 3;

    // 左から5bit送信する
    for (var i = 0; i < 5; i++) {
        rpio.write(MASTER_OUT_PIN, (cmd & 0x80) ? HIGH : LOW);
        cmd <<= 1;
        clockForward(1);
    }

    // 受信は全 13bit。12bitの分解能なので12bit+NullBit
    var result = 0;
    for (var i = 0; i < 13; i++) {
        result <<= 1;
        clockForward(1);
        if (rpio.read(MASTER_IN_PIN)) {
            result |= 0x1;
        }
    }

    // End
    rpio.write(CHIP_SELECT_PIN, HIGH);

    console.log('result : ', result);

    rpio.close(MASTER_OUT_PIN)
    rpio.close(MASTER_IN_PIN)
    rpio.close(CLOCK_PIN)
    rpio.close(CHIP_SELECT_PIN)
}

setInterval(readValue, 1000);

