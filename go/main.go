package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/tenntenn/natureremo"
)

func main() {
	cli := natureremo.NewClient(os.Getenv("NATURE_REMO_CLOUD_API_TOKEN"))
	ctx := context.Background()

	// applianceName := os.Args[2]
	// signalName := os.Args[3]

	as, err := cli.ApplianceService.GetAll(ctx)
	if err != nil {
		log.Fatal(err)
	}
	for _, a := range as {
		fmt.Println(a)
	}

	// var target *natureremo.Appliance
	// for _, a := range as {
	// 	if a.Nickname == applianceName {
	// 		target = a
	// 		break
	// 	}
	// }

	// if target == nil {
	// 	log.Fatalf("%s not found", applianceName)
	// }

	// for _, s := range target.Signals {
	// 	if s.Name == signalName {
	// 		cli.SignalService.Send(ctx, s)
	// 		break
	// 	}
	// }
}

//-----------------------------------------------
// package main

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"net/http"
// 	"os"
// )

// func prettyprint(b []byte) ([]byte, error) {
// 	var out bytes.Buffer
// 	err := json.Indent(&out, b, "", "  ")
// 	return out.Bytes(), err
// }

// func main() {
// 	url := "https://api.nature.global/1/devices"

// 	req, _ := http.NewRequest("GET", url, nil)
// 	req.Header.Set("Authorization", "Bearer "+os.Getenv("NATURE_REMO_CLOUD_API_TOKEN"))

// 	client := new(http.Client)
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		fmt.Printf("Error")
// 	}

// 	defer resp.Body.Close()

// 	byteArray, _ := ioutil.ReadAll(resp.Body)

// 	b, err := prettyprint(byteArray)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Printf("%s", b)

// }

//------------------------------------------------------

// package main

// import (
// 	"context"
// 	"fmt"
// 	"log"
// 	"os"
// 	"time"

// 	"github.com/tenntenn/natureremo"
// )

// func main() {
// 	cli := natureremo.NewClient(os.Getenv("NATURE_REMO_CLOUD_API_TOKEN"))
// 	ctx := context.Background()
// 	for {
// 		ds, err := cli.DeviceService.GetAll(ctx)
// 		if err != nil {
// 			log.Fatal(err)
// 		}
// 		fmt.Printf("%s\n", ds)

// 		for _, d := range ds {
// 			if len(ds) > 1 {
// 				fmt.Println("===", d.Name, "===")
// 			}

// 			fmt.Println("Temperature:", d.NewestEvents[natureremo.SensorTypeTemperature].Value, "°C")
// 			fmt.Println("Humidity:", d.NewestEvents[natureremo.SensorTypeHumidity].Value, "%")
// 			fmt.Println("illumination:", d.NewestEvents[natureremo.SensortypeIllumination].Value)
// 			fmt.Println("")
// 		}

// 		d := cli.LastRateLimit.Reset.Sub(time.Now())
// 		time.Sleep(d / time.Duration(cli.LastRateLimit.Remaining))
// 	}
// }
