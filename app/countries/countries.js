cncApp.controller('countriesCtrl', function($scope, countriesData, country) {
  countriesData().success(function(data) {
    $scope.countries = data.geonames;
    $scope.country = country;
  });
});