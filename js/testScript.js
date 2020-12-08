// global variables
let plantBased;
let seasonBased;
let ingredientPlant;
let ingredientSeason;
let ingredientReturn;
let ingredientArr = [];
let tempIngredientArr = [];

let recipeAmount;
let recipeList;
let recipeVector;
let recipeDataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';
let recipeData;

let ingredientAmount;
let ingredientList;
let ingredientDataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv';
let ingredientData;

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
  ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
  recipeData = loadTable(recipeDataUrl, 'csv', 'header');
  if (ingredientData && recipeData) {
    console.log('Data loaded!');
  }

  //set button color
  document.getElementById('plantBtn').style.backgroundColor = 'white';
  document.getElementById('seasonBtn').style.backgroundColor = 'white';
}

// assign variables when data loaded
function draw() {
  if (recipeData.getRowCount() != 0) {
    recipeAmount = recipeData.getRowCount();
    recipeList = recipeData.getColumn("recipeName");
    recipeVector = recipeData.getColumn("recipeVector");
    ingredientAmount = ingredientData.getRowCount();
    ingredientList = ingredientData.getColumn("ingredient");
    ingredientPlant = ingredientData.getColumn("isPlantbased");
    ingredientSeason = ingredientData.getColumn("inSeason");
    console.log('Variables assigned!')
    noLoop();
  }
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
    ingredientArr = [];
    for (let i = 0; i < ingredientAmount; i++) {
      if (ingredientPlant[i] == 1) {
        ingredientArr.push(ingredientList[i]);
      }
    }
    tempIngredientArr = [];
    for (let j = 1; j < 6; j++) {
      const random = Math.floor(Math.random() * ingredientArr.length);
      let randomIngredient = (random, ingredientArr[random])
      document.getElementById('ingrBtn' + j).innerText = randomIngredient;
      tempIngredientArr.push(randomIngredient);
    }
  } else {
    if (seasonBased == true) {
      ingredientArr = [];
      for (let i = 0; i < ingredientAmount; i++) {
        if (ingredientSeason[i]) {
          ingredientArr.push(ingredientList[i]);
        }
      }
      tempIngredientArr = [];
      for (let j = 1; j < 6; j++) {
        const random = Math.floor(Math.random() * ingredientArr.length);
        let randomIngredient = (random, ingredientArr[random])
        document.getElementById('ingrBtn' + j).innerText = randomIngredient;
        tempIngredientArr.push(randomIngredient);
      }
    }
  }
}

// removes suggestions if intention filter is de-selected
function removeIngredients() {
  for (let i = 1; i < 6; i++) {
    document.getElementById('ingrBtn' + i).innerText = '...';
    document.getElementById('newIngr').innerText = 'New ingredient';
  }
  // remove suggestions from recipe
}

// run model
function runModel(ingredientReturn) {
  // console.log(tempIngredientArr[ingredientReturn]);
  document.getElementById('newIngr').innerText = tempIngredientArr[ingredientReturn];
  // document.getElementById('newIngr').style.visibility = visible;
  // //   // run trained model with input value from UI
  // //   model.predict(tryoutArr, (err, results) => {
  // //     if (err) {
  // //       console.log(err);
  // //       return;
  // //     }
  // //     console.log(results[0]);
  // //     if (results[0] >= 0.8) {

  // //     }
  // //   });
}

// if model done
// function modelDone(results) {
//   console.log('model done!');
//   // handle prediction
//   console.log(results[0]);
// }