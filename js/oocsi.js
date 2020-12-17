var Tala_status;

// OOCSI.subscribe("Recuisine", function(msg) {
//     var dataa = msg.data.dataa;
//     var data1 = msg.data.data1;
//     console.log(dataa, data1);
// });

OOCSI.subscribe('Tala', function (msg) {
    var Tala_status = msg.data.Tala_status;
    console.log(Tala_status);
    if (Tala_status) {
    } else if (!Tala_status) {
    }
});

function sendCookInfo() {
    var recipe_energy = Recipe_Energy[currentIndex];
    var recipe_time = Recipe_Time[currentIndex];
    var recipe_name = recipeList[currentIndex];

    var parcel = { energy: recipe_energy, time: recipe_time, name: recipe_name };

    OOCSI.send('Recuisine', parcel);
    console.log('data send');
}
