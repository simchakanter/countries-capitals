cncApp.controller('countriesCtrl', function($scope, countriesData) {
  countriesData().success(function(data) {
    $scope.countries = data.geonames;
  });
});