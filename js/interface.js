// variables
var filter = " ";
var targetIngredient = "";

// setup packery for ingredient grid
var $grid = $(".grid").packery({
  gutter: ".gutter-sizer",
  itemSelector: ".grid-item",
  percentPosition: true,
});

var filter = " ";
var targetIngredient = "transparent";

// initiate grid
$(document).ready(function () {
  $grid.packery("layout");
});

// run when an intention filter is selected
function showIngredients(intentionFilter) {
  // reset array
  let tempArray = [];
  for (let i = 0; i < ingredientList.length; i++) {
    let ingredient = ingredientList[i];
    ingredient = ingredient.replace(/ /g, "");
    document.getElementById(ingredient).style.display = "none";
  }

  // check if a filter is already selected
  if (filter == intentionFilter) {
    // reset arrays
    filter = " ";
    intentionFilter = " ";

    // reset filter visuals
    document.getElementById("plantFilter").src = "img/plantFilter.svg";
    document.getElementById("seasonFilter").src = "img/seasonFilter.svg";

    // make all ingredients visible
    for (let i = 0; i < ingredientList.length; i++) {
      let ingredient = ingredientList[i];
      ingredient = ingredient.replace(/ /g, "");
      document.getElementById(ingredient).style.display = "block";
    }

    // clear current tryout ingredient
    selectTryout("transparent");
  }

  // check if the plant-based filter is selected
  if (intentionFilter == "plantFilter") {
    filter = "plantFilter";

    // update filter visuals
    document.getElementById("plantFilter").src = "img/plantFilterHover.svg";
    document.getElementById("seasonFilter").src = "img/seasonFilter.svg";
    logAI(">filtering on plant-based products"); // log

    // run for every ingredient
    for (let i = 0; i < ingredientList.length; i++) {
      // check for plant-based ingredients that are not fruit or vegetables
      if (ingredientPlant[i] == 1 && ingredientCategory[i] != "vegetables and fruit") {
        ingredient = ingredientList[i];
        ingredient = ingredient.replace(/ /g, "");
        tempArray.push(ingredient); // push applicable ingredient to a temporary array
      }

      // run for every ingredient in the temporary array
      for (let j = 0; j < tempArray.length; j++) {
        document.getElementById(tempArray[j]).style.display = "block"; // update ingredient visibility
      }
    }

    // reset tryout ingredient
    selectTryout("transparent");
  }

  // check if the season-based filter is selected
  else if (intentionFilter == "seasonFilter") {
    filter = "seasonFilter";

    // update filter visuals
    document.getElementById("seasonFilter").src = "img/seasonFilterHover.svg";
    document.getElementById("plantFilter").src = "img/plantFilter.svg";
    logAI('>filtering on seasonal products for "fall"'); // log
    logAI(">Botano has several products available!"); // log
    logAI(">Check the interface for the green circled ingredients"); // log

    // run for every ingredient
    for (let i = 0; i < ingredientList.length; i++) {
      // check for ingredient that are in season in fall
      if (ingredientSeason[i].includes("fall")) {
        ingredient = ingredientList[i];
        ingredient = ingredient.replace(/ /g, "");
        tempArray.push(ingredient); // push applicable ingredient to a temporary array
      }

      // run for every ingredient in the temporary array
      for (let j = 0; j < tempArray.length; j++) {
        document.getElementById(tempArray[j]).style.display = "block"; // update ingredient visibility
      }
    }
    selectTryout("transparent");
  }
  $grid.packery("layout");
}

// run to add a tryout ingredient to the tryout module
function selectTryout(ingredientReturn) {
  // define target ingredient
  targetIngredient = ingredientReturn;

  // check what filter is active or if no filter is active
  if (filter == "seasonFilter" || filter == "plantFilter" || ingredientReturn == "transparent") {
    // update tryout module visual to match ingredient
    document.getElementById("tryoutIngredient").src = "img/products/" + ingredientReturn + ".jpg";

    // check if ingredient input is 'transparent'
    if (ingredientReturn != "transparent") {
      // log
      if (filter == "plantFilter") {
        logAI(
          "\n*AI: \tShall I find a good recipe for trying " +
            ingredientReturn.charAt(0).toUpperCase() +
            ingredientReturn.slice(1) +
            "? I will try to replace it for " +
            ingredientCategory[ingredientList.indexOf(ingredientReturn)] +
            " that aren't plant-based"
        );
      } else if (filter == "seasonFilter") {
        logAI(
          "\n*AI: \tShall I find a good recipe for trying " +
            ingredientReturn.charAt(0).toUpperCase() +
            ingredientReturn.slice(1) +
            "? I will try to replace it for " +
            ingredientCategory[ingredientList.indexOf(ingredientReturn)] +
            " that aren't in season"
        );
      }

      // input for function for the recipe book
      tryAlternative(ingredientReturn);
    }
  }

  // check if no filters are selected but there is still a tryout ingredient clicked
  if (filter != "seasonFilter" && filter != "plantFilter" && ingredientReturn != "transparent") {
    logAI("*AI: \tPlease select one of the intention filters first"); // log
  }
}

// reset the tryout ingredient when necessary
function resetTryout() {
  selectTryout("transparent");
  document.getElementById("swaptext" + currentIndex).textContent = ""; // remove suggestions from the recipe book
}
