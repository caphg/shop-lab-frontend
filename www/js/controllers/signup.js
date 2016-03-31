APP.controller('SignupCtrl', function($scope, $auth) {
  $scope.handleRegBtnClick = function() {
    $auth.submitRegistration($scope.registrationForm)
      .then(function(resp) {
        // handle success response
        alert(resp);
      })
      .catch(function(resp) {
        // handle error response
        alert(resp);
      });
  };
});