let consoleSpeed = 25; // time to wait for adding message to console

var txtPos = 0;
var txt = '';
var consoleBusy = false;
var buffer = '';

function logAI(message) {   // function for adding messages to the console
    if (!consoleBusy) {
        txtPos = 0;
        document.getElementById('consoleText').textContent += '\n';
        txt = message;
        consoleBusy = true;
        typeWriter();   // if console isn't busy call the typewriter function
    } else if (consoleBusy && txt.length - txtPos > 600) {  // limiter for when people go crazy
        txtPos = 0;
        txt = "\n*AI: \tI can't keep this up. Can we slow down?";
    } else if (consoleBusy) {   // buffer. if it's busy, add new text to the message
        txt += '\n' + message;
    }
}

function typeWriter() {         // write messages to console char by char with a slight delay
    if (txtPos == txt.length) {     // if it's done it says it's not busy anymore
        consoleBusy = false;
    } else if (txtPos < txt.length) {
        document.getElementById('consoleText').textContent += txt.charAt(txtPos);
        txtPos++;
        fixScroll();        
        setTimeout(typeWriter, consoleSpeed);
    }
    adjustSpeed();
}

function adjustSpeed() {        // adjusts the speed considering the amount of text to write remains
    if (txt.length - txtPos > 180) {
        consoleSpeed = 1;
    } else if (txt.length - txtPos > 20) {
        consoleSpeed = abs(25 - (txt.length - txtPos) / 8);
    } else {
        consoleSpeed = 25;  // default value, otherwise goes faster
    }
}

function clearConsole() {   // function to clear the complete console
    document.getElementById('consoleText').textContent = '';
}


//---------------- FEEDBACK PROCESSING

function updateScore() {    // every time the feedback slider is adjusted, this function gets called and updates the shown value
    document.getElementById('userScore').textContent = document.getElementById('slider').value + '%';
}

function sendFeedback() {   // Sends the user score, AI score, and their difference to a Data Foundy dataset via OOCSI
    if (document.getElementById('AIscore').textContent != 'n.a.') {
        var uscore = document.getElementById('userScore').textContent;
        uscore = uscore.slice(0, -1);   // slice off the % sign

        var aiscore = document.getElementById('AIscore').textContent;
        aiscore = aiscore.slice(0, -1);

        var absError = Math.abs(uscore - aiscore) / 100; // convert it to absolute error for later calculation

        OOCSI.send('HumanAI_Feedback', { device_id: 'dd371eddb3d52429d', activity: 'SubmitFeedback', 'AI score': aiscore, 'User score': uscore, 'Absolute error': absError });

        logAI("*AI: \tI've received your feedback!");   // let user know it worked
    }
}

//--------------- scrollbar fixes

document.getElementById('console').onmouseover = function () {  // makes sure the text stays at the bottom of console with scrollbar
    if (document.getElementById('consoleText').scrollHeight > document.getElementById('console').clientHeight) {
        document.getElementById('consoleText').style.position = 'relative';
    }
    fixScroll();
};

document.getElementById('console').onmouseout = function () {   // makes sure text stays at the bottom of console without scrollbar
    document.getElementById('consoleText').style.position = 'absolute';
};

function fixScroll() {  // makes sure the scrollbar stays at the bottom of console
    var element = document.getElementById('console');
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

//----------- easter egg for fun

document.getElementById('console').onclick = function () {  // if console is clicked do this
    consoleClicked();
};

function consoleClicked() {
    var chance = randomInt(0, 100); // generate random number between 0-100
    // console.log(chance);
    if (chance % 10 == 0) {     // if the random number can be perfectly divided by 10
        let eggs = [
            '*AI: \tPlease stop',
            '*AI: \tYou clicked me!',
            "*AI: \tI'm trying to think here..",
            '*AI: \tWhat are you clicking at?',
            '*AI: \t(╯°□°)╯︵ ┻━┻',
            "*AI: \t(ง'̀-'́)ง",
        ];
        logAI(eggs[randomInt(0, eggs.length)]);     // pick a random sentence and write one
    }
}

function greetAI() {
    var greetings = [
        "Hi! my name is... Oh I don't have a name :(",
        'Finally, some friends!',
        'Welcome to the kitchen of the future!',
        "Hey, don't I know you from somewhere?",
        'Hi, welcome to my brain!',
        'Hiya! ༼ つ ◕_◕ ༽つ',
    ];
    logAI('*AI: \t' + greetings[randomInt(0, greetings.length)]);
}

function idleAI() {
    var chance = randomInt(0, 100);
    console.log(chance);
    if (chance % 14 == 0) {
        let questions = [
            "*AI: \tDon't you want to try anything?",
            '*AI: \tI really like fries you know',
            "*AI: \tYou want fries? ( ◑‿◑)ɔ┏🍟",
            "*AI: \tWeather seems nice",
        ];
        logAI(questions[randomInt(0, questions.length)]);
    }
}
