fetch(`https://hviewer.live/link${location.search}`)
.then(response => response.json())
.then(response => {
    if (response.length >= 1) {
        const main = document.getElementById("image");
        for (const s of response) {
            let el = document.createElement("img");
            main.append(el);
            el.src = `https://hviewer.live/img?url=${s}`;
            $("img").error(function(){
                $(this).hide();
            });
        }
    }
    else document.write("ERROR");
});
