// document.addEventListener("DOMContentLoaded", function () {
//   // Инициализация Prism для подсветки кода
//   if (typeof Prism !== "undefined") {
//     Prism.highlightAll();
//   }

//   // Обработка кнопок показа решения
//   const toggleButtons = document.querySelectorAll(".solution-toggle");

//   toggleButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       const solution = this.nextElementSibling;
//       if (solution.style.display === "block") {
//         solution.style.display = "none";
//         this.textContent = "Показать решение";
//       } else {
//         solution.style.display = "block";
//         this.textContent = "Скрыть решение";

//         // Подсветка кода в решении, если Prism доступен
//         if (typeof Prism !== "undefined") {
//           Prism.highlightAllUnder(solution);
//         }
//       }
//     });
//   });

  // Динамическая адаптация размера шрифта для очень длинных строк кода
  function adjustCodeFontSize() {
    const codeWrappers = document.querySelectorAll(".code-wrapper");
    const screenWidth = window.innerWidth;

    codeWrappers.forEach((wrapper) => {
      const codeElement = wrapper.querySelector("code");
      if (codeElement) {
        const codeWidth = codeElement.scrollWidth;
        const wrapperWidth = wrapper.clientWidth;

        if (codeWidth > wrapperWidth * 1.5 && screenWidth < 768) {
          wrapper.style.fontSize = "0.8rem";
        }
      }
    });
  }

  // Вызываем при загрузке и изменении размера окна
  adjustCodeFontSize();
  window.addEventListener("resize", adjustCodeFontSize);
// });
