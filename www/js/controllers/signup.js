APP.controller('SignupCtrl', function($scope, $auth, State) {

  $scope.registrationForm = {email: '', password: '', password_confirmation: ''};

  $scope.handleRegBtnClick = function() {
    if(!$scope.registrationForm.isChecked) {
      State.showError("Please read and accept Privacy Policy to continue.")
      return;
    }
    $auth.submitRegistration($scope.registrationForm)
      .then(function(resp) {
        // handle success response
        State.showInfo("Confirmation email has been sent to " + $scope.registrationForm.email);
        State.navigate("/signin");
      })
      .catch(function(resp) {
        // handle error response
        State.showError(resp.reason);
      });
  };
});