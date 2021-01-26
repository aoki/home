 # home

```sh
ssh pi@raspberrypi.local
```

```sh
docker-compose up -d
```

https://www.magata.net/memo/index.php?InfluxDB%C6%FE%CC%E7
```
$ docker exec -it influxdb bash
root@910e8e6953bc:/# influx -precision rfc3339
Connected to http://localhost:8086 version 1.8.3
InfluxDB shell version: 1.8.3
> show databases;
name: databases
name
----
_internal
telegraf
> create database home;
> show databases;
name: databases
name
----
_internal
telegraf
home
```

```
npx pm2 start remo.js --name remo
npx pm2 start raspberry-sensor.js --name sensor
```
