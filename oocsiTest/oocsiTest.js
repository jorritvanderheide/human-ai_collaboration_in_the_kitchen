 // connect OOCSI
 OOCSI.connect('wss://oocsi.id.tue.nl/ws');
 
 OOCSI.subscribe("Recuisine", function(msg) {
    var energy = msg.data.energy;
    var time = msg.data.time;
    var name = msg.data.name;
    console.log(energy, time, name);
});