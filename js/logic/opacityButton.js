const OPACITY_BUTTON = document.getElementById('hideButton')
OPACITY_BUTTON.onclick = showWindow

function showWindow() {
  document.getElementById('drawWindow').classList.toggle('alignTop')  
  document.getElementById('iframeContainer').classList.toggle('hide')
  OPACITY_BUTTON.classList.toggle('rotate180')  
}