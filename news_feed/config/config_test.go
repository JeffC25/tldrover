package config

import (
	"testing"
)

func TestConfig(t *testing.T) {
	t.Log("Testing")
	c, err := GetConfig()
	if err != nil {
		t.Errorf("Error creating config: %v", err)
	}

	if c.ApiKey == "" {
		t.Error("Error reading API key")
	}
	t.Log("API key: " + c.ApiKey)

	if c.LogLevel == 0 {
		t.Error("Error reading log level")
	}
	t.Logf("Log level: %d", c.LogLevel)

}
