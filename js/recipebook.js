let recipeIngredients = [];

$(document).ready(function () {
    // Activate Carousel
    $('#carouselExampleControls').carousel({ interval: false });
});

function setupRecipes() {
    for (let i = 0; i < recipeList.length; i++) {
        document.getElementById('recipe' + i).style.visibility = 'visible';
        // document.getElementById('recipe' + i).style.display = "block";
        let h = document.getElementById('header' + i);
        h.innerHTML = recipeList[i];

        let p = document.getElementById('p' + i);
        p.style.whiteSpace = 'pre-line';
        p.textContent = '';

        recipeIngredients = recipeVectors[i].slice(1, -1);
        recipeIngredients = recipeIngredients.split(',').map(Number);

        for (let k = 0; k < recipeIngredients.length; k++) {
            if (recipeIngredients[k] == 1) {
                p.textContent += ingredientList[k] + '\n';
            }
        }
    }
    logAI('Recipes loaded');
}

function runModel(ingredientReturn) {
    
}