(async function () {
    try {
            let params = new URLSearchParams(location.search.substring(1))
            var list = await axios.get(`/hitomi/list?number=${params.get('number')}`);
            list=list.data;
    }
    catch (e) {
            document.write("없는 동인지거나 서버가 이상합니다");
    }
    const maindiv = document.getElementById("images");
    for (let i = 0; i < list.length; i++) {
            let d = document.createElement("img");
            maindiv.appendChild(d);
            d.src = `/hitomi/image?link=${encodeURIComponent(list[i])}`;
    }
})();