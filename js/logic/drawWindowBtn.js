const DRAW_WINDOW = document.getElementById("openDrawWindow");
const CLOSE_DRAW_WINDOW = document.getElementById("closeButton");

DRAW_WINDOW.onclick = showDrawWindow;
CLOSE_DRAW_WINDOW.onclick = showDrawWindow;

function showDrawWindow() {
  document.getElementById("drawWindow").classList.toggle("drawWindowActive");
}
