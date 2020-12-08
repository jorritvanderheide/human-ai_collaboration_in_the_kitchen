// load data
let ingredientData;
let ingredientDataUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv';
let recipeData;
let recipeDataUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';

// variables
let tryoutArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// setup neural network
let model;
let modelOptions = {
  task: 'regression'
};

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // setup neural network
  model = ml5.neuralNetwork(modelOptions);

  // load model
  const modelLoad = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  };
  model.load(modelLoad, function () {
    console.log('model loaded!');
  });

  // preload data
  ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
  recipeData = loadTable(recipeDataUrl, 'csv', 'header');
}

// draw
function draw() {
  // if UI input, run model
  if (mousePressed) {
    runModel();
  }
  // send input to UI
}

// run model
function runModel() {
  // run trained model with input value from UI
  model.predict(tryoutArr, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(results[0]);
  });
}

// if model done
function modelDone(results) {
  console.log('model done!');
  // handle prediction
  console.log(results[0]);
}

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}