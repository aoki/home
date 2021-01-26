const bme280 = require('bme280');
const Influx = require('influx')

const host = 'living.raspberry.aoki.dev'
const MEASUREMENT = 'sensors'

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
});

const getSensorData = async () => {
  const sensor = await bme280.open({ i2cAddress: 0x76 })
  const data = await sensor.read()
  console.log(data);
  influx.writePoints([{
    measurement: MEASUREMENT,
    tags: { host: host },
    fields: {
      pressure: data.pressure,
      temperature: data.temperature,
      humidity: data.humidity,
      illuminance: 0
    }
  }]);
}

setInterval(getSensorData, 5000);


// bme280.open({ i2cAddress: 0x76 }).then(async sensor => {
//   const data = await sensor.read()
//   console.log(data);

//   influx.writePoints([{
//     measurement: MEASUREMENT,
//     tags: { host: host },
//     fields: {
//       pressure: data.pressure,
//       temperature: data.temperature,
//       humidity: data.humidity,
//       illuminance: 0
//     }
//   }]);

// }).catch(err => {
//   console.log(err);
//   sensor.close();
// });

