let recipeIngredients = [];

let thresholdValue = 0.5;   // threshold value for showing the alternative

let highestScore = 0;
let bestSwap = "";
let returnMessage = "";

$(document).ready(function () { // prevent automatic sliding
    $('#carouselExampleControls').carousel({ interval: false });
});

$("#carouselExampleControls").on('slid.bs.carousel', function () { // adjust targetrecipe after sliding
    tryAlternative(targetIngredient);
  });

let model;
let modelOptions = {
    task: 'regression',
};

model = ml5.neuralNetwork(modelOptions);

// // load model offline
const modelLoad = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
};
model.load(modelLoad);

function setupRecipes() {
    for (let i = 0; i < recipeList.length; i++) {
        document.getElementById('recipe' + i).style.visibility = 'visible';
        // document.getElementById('recipe' + i).style.display = "block";
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
    logAI('Recipes loaded');
}

function tryAlternative(ingredientReturn) {
    let tryoutCat = ingredientCategory[ingredientList.indexOf(ingredientReturn)];
    var currentIndex = $('div.active').index();
    let i = currentIndex;
        let inputArr = [];
        let swapArr = [];
        returnMessage = "";
        inputArr = recipeVectors[i];

        logAI("---");
        if (filter == "plantFilter") {
            logAI("Looking for plant-based ingredients from " + tryoutCat);
        } else if (filter == "seasonFilter") {
            logAI("Looking for non-seasonal " + tryoutCat + " in " + recipeList[i] + "..");
        }

        for (let j = 0; j < inputArr.length; j++) {
            if (filter == 'plantFilter') {
                // console.log('plant');
                if (inputArr[j] == 1 && ingredientPlant[j] == 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j);
                }
            } else if (filter == 'seasonFilter') {
                // console.log('season');
                if (inputArr[j] == 1 && ingredientSeason[j] != 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j);
                }
            }
        }

        if (swapArr.length > 0) {
            logAI("Found " + swapArr.length);
            highestScore = 0;
            bestSwap = "";

            for (let k = 0; k < swapArr.length; k++) {
                inputArr = recipeVectors[i];    // reset vector for each try
                inputArr[swapArr[k]] = 0;
                inputArr[ingredientList.indexOf(ingredientReturn)] = 1;
                console.log(inputArr);
                model.predict(inputArr, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (results[0].score < thresholdValue) {
                        // document.getElementById('oldIngr' + i).innerText = ' ';
                        // document.getElementById('newIngr' + i).innerText = ' ';
                        if (results[0].score > highestScore) {
                            highestScore = results[0].score;
                        }
                    } else if (results[0].score >= thresholdValue && results[0].score > highestScore) {
                        highestScore = results[0].score;
                        // bestSwap = tempIngredientArr[ingredientReturn];
                        bestSwap = ingredientList[swapArr[k]];
                        returnMessage = "You may swap " + ingredientReturn + "for " + bestSwap;
                        document.getElementById("AIscore").textContent = (highestScore * 100).slice(0,3) + "%";
                        // document.getElementById('newIngr' + i).innerText = tempIngredientArr[ingredientReturn];
                        // document.getElementById('oldIngr' + i).innerText = ingredientList[swapArr[k]];
                    } else if (highestScore != 0) {
                        returnMessage = "No suitable swaps found";
                        // document.getElementById('p' + i).innerText = "Swap " + oldText + "for " + newText;
                        // document.getElementById('newIngr' + i).innerText = newText;
                    }
                });
                // inputArr[swapArr[k]] = 1;
                logAI("Looking at " + ingredientList[swapArr[k]] + "... " + results[0].score + "% compatible");
            }
        } else {
            returnMessage = "Nothing found";
            // document.getElementById('oldIngr' + i).innerText = ' ';
            // document.getElementById('newIngr' + i).innerText = ' ';
        }
        // return returnMessage;
        let p = document.getElementById('p' + i);
        p.textContent = "";

        recipeIngredients = recipeVectors[i].slice(1, -1);
        recipeIngredients = recipeIngredients.split(',').map(Number);

        for (let k = 0; k < recipeIngredients.length; k++) {
            if (recipeIngredients[k] == 1) {
                p.textContent += ingredientList[k] + '\n';
            }
        }

        p.textContent += '\n \n ' + returnMessage;
    }
// function testAlternative(tryIng) {
//     var currentIndex = $('div.active').index();

//     var targetRecipe = recipeList[currentIndex];
//     var targetCategory = ingredientCategory[ingredientList.indexOf(tempIngredientArr[ingredientReturn])];

// }
