package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strconv"
	"strings"
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
	host  = "https://a.hitomi.la/%s/1639745412/%d/%s.%s"
	image = "https://a.hitomi.la/%s/%s.%s"
)

var (
	RES = regexp.MustCompile(`//..?\.hitomi\.la/`)
	M   = regexp.MustCompile(`/[a-f0-9]{64}`)
)

// func (h Hitomi) Deciphear(file File) string {

// 	var ext, dir, retval, url string

// 	retval = "b"

// 	if file.Hasavif == 1 {
// 		dir = "avif"
// 		ext = "avif"
// 		retval = "a"
// 	} else if file.Haswebp == 1 {
// 		dir = "webp"
// 		ext = "webp"
// 		retval = "a"
// 	} else {
// 		dir = "images"
// 		ext = strings.Split(file.Name, ".")[1]
// 	}

// 	if len(file.Name) >= 3 {

// 		l := len(file.Hash)

// 		a := file.Hash[l-1:]
// 		b := file.Hash[l-3 : l-1]

// 		file.Hash = fmt.Sprintf("%s/%s/%s", a, b, file.Hash)
// 	}

// 	url = fmt.Sprintf(image, dir, file.Hash, ext)

// 	if !VALID.MatchString(url) {
// 		fmt.Println("ha!")
// 		return URL.ReplaceAllString(url, `//a.hitomi.la/`)
// 	}

// 	m := VALID.FindString(url)
// 	g, err := strconv.ParseInt(m[64:]+m[62:64], 16, 0)

// 	if err == nil {
// 		retval = string(rune(97+h.gg(g))) + retval
// 	}
// 	last := fmt.Sprintf("//%s.hitomi.la/", retval)
// 	return RES.ReplaceAllString(url, last)
// }

func (h Hitomi) Decipher(file File) string {

	var dir, ext, url, retval, last string

	if file.Haswebp == 1 {
		dir = "webp"
		ext = "webp"
		retval = "a"
	} else if file.Hasavif == 1 {
		dir = "avif"
		ext = "avif"
		retval = "a"
	} else {
		ext = strings.Split(file.Name, ".")[1]
		dir = "images"
		retval = "b"
	}
	l := len(file.Hash)
	g, _ := strconv.ParseInt(file.Hash[l-1:]+file.Hash[l-3:l-1], 16, 0)
	url = fmt.Sprintf(host, dir, g, file.Hash, ext)

	m := M.FindString(url)

	if m == "" {
		retval = "a"
	} else {
		l = len(m)
		n, err := strconv.ParseInt(m[l-1:]+m[62:l-1], 16, 0)

		if err == nil {
			retval = string(rune(97+h.gg(n))) + retval
		}

	}
	last = fmt.Sprintf("//%s.hitomi.la/", retval)
	return RES.ReplaceAllString(url, last)
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
