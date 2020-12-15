// setup packery
var $grid = $('.grid').packery({
    gutter: 30,
    itemSelector: '.grid-item',
    percentPosition: true,
});

var filter = ' ';
var targetIngredient = '';

// initiate grid
$(document).ready(function () {
    $grid.packery('layout');
});

function showIngredients(intentionFilter) {
    // reset grid
    let tempArray = [];
    for (let i = 0; i < ingredientList.length; i++) {
        let ingredient = ingredientList[i];
        ingredient = ingredient.replace(/ /g, '');
        document.getElementById(ingredient).style.display = 'none';
    }

    if (filter == intentionFilter) {
        filter = ' ';
        intentionFilter = ' ';
        for (let i = 0; i < ingredientList.length; i++) {
            let ingredient = ingredientList[i];
            ingredient = ingredient.replace(/ /g, '');
            document.getElementById(ingredient).style.display = 'block';
        }
        selectTryout('transparent');
    }

    // plant filter
    if (intentionFilter == 'plantFilter') {
        filter = 'plantFilter';
        logAI('Showing plant-based products');
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
        selectTryout('transparent');
    }

    // season filter
    else if (intentionFilter == 'seasonFilter') {
        filter = 'seasonFilter';
        console.log(filter);
        logAI('Showing seasonal products for "fall"');
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
        selectTryout('transparent');
    }
    $grid.packery('layout');
}

// show tryout ingredient
function selectTryout(ingredientReturn) {
    targetIngredient = ingredientReturn;
    if (filter == 'seasonFilter' || filter == 'plantFilter' || ingredientReturn == 'transparent') {
        document.getElementById('tryoutIngredient').src = 'img/products/' + ingredientReturn + '.jpg';
        if (ingredientReturn != 'transparent') {
            logAI(ingredientReturn.charAt(0).toUpperCase() + ingredientReturn.slice(1) + ' selected as a tryout ingredient');
            tryAlternative(ingredientReturn);
        }
    }
}
