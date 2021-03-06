APP.controller('SigninCtrl', function($scope, $auth, $location, State) {
    $scope.loginForm = {email: '', password: ''};

    $scope.handleLoginBtnClick = function() {
      $auth.submitLogin($scope.loginForm)
        .then(function(resp) {
          // handle success response
          console.log(resp);
          $location.path('/');
        })
        .catch(function(resp) {
          State.showError('Please try again.')
        });
    };
  });