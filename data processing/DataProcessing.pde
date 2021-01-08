//*********************************************
// Data preprocessing sketch specifically made for the DIGSIM Recuisine Project 2020-2021
// Based on dataset saving sketch made by Rong-Hao Liang, altered and extended by Lars de Langen (l.j.d.langen@student.tue.nl)
//
// Cleans a RAW dataset imported from Data Foundry, converts and saves it with processed duplicates and mean score calculated
//*********************************************


Table trainDataRAW;
Table ingredients;
String[] attrNames;
TableRow duplicateRow;
Table cleanCSV;
Table trainCSV; 

int minDuplicates = 0;   // 0 (default) means all data gets processed, increasing it means more duplicates are required and thus ingredient combinations have been reviewed multiple times

void setup () {
  size(100, 100);
  ingredients = loadTable("ingredients.csv", "header");            // ingredients dataset to retrieve number of attributes
  trainDataRAW = loadTable("trainingDataFinal.csv", "header");     // RAW trainingset retrieved from Data Foundry

  RAWtoARFF("trainingset_xinstances", trainDataRAW);               // Processes RAW dataset and saves it in both ARFF and CSV with the supplied name
}


void draw() {
  background(0);
  fill(255);
  text("DONE", 30, height/2);
}


void RAWtoARFF(String dataSetName, Table rawCSV) {                // this functions needs a RAW csv file from Data Foundry and the corresponding ingredient database loaded in the sketch
  cleanCSV = new Table();
  attrNames = new String[ingredients.getRowCount() + 2];          // create attribute array and fill with score plus ingredients from database

  // CREATING THE TABLE--------------------------
  for (int i = 0; i < attrNames.length-2; i++) {
    TableRow row = ingredients.getRow(i);
    attrNames[i] = row.getString("ingredient");
    String[] tempAttrArray = attrNames[i].split(" ");
    String tempAttr = "";
    for (int j=0; j < tempAttrArray.length; j++) {
      tempAttr += tempAttrArray[j];
    }
    attrNames[i] = tempAttr;
    cleanCSV.addColumn(tempAttr);                                 // add to new table and set type
    cleanCSV.setColumnType(i, Table.INT);
  }
  attrNames[attrNames.length-2] = "score";
  cleanCSV.addColumn(attrNames[attrNames.length-2]);
  cleanCSV.setColumnType(attrNames.length-2, Table.FLOAT);

  attrNames[attrNames.length-1] = "instances";
  cleanCSV.addColumn(attrNames[attrNames.length-1]);
  cleanCSV.setColumnType(attrNames.length-1, Table.INT);

  println("imported " + attrNames.length + " attributes");

  // FILLING THE TABLE---------------------------
  for (int i = 0; i < 936; i++) {                                                    // for every RAW data row
    println("retrieving data from row " + (i+1) + "/" + rawCSV.getRowCount());
    TableRow row = rawCSV.getRow(i);                                                 // retrieve data from RAW csv
    float score = row.getFloat("score");
    String vectorString = row.getString("recipe vector");
    int[] vectorArray = int(splitTokens(vectorString, "[, ]"));                      // convert vector string into an int array

    boolean duplicate = false;
    int duplicateIndex = 0;
    for (int w = 0; w < cleanCSV.getRowCount() && duplicate == false; w++) {         // check if recipe vector was already processed once
      duplicate = true;
      int attr = 0;
      TableRow cleanRow = cleanCSV.getRow(w);                                        // row to check with

      while (attr < attrNames.length-2 && duplicate == true) {                       // check if all attribute values are the same in row w
        if (vectorArray[attr] != cleanRow.getInt(attr)) {
          duplicate = false;
        }
        attr++;
      }
      if (duplicate == true) {
        duplicateRow = cleanRow;
        duplicateIndex = w;
      }
    }

    if (duplicate == false) {                                                         // if no duplicate is found, add new row with the data and instances 1
      TableRow newRow = cleanCSV.addRow();                  
      for (int j = 0; j < vectorArray.length; j++) {
        newRow.setInt(attrNames[j], vectorArray[j]);
      }
      newRow.setFloat(attrNames[attrNames.length-2], score);
      newRow.setInt(attrNames[attrNames.length-1], 1);
    } else if (duplicate == true) {                                                   // if a duplicate is found, calculate the new mean score and plus one the instances
      println("This vector was already processed on row " + duplicateIndex + ". Calculating mean score..");
      int instances = duplicateRow.getInt("instances");
      float oldScore = duplicateRow.getFloat("score");
      float newScore = ((oldScore * instances) + score)/(instances+1);
      duplicateRow.setFloat(attrNames[attrNames.length-2], newScore);
      duplicateRow.setInt(attrNames[attrNames.length-1], instances+1);
    }
  }
  println("---");
  //saveTable(cleanCSV, dataPath(dataSetName + ".csv"));                              //save table as CSV file where amount of instances aren't taken into account
  //println("New CSV table with " + cleanCSV.getColumnCount() + " attributes and " + cleanCSV.getRowCount() + " rows of data with unique combinations and their means and instances saved");

  //saveARFF(dataSetName, cleanCSV);                                                  //save table as ARFF file where amount of instances aren't taken into account
  //println("New ARFF table with that data saved");


  // MAKE DATASET WITH INSTANCES IMPLEMENTED---------------------------------------
  // create new dataset
  trainCSV = new Table();
  for (int i = 0; i < attrNames.length-2; i++) {
    TableRow row = ingredients.getRow(i);
    attrNames[i] = row.getString("ingredient");
    String[] tempAttrArray = attrNames[i].split(" ");
    String tempAttr = "";
    for (int j=0; j < tempAttrArray.length; j++) {
      tempAttr += tempAttrArray[j];
    }
    attrNames[i] = tempAttr;
    trainCSV.addColumn(tempAttr);                                     // add to new table and set type
    trainCSV.setColumnType(i, Table.INT);
  }
  attrNames[attrNames.length-2] = "score";
  trainCSV.addColumn(attrNames[attrNames.length-2]);
  trainCSV.setColumnType(attrNames.length-2, Table.FLOAT);
  //println("imported " + attrNames.length + " attributes");

  // fill table
  for (int i = 0; i < cleanCSV.getRowCount(); i++) {
    TableRow row = cleanCSV.getRow(i);
    int instances = row.getInt("instances");

    if (instances > minDuplicates) {                                  // skips data that doesn't meet the duplicate threshold
      for (int j = 0; j < instances; j++) {
        TableRow newRow = trainCSV.addRow();
        for (int k = 0; k < row.getColumnCount()-2; k++) {
          newRow.setInt(attrNames[k], row.getInt(attrNames[k]));
        }
        float score = row.getFloat("score");
        newRow.setFloat("score", score);
      }
    }
  }
  println("---");
  saveTable(trainCSV, dataPath(dataSetName + "Processed.csv"));      // save table as CSV file
  println("New CSV table with " + trainCSV.getColumnCount() + " attributes and " + trainCSV.getRowCount() + "/" + rawCSV.getRowCount() + " rows of training data saved");
  saveARFF(dataSetName + "Processed", trainCSV);                     // save table as ARFF file
  println("New ARFF table with that data saved");
}





void saveARFF(String dataSetName, Table csvData) {
  String[] attrNames = csvData.getColumnTitles();
  int[] attrTypes = csvData.getColumnTypes();
  int lineCount = 1 + attrNames.length + 1 + (csvData.getRowCount()); //@relation + @attribute + @data + CSV
  String[] text = new String[lineCount];
  text[0] = "@relation "+dataSetName;
  for (int i = 0; i < attrNames.length; i++) {
    String s = "";
    ArrayList<String> dict = new ArrayList<String>();
    s += "@attribute "+attrNames[i];
    if (attrTypes[i]==0) {
      for (int j = 0; j < csvData.getRowCount(); j++) {
        TableRow row = csvData.getRow(j);
        String l = row.getString(attrNames[i]);
        boolean found = false;
        for (String d : dict) {
          if (d.equals(l)) found = true;
        }
        if (!found) dict.add(l);
      }
      s += " {";
      for (int n=0; n<dict.size(); n++) {
        s += dict.get(n);
        if (n != dict.size()-1) s += ",";
      }
      s += "}";
    } else s+=" numeric";
    text[1+i] = s;
  }
  text[1+attrNames.length] = "@data";
  for (int i = 0; i < csvData.getRowCount(); i++) {
    String s = "";
    TableRow row = csvData.getRow(i);
    for (int j = 0; j < attrNames.length; j++) {
      if (attrTypes[j]==0) s += row.getString(attrNames[j]);
      else s += row.getFloat(attrNames[j]);
      if (j!=attrNames.length-1) s +=",";
    }
    text[2+attrNames.length+i] = s;
  }
  saveStrings(dataPath(dataSetName+".arff"), text);
  println("Saved as: ", dataSetName+".arff");
}
