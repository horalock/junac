import bookDevHtmlData from "../../data/dev/devTreeHtml.js";
import bookDevJsData from "../../data/dev/devTreeJs.js";

console.log(bookDevJsData);

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
  if (document.querySelector("body").id === "book-js") {
    createHtmlStructure(bookDevJsData);
  } else if (document.querySelector("body").id === "book-html") {
    createHtmlStructure(bookDevHtmlData);
  }
};

const pathSearch_input = document.getElementById("pathSearch-input");
const pathSearch_btn = document.getElementById("pathSearch-btn");

// pathSearch_input.oninput = updatePath;

function updatePath() {
  const keyword = pathSearch_input.value.toLowerCase();
  const container = document.getElementById("gymThemes");
  container.innerHTML = "";
  const filteredData = bookDevHtmlData.filter((item) =>
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
