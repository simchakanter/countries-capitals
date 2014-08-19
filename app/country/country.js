cncApp.controller('countryCtrl', function($scope, countryCode, countryData) {
  $scope.countryCode = countryCode;
  countryData(countryCode).then(function(country) {
    console.log('The controller received');
    console.log(country);
    // TODO Why is this coming back as undefined/
    console.log(country.neighbours);
    $scope.country = country;
  });
});