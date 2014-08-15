cncApp.controller('countriesCtrl', function($scope, countriesData, countryData) {
  countriesData().success(function(data) {
    $scope.countries = data.geonames;
  });
  $scope.country = countryData();
});