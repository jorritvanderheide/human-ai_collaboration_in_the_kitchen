
let consoleSpeed = 25; // time to wait for adding message to console

var i = 0;
var txt = '';
var consoleBusy = false;
var buffer = '';

function logAI(message) {
    if (!consoleBusy) {
        i = 0;
        document.getElementById("consoleText").textContent += "\n";
        txt = message;
        consoleBusy = true;
        typeWriter();
    } else if (consoleBusy) {
        txt += "\n" + message;
    }
    console.log(consoleBusy);
}

function typeWriter() {
    if (i == txt.length) {
        consoleBusy = false;
    } else if (i < txt.length) {
      document.getElementById("consoleText").textContent += txt.charAt(i);
      i++;
      setTimeout(typeWriter, consoleSpeed);
    }
    console.log(consoleBusy);
  }


function clearConsole() {
    document.getElementById("consoleText").textContent = "";
}

document.getElementById("console").onclick = function() {logAI("You clicked me!")};