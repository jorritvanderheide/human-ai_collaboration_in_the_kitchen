
let recipeData; // full recipe .csv
let ingredientData; // full ingredient .csv
let recipeList = []; // array with the names of the recipes
let recipeVectors = []; // array with the vectors of the recipes
let ingredientList = []; // array with the names of the ingredients
let ingredientPlant = []; // array with if an ingredient is plant-based
let ingredientSeason = []; // array with when an ingredient is in season
let ingredientCategory = []; // array with the ingredient category

// import csv's
let recipeDataUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDKC0TKzDZxYVeogUXlhM14U7CsL3rAX0-q4J_hOO8rj-OWxcaANNLuw5WYEuv7FMBylZGa3GC8Mp7/pub?gid=0&single=true&output=csv';
let ingredientDataUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_zg-Q_2KiUOTb6ZnWY-GHvp2Pjs7bnfWZ1jpP35EJ0nOEkAUCtoCBgsOzh0VY1KXU8Q_4SSweBDEP/pub?gid=0&single=true&output=csv';


function setup() {

    // preload data
    ingredientData = loadTable(ingredientDataUrl, 'csv', 'header');
    recipeData = loadTable(recipeDataUrl, 'csv', 'header');

    for (i=0 ; i < recipeData.rows.count; i++) {         // for every recipe get recipe data from columns
        recipeList[i] = recipeData.getColumn('recipeName');
        recipeVectors[i] = recipeData.getColumn('recipeVector');
        ingredientList[i] = ingredientData.getColumn('ingredient');
        ingredientPlant[i] = ingredientData.getColumn('isPlantbased');
        ingredientSeason[i] = ingredientData.getColumn('inSeason');
        ingredientCategory[i] = ingredientData.getColumn('category');  
    }
}