let consoleSpeed = 50; // time to wait for adding message to console

// function logAI(log) {
//     // setTimeout(function(){document.getElementById("consoleText").textContent += "\n" + log}, consoleSpeed);
//     for (var i=0; i < log.length; i++) {
//         var char = log.charAt(i);
//         setTimeout(writeAI(char), consoleSpeed);
//     }
// }

var i = 0;
var txt = '';
var consoleBusy = false;
var buffer = '';

function logAI(message) {
    if (!consoleBusy) {
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
  }


function clearConsole() {
    document.getElementById("consoleText").textContent = "";
}