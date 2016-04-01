APP.controller('TaskCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects, $auth, $location, State, Tasks) {

    $scope.$on('project-changed', function(event, args) {
      $scope.init();
    });

    $scope.init = function () {
      $scope.tasks = [];
      $auth.validateUser().then(function(resp) {
        console.info(resp);

        Projects.query(function(res) {
            $scope.projects = State.projects = res
            $scope.activeProject = State.activeProject || ($scope.projects && $scope.projects[0]);
            if(!State.activeProject) State.activeProject = $scope.activeProject;
            if($scope.activeProject) {
              Tasks.query({project_id: $scope.activeProject.id}, function(tasks) {
                $scope.tasks = tasks;
              });
            }
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
      var task = new Tasks({name: task.title});
      task.$save({project_id: $scope.activeProject.id}, function (task) {
        console.log(task);
        $scope.tasks.push(task);
      });
      $scope.taskModal.hide();

      task.title = "";
    };

    $scope.toggle = function (task) {
      task.done = !task.done;
      Tasks.update({project_id: $scope.activeProject.id, id: task.id}, task);
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