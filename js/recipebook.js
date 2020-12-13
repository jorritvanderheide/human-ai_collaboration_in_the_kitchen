let recipeIngredients = [];

$(document).ready(function(){
    // Activate Carousel
    $("#carouselExampleControls").carousel({interval: false});
});

function setupRecipes() {   
    logAI("I've seen all recipes");
    logAI("More text");
    logAI("Even more text");
    logAI("The list goes on");

    for (let i=0; i<recipeList.length; i++) {
        document.getElementById('recipe' + i).style.visibility = "visible";
        // document.getElementById('recipe' + i).style.display = "block";
        let h = document.getElementById("header" + i)
        h.innerHTML = recipeList[i];
        h.style.margin = "1vw";
        
        let p = document.getElementById("p" + i);
        p.style.whiteSpace = "pre-line";
        p.textContent = "Ingredients: \n\n";
        p.style.margin = "2vw";
        p.style.fontSize = "18px";

        recipeIngredients = recipeVectors[i].slice(1, -1);
        recipeIngredients = recipeIngredients.split(',').map(Number);

        for (let j=0; j < recipeIngredients.length; j++) {
            if (recipeIngredients[j] == 1) {
                p.textContent += ingredientList[j] + "\n";
            }
        }
    }
    console.log(recipeList.length, i);    
}
