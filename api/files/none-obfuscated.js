    checklocal = localStorage.getItem("darkmode");

    if (checklocal !== null) {
        if (checklocal === "true") {
            $("html").addClass("darkmode");
            $(".lgo").attr("src", "https://everest.mist.pw/img/EshmT.png")
            localStorage.setItem("darkmode", "true");
        } else if (checklocal === "false") {
            $("html").removeClass("darkmode");
            $(".lgo").attr("src", "https://everest.mist.pw/img/tiVpX.png")
            localStorage.setItem("darkmode", "false");
        } else if (checklocal === "system") {
            onclk(3);
        }
    } else {
        onclk(3);
    }

    oncTtp = 0;
    oncStg = 0;
    onIntv = 0;
    function onclk(id) {
        if (id === 1) {
            oncTtp++;
            if (oncTtp === 1) {
                $(".mnu-ttp").addClass("modal");
                $(".mnu-icn").addClass("blk");
            } else if (oncTtp === 2) {
                $(".mnu-ttp").removeClass("modal");
                $(".mnu-icn").removeClass("blk");
                oncTtp = 0;
            }
        }

        if (id === 2) {
            oncStg++;
            if (oncStg === 1) {
                $(".mnu-stg").addClass("modal");
            } else if (oncStg === 2) {
                $(".mnu-stg").removeClass("modal");
                oncStg = 0;
            }
        }

        if (id === 3) {
            localStorage.setItem("darkmode", "system");
            onIntv = 1;
            isStop = null;
            var detectTheme = setInterval(function() {
            if (!isStop) {
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    $("html").addClass("darkmode");
                    $("html").addClass("system");
                    $(".lgo").attr("src", "https://everest.mist.pw/img/EshmT.png")
                } else {
                    $("html").removeClass("darkmode");
                    $("html").addClass("system");
                    $(".lgo").attr("src", "https://everest.mist.pw/img/tiVpX.png")
                }
            } else {
                onIntv = 0;
                clearInterval(detectTheme);
            }
            }, 1)
        }

        if (id === 4) {
            checklocal = localStorage.getItem("darkmode");
            if (checklocal !== null) {
                if (checklocal === "true" || checklocal === "system") {
                    $("html").removeClass("darkmode");
                    $(".lgo").attr("src", "https://everest.mist.pw/img/tiVpX.png")
                    localStorage.setItem("darkmode", "false");
                }
            } else {
                $("html").removeClass("darkmode");
                $(".lgo").attr("src", "https://everest.mist.pw/img/tiVpX.png")
                localStorage.setItem("darkmode", "false");
            }
        }
        
        if (id === 5) {
            checklocal = localStorage.getItem("darkmode");
            if (checklocal !== null) {
                if (checklocal === "false" || checklocal === "system") {
                    $("html").addClass("darkmode");
                    $(".lgo").attr("src", "https://everest.mist.pw/img/EshmT.png")
                    localStorage.setItem("darkmode", "true");
                }
            } else {
                $(".lgo").attr("src", "https://everest.mist.pw/img/EshmT.png")
                $("html").addClass("darkmode");
                localStorage.setItem("darkmode", "true");
            }
        }

        if (id === 6) {
            $(".apidoc").addClass("modal");
        }

        if (id === 7) {
            $(".apidoc").removeClass("modal");
        }
    }

    function stop() {
        isStop = true;
        $("html").removeClass("system");
    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }
