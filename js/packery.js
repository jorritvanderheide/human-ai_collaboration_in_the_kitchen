// Packery Init
var $grid = $('.grid').packery({
  gutter: 30,
  itemSelector: '.grid-item',
  percentPosition: true,
});

// Packery Layout
$(document).ready(function(){
  $grid.packery('layout');
});