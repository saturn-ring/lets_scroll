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
	base = "https://ltn.hitomi.la/galleries/%s.js"
	img  = "https://a.hitomi.la/%s/1639745412/%d/%s.%s"
)

var (
	reg  = regexp.MustCompile(`//..?\.hitomi\.la/`)
	hash = regexp.MustCompile(`/[a-f0-9]{64}`)
)

func (h Hitomi) GetLink(id string) []string {

	var link []string
	var data Body

	url := fmt.Sprintf(base, id)
	resp, err := http.Get(url)

	if err != nil {
		return link
	}

	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	_ = json.Unmarshal(body[18:], &data)

	for _, v := range data.Files {
		image := h.Decipher(&v)
		link = append(link, image)
	}

	return link
}

func (h Hitomi) Decipher(file *File) string {

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
	url = fmt.Sprintf(img, dir, g, file.Hash, ext)

	m = hash.FindString(url)
	length = len(m)

	a = m[length-1:]
	b = m[62 : length-1]

	n, _ := strconv.ParseInt(a+b, 16, 0)
	retval = string(rune(97+h.gg(n))) + retval

	m = fmt.Sprintf("//%s.hitomi.la/", retval)
	return reg.ReplaceAllString(url, m)

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
