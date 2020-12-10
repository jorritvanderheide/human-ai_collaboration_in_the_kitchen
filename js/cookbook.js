
let targetRecipe = 0;

function nextRecipe() {     // if not at the end of recipes show next recipe
    if (targetRecipe < recipeList.length) {
        targetRecipe++;
    }
    showRecipe(targetRecipe);
}

function prevRecipe() {     // if not at the start of recipes show previous one
    if (targetRecipe > 0) {
        targetRecipe--;
    }
    showRecipe(targetRecipe);
}


function showRecipe(recipeIndex) {      // show recipe name and ingredients for index of targetRecipe
    
    document.getElementById('recipeName').innerText = recipeList[recipeIndex];

    let recipeVector = []; // Hier moet recipeVector geimporteerd worden maar waar vandaan?

    let j = 0;  // counter for amount of ingredients already displayed

    for (i=0; i<recipeVector.length; i++) {
        if (recipeVector[i] == 1) {
            document.getElementById('ingredient' + j).innerText = ingredientList[i];
            j++;
        }
    }

} 


// HTML part
{/* <button id="nextRecipe" onclick="nextRecipe()">next</button>
<button id="prevRecipe" onclick="prevRecipe()">back</button> */}

// er moeten ook nog elements bij om de recipe naam en ingredienten toe te voegen maar geen idee hoe dat moet