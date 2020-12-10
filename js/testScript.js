//settings
let thresholdValue = 0.8; // set threshold value
let debug = true; // toggle debug mode

// global variables
let plantBased = false;
let seasonBased = false;
let recipeData; // full recipe .csv
let ingredientData; // full ingredient .csv
let recipeList; // array with the names of the recipes
let ingredientList; // array with the names of the ingredients
let ingredientPlant; // array with if an ingredient is plant-based
let ingredientSeason; // array with when an ingredient is in season
let ingredientCategory; // array with the ingredient category
let ingredientReturn; // chosen tryout ingredient
let ingredientArr = []; // array with all the possible recommendation for a chosen intention
let tempIngredientArr = []; // array with 5 random recommendations from ingredientArr
let highestScore = 0; // highest scoring try-out ingredient score

// import csv's
let recipeDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv";
let ingredientDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv";

// setup neural network
let model;
let modelOptions = {
  task: "regression",
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
  ingredientData = loadTable(ingredientDataUrl, "csv", "header");
  recipeData = loadTable(recipeDataUrl, "csv", "header");

  // set button color in HTML
  document.getElementById("plantBtn").style.backgroundColor = "white";
  document.getElementById("seasonBtn").style.backgroundColor = "white";
}

// assign values to variables when data loaded
function draw() {
  // check if data loaded
  if (recipeData.getRowCount() && ingredientData.getRowCount()) {
    recipeList = recipeData.getColumn("recipeName");
    ingredientList = ingredientData.getColumn("ingredient");
    ingredientPlant = ingredientData.getColumn("isPlantbased");
    ingredientSeason = ingredientData.getColumn("inSeason");
    ingredientCategory = ingredientData.getColumn("category");

    // console message
    console.clear();
    if (debug == true) {
      console.log("[Debug mode enabled]");
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
  const plantBtn = document.getElementById("plantBtn");
  const seasonBtn = document.getElementById("seasonBtn");

  // check if button is already active or not, and if data is loaded
  if (plantBtn.style.backgroundColor == "white") {
    // run if button was not yet active
    plantBtn.style.backgroundColor = "green";
    seasonBtn.disabled = true; // filter is set to true
    plantBased = true; // ingredients are recommended

    // log
    if (debug == true) {
      console.log("-> Plant-based filter enabled");
    }

    // run 'recommendIngredients'
    recommendIngredients();
  } else {
    // run if button is already active
    plantBtn.style.backgroundColor = "white";
    seasonBtn.disabled = false; // filter is set to false
    plantBased = false; // recommended ingredients are removed

    // log
    if (debug == true) {
      console.log("-> Plant-based filter disabled");
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
  const seasonBtn = document.getElementById("seasonBtn");
  const plantBtn = document.getElementById("plantBtn");

  // check if filter is already active or not, and if data is loaded
  if (seasonBtn.style.backgroundColor == "white") {
    // run if button is not yet active
    seasonBtn.style.backgroundColor = "green";
    plantBtn.disabled = true; // ingredients are recommended
    seasonBased = true; // filter is set to true

    // log
    if (debug == true) {
      console.log("-> Season-based filter enabled");
    }

    // run 'recommendIngredients'
    recommendIngredients();
  } else {
    // run if button is already active
    seasonBtn.style.backgroundColor = "white";
    plantBtn.disabled = false; // filter is set to false
    seasonBased = false; // recommended ingredients are removed

    //log
    if (debug == true) {
      console.log("-> Season-based filter enabled");
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
      if (ingredientPlant[i] == 1 && ingredientCategory[i] != "vegetables and fruit") {
        ingredientArr.push(ingredientList[i]); // push possible recommendations to array
      }
    }
    tempIngredientArr = []; // reset the recommendation array for the 5 try-out buttons

    // run for every try-out button
    for (i = 1; i < 6; i++) {
      const random = Math.floor(Math.random() * ingredientArr.length); // define random value within the array's length
      let randomIngredient = (random, ingredientArr[random]); // pick a random ingredient from the array
      document.getElementById("ingrBtn" + i).innerText = randomIngredient; // update try-out button text in HTML
      tempIngredientArr.push(randomIngredient); // add the chosen ingredient to the array
    }
  }
  // run if season-based filter is active
  else if (seasonBased == true) {
    ingredientArr = []; // reset recommendation array

    // run for every ingredient in the database
    for (i = 0; i < ingredientList.length; i++) {
      // checks if ingredient is in season in fall
      if (ingredientSeason[i].includes("fall")) {
        ingredientArr.push(ingredientList[i]); // push possible recommendations to array
      }
    }
    tempIngredientArr = []; // reset the recommendation array for the 5 try-out buttons

    // run for every try-out button
    for (i = 1; i < 6; i++) {
      const random = Math.floor(Math.random() * ingredientArr.length); // define random value within the array's length
      let randomIngredient = (random, ingredientArr[random]); // pick a random ingredient from the array
      document.getElementById("ingrBtn" + i).innerText = randomIngredient; // update try-out button text in HTML
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
    console.log("-> Removing try-out suggestions on buttons");
    console.log("-> Resetting suggestion text on recipe");
  }

  // run for every try-out button
  for (let i = 1; i < 6; i++) {
    document.getElementById("ingrBtn" + i).innerText = "..."; // remove suggestion from try-out button
  }

  // run for each recipe
  for (let i = 0; i < 5; i++) {
    // remove suggestions from recipe
    document.getElementById("newIngr" + i).innerText = "new ingredient";
    document.getElementById("oldIngr" + i).innerText = "old ingredient";
  }
}

// run model with an input value ('ingredientReturn') of 1-5, received from the HTML depending on what try-out button is clicked
function runModel(ingredientReturn) {
  // log
  if (debug == true) {
    console.clear();
    console.log('Running "runModel" for try-out ingredient ' + tempIngredientArr[ingredientReturn]);
  }

  // determine the product category of the try-out ingredient based on the input value
  let tryoutCat = ingredientCategory[ingredientList.indexOf(tempIngredientArr[ingredientReturn])];

  // run for each recipe
  for (let i = 0; i < 5; i++) {
    // log
    if (debug == true) {
      console.log("Run for recipe " + i);
    }

    // reset variables
    let inputArr = []; // array for inputting into the neural network
    let swapArr = []; // array containing the ingredients that can potentially be swapped out for a try-out ingredient
    highestScore = 0; // highest neural network score

    // fill input array with the recipe vector from the HTML
    inputArr = document.getElementById("recipeVector" + i).innerText;
    inputArr = inputArr.split(",").map(Number);

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
          inputArr[j] = 0; // remove swap ingredient from the input array
          swapArr.push(j); // add the swap ingredient to the swap-potential array
          document.getElementById("oldIngr" + i).innerText = ingredientList[j]; // update the 'old ingredient' text on the recipe card
        }
      }

      // check if season-based filter is active
      else if (seasonBased == true) {
        // check which ingredients that have the same category as the selected try-out ingredient, are in the recipe and are in season
        if (inputArr[j] == 1 && ingredientSeason[j].length != 0 && tryoutCat == ingredientCategory[j]) {
          inputArr[j] = 0; // remove swap ingredient from the input array
          swapArr.push(j); // add the swap ingredient to the swap-potential array
          document.getElementById("oldIngr" + i).innerText = ingredientList[j]; // update the text on the recipe card
        }
      }
    }

    // check if there are potential swaps
    if (swapArr.length > 0) {
      // log
      if (debug == true) {
        console.log("-> " + swapArr.length + " swap ingredient(s) found");
      }

      // run for every potential swap
      for (let k = 0; k < swapArr.length; k++) {
        // update the input array for current potential swap ingredient
        inputArr[swapArr[k]] = 1;

        // remove the previous try-out ingredient from the input array
        if (k >= 1) {
          inputArr[swapArr[k - 1]] = 0;
        }

        // run the input array through the neural network
        model.predict(inputArr, (err, results) => {
          // show errors in console
          if (err) {
            console.log(err);
            return;
          }

          // if the score is higher then the threshold value
          if (results[0].score >= thresholdValue) {
            // log
            if (debug == true) {
              console.log("-> Swap " + k + " above threshold for recipe " + i);
            }

            // if the score is higher then the current highest score
            if (results[0].score > highestScore) {
              // log
              if (debug == true) {
                console.log("-> Swap " + k + " new highest score");
              }

              highestScore = results[0].score; // update highest score
              document.getElementById("newIngr" + i).innerText = tempIngredientArr[ingredientReturn]; // update recipe card text
            }
          }

          // if the score is lower then the threshold value
          else {
            // log
            if (debug == true) {
              console.log("-> Swap " + k + " below threshold for recipe " + i);
            }

            // update recipe card text
            document.getElementById("newIngr" + i).innerText = "no alternative found";
          }

          // log
          if (debug == true) {
            console.log(results[0].score);
          }
        });
      }
    }

    // if there are no potential swaps
    else {
      // log
      if (debug == true) {
        console.log("-> No swap ingredient(s) found");
        console.log("-> Recipe " + i + " not applicable");
      }

      // update recipe card text
      document.getElementById("oldIngr" + i).innerText = "not applicable";
      document.getElementById("newIngr" + i).innerText = "-";
    }
  }
}
