const ERASER = document.getElementById('eraseButton')
ERASER.onclick = checkEraser

document.getElementById('eraseButton').addEventListener('click', () => {
  const drawingFrame = document.getElementById('drawingFrame');
  drawingFrame.contentWindow.setEraseMode();
}); 

function checkEraser() {
  ERASER.classList.toggle('eraseActive')  
}