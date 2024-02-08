package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()
	r.Get("/article", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Article"))
	})
	r.Post("/file", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("File uploaded"))
	})
	r.Get("/search", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Search"))
	})
	http.ListenAndServe(":3000", r)
}
