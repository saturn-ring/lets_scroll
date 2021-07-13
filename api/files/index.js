document.getElementById("btn").onclick=function(){
    var number=document.getElementById("getnum").value;
    var a=location.href.split("/");
    if(a.length!==1) a.length--;
    location.href="/view.html?number="+encodeURIComponent(number);  
}