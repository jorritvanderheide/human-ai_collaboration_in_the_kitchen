let recipeIngredients = [];

$(document).ready(function () {
    // Activate Carousel
    $('#carouselExampleControls').carousel({ interval: false });
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

let thresholdValue = 0.5;

function runModel(ingredientReturn) {
    let tryoutCat = ingredientCategory[ingredientList.indexOf(ingredientReturn)];
    for (let i = 0; i < recipeList.length; i++) {
        let inputArr = [];
        let swapArr = [];
        inputArr = recipeVectors[i];
        for (let j = 0; j < inputArr.length; j++) {
            if (filter == 'plantFilter') {
                console.log('plant');
                if (inputArr[j] == 1 && ingredientPlant[j] == 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j);
                }
            } else if (filter == 'seasonFilter') {
                console.log('season');
                if (inputArr[j] == 1 && ingredientSeason[j].length != 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j);
                }
            }
        }
        if (swapArr.length > 0) {
            let highestScore = 0;
            // let newText = ' ';
            // let oldText = ' ';
            for (let k = 0; k < swapArr.length; k++) {
                inputArr[swapArr[k]] = 0;
                inputArr[ingredientList.indexOf(ingredientReturn)] = 1;
                model.predict(inputArr, (err, results) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (results[0].score < thresholdValue) {
                        // document.getElementById('oldIngr' + i).innerText = ' ';
                        // document.getElementById('newIngr' + i).innerText = ' ';
                        results[0].score;
                    } else if (results[0].score >= thresholdValue && results[0].score > highestScore) {
                        highestScore = results[0].score;
                        newText = tempIngredientArr[ingredientReturn];
                        oldText = ingredientList[swapArr[k]];
                        // document.getElementById('newIngr' + i).innerText = tempIngredientArr[ingredientReturn];
                        // document.getElementById('oldIngr' + i).innerText = ingredientList[swapArr[k]];
                    } else if (highestScore != 0) {
                        // document.getElementById('oldIngr' + i).innerText = oldText;
                        // document.getElementById('newIngr' + i).innerText = newText;
                    }
                });
                inputArr[swapArr[k]] = 1;
            }
        } else {
            // document.getElementById('oldIngr' + i).innerText = ' ';
            // document.getElementById('newIngr' + i).innerText = ' ';
        }
    }
}
// function testAlternative(tryIng) {
//     var currentIndex = $('div.active').index();

//     var targetRecipe = recipeList[currentIndex];
//     var targetCategory = ingredientCategory[ingredientList.indexOf(tempIngredientArr[ingredientReturn])];

// }
