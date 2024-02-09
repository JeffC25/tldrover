package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	logLevel int
	apiKey   string
}

func NewConfig() (Config, error) {
	c := Config{}
	var err error

	c.logLevel, err = strconv.Atoi(os.Getenv("LOG_LEVEL"))
	if err != nil {
		fmt.Println("LOG_LEVEL not set, defaulting to 0")
		c.logLevel = 0
	}

	c.apiKey = os.Getenv("API_KEY")
	return c, nil
}
