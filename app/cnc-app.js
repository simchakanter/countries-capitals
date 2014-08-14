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
  .when('countries/:country/capital', {
    templateUrl: 'countries/country.html',
    controller: 'countriesCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});

cncApp.factory("countriesData", function($http) {
  return function() {
    return $http.get('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=simcha');
  };
});