


function setup() {
    console.log(recipeList);

    for (i=0; i<recipeList.length; i++) {
        document.getElementById('recipe' + i).style.visibility = visible;
        document.getElementById('reicpe' + i).style.display = block;
        //innerText = recipeList[recipeIndex];
    
    }
    console.log('recipes loaded');
}
