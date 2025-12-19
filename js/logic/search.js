import gymMathData from "../../data/math/mathTreeGym.js";
import booksMathData from "../../data/math/mathTreeBooks1-4.js";

const pathSearch_input = document.getElementById("pathSearch-input");
// const pathSearch_btn = document.getElementById("pathSearch-btn");

pathSearch_input.oninput = updatePath;

function updatePath() {
  const keyword = pathSearch_input.value.toLowerCase();
  const container = document.getElementById("gymThemes");
  container.innerHTML = "";
  const filteredData = gymMathData.filter((item) =>
    item.description.some((desc) => desc.toLowerCase().includes(keyword))
  );

  if (filteredData.length > 0) {
    filteredData.forEach((el) => {
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
  } else {
    container.innerHTML = "<p>Ничего не найдено</p>";
  }
}
