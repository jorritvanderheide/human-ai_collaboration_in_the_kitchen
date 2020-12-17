// variables
let recipeIngredients = [];
let thresholdValue = 0.5; // threshold value for showing the alternative
let highestScore = 0;
let bestSwap = '';
let returnMessage = '';
var currentIndex;

// run when page loaded
$(document).ready(function () {
    // prevent automatic sliding
    $('#carouselExampleControls').carousel({ interval: false });
});

// adjust targetrecipe after sliding
$('#carouselExampleControls').on('slid.bs.carousel', function () {
    tryAlternative(targetIngredient);
});

// create model
let model;
let modelOptions = {
    task: 'regression',
};
model = ml5.neuralNetwork(modelOptions);

// load model
const modelLoad = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
};
model.load(modelLoad);

// load recipes into cookbook
function setupRecipes() {
    // run for each recipe
    for (let i = 0; i < recipeList.length; i++) {
        // load header text
        document.getElementById('recipe' + i).style.visibility = 'visible';
        let h = document.getElementById('header' + i);
        h.innerHTML = '(' + (i + 1) + '/29) ' + recipeList[i]; // add page numbers

        // setup ingredient paragraph
        let p = document.getElementById('p' + i);
        p.style.whiteSpace = 'pre-line';
        p.textContent = '';

        // load ingredient data
        recipeIngredients = recipeVectors[i].slice(1, -1);
        recipeIngredients = recipeIngredients.split(',').map(Number);

        // load ingredient text for each recipe
        for (let k = 0; k < recipeIngredients.length; k++) {
            if (recipeIngredients[k] == 1) {
                p.textContent += ingredientList[k] + '\n';
            }
        }
    }
    logAI('>recipes imported'); // log
}

// ingredient recommendation
function tryAlternative(ingredientReturn) {
    // set current tryout ingredient category
    let tryoutCat = ingredientCategory[ingredientList.indexOf(ingredientReturn)];

    // derive index from HTML
    currentIndex = $('div.active').index();
    let i = currentIndex;

    // include first and last recipe page transitions
    if (i < 28) {
        document.getElementById('swaptext' + (currentIndex + 1)).textContent = '';
    }
    if (i > 0) {
        document.getElementById('swaptext' + (currentIndex - 1)).textContent = '';
    }
    if (i == 0) {
        document.getElementById('swaptext28').textContent = '';
    }
    if (i == 28) {
        document.getElementById('swaptext0').textContent = '';
    }

    // reset arrays
    let inputArr = [];
    let swapArr = [];
    let highestScore = 0;

    // assign current recipe vector to array
    inputArr = recipeVectors[i];
    inputArr = inputArr.slice(1, -1);
    inputArr = inputArr.split(',').map(Number); // remap to numbers

    // check if a tryout ingedient is selected
    if (targetIngredient != 'transparent') {
        logAI("*AI: \tI'll look at ingredients in " + recipeList[i]); // log
    } else if (targetIngredient == 'transparent') {
        idleAI();
    }

    // check if tryout ingredient is already in the recipe
    if (inputArr[ingredientList.indexOf(ingredientReturn)] == 0) {
        // run for every ingredient
        for (let j = 0; j < inputArr.length; j++) {
            // check if plant-base filter is active
            if (filter == 'plantFilter') {
                // check if any ingredients is in the recipe are not in line with the active filter
                if (inputArr[j] == 1 && ingredientPlant[j] == 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j); // add flagged ingredients to a temporary array
                }
            }

            // check if season-base filter is active
            else if (filter == 'seasonFilter') {
                // check if any ingredients is in the recipe are not in line with the active filter
                if (inputArr[j] == 1 && ingredientSeason[j] != 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j); // add flagged ingredients to a temporary array
                }
            }
        }

        // run if there are flagged ingredients (= potential swaps)
        if (swapArr.length > 0) {
            highestScore = 0;
            highScore = 0;
            let bestSwap = '';

            // run for every potential swap
            for (let k = 0; k < swapArr.length; k++) {
                // reset input array
                inputArr = recipeVectors[i];
                inputArr = inputArr.slice(1, -1);
                inputArr = inputArr.split(',').map(Number);

                // alter recipe vector
                inputArr[swapArr[k]] = 0; // remove potential swap ingredient from recipe
                inputArr[ingredientList.indexOf(ingredientReturn)] = 1; // add tryoutingredient to recipe

                // run new vector through model
                model.predict(inputArr, (err, results) => {
                    // log errors
                    if (err) {
                        console.log(err);
                        return;
                    }

                    // check if the model scores above the rthreshold and above the previous highest score
                    if (results[0].score >= thresholdValue && results[0].score > highestScore) {
                        highestScore = results[0].score; // update higest score
                        bestSwap = ingredientList[swapArr[k]]; // update best swap ingredient

                        // update cookbook recommendation text
                        let highScore = (highestScore * 100).toString();
                        highScore = highScore.slice(0, 3);
                        highScore = parseInt(highScore);
                        let filterText = '';
                        if (filter == 'plantFilter') {
                            filterText = 'plant based';
                        } else if (filter == 'seasonFilter') {
                            filterText = 'in season';
                        }
                        document.getElementById('swaptext' + currentIndex).textContent = 'Replace ' + bestSwap + ' for ' + ingredientReturn + ' to eat more ' + filterText; // recommendation sentence
                        document.getElementById('AIscore').textContent = highScore + '%'; // score percentage
                    }

                    // check if there is no swap possible
                    else if (highestScore == 0) {
                        // update cookbook text
                        document.getElementById('swaptext' + currentIndex).textContent = 'No suitable swaps found';
                        document.getElementById('AIscore').textContent = 'n.a.';
                    }

                    // log to AI console
                    let resultScore = results[0].score * 100;
                    resultScore = resultScore.toString();
                    resultScore = resultScore.slice(0, 3);
                    resultScore = parseInt(resultScore);
                    if (resultScore < thresholdValue * 100) {
                        logAI('\t\tswap ' + ingredientList[swapArr[k]] + ' for ' + ingredientReturn + ' --> ' + resultScore + '% match, not enough');
                    } else {
                        logAI('\t\tswap ' + ingredientList[swapArr[k]] + ' for ' + ingredientReturn + ' --> ' + resultScore + '% match');
                    }
                });
            }
        }

        // if there are flagged ingredients
        else {
            // check if no filters are active
            if (filter != 'plantFilter' || filter != 'seasonFilter') {
                // check if the tryout module contains a tryout ingredient
                if (document.getElementById('tryoutIngredient').src.includes('transparent') != true) {
                    // do not display potential swaps in the cookbook
                    document.getElementById('swaptext' + currentIndex).textContent = 'No potential swaps found';
                    document.getElementById('AIscore').textContent = 'n.a.';
                    logAI("*AI: \tI didn't find ingredients to swap " + ingredientReturn + ' for'); // log
                }
            }
        }
    }

    // run if the tryout ingedient is already in the recipe
    else if (inputArr[ingredientList.indexOf(ingredientReturn)] == 1) {
        logAI('*AI: \tThis recipe already contains ' + ingredientReturn); // log
    }
}

// replace cookbook module on hover
function hover(element) {
    element.setAttribute('src', 'img/cookbookModuleHover.svg');
}

// replace cookbook module on unhover
function unhover(element) {
    element.setAttribute('src', 'img/cookbookModule.svg');
}
