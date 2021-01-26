const got = require('got');
const Influx = require('influx')

const MEASUREMENT = 'nature_remo_e'
const host = 'living.remo.aoki.dev'

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'home',
  schema: [{
    measurement: MEASUREMENT,
    fields: {
      instantaneous: Influx.FieldType.INTEGER,
      kwh: Influx.FieldType.FLOAT
    },
    tags: ['host']
  }]
})


const getRemoData = async () => {
  const data = {}
  try {
    const response = await got('https://api.nature.global/1/appliances', {
      responseType: 'json',
      headers: { "Authorization": `Bearer ${process.env.NATURE_REMO_CLOUD_API_TOKEN}` }
    });
    data.statusCode = response.statusCode
    data.statusMessage = response.statusMessage
    data.rateLimit = response.headers['x-rate-limit-limit']
    data.rateLimitRemaining = response.headers['x-rate-limit-remaining']
    data.rateLimitResetTime = response.headers['x-rate-limit-reset']

    data.energyRawData = response.body[0].smart_meter.echonetlite_properties.reduce((acc, e) => {
      acc[e.epc] = e
      return acc
    }, {})
    data.energy = {
      instantaneous: data.energyRawData["231"].val,
      kwh: data.energyRawData["224"].val * data.energyRawData["211"].val / (10 * data.energyRawData["225"].val)
    }

    console.log(data.energyRawData)
    console.log(data.energy)
    influx.writePoints([{
      measurement: MEASUREMENT,
      tags: { host: host },
      fields: {
        instantaneous: data.energy.instantaneous,
        kwh: data.energy.kwh
      }
    }]);


    // console.log(remoE.smart_meter.echonetlite_properties)

    // https://developer.nature.global/jp/how-to-calculate-energy-data-from-smart-meter-values
    // epc	name	プロパティ名称
    // 0xE0(224)	normal_direction_cumulative_electric_energy	積算電力量計測値(正方向)
    // 0xE3(227)	reverse_direction_cumulative_electric_energy	積算電力量計測値(逆方向)
    // 正方向が買電、逆方向が売電に対応
    // 0xD3(211)	coefficient	係数
    // 0xE1(225)	cumulative_electric_energy_unit	積算電力量単位
    // 0xD7(215)	cumulative_electric_energy_effective_digits	積算電力量有効桁数
    // 0xE7(231)	measured_instantaneous	瞬時電力計測値

    // const r = await got('https://api.nature.global/1/devices', {
    //   responseType: 'json',
    //   headers : {"Authorization" : `Bearer ${process.env.NATURE_REMO_CLOUD_API_TOKEN}`}
    // });

    // console.log(r.body[1].newest_events)

  } catch (error) {
    console.log(error);
    //=> 'Internal server error ...'
  }
}
setInterval(getRemoData, 10000);
