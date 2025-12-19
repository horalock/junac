const LOGIN_BTN = document.getElementById('login-btn')
LOGIN_BTN.onclick = checkLogin

function checkLogin() {
  let loginWord = document.querySelector("#login-word").value
  if (loginWord === 'junac') {
    alert("Верно")
    console.log(1)
  } else {
    alert("Указанное слово не верно")
    console.log(0)
    
  }
}