package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
)

type Hitomi struct{}

var (
	host = "https://ltn.hitomi.la"
	path = "/galleryblock/%s.html"

	reg = regexp.MustCompile(`t="[^ ]+`)
)

func (h Hitomi) GetLink(id string) []string {

	var link []string

	url := fmt.Sprintf(host+path, id)

	resp, err := http.Get(url)

	if err != nil {
		return link
	}

	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	m := reg.FindAllString(string(body), -1)

	for i, v := range m {

		if i%2 == 1 {
			continue
		}
		v = "https:" + v[3:]
		link = append(link, v)
	}

	return link
}

func (h Hitomi) GetIMG(url string) []byte {

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
