const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Influx = require('influx')
const ltsv = require('ltsv')

const port = new SerialPort('/dev/cu.usbmodem143101')
const host = 'living.arduino.aoki.dev'
const MEASUREMENT = 'arduino_sensors'

try {
  const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
  parser.on('data', (line) => {
    const data = ltsv.parse(line)[0]
    console.log(data)
    influx.writePoints([{
      measurement: MEASUREMENT,
      tags: { host: host },
      fields: {
        pressure: data.pressure,
        temperature: data.temperature,
        humidity: data.humidity,
        illuminance: data.brightness
      }
    }]);
  })
} catch (error) {
  console.log(error);
}



const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'home',
  schema: [{
    measurement: MEASUREMENT,
    fields: {
      pressure: Influx.FieldType.INTEGER,
      temperature: Influx.FieldType.FLOAT,
      humidity: Influx.FieldType.FLOAT,
      illuminance: Influx.FieldType.INTEGER
    },
    tags: ['host']
  }]
})
