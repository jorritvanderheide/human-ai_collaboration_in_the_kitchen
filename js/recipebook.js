let recipeIngredients = [];

let thresholdValue = 0.5; // threshold value for showing the alternative

let highestScore = 0;
let bestSwap = '';
let returnMessage = '';

$(document).ready(function () {
    // prevent automatic sliding
    $('#carouselExampleControls').carousel({ interval: false });
});

$('#carouselExampleControls').on('slid.bs.carousel', function () {
    // adjust targetrecipe after sliding
    tryAlternative(targetIngredient);
});

let model;
let modelOptions = {
    task: 'regression',
};

model = ml5.neuralNetwork(modelOptions);

const modelLoad = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
};
model.load(modelLoad);

function setupRecipes() {
    for (let i = 0; i < recipeList.length; i++) {
        document.getElementById('recipe' + i).style.visibility = 'visible';
        let h = document.getElementById('header' + i);
        h.innerHTML = recipeList[i];

        let p = document.getElementById('p' + i);
        p.style.whiteSpace = 'pre-line';
        p.textContent = '';

        recipeIngredients = recipeVectors[i].slice(1, -1);
        recipeIngredients = recipeIngredients.split(',').map(Number);

        for (let k = 0; k < recipeIngredients.length; k++) {
            if (recipeIngredients[k] == 1) {
                p.textContent += ingredientList[k] + '\n';
            }
        }
    }
    logAI('>recipes imported');
}

function tryAlternative(ingredientReturn) {
    let tryoutCat = ingredientCategory[ingredientList.indexOf(ingredientReturn)];
    var currentIndex = $('div.active').index();
    let i = currentIndex;
    document.getElementById('swaptext' + (currentIndex + 1)).textContent = '';
    document.getElementById('swaptext' + (currentIndex - 1)).textContent = '';
    let inputArr = [];
    let swapArr = [];
    let highestScore = 0;
    inputArr = recipeVectors[i];
    inputArr = inputArr.slice(1, -1);
    inputArr = inputArr.split(',').map(Number);
    if (filter == 'plantFilter') {
        logAI("*AI: \tLet's look at " + recipeList[i] + '');
    } else if (filter == 'seasonFilter') {
        logAI("*AI: \tLet's look at " + recipeList[i] + '');
    }
    for (let j = 0; j < inputArr.length; j++) {
        if (filter == 'plantFilter') {
            if (inputArr[j] == 1 && ingredientPlant[j] == 0 && tryoutCat == ingredientCategory[j]) {
                swapArr.push(j);
            }
        } else if (filter == 'seasonFilter') {
            if (inputArr[j] == 1 && ingredientSeason[j] != 0 && tryoutCat == ingredientCategory[j]) {
                swapArr.push(j);
            }
        }
    }
    if (swapArr.length > 0) {
        highestScore = 0;
        highScore = 0;
        let bestSwap = '';
        for (let k = 0; k < swapArr.length; k++) {
            inputArr = recipeVectors[i];
            inputArr = inputArr.slice(1, -1);
            inputArr = inputArr.split(',').map(Number);
            inputArr[swapArr[k]] = 0;
            inputArr[ingredientList.indexOf(ingredientReturn)] = 1;
            model.predict(inputArr, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (results[0].score >= thresholdValue && results[0].score > highestScore) {
                    highestScore = results[0].score;
                    bestSwap = ingredientList[swapArr[k]];
                    let highScore = (highestScore * 100).toString();
                    highScore = highScore.slice(0, 3);
                    highScore = parseInt(highScore);
                    let filterText = '';
                    if (filter == 'plantFilter') {
                        filterText = 'plant based';
                    } else if (filter == 'seasonFilter') {
                        filterText = 'in season';
                    }
                    document.getElementById('swaptext' + currentIndex).textContent =
                        'Try swapping ' + bestSwap + ' for ' + ingredientReturn + ' if you want to eat more ' + filterText;
                    document.getElementById('AIscore').textContent = highScore + '%';
                } else if (highestScore == 0) {
                    document.getElementById('swaptext' + currentIndex).textContent = 'No suitable swaps found';
                    document.getElementById('AIscore').textContent = 'n.a.';
                }
                // inputArr[swapArr[k]] = 1;
                let resultScore = results[0].score * 100;
                resultScore = resultScore.toString();
                resultScore = resultScore.slice(0, 3);
                resultScore = parseInt(resultScore);
                if (resultScore < thresholdValue * 100) {
                    logAI('\t\tswap ' + ingredientList[swapArr[k]] + " for " + ingredientReturn + ' --> ' + resultScore +  "% match, not enough");
                } else {
                    logAI('\t\tswap ' + ingredientList[swapArr[k]] + " for " + ingredientReturn + ' --> ' + resultScore + '% match');
                }
            });
        }
    } else {
        // logAI("Nothing found");
        if (filter != 'plantFilter' || filter != 'seasonFilter') {
            document.getElementById('swaptext' + currentIndex).textContent = 'No potential swaps found';
            document.getElementById('AIscore').textContent = 'n.a.';
        }
    }

    // // return returnMessage;
    // let p = document.getElementById('p' + i);
    // p.textContent = '';

    // recipeIngredients = recipeVectors[i].slice(1, -1);
    // recipeIngredients = recipeIngredients.split(',').map(Number);

    // for (let k = 0; k < recipeIngredients.length; k++) {
    //     if (recipeIngredients[k] == 1) {
    //         p.textContent += ingredientList[k] + '\n';
    //     }
    // }

    // p.textContent += '\n \n ' + returnMessage;
}
