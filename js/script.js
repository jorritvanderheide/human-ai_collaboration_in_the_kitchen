// load data
let ingredientData;
let ingredientDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv";
let recipeData;
let recipeDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv";
let trainingData;
// let trainingDataUrl = '';

// variables
let recipeAmount;
let recipeList
let recipeVector
let currentRecipeName
let currentRecipeVector

// setup neural network
let model;
let options = {
  inputs: 60,
  outputs: 1,
  task: 'regression'
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
  // trainingData =;

  // run conditions
  if (recipeData.getRowCount() != 0) {
    recipeAmount = recipeData.getRowCount()
    recipeList = recipeData.getColumn('recipeName');
    recipeVector = recipeData.getColumn('recipeVector')
  }
}

// draw
function draw() {
  //draw UI
  drawUI();

  // get tryout ingredient from UI
  // get intention filter from UI

  // if input, run model
  if (ingredientData && recipeData) {
    runModel();
  }

  // send saved results to UI
}

function drawUI() {
  background(255);
  fill(200);
  noStroke();
  rect(25, 25, ((windowWidth - 100) / 3), ((windowHeight - 75) / 3 * 2));
  rect(((windowWidth - 100) / 3 + 50), 25, ((windowWidth - 100) / 3), ((windowHeight - 75) / 3 * 2));
  rect((((windowWidth - 100) / 3) * 2 + 75), 25, ((windowWidth - 100) / 3), ((windowHeight - 75) / 3 * 2));
  rect(25, ((windowHeight - 75) / 3 * 2 + 50), (windowWidth - 50), ((windowHeight - 75) / 3));
  fill(0);
  textSize(18);
  text('Insight Interface', 25 + 12.5, 25 + 25);
  text('Try-out', ((windowWidth - 100) / 3 + 50) + 12.5, 25 + 25)
  text('Cookbook', (((windowWidth - 100) / 3) * 2 + 75) + 12.5, 25 + 25)
  text('Console', 25 + 12.5, ((windowHeight - 75) / 3 * 2 + 50) + 25)
}

function runModel() {
  // runs for every recipe in the database
  for (i = 0; i < recipeAmount; i++) {
    currentRecipeName = recipeList[i];
    currentRecipeVector = recipeVector[i];

    // intention filter

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
