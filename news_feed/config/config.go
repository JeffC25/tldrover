package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	LogLevel int    `yaml:"loglevel"`
	ApiKey   string `yaml:"apikey"`
}

func GetConfig() (Config, error) {
	f, err := os.ReadFile("../config/config.yaml")
	if err != nil {
		return Config{}, fmt.Errorf("unable to read config file: %v", err)
	}

	c := Config{}
	err = yaml.Unmarshal(f, &c)
	if err != nil {
		return Config{}, fmt.Errorf("unable to unmarshal config into struct: %v", err)
	}

	return c, nil
}
