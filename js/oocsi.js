
var Tala_status;

// OOCSI.subscribe("Recuisine", function(msg) {
//     var dataa = msg.data.dataa;
//     var data1 = msg.data.data1;
//     console.log(dataa, data1);
// });

OOCSI.subscribe("Tala", function(msg) {
    var Tala_status = msg.data.Tala_status;
    if (Tala_status) {
        
    } else if (!Tala_status) {

    }
});

function sendCookInfo() {
    var recipe_energy = Recipe_Energy[currentIndex];
    var recipe_time = Recipe_Time[currentIndex];
    var recipe_name = recipeList[currentIndex];

    var parcel = {'energy': recipe_energy, 'time': recipe_time, 'name': recipe_name};

    OOCSI.send("Recuisine", parcel);
    console.log("data send");
}






//--------------------- EXAMPLES

// // connect to the OOCSI server
// OOCSI.connect('wss://' + 'oocsi.id.tue.nl' + '/ws');

// function sendWatt() {
//     var watt = {
//         energy: Math.floor(Math.random() * 3000) + 2500,
//         time: Math.floor(Math.random() * 90) + 15,
//     };
//     //var watt = 4;
//     OOCSI.send('recipeEnergy', watt);
// }

// function myFunction() {
//     var x = document.getElementById('ing').value;
//     document.getElementById('demo').innerHTML = x;
//     var d = {
//         ingredients: document.getElementById('ing').value,
//     };
//     var name = 'The most popular recipes:';
//     document.getElementById('filter').innerHTML = name;
//     OOCSI.send('RecipeRecommender', d);
//     var filter = {
//         filter: 'popular',
//     };
//     OOCSI.send('RecipeRecommender', filter);
// }

// function pop() {
//     var filter = {
//         filter: 'popular',
//     };
//     OOCSI.send('RecipeRecommender', filter);
//     var name = 'Most popular:';
//     document.getElementById('filter').innerHTML = name;
// }

// function pers() {
//     var filter = {
//         filter: 'personal',
//     };
//     OOCSI.send('RecipeRecommender', filter);
//     var name = 'Recommend for you:';
//     document.getElementById('filter').innerHTML = name;
// }

// function fam() {
//     var filter = {
//         filter: 'family',
//     };
//     OOCSI.send('RecipeRecommender', filter);
//     var name = 'Family favourites:';
//     document.getElementById('filter').innerHTML = name;
// }

// // subscribe to a channel and add data to HTML
// OOCSI.subscribe('RecipeRecommender', function (e) {
//     //$("#position")
//     document.getElementById('r0').innerHTML = typeof e.data.Recipe0 != 'undefined' ? e.data.Recipe0 : '';
//     document.getElementById('r1').innerHTML = typeof e.data.Recipe1 != 'undefined' ? e.data.Recipe1 : '';
//     document.getElementById('r2').innerHTML = typeof e.data.Recipe2 != 'undefined' ? e.data.Recipe2 : '';
//     document.getElementById('r3').innerHTML = typeof e.data.Recipe3 != 'undefined' ? e.data.Recipe3 : '';
//     document.getElementById('r4').innerHTML = typeof e.data.Recipe4 != 'undefined' ? e.data.Recipe4 : '';
//     document.getElementById('r5').innerHTML = typeof e.data.Recipe5 != 'undefined' ? e.data.Recipe5 : '';
//     document.getElementById('r6').innerHTML = typeof e.data.Recipe6 != 'undefined' ? e.data.Recipe6 : '';
//     document.getElementById('r7').innerHTML = typeof e.data.Recipe7 != 'undefined' ? e.data.Recipe7 : '';
//     document.getElementById('r8').innerHTML = typeof e.data.Recipe8 != 'undefined' ? e.data.Recipe8 : '';
//     document.getElementById('r9').innerHTML = typeof e.data.Recipe9 != 'undefined' ? e.data.Recipe9 : '';
// });
