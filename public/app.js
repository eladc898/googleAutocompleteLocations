var app = angular.module('compie', []);

var autocomplete;
var initMap = function() {
    var input = document.getElementById('pac-input');
    autocomplete = new google.maps.places.Autocomplete(input);
}
