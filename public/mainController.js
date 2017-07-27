// var autocomplete;

// var initMap = function() {
//     var input = document.getElementById('pac-input');
//     autocomplete = new google.maps.places.Autocomplete(input);
// }


app.controller('mainCtrl', function($scope, $http) {

    var locations = [];

    $http.get('/supermarkets.json').then(function(response) {
        for (var i = 0; i < response.data.results.length; i++) {
            locations.push({ latLng: response.data.results[i].geometry.location, address: response.data.results[i].formatted_address, supermarket: response.data.results[i].supermarket})
        };
    })

    $scope.supermarket;


    $scope.places = [];

    $scope.findDistances = function(city) {

        var address;

        var place = autocomplete.getPlace();


        if (!place || !place.geometry) {
            var input = document.getElementById('pac-input');

            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + input.value + "'");
            return;
        }

        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }



        var destinations = [];

        for (var i = 0; i < locations.length; i++) {
            destinations.push(new google.maps.LatLng(locations[i].latLng.lat, locations[i].latLng.lng))
        };

        var service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [address],
            destinations: destinations,
            travelMode: 'DRIVING',
            avoidHighways: true,
            avoidTolls: true,
        }, function(response, status) {
            var answers = [];

            for (var i = 0; i < locations.length; i++) {
                if (response.rows[0].elements[i].distance) {
                    answers.push({ add: locations[i].address, supermarket: locations[i].supermarket, dist: response.rows[0].elements[i].distance.text, value: response.rows[0].elements[i].distance.value })
                }
            };
            $scope.places = answers
        });

    }

    $scope.filterSupermarkets = function(){
        if ($scope.supermarket==places.supermarket){
            return true;
        }
    }
})

