// variables
let plantBased = false;
let seasonBased = false;

// load data
let ingredientDataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv';
let recipeDataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';

// setup neural network
let model;
let modelOptions = {
  task: 'regression'
};

// setup
function setup() {

  // setup neural network
  model = ml5.neuralNetwork(modelOptions);

  // load model
  const modelLoad = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  };
  model.load(modelLoad, function () {
    console.log('Model loaded!');
  });

  // preload data
  let ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
  let recipeData = loadTable(recipeDataUrl, "csv", "header");
  if (ingredientData && recipeData) {
    console.log('Data loaded!');
  }

  // run conditions
  if (recipeData.getRowCount() != 0) {
    // let recipeAmount = recipeData.getRowCount();
    let recipeList = recipeData.getColumn("recipeName");
    let recipeVector = recipeData.getColumn("recipeVector");
  }

  //set button color
  document.getElementById('plantBtn').style.backgroundColor = 'white';
  document.getElementById('seasonBtn').style.backgroundColor = 'white';
}

// if plant-based intention filter is clicked
function plantFilter() {
  const plantBtn = document.getElementById('plantBtn');
  const seasonBtn = document.getElementById('seasonBtn');
  if (plantBtn.style.backgroundColor == 'white') {
    plantBtn.style.backgroundColor = 'green';
    seasonBtn.disabled = true;
    plantBased = true;
    recommendIngredients();
  } else {
    plantBtn.style.backgroundColor = 'white';
    seasonBtn.disabled = false;
    plantBased = false;
    removeIngredients();
  }
}

// if season-based intention filter is clicked
function seasonFilter() {
  const seasonBtn = document.getElementById('seasonBtn');
  const plantBtn = document.getElementById('plantBtn');
  if (seasonBtn.style.backgroundColor == 'white') {
    seasonBtn.style.backgroundColor = 'green';
    plantBtn.disabled = true;
    seasonBased = true;
    recommendIngredients();
  } else {
    seasonBtn.style.backgroundColor = 'white';
    plantBtn.disabled = false;
    seasonBased = false;
    removeIngredients();
  }
}

// recommends ingredients to try out
function recommendIngredients() {
  if (plantBased == true) {

    // if plantbased true in row
    // copy name to table
    // get 5 random ingredients from table

    for (let i = 1; i < 6; i++) {
      ingrName = 'test'    // ingrName = random ingredient uit lijst met intention based ingredients
      document.getElementById('ingrBtn' + i).innerText = ingrName;
    }
  } else {
    if (seasonBased == true) {
      // do stuff
    }
  }
}

// removes suggestions if intention filter is de-selected
function removeIngredients() {
  for (let i = 1; i < 6; i++) {
    document.getElementById('ingrBtn' + i).innerText = '...';
  }
  // remove suggestions from recipe
}

// run model
// function runModel() {
//   // run trained model with input value from UI
//   model.predict(tryoutArr, (err, results) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(results[0]);
//     if (results[0] >= 0.8) {

//     }
//   });
// }

// if model done
// function modelDone(results) {
//   console.log('model done!');
//   // handle prediction
//   console.log(results[0]);
// }