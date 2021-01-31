const raspi = require('raspi');
const gpio = require('raspi-gpio');

const HIGH = gpio.HIGH;
const LOW = gpio.LOW;
const Input = gpio.DigitalInput;
const Output = gpio.DigitalOutput;

const initHandler = function () {

    const d_in = new Output('GPIO10'); //SPI_MOSI
    const d_out = new Input('GPIO9');   //SPI_MISO
    const clk = new Output('GPIO11'); //SPI_CSLK
    const cs = new Output({ 'pin': 'GPIO8', 'pullResistor': gpio.PULL_UP });  //SPI_CE0

    const clock = function (count) {
        for (var i = 0; i < count; i++) {
            clk.write(HIGH);
            clk.write(LOW);
        }
    };

    const readValue = function () {
        cs.write(LOW); //start

        const ch = 0; // 0 ch. (0~7)
        var cmd = (ch | 0x18) << 3;
        for (var i = 0; i < 5; i++) {
            d_in.write((cmd & 0x80) ? HIGH : LOW);
            cmd <<= 1;
            clock(1);
        }

        var result = 0;
        for (var i = 0; i < 13; i++) { // one null bit and 12 ADC bits.
            result <<= 1;
            clock(1);
            if (d_out.read()) { // === 1
                result |= 0x1;
            }
        }

        cs.write(HIGH); //end

        //TODO:結果出力
        console.log('result : ', result);
    };

    setInterval(readValue, 1000);

};

raspi.init(initHandler);
