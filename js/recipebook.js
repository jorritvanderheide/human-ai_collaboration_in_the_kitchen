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

    console.log(recipeList.length);   

    for (let j=0; j<recipeList.length; j++) {
        document.getElementById('recipe' + j).style.visibility = "visible";
        // document.getElementById('recipe' + i).style.display = "block";
        let h = document.getElementById("header" + j);
        h.innerHTML = recipeList[j];
        
        let p = document.getElementById("p" + j);
        p.style.whiteSpace = "pre-line";
        p.textContent = "";

        recipeIngredients = recipeVectors[j].slice(1, -1);
        recipeIngredients = recipeIngredients.split(',').map(Number);

        for (let k=0; k < recipeIngredients.length; k++) {
            if (recipeIngredients[k] == 1) {
                p.textContent += ingredientList[k] + "\n";
            }
        }
        console.log(recipeList[j], j);   
    } 
}


function testAlternative(rec) {

}
