// variables
var Tala_status;

// subscribe to tala chennel
OOCSI.subscribe('Tala', function (msg) {
    var Tala_status = msg.data.Tala_status;
    // check if Tala sends 'true' or 'false'
    if (Tala_status == true) {
        logAI('*AI: \tThere is enough energy for this recipe!'); // log
    } else if (Tala_status == false) {
        logAI('*AI: \tAnother recipe would be better energywise'); // log
    }
});

// when 'cook today' button is clicked
function sendCookInfo() {
    logAI('*AI: \tI will ask Tala for the energy status!'); // log

    // assign variables
    var recipe_energy = Recipe_Energy[currentIndex];
    var recipe_time = Recipe_Time[currentIndex];
    var recipe_name = recipeList[currentIndex];

    // create parcel
    var parcel = { energy: recipe_energy, time: recipe_time, name: recipe_name };

    // send parcel to Recuisine channel
    OOCSI.send('Recuisine', parcel);
    console.log('data send');
}
