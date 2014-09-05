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
  // TODO add an error page
  .otherwise({
    redirectTo: '/'
  });
});

// TODO: How do I use explicity named dependencies with .run?
cncApp.run(function($rootScope, $location, $timeout) {
  $rootScope.$on('$routeChangeError', function() {
      $location.path("/error");
  });
  $rootScope.$on('$routeChangeStart', function() {
      $rootScope.isLoading = true;
  });
  $rootScope.$on('$routeChangeSuccess', function() {
    $timeout(function() {
      $rootScope.isLoading = false;
    }, 1000);
  });
});

cncApp.factory("countriesData", function($http) {
  return function() {
    return $http.get('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=simcha', {cache: true});
  };
});

cncApp.factory("capitalData", function($http, $q) {
  return function(request, country) {
    var d = $q.defer();
    angular.extend(request, {
      // TODO: look into featureCode from the API
      q: country.capital,
      name_equals: country.capital,
      isNameRequired: true
    });
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
      d.resolve(country);
    });
    return d.promise;
  };
});

cncApp.factory("neighboursData", function($http, $q) {
  return function(request, country) {
    var d = $q.defer();
    $http({
      method: 'GET',
      url: 'http://api.geonames.org/neighboursJSON',
      params: request
    })
    .success(function(response) {
      console.log("Neighbors response is:");
      console.log(response);
      country.neighbours = response.geonames;
      d.resolve(country);
    });
    return d.promise;
  };
});

cncApp.factory("countryData", function($http, capitalData, neighboursData, $q) {
  return function(countryCode) {
    var country;
    // Get the core country data
    return $http.get('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=' + countryCode + '&username=simcha')
    .then(function(response) {
      console.log(response);
      country = response.data.geonames[0];
      // Add the capital population
      var request = {
        country: country.countryCode,
        username: "simcha"
      };
      return $q.all([
        capitalData(request, country),
        neighboursData(request, country)
      ])
      .then(function() {
        console.log(arguments);
        return country;
      });
    });
  };
});