import mathGymData from "./logic/dataPath.js";
// const currentPath = window.location.pathname;
const mathGymDataPath = mathGymData[currentTheme];

let testData;
let dataLength = 0;
let randI = 0;
let correctAnswer = 0;
let wrongAnswer = 0;

const TEST_AREA = document.getElementById("test-area");
const CHECK_TEST_BTN = document.getElementById("check-test-btn");
const INPUT_ANSWER_FIELD = document.getElementById("intup-answer-field");
const WRONG_ANSWER_FIELD = document.getElementById("wrong-answer");
const CORRECT_ANSWER_FIELD = document.getElementById("correct-answer");
const GYM_ID = document.getElementById("gymId");
const GO_BACK_LINK = document.getElementById("goBackLink");
const TO_GYM = document.getElementById("toGymLink");


async function loadModule(testId) {
  try {
    const module = await import(testId);
    testData = module.default;
    return module.default;
  } catch (error) {
    console.error("Ошибка загрузки модуля:", error);
    return null;
  }
}

loadModule(mathGymDataPath).then((data) => {
  GYM_ID.textContent = data.title
  GO_BACK_LINK.setAttribute("href", data.backLink);
  TO_GYM.setAttribute("href", data.trainingsLink);
  testData = data.quests;
  dataLength = data.quests.length;
  
  //Начальная загрузка первого задания
  randI = getRandomInRange(0, dataLength - 1);
  TEST_AREA.innerText = testData[randI]["ex"];
  console.log(TEST_AREA.innerText.length);
  TEST_AREA.innerText.length > 30 ? 
  (    
    TEST_AREA.style.fontSize = "1.5rem",     
    TEST_AREA.style.fontWeight = "500",    
    TEST_AREA.style.textAlign = "left"  
  ) : 
  (
    TEST_AREA.style.fontSize = "2.2rem", 
    TEST_AREA.style.fontWeight = "600"
  );
});

CHECK_TEST_BTN.onclick = check;
function check() {
  let studentAnswer = removeSpaces(INPUT_ANSWER_FIELD.value);
  if (studentAnswer === removeSpaces(testData[randI]["ans"])) {
    correctAnswer++;
    CORRECT_ANSWER_FIELD.innerText = correctAnswer;
    INPUT_ANSWER_FIELD.style.backgroundColor = "lightgreen";
    INPUT_ANSWER_FIELD.style.borderColor = "lightgreen";
    CHECK_TEST_BTN.setAttribute("disabled", "true");
    CHECK_TEST_BTN.style.backgroundColor = "grey";
    CHECK_TEST_BTN.style.cursor = "wait";
    console.log("ok", INPUT_ANSWER_FIELD.value, testData[randI]["ans"]);
    setTimeout(() => {
      randI = getRandomInRange(0, dataLength - 1);
      TEST_AREA.innerText = testData[randI]["ex"];
      CHECK_TEST_BTN.removeAttribute("disabled");
      CHECK_TEST_BTN.style.backgroundColor = "#6f3aff";
      CHECK_TEST_BTN.style.cursor = "pointer";
      INPUT_ANSWER_FIELD.style.backgroundColor = "#fff";
      INPUT_ANSWER_FIELD.style.border = "2px solid #6f3aff";
      INPUT_ANSWER_FIELD.value = "";
    }, 800);
  } else if (studentAnswer) {
    wrongAnswer++;
    WRONG_ANSWER_FIELD.innerText = wrongAnswer;
    INPUT_ANSWER_FIELD.style.borderColor = "#ff4242";
    INPUT_ANSWER_FIELD.value = "";
    console.log("not ok", INPUT_ANSWER_FIELD.value, testData[randI]["ans"]);
  }
  INPUT_ANSWER_FIELD.value = "";
}

function removeSpaces(str) {
  return str.replace(/\s+/g, "");
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// let arr = new Set();
// let count = 101;
// for (let i = 1; i <= 1; i++) {
//   for (let k = 1; k < 6600; k++) {
//     // let symbol = getRandomInRange(1, 4);
//     let a = getRandomInRange(-999, 999);
//     let b = getRandomInRange(-999, 999);
//     let c = 100;
//     let d = 1000;
//     let e = 10;
//     if (a < 0 || b < 0) {
//       if (`${a / c * (b / e)}`.length < 6) {
//         if (b < 0) {
//           arr.add(`{"ex": '${a / c} ∙ (${b / e})', "ans": "${a / c * (b / e)}"}`);
//         } else {
//           arr.add(`{"ex": '${a / c} ∙ ${b / e}', "ans": "${a / c * (b / e)}"}`);
//         }
//       }
//     }
//     if (a < 0 || b < 0) {
//       if (`${a / c / (b / e)}`.length < 6) {
//         if (b < 0) {
//           arr.add(`{"ex": '${a / c} : (${b / e})', "ans": "${a / c / (b / e)}"}`);
//         } else {
//           arr.add(`{"ex": '${a / c} : ${b / e}', "ans": "${a / c / (b / e)}"}`);
//         }
//       }
//     }

//   }
//   //∙
  //arr.add(`{"ex": '${} : ${}', "ans": "${}"}`);
  //
// }
// console.log(arr);
