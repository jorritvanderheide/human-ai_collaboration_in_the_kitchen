 // connect OOCSI
 OOCSI.connect('wss://oocsi.id.tue.nl/ws');
 
 OOCSI.subscribe("Recuisine", function(msg) {
    var dataa = msg.data.dataa;
    var data1 = msg.data.data1;
    console.log(dataa, data1);
});