package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	PATH "path"
)

func getLink(w http.ResponseWriter, r *http.Request) {

	var hitomi Hitomi

	Id := r.URL.Query().Get("id")
	list := hitomi.GetLink(Id)

	body, _ := json.Marshal(list)
	w.Write(body)

}

func serveIMG(w http.ResponseWriter, r *http.Request) {

	url := r.URL.Query().Get("url")

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("referer", "https://hitomi.la")

	client := &http.Client{}
	resp, e := client.Do(req)

	defer resp.Body.Close()

	if e != nil {
		return
	}

	img, _ := ioutil.ReadAll(resp.Body)
	w.Write(img)
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
