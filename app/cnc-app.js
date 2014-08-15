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
    return $http.get('http://api.geonames.org/countryInfoJSON?formatted=true&lang=it&country=' + countryCode + '&username=simcha');
  };
});