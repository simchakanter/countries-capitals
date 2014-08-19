var cncApp = angular.module('cncApp', ['ngRoute', 'ngAnimate']);

cncApp.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  })
  .when('/countries', {
    templateUrl: 'countries/countries.html',
    controller: 'countriesCtrl'
  })
  .when('/countries/:countryCode/capital', {
    templateUrl: 'country/country.html',
    controller: 'countryCtrl',
    resolve: {
      countryCode: function($route) {
        var countryCode = $route.current.params.countryCode;
        return countryCode;
      }
    }
  })
  .otherwise({
    redirectTo: '/'
  });
});

cncApp.factory("countriesData", function($http) {
  return function() {
    // I don't think this cache is working
    return $http.get('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=simcha', {cache: true});
  };
});

cncApp.factory("countryData", function($http) {
  return function(countryCode) {
    var country;
    // Get the core country data
    return $http.get('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=' + countryCode + '&username=simcha')
    .then(function(response) {
      country = response.data.geonames[0];
      // Add the capital population
      var request = {
        q: country.capital,
        country: country.countryCode,
        name_equals: country.capital,
        isNameRequired: true,
        username: "simcha"
      };
      $http({
        method: 'GET',
        url: 'http://api.geonames.org/searchJSON',
        params: request
      })
      .success(function(response) {
        console.log("Capital response is:");
        console.log(response);
        country.capitalPopulation = response.geonames[0].population;
        console.log("Updated country object");
        console.log(country);
      });
      return country;
    })
    .then(function(country) {
      var request = {
        country: country.countryCode,
        username: 'simcha'
      };
      $http({
        method: 'GET',
        url: 'http://api.geonames.org/neighboursJSON',
        params: request
      })
      .success(function(response) {
        console.log("Neighbors response is:");
        console.log(response);
        country.neighbours = response.geonames;
      });
      return country;
    })
    .then(function(country) {
      return country;
    });
  };
});