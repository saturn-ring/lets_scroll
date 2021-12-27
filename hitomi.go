package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strconv"
)

type Hitomi struct{}

type DATA struct {
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
	base  = "https://ltn.hitomi.la/galleries/%s.js"
	ha    = "https://a.hitomi.la/%s/1639745412/%d/%s.%s"
	image = "https://a.hitomi.la/%s/%s/%s/%s.%s"
)

var (
	RES = regexp.MustCompile(`//..?\.hitomi\.la/`)
	M   = regexp.MustCompile(`/[a-f0-9]{64}`)
)

func (h Hitomi) Decipher(file File) string {

	var dir, ext, url, retval, m string

	if file.Haswebp == 1 {
		dir = "webp"
		ext = "webp"
		retval = "a"
	}

	if file.Hasavif == 1 {
		dir = "avif"
		ext = "avif"
		retval = "a"
	}

	if dir == "" {
		dir = "images"
		retval = "b"
		ext = file.Name[len(file.Name)-3:]
	}

	length := len(file.Hash)

	a := file.Hash[length-1 : length-0]
	b := file.Hash[length-3 : length-1]

	g, _ := strconv.ParseInt(a+b, 16, 0)
	url = fmt.Sprintf(ha, dir, g, file.Hash, ext)

	m = M.FindString(url)
	length = len(m)

	a = m[length-1:]
	b = m[62 : length-1]

	n, _ := strconv.ParseInt(a+b, 16, 0)
	retval = string(rune(97+h.gg(n))) + retval

	m = fmt.Sprintf("//%s.hitomi.la/", retval)
	return RES.ReplaceAllString(url, m)

}

func (h Hitomi) GetLink(Id string) []string {

	URL := fmt.Sprintf(base, Id)
	resp, err := http.Get(URL)

	if err != nil {
		return nil
	}

	defer resp.Body.Close()

	var data DATA

	body, _ := ioutil.ReadAll(resp.Body)
	_ = json.Unmarshal(body[18:], &data)

	link := make([]string, len(data.Files))
	for i, v := range data.Files {
		link[i] = h.Decipher(v)
	}

	return link
}
