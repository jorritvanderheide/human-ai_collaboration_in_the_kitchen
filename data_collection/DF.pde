

public void submit(String tempChoice, float tempScore) {        // this sends the ingredient array together with the given score to Data Foundry

  // send data to both datasets
  logIoTData(tempChoice, tempScore);
  updateUserProfile();
  
  println("Data submitted: ", uname, tempChoice, tempScore, newRecipeStringVector);
}

// to IoT dataset
void logIoTData(String tempChoice, float tempScore) {
  iotDS.device(uname);
  // set activity for the log
  iotDS.activity("input");
  // add data, then send off the log
  iotDS.data("choice", tempChoice).data("score", tempScore).data("recipe vector", newRecipeStringVector).log();
}

void updateUserProfile() {                                      // this is used for documentation and saves how much a certain username has reviewed a combination of ingredients
  // select item with id and token combination
  entityDS.id(uname).token(uname);
  // add data to send (=update)
  entityDS
    .data("plays", plays).update();
}
