// variables
let ingredientData;
let ingredientDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRghrGRbuEdWP5J_FPzh5f-oNdPnsGpc8hkgPe3k7o5VliWepVoAWIgZVsaI0At4M_b4yTIYEe7F-rX/pub?gid=0&single=true&output=csv";
let recipeData;
let recipeDataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIGYNRFDYXKj00RPTS5pbpAr9if65t2kbi2In5_dkUwzMPO2HVV4QvIxpfxFq0jo7fNHB7HG7Z3Nvf/pub?gid=0&single=true&output=csv";

let trainingData;
let trainingDataUrl = '';

let recipeVector = [];
let newRecipeVector = [];

// setup neural network
let model;
let options = {
  inputs = 60,
  outputs = 1,
  task = 'regression'
};

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // setup nn
  model = ml5.neuralNetwork(options);

  // preload data
  ingredientData = loadTable(ingredientDataUrl, "csv", "header");
  recipeData = loadTable(recipeDataUrl, "csv", "header");

  //preload trained model
  // trainingData =;
}

// draw
function draw() {
  background(255);

  if (ingredientData && recipeData) {

    // get tryout ingredient from UI

    // get intention filter from UI
    
    loop {
    // get recipe 1 - 20

    // intention filter

    // remove old ingredient

    // generate new recipe vector

    // execute model
    model.addData(inputs, output)

    // if > threshold -> save recommendation to recipe

    }

    // send saved results to UI
 
  }
}

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
