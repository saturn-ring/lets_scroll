package main

import (
	"encoding/json"
	"net/http"
	PATH "path"
)

func serveIMG(w http.ResponseWriter, r *http.Request) {

	url := r.URL.Query().Get("url")
	w.Write(Hitomi{}.GetIMG(url))

}

func getLink(w http.ResponseWriter, r *http.Request) {

	Id := r.URL.Query().Get("id")
	list := Hitomi{}.GetLink(Id)

	body, _ := json.Marshal(list)
	w.Write(body)

}

func serveFile(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodGet {

		path := r.URL.Path

		if path == "/" {
			path = "./files/index.html"
			http.ServeFile(w, r, path)
		} else {
			path = "./files" + path

			if PATH.Ext(path) == "" {
				path = path + ".html"
			}

			http.ServeFile(w, r, path)
		}

	}
}

func main() {
	http.HandleFunc("/link", getLink)
	http.HandleFunc("/img", serveIMG)
	http.HandleFunc("/", serveFile)
	http.ListenAndServe(":3000", nil)
}
