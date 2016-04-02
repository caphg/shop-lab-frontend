APP.controller('TaskCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects, $auth, $location, State, Tasks, ProjectInvite) {

    $scope.$on('project-changed', function(event, args) {
      $scope.init();
    });

    var loadTasks = function () {
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
    };

    $scope.init = function () {
      $scope.tasks = [];
      $auth.validateUser().then(function(resp) {
        State.user = resp.uid;
        ProjectInvite.query().then(function (invite) {
          console.log(invite.data);
          if(invite && invite.data) {
            State.showInvitePopup(invite.data.user_email, invite.data.project_name, invite.data.id);
          }
        });

        loadTasks();

        },function(err) {
            console.error(err);
            $location.path('/signin');
        });
    }, function (err) {
        console.log(err);
        $location.path('/signin');
    };

    $scope.doRefresh = function () {
      loadTasks();
      $scope.$broadcast('scroll.refreshComplete');
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

    $scope.deleteTask = function (task) {
      if(!task) return;
      task.$delete({project_id: $scope.activeProject.id});
      $scope.doRefresh();
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
      scope: $scope,
      focusFirstInput: true
    });
});