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
  .when('/countries/:country/capital', {
    templateUrl: 'countries/country.html',
    controller: 'countriesCtrl'
    // resolve: {
    //   country: function($route) {
    //     var country = $route.current.params.country;
    //     return country;
    //   }
    // }
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

cncApp.factory("countryData", function($route) {
  return function() {
    return $route.current.params.country;
  };
});