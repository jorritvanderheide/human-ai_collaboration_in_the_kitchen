// global variables
let plantBased = false;
let seasonBased = false;
let recipeData;
let recipeAmount;
let recipeList;
let recipeVector;
let ingredientData;
let ingredientAmount;
let ingredientList;
let ingredientPlant;
let ingredientSeason;
let ingredientCategory;
let ingredientReturn;
let ingredientArr = [];
let tempIngredientArr = [];

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

    // load model
    const modelLoad = {
        model: 'model/model.json',
        metadata: 'model/model_meta.json',
        weights: 'model/model.weights.bin',
    };
    model.load(modelLoad);

    // preload data
    ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
    recipeData = loadTable(recipeDataUrl, 'csv', 'header');

    //set button color in HTML
    document.getElementById('plantBtn').style.backgroundColor = 'white';
    document.getElementById('seasonBtn').style.backgroundColor = 'white';

    // clear console
    console.clear();
}

// assign values to variables when data loaded
function draw() {
    // check if data loaded
    if (recipeData.getRowCount() && ingredientData.getRowCount()) {
        recipeAmount = recipeData.getRowCount();
        recipeList = recipeData.getColumn('recipeName');
        recipeVector = recipeData.getColumn('recipeVector');
        ingredientAmount = ingredientData.getRowCount();
        ingredientList = ingredientData.getColumn('ingredient');
        ingredientPlant = ingredientData.getColumn('isPlantbased');
        ingredientSeason = ingredientData.getColumn('inSeason');
        ingredientCategory = ingredientData.getColumn('category');
        noLoop(); // run once when data is loaded
    }
}

// run if plant-based intention filter is clicked
function plantFilter() {
    // get buttons from HTML
    const plantBtn = document.getElementById('plantBtn');
    const seasonBtn = document.getElementById('seasonBtn');
    // check if button is already active or not, and if data is loaded
    if (plantBtn.style.backgroundColor == 'white' && recipeData.getRowCount() && ingredientData.getRowCount()) {
        // run if button was not yet active
        plantBtn.style.backgroundColor = 'green';
        seasonBtn.disabled = true; // filter is set to true
        plantBased = true; // ingredients are recommended
        recommendIngredients();
    } else {
        // run if button is already active
        plantBtn.style.backgroundColor = 'white';
        seasonBtn.disabled = false; // filter is set to false
        plantBased = false; // recommended ingredients are removed
        removeIngredients();
    }
}

// run if season-based intention filter is clicked
function seasonFilter() {
    // get buttons from HTML
    const seasonBtn = document.getElementById('seasonBtn');
    const plantBtn = document.getElementById('plantBtn');
    // check if filter is already active or not, and if data is loaded
    if (-seasonBtn.style.backgroundColor == 'white' && recipeData.getRowCount() && ingredientData.getRowCount()) {
        // run if button is not yet active
        seasonBtn.style.backgroundColor = 'green';
        plantBtn.disabled = true; // ingredients are recommended
        seasonBased = true; // filter is set to true
        recommendIngredients();
    } else {
        // run if button is already active
        seasonBtn.style.backgroundColor = 'white';
        plantBtn.disabled = false; // filter is set to false
        seasonBased = false; // recommended ingredients are removed
        removeIngredients();
    }
}

// recommend ingredients to try out
function recommendIngredients() {
    // run if plant-based filter is active
    if (plantBased == true) {
        ingredientArr = []; // reset recommendation array
        // run for every ingredient in the database
        for (let i = 0; i < ingredientAmount; i++) {
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
    } else {
        // run if season-based filter is active
        if (seasonBased == true) {
            ingredientArr = []; // reset recommendation array
            // run for every ingredient in the database
            for (i = 0; i < ingredientAmount; i++) {
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
}

// reset interface if a filter is de-selected
function removeIngredients() {
    // run for every try-out button
    for (let i = 1; i < 6; i++) {
        document.getElementById('ingrBtn' + i).innerText = '...'; // remove suggestions from buttons
    }
    // run for each recipe
    for (let i = 0; i < 5; i++) {
        // remove suggestions from recipe
        document.getElementById('newIngr' + i).innerText = 'New ingredient';
        document.getElementById('oldIngr' + i).innerText = 'Old ingredient';
    }
}

// run model with an input value ('ingredientReturn') of 1-5, received from the HTML depending on what try-out button is clicked
function runModel(ingredientReturn) {
    let tryoutCat = ingredientCategory[ingredientList.indexOf(tempIngredientArr[ingredientReturn])]; //determine the product category of the try-out ingredient based on the input value
    // run for each recipe
    for (let i = 0; i < 5; i++) {
        // reset arrays
        let inputArr = [];
        let swapArr = [];

        inputArr = document.getElementById('recipeVector' + i).innerText;
        inputArr = inputArr.split(',').map(Number);

        // runs for every ingredient in the recipe vector
        for (let j = 0; j < inputArr.length; j++) {
            if (plantBased == true) {
                if (inputArr[j] == 1 && ingredientPlant[j] == 0 && tryoutCat == ingredientCategory[j]) {
                    inputArr[j] = 0;
                    swapArr.push(j);
                    document.getElementById('oldIngr' + i).innerText = ingredientList[j];
                }
            }
            if (seasonBased == true) {
                if (inputArr[j] == 1 && ingredientSeason[j].length != 0 && tryoutCat == ingredientCategory[j]) {
                    inputArr[j] = 0;
                    swapArr.push(j);
                    document.getElementById('oldIngr' + i).innerText = ingredientList[j];
                }
            }
            if (ingredientList[j] == ingredientReturn) {
                inputArr[j] = 1;
            }
        }

        if (swapArr.length > 0) {
            // for (let k; k < swapArr.length; k++) {
            model.predict(inputArr, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (results[0].score >= 0.8) {
                    document.getElementById('newIngr' + i).innerText = tempIngredientArr[ingredientReturn];
                } else if (results[0].score < 0.5) {
                    document.getElementById('newIngr' + i).innerText = 'no alternative found';
                }
                // console.log(results[0].score);
            });
            // }
        } else if (swapArr.length == 0) {
            document.getElementById('oldIngr' + i).innerText = 'not applicable';
            document.getElementById('newIngr' + i).innerText = ' ';
        }
    }
}
