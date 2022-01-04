package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
)

type Hitomi struct{}

type Body struct {
	Date     string `json:"date"`
	Language string `json:"language"`
	Type     string `json:"type"`
	Id       string `json:"id"`
	Title    string `json:"title"`
	Files    []File `json:"files"`
}

type File struct {
	Name    string `json:"name"`
	Hash    string `json:"hash"`
	Width   int    `json:"width"`
	Height  int    `json:"height"`
	Haswebp int    `json:"haswebp"`
	Hasavif int    `json:"hasavif"`
}

const (
	host = "https://ltn.hitomi.la"
	path = host + "/galleries/%s.js"
)

func (h Hitomi) GetLink(id string) (f []File) {

	var data Body

	url := fmt.Sprintf(path, id)
	resp, err := http.Get(url)

	if err != nil {
		return
	}

	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	_ = json.Unmarshal(body[18:], &data)

	f = data.Files
	return
}

func (h Hitomi) GetIMG(url string) []byte {

	fmt.Println(url)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("referer", "https://hitomi.la")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return []byte{}
	}

	defer resp.Body.Close()

	bytes, _ := ioutil.ReadAll(resp.Body)
	return bytes
}

func (h Hitomi) GetJS() {

	h.Download("./files/gg.js", "http://ltn.hitomi.la/gg.js")
	h.Download("./files/common.js", "http://ltn.hitomi.la/common.js")

}

func (h Hitomi) Download(path, url string) {

	out, err := os.Create(path)

	if err != nil {
		panic(err)
	}

	defer out.Close()

	resp, err := http.Get(url)

	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	io.Copy(out, resp.Body)
}
