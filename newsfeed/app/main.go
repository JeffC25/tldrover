package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	config "main/config"

	"github.com/go-chi/chi/v5"
)

func main() {
	config, err := config.GetConfig()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("Logging Level: %d\n", config.LogLevel)

	r := chi.NewRouter()
	r.Get("/search", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Search"))
	})
	r.Get("/topics", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Topics"))
	})

	server := &http.Server{Addr: ":8001", Handler: r}

	go func() {
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			fmt.Printf("HTTP server ListenAndServe: %v\n", err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c
	fmt.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		fmt.Printf("HTTP server Shutdown: %v\n", err)
	}

	fmt.Println("Server gracefully stopped")
}
