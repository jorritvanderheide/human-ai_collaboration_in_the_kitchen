// variables
let ingredientData;
let ingredientDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRghrGRbuEdWP5J_FPzh5f-oNdPnsGpc8hkgPe3k7o5VliWepVoAWIgZVsaI0At4M_b4yTIYEe7F-rX/pub?gid=0&single=true&output=csv";
let recipeData;
let recipeDataUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIGYNRFDYXKj00RPTS5pbpAr9if65t2kbi2In5_dkUwzMPO2HVV4QvIxpfxFq0jo7fNHB7HG7Z3Nvf/pub?gid=0&single=true&output=csv";

// // setup nn
// const options = {
//   input: 1,
//   outputs: 2,
//   task: 'regression',
//   // debug: true
// }

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  // noLoop();

  // preload data
  ingredientData = loadTable(ingredientDataUrl, "csv", "header");
  recipeData = loadTable(recipeDataUrl, "csv", "header");
}

// draw
function draw() {
  background(255);
  if (ingredientData && recipeData) {
    
    h = 100;
    textSize(32);

    for (i = 0; i < 10; i++) {
      let value = ingredientData.getColumn('Product_EN');

      button = createButton(value[i]);
      button.position(100, h);
      h = h + 85;
    }
    

    // const nn = ml5.neuralNetwork(options);

    // // load trained model
    // const modelDetails = {
    //   model: 'model/model.json',
    //   metadata: 'model/model_meta.json',
    //   weights: 'model/model.weights.bin'
    // }
    // nn.load(modelDetails, modelLoaded)

    // // execute model
    // function modelLoaded() {

    // }
  }
}

function changeBG() {
  let val = random(255);
  background(val);
}

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
