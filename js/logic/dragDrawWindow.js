const draggable = document.getElementById("drawWindow");
const dragArea = document.getElementById("toolbar");
dragArea.onmousedown = function (event) {
  var shiftX = event.clientX - draggable.getBoundingClientRect().left;
  var shiftY = event.clientY - draggable.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    draggable.style.left = pageX - shiftX + "px";
    draggable.style.top = pageY - shiftY + "px";
  }
  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
    console.log(event.pageX, event.clientX)
    console.log(event.pageY, event.clientY)
  }
  document.addEventListener("mousemove", onMouseMove);
  draggable.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    draggable.onmouseup = null;
  };
};
draggable.ondragstart = function () {
  return false;
};
