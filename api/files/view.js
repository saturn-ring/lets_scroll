(async function () {
        async function load_image(url, d, call) {
                var image = await axios.get(`/image?url=${encodeURI(url)}`, {
                        responseType: 'arraybuffer',
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity
                });
                d.setAttribute('src', "data:image/png;base64,"+btoa([].reduce.call(new Uint8Array(image.data),function(p,c){return p+String.fromCharCode(c)},'')))
                call[0]=1;
        }
        function limit(arr) {
                var tasks = [];
                var dark = setInterval(() => {
                        tasks.forEach(x => { if (x) { tasks.splice(tasks.indexOf(x)) } });
                        if (tasks.length <= 5 && arr.length) {
                                let l = [];
                                let ll=arr.shift();
                                load_image(ll[0], ll[1], l);
                                tasks.push(l);
                        } else if (!arr.length && !tasks.length) {
                                clearInterval(dark);
                        }
                }, 10);
        }
        try {
                let params = new URLSearchParams(location.search.slice(1));
                var { data } = await axios.get(`/list/${params.get("number")}`);
        }
        catch (e) {
                document.write("없는 동인지거나 서버가 이상합니다");
        }
        const main = document.getElementById("images");
        const list = [];
        for (let i = 0; i < data.length; i++) {
                let d = document.createElement("img");
                main.appendChild(d);
                list.push([data[i], d]);
        }
        limit(list);
})();
