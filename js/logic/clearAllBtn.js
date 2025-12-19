const clearAreaButton = document.getElementById("clearAreaButton");

clearAreaButton.addEventListener("click", () => {
  const drawingFrame = document.getElementById("drawingFrame");
  drawingFrame.contentWindow.clearAllDrawings()
});
