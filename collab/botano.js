// This code is written for Botano, to share family favorite recipes

let recipeData; // full recipe .csv
let recipeList = []; // array with the names of the recipes

// import csv
let recipeDataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';

function setup() {
    // preload data
    recipeData = loadTable(recipeDataUrl, 'csv', 'header');
}

function draw() {
    // check if data loaded
    if (recipeData.getRowCount()) {
        // assign variables
        recipeList = recipeData.getColumn('recipeName');
        noLoop(); // run once when data is loaded

        for (let i  = 0; i < recipeList.length; i++) {
            console.log(recipeList[i]);
        }
    }
}

// dependencies (zet deze in je HTML)
/* <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js"></script> */