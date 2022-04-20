init:
	chown -R 472:472 grafana/*
.PHONY: init

copy:
	sudo cp telegraf/telegraf.conf /etc/telegraf/telegraf.d/rasp-pi.conf
.PHONY: copy

run:
	npx pm2 start src/remo.js --name remo
.PHONY: run
