//var $ = jQuery;
// connect to the OOCSI server
OOCSI.connect('wss://' + 'oocsi.id.tue.nl' + '/ws');

function myFunction() {
    var x;
    OOCSI.send('ReCuisine', x);
    var filter = { filter: 'popular' };
    OOCSI.send('RecipeRecommender', filter);
}

function pop() {
    var filter = { filter: 'popular' };
    OOCSI.send('RecipeRecommender', filter);
    var name = 'Most popular:';
    document.getElementById('filter').innerHTML = name;
}

function pers() {
    var filter = { filter: 'personal' };
    OOCSI.send('RecipeRecommender', filter);
    var name = 'Recommend for you:';
    document.getElementById('filter').innerHTML = name;
}

function fam() {
    var filter = { filter: 'family' };
    OOCSI.send('RecipeRecommender', filter);
    var name = 'Family favourites:';
    document.getElementById('filter').innerHTML = name;
}

// subscribe to a channel and add data to HTML

OOCSI.subscribe('RecipeRecommender', function (e) {
    //$("#position")
    document.getElementById('r0').innerHTML = typeof e.data.Recipe0 != 'undefined' ? e.data.Recipe0 : '';
    document.getElementById('r1').innerHTML = typeof e.data.Recipe1 != 'undefined' ? e.data.Recipe1 : '';
    document.getElementById('r2').innerHTML = typeof e.data.Recipe2 != 'undefined' ? e.data.Recipe2 : '';
    document.getElementById('r3').innerHTML = typeof e.data.Recipe3 != 'undefined' ? e.data.Recipe3 : '';
    document.getElementById('r4').innerHTML = typeof e.data.Recipe4 != 'undefined' ? e.data.Recipe4 : '';
    document.getElementById('r5').innerHTML = typeof e.data.Recipe5 != 'undefined' ? e.data.Recipe5 : '';
    document.getElementById('r6').innerHTML = typeof e.data.Recipe6 != 'undefined' ? e.data.Recipe6 : '';
    document.getElementById('r7').innerHTML = typeof e.data.Recipe7 != 'undefined' ? e.data.Recipe7 : '';
    document.getElementById('r8').innerHTML = typeof e.data.Recipe8 != 'undefined' ? e.data.Recipe8 : '';
    document.getElementById('r9').innerHTML = typeof e.data.Recipe9 != 'undefined' ? e.data.Recipe9 : '';
});
