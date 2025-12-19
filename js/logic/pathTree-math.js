import gymMathData from "../db/math/mathTreeGym.js";
import booksMathData14 from "../db/math/mathTreeBooks1-4.js";
import booksMathData59 from "../db/math/mathTreeBooks5-9.js";

function createHtmlStructure(data) {
  const container = document.getElementById("gymThemes");

  data.forEach((el) => {
    if (typeof el.class === `number`) {
      const curClass = document.createElement("h2");
      curClass.textContent = el.curClass;
      curClass.id = el.classId;
      container.append(curClass);
    } else {
      const pathLink = document.createElement("a");
      pathLink.className = "instruction-box";
      pathLink.href = el.linkPath;

      const pathTitle = document.createElement("p");
      pathTitle.className = "instruction-box-title";
      pathTitle.textContent = el.linkTitle;

      const pathCaption = document.createElement("p");
      pathCaption.className = "instruction-box-caption";
      pathCaption.textContent = el.linkCaption;

      pathLink.appendChild(pathTitle);
      pathLink.appendChild(pathCaption);
      container.appendChild(pathLink);
    }
  });
}
window.onload = () => {
  if (document.querySelector("body").id === "math-gym") {
    createHtmlStructure(gymMathData);
  } else if (document.querySelector("body").id === "book-math-1-4") {
    createHtmlStructure(booksMathData14);
  } else if (document.querySelector("body").id === "book-math-5-9") {
    createHtmlStructure(booksMathData59);
  }
};
