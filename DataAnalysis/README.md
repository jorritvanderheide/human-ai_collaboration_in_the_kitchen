# Data Analysis

## What is this repository?
This repository is meant as a reference to the data analysis as described in the Recuisine report. With the files in this repository our performed data analysis can be reproduced and explored further upon.

## How to use
Multiple datasets can be found in the data folder. Datasets with 336 and 936 instances were used in the original data analysis. A dataset with 1468 instances, which was used as final dataset, is also included.

These datasets were used to explore different Artificial Neural Network configurations in Weka Explorer. Detailed settings and configurations are given below.

### ANN configurations tested

Configurations where (30,30) represent an ANN with two layers of 30 nodes each. 9 configurations total.

1 layer: (30)   (60)

2 layers: (30,15)  (30,30)  (60,15)  (60,30)  (60,60)

3 layers: (60,30,15)  (60,30,30)

### Weka settings
The MultilayerPerceptron Weka function was used. If settings are not mentioned default settings were used.

trainingTime was set to 400 epochs

batchSize was set to 100 instances

5-fold cross-validation was used for testing
