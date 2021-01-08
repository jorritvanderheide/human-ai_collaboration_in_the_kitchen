//*********************************************
// Data Collection Interface sketch specifically made for the DIGSIM Recuisine Project 2020-2021
// Based on DBM180_example_app sketch made by I-Tang(Eden) Chiang for Designing with Advanced AI course, altered and extended by Lars de Langen (l.j.d.langen@student.tue.nl)
//
// Presents users with ingredient combinations and asks for compatibility, which is send and saved to Data Foundry for later use as training data.
// This sketch was used as a standalone application in the Recuisine project to be able to quickly collect larger amounts of data from a variety of users.
//*********************************************

import controlP5.*;
import nl.tue.id.datafoundry.*;

// settings for DataFoundry library
//
String host = "data.id.tue.nl";
String iot_api_token = "B43KgTmZdNx36gj4Wvsfi3xK+fKyVaXFpKvf0M5KH35WPhe8lyNuH2aiImWns79l";
String entity_api_token = "aRfiIvtRZ1epFT4KqdfzYtKMK5i8iav1w0wz4alio5BNpSVuAb5a7YbMK5otAV6I";
long iot_id = 796;
long entity_id = 795;
// ------------------------------------------------------------------------

// data foundry connection
DataFoundry df = new DataFoundry(host);
// access to two datasets: iotDS and entityDS
DFDataset iotDS = df.dataset(iot_id, iot_api_token);
DFDataset entityDS = df.dataset(entity_id, entity_api_token);

// documentation
String uname = "";
int plays = 0;

// UI
ControlP5 cp5;
controlP5.Textfield username;
controlP5.Button yes, no, skip, stop, NL, EN;

String uiLanguage = "EN";
String recipeColumn = "recipeName";

// Databases
Table recipes;
Table ingredients;
String[] ingredientVector;

// variables
String recipeName;
int[] recipeVector;
int[] newRecipeVector;
String newRecipeStringVector;
String stringVector;
StringList recipeContents;
StringList categoryIngredients;
StringList newRecipe;
String targetCategory;
String targetIngredient;
String altIngredient = "404";

void setup() {
  size(640, 960);
  background(0);
  fill(0);

  ingredients = loadTable("ingredients.csv", "header");
  recipes = loadTable("recipes.csv", "header");
  ingredientVector = new String[ingredients.getRowCount()];
  recipeContents = new StringList();
  categoryIngredients = new StringList();
  newRecipe = new StringList();

  print("Ingredient vector imported: ");
  for (int i=0; i < ingredientVector.length; i++) {            // convert ingredient vector from string to int array
    TableRow row = ingredients.getRow(i);
    ingredientVector[i] = row.getString("ingredient");
    print(i, ingredientVector[i] + ", ");
  }
  println("");
  println("--------------------");
  print("Recipes imported: ");
  for (int i = 0; i < recipes.getRowCount(); i++) {
    TableRow row = recipes.getRow(i);
    print(i, row.getString("recipeName") + ", ");
  }
  println("");

  // UI
  PFont pfont = createFont("Arial", 20);
  ControlFont font = new ControlFont(pfont, 20);  

  cp5 = new ControlP5(this);

  username = cp5.addTextfield("username")
    .setPosition(40, 235)
    .setSize(300, 30)
    .setFont(font)
    .setColor(255);

  username.getCaptionLabel()
    .toUpperCase(false);
  username.getCaptionLabel().getStyle().marginTop = -65;
  username.getCaptionLabel().setColor(0);

  no = cp5.addButton("no")
    .setPosition(width/2 - 150, 800)
    .setSize(100, 46);

  yes = cp5.addButton("yes")
    .setPosition(width/2 + 50, 800)
    .setSize(100, 46);

  skip = cp5.addButton("skip")
    .setPosition(width/2-130, 880)
    .setSize(80, 38);

  stop = cp5.addButton("stop")
    .setPosition(width/2+50, 880)
    .setSize(80, 38);

  NL = cp5.addButton("NL")
    .setPosition(470, 235)
    .setSize(50, 30);

  EN = cp5.addButton("EN")
    .setPosition(526, 235)
    .setSize(50, 30);

  setButtonStyle(no, font, 24, "No");
  setButtonStyle(yes, font, 24, "Yes");
  setButtonStyle(skip, font, 20, "Skip");
  setButtonStyle(stop, font, 20, "Stop");
  setButtonStyle(EN, font, 14, "EN");
  setButtonStyle(NL, font, 14, "NL");

  // Initial recipe
  getRecipe(int(random(0, recipes.getRowCount())));
}


void draw() {
  background(240);
  textSize(18);
  fill(0);
  text("Data Collection tool Human-AI Collaboration", 30, 40);
  strokeWeight(1);
  line(0, 60, width, 60);
  textSize(14);
  // description and instructions for participants
  text("Hi, thanks for considering helping us out. This program takes recipes, swaps", 50, 110);
  text("one ingredient for a similar one, and proposes the new combination as a dish.", 50, 130);
  text("You can choose an anonymous username and let us know if you think the new", 50, 150);
  text("combination of ingredients might make a nice dish. You can skip when in doubt.", 50, 170);

  line(30, 310, width-30, 310);

  textSize(20);
  text("ORIGINAL RECIPE", 50, 390);
  //text("ORIGINAL RECIPE", 40, 320);

  pushStyle();
  textSize(18);
  text(recipeName, 80, 430);
  popStyle();

  textSize(20);
  text("NEW DISH?", 50, 500);
  //text("NEW DISH?", 40, 390);

  pushStyle();
  textSize(18);
  for (int i =0; i < newRecipe.size(); i++) {        // color the ingredient that has been changed
    if ((newRecipe.get(i)).equals(altIngredient)) {
      fill(255, 127, 80);
    } else {
      fill(0);
    }
    int x = 0;
    int y = 0;
    if (i%2 == 1) {
      x = width/2-80;
      y = 10;
    } else {
      x = 0;
      y = 0;
    }
    text(newRecipe.get(i), 80 + x, 540 + 10*i-y);
  }
  popStyle();

  pushStyle();
  textSize(19);
  textAlign(CENTER);
  text("Does " + altIngredient + " fit well with these ingredients?", width/2, 720);
  popStyle();
  line(30, 770, width-30, 770);
}

// void functions below answer to the UI control elements with the same name

void setButtonStyle(controlP5.Button btn, ControlFont cf, int fontSize, String label) {
  btn.getCaptionLabel()
    .setFont(cf)
    .setSize(fontSize)
    .toUpperCase(false)
    .setText(label);
}

void no() {
  plays++;
  setUser();
  submit("No", 0.00);
  getRecipe(int(random(0, recipes.getRowCount())));
}

void yes() {
  plays++;
  setUser();
  submit("Yes", 1.00);
  getRecipe(int(random(0, recipes.getRowCount())));
}

void skip() {
  getRecipe(int(random(0, recipes.getRowCount())));
}

void stop() {
  exit();
}

// if username is empty, get the user name from the text field -- ONCE.
void setUser() {
  uname = cp5.get(Textfield.class, "username").getText();

  // if the text field is empty, random Id!
  if (uname.isEmpty()) {
    uname = "rand" + round(random(1000, 20000));
    username.setText(uname);
  }
}

void EN() {                                              // change language to English
  for (int i=0; i < ingredientVector.length; i++) {
    TableRow row = ingredients.getRow(i);
    ingredientVector[i] = row.getString("ingredient");
    //print(i, ingredientVector[i] + ", ");
  }

  recipeColumn = "recipeName";
  println("language changed to EN");
  getRecipe(int(random(0, recipes.getRowCount())));
}

void NL() {                                              // change language to Dutch
  for (int i=0; i < ingredientVector.length; i++) {
    TableRow row = ingredients.getRow(i);
    ingredientVector[i] = row.getString("ingredientNL");
    //print(i, ingredientVector[i] + ", ");
  }

  recipeColumn = "recipeNameNL";
  println("language changed to NL");
  getRecipe(int(random(0, recipes.getRowCount())));
}
