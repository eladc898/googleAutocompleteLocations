app.controller('mainCtrl', function($scope, $http) {
    var locations = [];
    $scope.supermarket = 'All';
    $scope.supermarketsList = [];
    const RADIUS = 50000;

    $http.get('/supermarketsTest.json').then(function(response) {
        for (var i = 0; i < response.data.supermarketsList.length; i++) {
            locations.push({ geoLocation: response.data.supermarketsList[i].location, address: response.data.supermarketsList[i].address, supermarket: response.data.supermarketsList[i].supermarket})
        };
    })


    $scope.getAllDistances = function() {
        let address;
        $scope.supermarketsList = [];
        const place = autocomplete.getPlace();

        if (!place || !place.geometry) {
            var input = document.getElementById('pac-input');
            // Case the user entered the name of a Place that was not suggested
            window.alert("Cannot get distances for input: '" + input.value + "'");
            return;
        }

        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || ''),
                (place.address_components[3] && place.address_components[3].short_name || '')
            ].join(' ');
        }

        var destinations = [];
        for (var i = 0; i < locations.length; i++) {
            destinations.push(new google.maps.LatLng(locations[i].geoLocation.latetiude, locations[i].geoLocation.longitude))
        };

        var service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [address],
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false,
        }, (response, status) => {
            var res = [];
            for (var i = 0; i < locations.length; i++) {
                if (response.rows[0].elements[i].status === "ZERO_RESULTS") {
                    alert('Cant get distances by driving to the given location');
                    return;
                }
                if (response.rows[0].elements[i].distance) {
                    res.push({ address: locations[i].address, 
                               supermarket: locations[i].supermarket, 
                               distance: response.rows[0].elements[i].distance.text, 
                               value: response.rows[0].elements[i].distance.value })
                }
            };
            $scope.supermarketsList = res;
            $scope.getBestSupermarket();
            $scope.$apply();
        });
    }

    $scope.getBestSupermarket = () => {
        let stats = {
            RamiLevi:  {name: 'RamiLevi', sum: 0 , numOfElements: 0, avg: 0},
            Shufersal: {name: 'Shufersal', sum: 0 , numOfElements: 0, avg: 0},
            Mega:      {name: 'Mega', sum: 0 , numOfElements: 0, avg: 0},
            Yenot:     {name: 'Yenot', sum: 0 , numOfElements: 0, avg: 0},
        };
        $scope.supermarketsList.forEach(function(element) {
            if (element.value < RADIUS) {
                switch (element.supermarket) {
                    case 'RamiLevi':
                        stats.RamiLevi.sum += element.value;
                        stats.RamiLevi.numOfElements += 1;
                        break;
                    case 'Shufersal':
                        stats.Shufersal.sum += element.value;
                        stats.Shufersal.numOfElements += 1;
                        break;
                    
                    case 'Mega':
                        stats.Mega.sum += element.value;
                        stats.Mega.numOfElements += 1;
                        break;
                    
                    case 'Yenot':
                        stats.Yenot.sum += element.value;
                        stats.Yenot.numOfElements += 1;
                        break;
                    default:
                        break;
                  }
            }
        });
        Object.keys(stats).forEach(key => {
            if (stats[key].numOfElements !== 0) {
                stats[key].avg = stats[key].sum / stats[key].numOfElements;
            }
        });
        let min = {name: '', dist: RADIUS};
        Object.keys(stats).forEach(key => {
            if (stats[key].numOfElements !== 0 && stats[key].avg < min.dist) {
                min.dist = stats[key].avg;
                min.name = stats[key].name;
            }
        });
        $scope.bestSupermarket = min.name;
    };
})

