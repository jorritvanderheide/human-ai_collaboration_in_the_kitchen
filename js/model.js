// load data
let ingredientData;
let ingredientDataUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv';
let recipeData;
let recipeDataUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';

// variables
let tryoutArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0];

// setup neural network
let model;
let modelOptions = {
  dataUrl: 'data/trainingData.csv',
  inputs: [
    'pineapple',
    'eggplant',
    'basil',
    'puffpastry',
    'cauliflower',
    'kale',
    'springonion',
    'broccoli',
    'cashewnuts',
    'cherrytomatoes',
    'zucchini',
    'egg',
    'mincedmeat',
    'cannedpeeledtomatoes',
    'gratedcheese',
    'Greekyoghurt',
    'skimmilk',
    'ham',
    'oatdrink',
    'codfish',
    'kidneybeans',
    'chickpeas',
    'chickenbreast',
    'garlic',
    'babypotatoes',
    'lasagnasheets',
    'lentils',
    'margarine',
    'oliveoil',
    'bokchoi',
    'Parmesancheese',
    'pastasauce',
    'pumpkin',
    'quinoa',
    'rice',
    'risottorice',
    'beetroot',
    'redbellpepper',
    'redpepper',
    'redonion',
    'butter',
    'whippedcream',
    'soyyoghurt',
    'bacon',
    'spinach',
    'Brusselssprouts',
    'vegetarianchicken',
    'tagliatelle',
    'wheatflour',
    'tofu',
    'tomato',
    'dicedtomatoes',
    'peas',
    'onion',
    'vegetariansalmon',
    'whitecabbage',
    'carrot',
    'salmon',
    'sweetpotato',
    'sunfloweroil',
  ],
  outputs: ['score'],
  task: 'regression',
};

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // setup neural network
  model = ml5.neuralNetwork(modelOptions, dataLoaded);

  // preload data
  ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
  recipeData = loadTable(recipeDataUrl, 'csv', 'header');

  //preload trained model
  trainingData = loadTable(ingredientDataUrl, 'csv', 'header');
}

// if data loaded
function dataLoaded() {
  console.log('data loaded');
  //train
  console.log('training...');
  model.train(doneTraining);
}

// if training done
function doneTraining() {
  console.log('training done!');
}

// // draw
// function draw() {
//   // if UI input, run model
//   runModel();
//   // send input to UI
// }

function mousePressed() {
  // if UI input, run model
  runModel();
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
// function modelDone(results) {
//   console.log('model done!');
//   // handle prediction
//   console.log(results[0]);
// }

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}