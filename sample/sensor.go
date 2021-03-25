package main

import (
	"fmt"

	"golang.org/x/exp/io/spi"
	"github.com/advancedclimatesystems/io/spi/microchip"
	"github.com/robfig/cron/v3"
)


func main() {
	conn, err := spi.Open(&spi.Devfs{
    Dev:      "/dev/spidev0.1",
    Mode:     spi.Mode0,
    MaxSpeed: 3600000,
	})
	if err != nil {
		panic(fmt.Sprintf("failed to open SPI device: %s", err))
	}

	adc := microchip.MCP3208 {
    Conn:      conn,
    Vref:      3.3,
	}


	cr := cron.New()
	cr.AddFunc("@every 5s", func() {
		for i := 0; i<10; i++ {
			v, err := adc.Voltage(i)
			if err != nil {
				fmt.Sprintf("failed to get data: %s", err)
			}
			c, err := adc.OutputCode(3)
			if err != nil {
				fmt.Sprintf("failed to get data: %s", err)
			}
			fmt.Printf("channel %d reads %f Volts or digital output code %d\n", i, v, c)
		}
	})
	cr.Start()
	defer cr.Stop()

	select {}

}
