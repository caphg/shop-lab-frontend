APP.controller('TaskCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects, $auth, $location, State) {
    $scope.init = function () {
      $auth.validateUser().then(function(resp) {
        console.info(resp);

        Projects.query(function(res) {
            $scope.projects = State.projects = res
            $scope.activeProject = State.activeProject = $scope.projects && $scope.projects[0];
            $timeout(function() {
              if($scope.projects.length == 0) {
                  $scope.projectModal.show();
              }
            });
        });

        },function(err) {
            console.error(err);
        });
    }, function (err) {
        console.log(err);
        $location.path('/signin');
    };

    $scope.createTask = function(task) {
      if(!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        title: task.title,
        done: false
      });
      $scope.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save($scope.projects);

      task.title = "";
    };

    $scope.toggle = function (task) {
      task.done = !task.done;
      Projects.save($scope.projects);
    };

    $scope.closeNewTask = function() {
        $scope.taskModal.hide();
    };

    $scope.newTask = function() {
        $scope.taskModal.show();
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope
    });
});