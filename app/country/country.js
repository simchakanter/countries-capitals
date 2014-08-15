cncApp.controller('countryCtrl', function($scope, countryCode, countryData) {
  countryData(countryCode).success(function(data) {
    $scope.country = data.geonames[0];
    console.log($scope.country);
  });
});