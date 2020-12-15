let consoleSpeed = 25; // time to wait for adding message to console

var txtPos = 0;
var txt = '';
var consoleBusy = false;
var buffer = '';

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
    adjustSpeed();
    // console.log(txt.length - txtPos, consoleSpeed);
}

function adjustSpeed() {
    if (txt.length-txtPos > 180) {
        consoleSpeed = 1;
    } else if (txt.length-txtPos > 20) {
        consoleSpeed = abs(25 - ((txt.length-txtPos)/8));
    } else {
        consoleSpeed = 25;
    }
}

function clearConsole() {
    document.getElementById('consoleText').textContent = '';
}

//---------------- FEEDBACK PROCESSING

function updateScore() {
    document.getElementById("userScore").textContent = document.getElementById("slider").value + "%";
}

function sendFeedback() {
    var uscore = document.getElementById("userScore").textContent;
    uscore = uscore.slice(0,-1);

    var aiscore = document.getElementById("AIscore").textContent;
    aiscore = aiscore.slice(0,-1);

    var absError = Math.abs(uscore - aiscore)/100;

    OOCSI.send("HumanAI_Feedback",
        {"device_id": "dd371eddb3d52429d",
        "activity": "SubmitFeedback",
        "AI score": aiscore, "User score": uscore,"Absolute error": absError
    });

    logAI("I've received your feedback!");
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

//----------- easter egg for fun

document.getElementById("console").onclick = function() {consoleClicked()};

function consoleClicked() {
    var chance = randomInt(0, 100);
    console.log(chance);
    if (chance%10 == 0) {
        let eggs = ["Please stop", "You clicked me!", "I'm trying to think here..", "What are you clicking at?"];
        logAI(eggs[randomInt(0, eggs.length)]);
    }
}