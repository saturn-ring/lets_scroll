(async function () {
    try {
        let params = new URLSearchParams(location.search.slice(1));
        var { data } = await axios.get(`/list/${params.get("number")}`);
    }
    catch (e) {
            document.write("없는 동인지거나 서버가 이상합니다");
    }
    const main = document.getElementById("images");
    for (let i = 0; i < data.length; i++) {
            let d = document.createElement("img");
            main.appendChild(d);
            d.src = `/image?url=${encodeURI(data[i])}`;
    }
})();
