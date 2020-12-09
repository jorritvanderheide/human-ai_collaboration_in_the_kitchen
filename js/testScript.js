// global variables
let plantBased = false;
let seasonBased = false;
let ingredientPlant;
let ingredientSeason;
let ingredientCategory;
let ingredientReturn;
let ingredientArr = [];
let tempIngredientArr = [];

let recipeAmount;
let recipeList;
let recipeVector;
let recipeDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv";
let recipeData;

let ingredientAmount;
let ingredientList;
let ingredientDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv";
let ingredientData;

// setup neural network
let model;
let modelOptions = {
  task: "regression",
};

// setup
function setup() {
  // setup neural network
  model = ml5.neuralNetwork(modelOptions);

  // load model
  const modelLoad = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  model.load(modelLoad, function () {});

  // preload data
  ingredientData = loadTable(ingredientDataUrl, "csv", "header");
  recipeData = loadTable(recipeDataUrl, "csv", "header");

  //set button color
  document.getElementById("plantBtn").style.backgroundColor = "white";
  document.getElementById("seasonBtn").style.backgroundColor = "white";

  // clear console
  console.clear();
}

// assign variables when data loaded
function draw() {
  if (recipeData.getRowCount() && ingredientData.getRowCount()) {
    recipeAmount = recipeData.getRowCount();
    recipeList = recipeData.getColumn("recipeName");
    recipeVector = recipeData.getColumn("recipeVector");
    ingredientAmount = ingredientData.getRowCount();
    ingredientList = ingredientData.getColumn("ingredient");
    ingredientPlant = ingredientData.getColumn("isPlantbased");
    ingredientSeason = ingredientData.getColumn("inSeason");
    ingredientCategory = ingredientData.getColumn("category");
    noLoop();
  }
}

// if plant-based intention filter is clicked
function plantFilter() {
  const plantBtn = document.getElementById("plantBtn");
  const seasonBtn = document.getElementById("seasonBtn");
  if (
    plantBtn.style.backgroundColor == "white" &&
    recipeData.getRowCount() &&
    ingredientData.getRowCount()
  ) {
    plantBtn.style.backgroundColor = "green";
    seasonBtn.disabled = true;
    plantBased = true;
    recommendIngredients();
  } else {
    plantBtn.style.backgroundColor = "white";
    seasonBtn.disabled = false;
    plantBased = false;
    removeIngredients();
  }
}

// if season-based intention filter is clicked
function seasonFilter() {
  const seasonBtn = document.getElementById("seasonBtn");
  const plantBtn = document.getElementById("plantBtn");
  if (
    seasonBtn.style.backgroundColor == "white" &&
    recipeData.getRowCount() &&
    ingredientData.getRowCount()
  ) {
    seasonBtn.style.backgroundColor = "green";
    plantBtn.disabled = true;
    seasonBased = true;
    recommendIngredients();
  } else {
    seasonBtn.style.backgroundColor = "white";
    plantBtn.disabled = false;
    seasonBased = false;
    removeIngredients();
  }
}

// recommends ingredients to try out
function recommendIngredients() {
  if (plantBased == true) {
    // if plant-based filter is active
    ingredientArr = [];
    for (let i = 0; i < ingredientAmount; i++) {
      if (
        ingredientPlant[i] == 1 &&
        ingredientCategory[i] != "vegetables and fruit"
      ) {
        // filters vegetables from the recommendations
        ingredientArr.push(ingredientList[i]); // push possible recommendations to array
      }
    }
    tempIngredientArr = [];
    for (i = 1; i < 6; i++) {
      const random = Math.floor(Math.random() * ingredientArr.length);
      let randomIngredient = (random, ingredientArr[random]);
      document.getElementById("ingrBtn" + i).innerText = randomIngredient;
      tempIngredientArr.push(randomIngredient);
    }
  } else {
    // if season-based filter is active
    if (seasonBased == true) {
      ingredientArr = [];
      for (i = 0; i < ingredientAmount; i++) {
        if (ingredientSeason[i].includes("fall")) {
          ingredientArr.push(ingredientList[i]); // push possible recommendations to array
        }
      }
      tempIngredientArr = [];
      for (i = 1; i < 6; i++) {
        const random = Math.floor(Math.random() * ingredientArr.length);
        let randomIngredient = (random, ingredientArr[random]);
        document.getElementById("ingrBtn" + i).innerText = randomIngredient;
        tempIngredientArr.push(randomIngredient);
      }
    }
  }
}

// reset interface if filter is de-selected
function removeIngredients() {
  for (let i = 1; i < 6; i++) {
    document.getElementById("ingrBtn" + i).innerText = "..."; // remove suggestions from buttons
  }
  for (let i = 0; i < 5; i++) {
    document.getElementById("newIngr" + i).innerText = "New ingredient"; // remove suggestions from recipes
    document.getElementById("oldIngr" + i).innerText = "Old ingredient";
  }
}

// run model
function runModel(ingredientReturn) {
  let tryoutCat =
    ingredientCategory[
      ingredientList.indexOf(tempIngredientArr[ingredientReturn])
    ];

  // runs for every recipe
  for (let i = 0; i < 5; i++) {
    let inputArr = [];
    let swapArr = [];

    inputArr = document.getElementById("recipeVector" + i).innerText;
    inputArr = inputArr.split(",").map(Number);

    // runs for every ingredient in the recipe vector
    for (let j = 0; j < inputArr.length; j++) {
      if (plantBased == true) {
        if (
          inputArr[j] == 1 &&
          ingredientPlant[j] == 0 &&
          tryoutCat == ingredientCategory[j]
        ) {
          inputArr[j] = 0;
          swapArr.push(j);
          document.getElementById("oldIngr" + i).innerText = ingredientList[j];
        }
      }
      if (seasonBased == true) {
        if (
          inputArr[j] == 1 &&
          ingredientSeason[j].length != 0 &&
          tryoutCat == ingredientCategory[j]
        ) {
          inputArr[j] = 0;
          swapArr.push(j);
          document.getElementById("oldIngr" + i).innerText = ingredientList[j];
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
          document.getElementById("newIngr" + i).innerText =
            tempIngredientArr[ingredientReturn];
        } else if (results[0].score < 0.5) {
          document.getElementById("newIngr" + i).innerText =
            "no alternative found";
        }
        // console.log(results[0].score);
      });
      // }
    } else if (swapArr.length == 0) {
      document.getElementById("oldIngr" + i).innerText = "not applicable";
      document.getElementById("newIngr" + i).innerText = " ";
    }
  }
}
