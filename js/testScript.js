//settings
let debug = true; // toggle debug mode

// global variables
let plantBased = false;
let seasonBased = false;
let recipeData; // full recipe .csv
let ingredientData; // full ingredient .csv
let recipeList; // array with the names of the recipes
let recipeVectors; // array with the vectors of the recipes
let ingredientList; // array with the names of the ingredients
let ingredientPlant; // array with if an ingredient is plant-based
let ingredientSeason; // array with when an ingredient is in season
let ingredientCategory; // array with the ingredient category
let ingredientReturn; // chosen tryout ingredient
let ingredientArr = []; // array with all the possible recommendation for a chosen intention
let tempIngredientArr = []; // array with 5 random recommendations from ingredientArr
let thresholdValue; // recommendation accuracy

// import csv's
let recipeDataUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';
let ingredientDataUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv';

// setup neural network
let model;
let modelOptions = {
    task: 'regression',
};

// setup
function setup() {
    // setup neural network
    model = ml5.neuralNetwork(modelOptions);

    // // load model offline
    const modelLoad = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin',
    };
    model.load(modelLoad);

    // // load model online
    // const modelLoad = {
    //   model: "webapp/model/model.json",
    //   metadata: "webapp/model/model_meta.json",
    //   weights: "webapp/model/model.weights.bin",
    // };
    // model.load(modelLoad);

    // preload data
    ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
    recipeData = loadTable(recipeDataUrl, 'csv', 'header');

    // set button color in HTML
    document.getElementById('plantBtn').style.backgroundColor = 'white';
    document.getElementById('seasonBtn').style.backgroundColor = 'white';
}

// assign values to variables when data loaded
function draw() {
    // check if data loaded
    if (recipeData.getRowCount() && ingredientData.getRowCount()) {
        recipeList = recipeData.getColumn('recipeName');
        recipeVectors = recipeData.getColumn('recipeVector');
        ingredientList = ingredientData.getColumn('ingredient');
        ingredientPlant = ingredientData.getColumn('isPlantbased');
        ingredientSeason = ingredientData.getColumn('inSeason');
        ingredientCategory = ingredientData.getColumn('category');

        // console message
        console.clear();
        if (debug == true) {
            console.log('[Debug mode enabled]');
        }
        noLoop(); // run once when data is loaded
    }
}

// run if plant-based intention filter is clicked
function plantFilter() {
    // log
    if (debug == true) {
        console.clear();
        console.log('Running "plantFilter"');
    }

    // get buttons from HTML
    const plantBtn = document.getElementById('plantBtn');
    const seasonBtn = document.getElementById('seasonBtn');

    // check if button is already active or not, and if data is loaded
    if (plantBtn.style.backgroundColor == 'white') {
        // run if button was not yet active
        plantBtn.style.backgroundColor = 'green';
        seasonBtn.disabled = true; // filter is set to true
        plantBased = true; // ingredients are recommended

        // log
        if (debug == true) {
            console.log('-> Plant-based filter enabled');
        }

        // run 'recommendIngredients'
        recommendIngredients();
    } else {
        // run if button is already active
        plantBtn.style.backgroundColor = 'white';
        seasonBtn.disabled = false; // filter is set to false
        plantBased = false; // recommended ingredients are removed

        // log
        if (debug == true) {
            console.log('-> Plant-based filter disabled');
        }

        // run 'removeIngredients'
        removeIngredients();
    }
}

// run if season-based intention filter is clicked
function seasonFilter() {
    // log
    if (debug == true) {
        console.clear();
        console.log('Running "seasonFilter"');
    }

    // get buttons from HTML
    const seasonBtn = document.getElementById('seasonBtn');
    const plantBtn = document.getElementById('plantBtn');

    // check if filter is already active or not, and if data is loaded
    if (seasonBtn.style.backgroundColor == 'white') {
        // run if button is not yet active
        seasonBtn.style.backgroundColor = 'green';
        plantBtn.disabled = true; // ingredients are recommended
        seasonBased = true; // filter is set to true

        // log
        if (debug == true) {
            console.log('-> Season-based filter enabled');
        }

        // run 'recommendIngredients'
        recommendIngredients();
    } else {
        // run if button is already active
        seasonBtn.style.backgroundColor = 'white';
        plantBtn.disabled = false; // filter is set to false
        seasonBased = false; // recommended ingredients are removed

        //log
        if (debug == true) {
            console.log('-> Season-based filter enabled');
        }

        // run 'removeIngredients'
        removeIngredients();
    }
}

// recommend ingredients to try out
function recommendIngredients() {
    // log
    if (debug == true) {
        console.log('Running "recommendIngredients"');
    }

    // run if plant-based filter is active
    if (plantBased == true) {
        ingredientArr = []; // reset recommendation array

        // run for every ingredient in the database
        for (let i = 0; i < ingredientList.length; i++) {
            // checks if ingredient is plant-based and does not belong to the 'vegetables and fruit' category
            if (ingredientPlant[i] == 1 && ingredientCategory[i] != 'vegetables and fruit') {
                ingredientArr.push(ingredientList[i]); // push possible recommendations to array
            }
        }
        tempIngredientArr = []; // reset the recommendation array for the 5 try-out buttons

        // run for every try-out button
        for (i = 1; i < 6; i++) {
            const random = Math.floor(Math.random() * ingredientArr.length); // define random value within the array's length
            let randomIngredient = (random, ingredientArr[random]); // pick a random ingredient from the array
            document.getElementById('ingrBtn' + i).innerText = randomIngredient; // update try-out button text in HTML
            tempIngredientArr.push(randomIngredient); // add the chosen ingredient to the array
        }
    }
    // run if season-based filter is active
    else if (seasonBased == true) {
        ingredientArr = []; // reset recommendation array

        // run for every ingredient in the database
        for (i = 0; i < ingredientList.length; i++) {
            // checks if ingredient is in season in fall
            if (ingredientSeason[i].includes('fall')) {
                ingredientArr.push(ingredientList[i]); // push possible recommendations to array
            }
        }
        tempIngredientArr = []; // reset the recommendation array for the 5 try-out buttons

        // run for every try-out button
        for (i = 1; i < 6; i++) {
            const random = Math.floor(Math.random() * ingredientArr.length); // define random value within the array's length
            let randomIngredient = (random, ingredientArr[random]); // pick a random ingredient from the array
            document.getElementById('ingrBtn' + i).innerText = randomIngredient; // update try-out button text in HTML
            tempIngredientArr.push(randomIngredient); // add the chosen ingredient to the array
        }
    }
}

// reset interface if a filter is de-selected
function removeIngredients() {
    // log
    if (debug == true) {
        console.clear();
        console.log('Running "removeIngredients"');
        console.log('-> Removing try-out suggestions on buttons');
        console.log('-> Resetting suggestion text on recipe');
    }

    // run for every try-out button
    for (let i = 1; i < 6; i++) {
        document.getElementById('ingrBtn' + i).innerText = '...'; // remove suggestion from try-out button
    }

    // run for each recipe
    for (let i = 0; i < 5; i++) {
        // remove suggestions from recipe
        document.getElementById('newIngr' + i).innerText = 'new ingredient';
        document.getElementById('oldIngr' + i).innerText = 'old ingredient';
    }
}

// run model with an input value ('ingredientReturn') of 1-5, received from the HTML depending on what try-out button is clicked
function runModel(ingredientReturn) {
    // log
    if (debug == true) {
        console.clear();
        console.log('Running "runModel" for try-out ingredient ' + tempIngredientArr[ingredientReturn]);
    }

    // set recommendation accuracy
    thresholdValue = document.getElementById('accuracy').value;

    // determine the product category of the try-out ingredient based on the input value
    let tryoutCat = ingredientCategory[ingredientList.indexOf(tempIngredientArr[ingredientReturn])];

    // top recipes
    let topRecipes = [];
    let topNew = [];
    let topOld = [];

    // run for each recipe
    // for (let i = 0; i < recipeList.length; i++) { // enable for fulll recipe list
    for (let i = 0; i < 5; i++) {
        // disable for fulll recipe list
        // log
        if (debug == true) {
            console.log('Run for recipe ' + i);
        }

        // reset variables
        let inputArr = []; // array for inputting into the neural network
        let swapArr = []; // array containing the ingredients that can potentially be swapped out for a try-out ingredient

        // fill input array with the recipe vectors from database
        inputArr = recipeVectors[i];
        inputArr = inputArr.slice(1, -1);
        inputArr = inputArr.split(',').map(Number);

        // log
        if (debug == true) {
            // console.log('-> The recipe vector for recipe ' + i + ' is ' + inputArr);
        }

        // runs for every ingredient in the recipe vector
        for (let j = 0; j < inputArr.length; j++) {
            // check if plant-based filter is active
            if (plantBased == true) {
                // check which ingredients that have the same category as the selected try-out ingredient, are in the recipe and are not plant-based
                if (inputArr[j] == 1 && ingredientPlant[j] == 0 && tryoutCat == ingredientCategory[j]) {
                    swapArr.push(j); // add the swap ingredient to the swap-potential array
                }
            }

            // check if season-based filter is active
            else {
                // check which ingredients that have the same category as the selected try-out ingredient, are in the recipe and are in season
                if (inputArr[j] == 1 && ingredientSeason[j].length != 0) {
                    swapArr.push(j); // add the swap ingredient to the swap-potential array
                }
            }
        }

        // check if there are potential swaps
        if (swapArr.length > 0) {
            // log
            if (debug == true) {
                console.log('-> ' + swapArr.length + ' swap ingredient(s) found');
            }

            // reset variables for each recipe with potential swaps
            let highestScore = 0;
            let newText = ' ';
            let oldText = ' ';

            // run for every potential swap
            for (let k = 0; k < swapArr.length; k++) {
                inputArr[swapArr[k]] = 0; // update the input array for current potential swap ingredient
                inputArr[ingredientList.indexOf(tempIngredientArr[ingredientReturn])] = 1; // add the try-out ingredient to the input array

                // run the input array through the neural network
                model.predict(inputArr, (err, results) => {
                    // show errors in console
                    if (err) {
                        console.log(err);
                        return;
                    }

                    // if the score is lower then the threshold value
                    if (results[0].score < thresholdValue) {
                        // log
                        if (debug == true) {
                            console.log('-> Swap ' + k + ' below threshold for recipe ' + i);
                        }

                        // update recipe card text
                        document.getElementById('oldIngr' + i).innerText = ' ';
                        document.getElementById('newIngr' + i).innerText = ' ';
                    }

                    // if the score is higher then the threshold value
                    else if (results[0].score >= thresholdValue && results[0].score > highestScore) {
                        // log
                        if (debug == true) {
                            console.log('-> Swap ' + k + ' above threshold for recipe ' + i + ' and highestScore');
                        }
                        highestScore = results[0].score; // update highest score
                        newText = tempIngredientArr[ingredientReturn]; // remember highest scoring ingredient
                        oldText = ingredientList[swapArr[k]]; // remember for what ingredient this was swapped

                        // add recipe to the top recipe list
                        topRecipes.push(recipeList[i]);
                        topNew.push(tempIngredientArr[ingredientReturn]);
                        topOld.push(ingredientList[swapArr[k]]);
                    }

                    // update recipe card text
                    else if (highestScore != 0) {
                        // log
                        if (debug == true) {
                            console.log('-> Swap ' + k + ' above threshold for recipe ' + i + ' but not higestScore');
                        }
                        document.getElementById('oldIngr' + i).innerText = oldText;
                        document.getElementById('newIngr' + i).innerText = newText;
                    }

                    // log
                    if (debug == true) {
                        console.log(results[0].score);
                    }
                });
                inputArr[swapArr[k]] = 1; // reset input array
            }
        }

        // if there are no potential swaps
        else {
            // log
            if (debug == true) {
                console.log('-> No swap ingredient(s) found');
            }

            // update recipe card text
            document.getElementById('oldIngr' + i).innerText = ' ';
            document.getElementById('newIngr' + i).innerText = ' ';
        }
    }
}

// function viableSwaps() {

//     // show recipes
//     console.log('test');
//     for (let l = 0; l < topRecipes.length; l++) {
//         console.log('Recipe ' + (l + 1) + ': ' + topRecipes[0]);
//         console.log('-> Old ingredient: ' + topOld[0]);
//         console.log('-> New ingredient: ' + topNew[0]);
//     }

// }
