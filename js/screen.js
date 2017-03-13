function ReScreen(){
    var sWidth=document.documentElement.clientWidth;
    document.documentElement.style.fontSize="625%";
}
ReScreen();
window.onresize=function(){
    ReScreen();
}