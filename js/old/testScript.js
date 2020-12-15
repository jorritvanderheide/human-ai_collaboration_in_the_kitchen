//settings
let debug = true; // toggle debug mode

// global variables
let plantBased = false;
let seasonBased = false;
let ingredientReturn; // chosen tryout ingredient
let ingredientArr = []; // array with all the possible recommendation for a chosen intention
let tempIngredientArr = []; // array with 5 random recommendations from ingredientArr
let thresholdValue; // recommendation accuracy

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


    // set button color in HTML
    // document.getElementById('plantBtn').style.backgroundColor = 'white';
    // document.getElementById('seasonBtn').style.backgroundColor = 'white';
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
    
}
