// load data
let ingredientData;
let ingredientDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv";
let recipeData;
let recipeDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv";
let trainingData;
let trainingDataUrl = "https://data.id.tue.nl/datasets/downloadPublic/WM4i2UiFfBqCkooSD6z/0bSDERz3S2eVjGdNK8me8EEn8BeyxZTcbUVXR1+5BWl2";

// variables
let recipeAmount;
let recipeList;
let recipeVector;
let currentRecipeName;
let currentRecipeVector;

let consoleText;
let x1;
let x2;
let x3;
let x4;
let x5;
let x6;
let x7;
let x8;
let x9;
let x10;
let timer = 0;

// ui
let gui;
let plantToggle;
let seasonToggle;

// setup neural network
let model;
let options = {
  inputs: 60,
  outputs: 1,
  task: "regression",
};

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // setup neural network
  model = ml5.neuralNetwork(options);

  // preload data
  ingredientData = loadTable(ingredientDataUrl, "csv", "header");
  recipeData = loadTable(recipeDataUrl, "csv", "header");

  //preload trained model
  trainingData = loadTable(ingredientDataUrl, "csv", "header");

  // setup ui
  gui = createGui();
  plantToggle = createToggle("Plant-based", 50, 50, 150, 50);
  seasonToggle = createToggle("In-season", 250, 50, 150, 50);
}

// draw
function draw() {
  // gui
  drawGui();

  // intention filter
  if (plantToggle.val) {
    //flag ingredients
    print("plant");
  }

  if (seasonToggle.val) {
    // flag ingredients
    print("season");
  }

  // display try-out ingredients

  // select tryout ingredient

  // determine input vector for nn

  // if input, run model
  if (ingredientData && recipeData) {
    // run conditions
    if (recipeData.getRowCount() != 0) {
      recipeAmount = recipeData.getRowCount();
      recipeList = recipeData.getColumn("recipeName");
      recipeVector = recipeData.getColumn("recipeVector");
    }
    runModel();
  }
}

function runModel() {
  // runs for every recipe in the database
  for (i = 0; i < recipeAmount; i++) {
    currentRecipeName = recipeList[i];
    currentRecipeVector = recipeVector[i];

    // decide which old ingredient has to go

    // remove old ingredient

    // generate new recipe vector

    // execute model
    // model.addData(inputs, output)

    // if > threshold -> save recommendation to recipe
  }
}

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// prevent scrolling on mobile
function touchMoved() {
  return false;
}