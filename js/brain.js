let consoleSpeed = 25; // time to wait for adding message to console

var txtPos = 0;
var txt = '';
var consoleBusy = false;
var buffer = '';

// document.getElementById("console").onclick = function() {logAI("You clicked me!")};

function logAI(message) {
    if (!consoleBusy) {
        txtPos = 0;
        document.getElementById('consoleText').textContent += '\n';
        txt = message;
        consoleBusy = true;
        typeWriter();
    } else if (consoleBusy) {
        txt += '\n' + message;
    }
    // console.log(consoleBusy);
}

function typeWriter() {
    if (txtPos == txt.length) {
        consoleBusy = false;
    } else if (txtPos < txt.length) {
        document.getElementById('consoleText').textContent += txt.charAt(txtPos);
        txtPos++;
        fixScroll();
        setTimeout(typeWriter, consoleSpeed);
    }
    // console.log(consoleBusy);
}

function clearConsole() {
    document.getElementById('consoleText').textContent = '';
}

//---------------- feedback processing

function updateScore() {
    document.getElementById("userScore").textContent = document.getElementById("slider").value + "%";
}

function sendFeedback() {
    var uscore = document.getElementById("userScore").textContent;
    uscore = uscore.slice(0,-1);

    var aiscore = document.getElementById("AIscore").textContent;
    aiscore = aiscore.slice(0,-1);

    var absError = Math.abd(uscore - aiscore);

}




//--------------- scrollbar fixes
document.getElementById('console').onmouseover = function () {
    if (document.getElementById('consoleText').scrollHeight > document.getElementById('console').clientHeight) {
        document.getElementById('consoleText').style.position = 'relative';
    }
    fixScroll();
};

document.getElementById('console').onmouseout = function () {
    document.getElementById('consoleText').style.position = 'absolute';
};

function fixScroll() {
    var element = document.getElementById('console');
    element.scrollTop = element.scrollHeight - element.clientHeight;
}