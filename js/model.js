// load data
let ingredientData;
let ingredientDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv";
let recipeData;
let recipeDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv";
let trainingData;
let trainingDataUrl = "https://data.id.tue.nl/datasets/downloadPublic/WM4i2UiFfBqCkooSD6z/0bSDERz3S2eVjGdNK8me8EEn8BeyxZTcbUVXR1+5BWl2";

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

  // run conditions
  if (recipeData.getRowCount() != 0) {
    recipeAmount = recipeData.getRowCount();
    recipeList = recipeData.getColumn("recipeName");
    recipeVector = recipeData.getColumn("recipeVector");
  }
}

// draw
function draw() {
  // if input, run model
  if (ingredientData && recipeData) {
    runModel();
  }
}

function runModel() {
  for (i = 0; i < recipeAmount; i++) {

  // nn code

  }
}

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
