fetch(`/link${location.search}`)
.then(response => response.json())
.then(response => {
    if (response.length >= 1) {
        const main = document.getElementById("image");
        for (const s of response) {
            let el = document.createElement("img");
            main.append(el);
            el.src = `/img?url=${s}`;
            el.onerror = "this.parentNode.style.display='none'";
            console.log('err', this);
        }
    }
    else document.write("ERROR");
});
