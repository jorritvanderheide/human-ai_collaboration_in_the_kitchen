// setup packery
var $grid = $('.grid').packery({
    gutter: 30,
    itemSelector: '.grid-item',
    percentPosition: true,
});

// initiate grid
$(document).ready(function () {
    $grid.packery('layout');
});

var filter;

function showIngredients(intentionFilter) {
    // reset grid
    let tempArray = [];
    for (let i = 0; i < ingredientList.length; i++) {
        let ingredient = ingredientList[i];
        ingredient = ingredient.replace(/ /g, '');
        document.getElementById(ingredient).style.display = 'none';
    }

    // plant filter
    if (intentionFilter == 'plantFilter') {
        filter = 'plantFilter';
        logAI('Plant-based filter selected');
        for (let i = 0; i < ingredientList.length; i++) {
            if (ingredientPlant[i] == 1 && ingredientCategory[i] != 'vegetables and fruit') {
                ingredient = ingredientList[i];
                ingredient = ingredient.replace(/ /g, '');
                tempArray.push(ingredient);
            }
            for (let j = 0; j < tempArray.length; j++) {
                document.getElementById(tempArray[j]).style.display = 'block';
            }
        }
        $grid.packery('layout');
        selectTryout('transparent');
    }

    // season filter
    else if (intentionFilter == 'seasonFilter') {
        filter = 'seasonFilter';
        logAI('Season-based filter selected');
        for (let i = 0; i < ingredientList.length; i++) {
            if (ingredientSeason[i].includes('fall')) {
                ingredient = ingredientList[i];
                ingredient = ingredient.replace(/ /g, '');
                tempArray.push(ingredient);
            }
            for (let j = 0; j < tempArray.length; j++) {
                document.getElementById(tempArray[j]).style.display = 'block';
            }
        }
        $grid.packery('layout');
        selectTryout('transparent');
    }
}

// show tryout ingredient
function selectTryout(ingredientReturn) {
    document.getElementById('tryoutIngredient').src = 'img/products/' + ingredientReturn + '.jpg';
    if (ingredientReturn != 'transparent') {
        logAI(ingredientReturn.charAt(0).toUpperCase() + ingredientReturn.slice(1) + ' selected as a tryout ingredient!');
        logAI('Finding suitable recipes ...');
        runModel(ingredientReturn);
    }
}
