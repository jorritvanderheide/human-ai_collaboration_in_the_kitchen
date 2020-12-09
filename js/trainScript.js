// variables
let model;
let modelOptions = {
  dataUrl: "data/trainingData.csv",
  inputs: [
    "pineapple",
    "eggplant",
    "basil",
    "puffpastry",
    "cauliflower",
    "kale",
    "springonion",
    "broccoli",
    "cashewnuts",
    "cherrytomatoes",
    "zucchini",
    "egg",
    "mincedmeat",
    "cannedpeeledtomatoes",
    "gratedcheese",
    "Greekyoghurt",
    "skimmilk",
    "ham",
    "oatdrink",
    "codfish",
    "kidneybeans",
    "chickpeas",
    "chickenbreast",
    "garlic",
    "babypotatoes",
    "lasagnasheets",
    "lentils",
    "margarine",
    "oliveoil",
    "bokchoi",
    "Parmesancheese",
    "pastasauce",
    "pumpkin",
    "quinoa",
    "rice",
    "risottorice",
    "beetroot",
    "redbellpepper",
    "redpepper",
    "redonion",
    "butter",
    "whippedcream",
    "soyyoghurt",
    "bacon",
    "spinach",
    "Brusselssprouts",
    "vegetarianchicken",
    "tagliatelle",
    "wheatflour",
    "tofu",
    "tomato",
    "dicedtomatoes",
    "peas",
    "onion",
    "vegetariansalmon",
    "whitecabbage",
    "carrot",
    "salmon",
    "sweetpotato",
    "sunfloweroil",
  ],
  outputs: ["score"],
  task: "regression",
};

// setup
function setup() {
  const loadBtn = select("#loadBtn");
  loadBtn.mousePressed(function () {
    model = ml5.neuralNetwork(modelOptions, dataLoaded);
  });

  // clear console
  console.clear();
}

// train model when data loaded
function dataLoaded() {
  const trainBtn = select("#trainBtn");
  trainBtn.mousePressed(function () {
    console.log("Training...");
    model.train(doneTraining);
  });
}

// save model when training done
function doneTraining() {
  console.log("Training done!");
  document.getElementById("downloadBtn").disabled = false;
  const downloadBtn = select("#downloadBtn");
  downloadBtn.mousePressed(function () {
    model.save();
  });
}
