APP.controller('SignupCtrl', function($scope, $auth, State) {
  $scope.handleRegBtnClick = function() {
    $auth.submitRegistration($scope.registrationForm)
      .then(function(resp) {
        // handle success response
        State.showInfo("Confirmation email has been sent to address you specified.");
        State.navigate("/signin");
      })
      .catch(function(resp) {
        // handle error response
        State.showError(resp.reason);
      });
  };
});