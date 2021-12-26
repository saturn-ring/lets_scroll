document.getElementById("btn").onclick = () => {
        const value = document.getElementById("num");
        location.href = `/view.html?id=${value.value}`;
};