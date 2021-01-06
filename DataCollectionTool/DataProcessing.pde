


void getRecipe(int id) {                  // gets a random recipe and generates a new combination of ingredients if possible
  recipeContents.clear();
  categoryIngredients.clear();
  newRecipe.clear();

  TableRow row = recipes.getRow(id);
  recipeName = row.getString(recipeColumn);
  stringVector = row.getString("recipeVector");
  recipeVector = int(splitTokens(stringVector, "[, "));
  for (int i=0; i < recipeVector.length; i++) {
    if (recipeVector[i] == 1) {
      recipeContents.append(ingredientVector[i]);
    }
  }

  getAlternative();

  //println(recipeName + " contains: " + recipeContents);

  if (altIngredient.equals("404") == false) {                    // if an alternative ingredient is found, create new recipe vector
    newRecipeVector = recipeVector;
    for (int i=0; i < ingredientVector.length; i++) {
      if (targetIngredient.equals(ingredientVector[i])) {
        newRecipeVector[i] = 0;
      } else if (altIngredient.equals(ingredientVector[i])) {
        newRecipeVector[i] = 1;
      }
    }
    newRecipeStringVector = "[";

    for (int i=0; i < newRecipeVector.length; i++) {                  // create list with new ingredients and new recipe string vector for Data Foundry
      if (newRecipeVector[i] == 1) {
        newRecipeStringVector = newRecipeStringVector + "1";
        newRecipe.append(ingredientVector[i]);
      } else if (newRecipeVector[i] == 0) {
        newRecipeStringVector = newRecipeStringVector + "0";
      }
      if (i < newRecipeVector.length-1) {
        newRecipeStringVector = newRecipeStringVector + ", ";
      } else if (i == newRecipeVector.length-1) {
        newRecipeStringVector = newRecipeStringVector + "]";
      }
    }
    //println(newRecipeStringVector);
  } else if (altIngredient.equals("404")) {
    println("No alternatives found, trying again...");
    getRecipe(int(random(0, recipes.getRowCount())));
  }
}

void getAlternative() {
  targetIngredient = recipeContents.get(int(random(0, recipeContents.size())));                // pick ingredient to find alternative for
  println("");
  println("Let's find an alternative for " + targetIngredient + " in " + recipeName);
  for (int i=0; i < ingredients.getRowCount(); i++) {                                          // find category for that ingredient
    if (ingredientVector[i].equals(targetIngredient)) {
      TableRow row = ingredients.getRow(i);
      targetCategory = row.getString("category");
      println("looking at " + targetCategory);
    }
  }
  for (int i=0; i < ingredientVector.length; i++) {                                            // make a list of possible alternatives and pick a random one
    TableRow row = ingredients.getRow(i);
    if (targetCategory.equals(row.getString("category")) && recipeVector[i] == 0) {
      categoryIngredients.append(ingredientVector[i]);
    }
  }
  //println(categoryIngredients);
  if (categoryIngredients.size() > 0) {
    altIngredient = categoryIngredients.get(int(random(0, categoryIngredients.size())));
    println("Can we replace " + targetIngredient + " with " + altIngredient + "?");
  } else {
    altIngredient = "404";
  }
}
