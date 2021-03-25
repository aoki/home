const Influx = require('influx');
const cron = require('node-cron');
const fast = require('./node_modules/fast-cli/api.js');

const MEASUREMENT = 'fast_com'
const host = 'living.fast.aoki.dev'

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'home',
  schema: [{
    measurement: MEASUREMENT,
    fields: {
      upload: Influx.FieldType.FLOAT,
      download: Influx.FieldType.FLOAT
    },
    tags: ['host']
  }]
})

let data;

const getSpeed = async () => {
	try {
		await fast({measureUpload: true}).forEach(result => {
			data = result;
		});
		switch (data.uploadUnit) {
			case 'Mbps':
				data.uploadSpeed = data.uploadSpeed * 1024 * 1024
				break;
			case 'Kbps':
				data.uploadSpeed = data.uploadSpeed * 1024
				break;
			default:
				console.log(`Upload unit not found: ${data.uploadUnit}`)
		}

		switch (data.downloadUnit) {
			case 'Mbps':
				data.downloadSpeed = data.downloadSpeed * 1024 * 1024
				break;
			case 'Kbps':
				data.downloadSpeed = data.downloadSpeed * 1024
				break;
			default:
				console.log(`Upload unit not found: ${data.downloadUnit}`)
		}

		influx.writePoints([{
      measurement: MEASUREMENT,
      tags: { host: host },
      fields: {
        downloadSpeed: data.downloadSpeed,
        uploadSpeed: data.uploadSpeed
      }
    }]);

	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

cron.schedule('0 0 * * * *', () => {
	console.log('Start to measure network speed.')
	getSpeed();
	console.log('End to measure network speed.')
});
