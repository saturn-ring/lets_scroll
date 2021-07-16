document.getElementById("getnum").addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
                let num = document.getElementById("getnum").value || undefined;
                if (!isNaN(num)) location.href = `/view.html?number=${num}`;
        }
})
document.getElementById("btn").onclick = function () {
        let num = document.getElementById("getnum").value || undefined;
        if (!isNaN(num)) location.href = `/view.html?number=${num}`;
}
