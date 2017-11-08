var app = angular.module('compieApp', []);

app.filter('supermaketFilter', function() {
    return function(data, supermarket) {
        if (!supermarket || supermarket === 'All') return data;
        let filteredData = [];
        data.forEach(function(element) {
            if(element.supermarket === supermarket) {
                filteredData.push(element);
            }
        });
        return filteredData;
    };
});

var autocomplete;
var initMap = function() {
    var input = document.getElementById('pac-input');
    autocomplete = new google.maps.places.Autocomplete(input);
}
