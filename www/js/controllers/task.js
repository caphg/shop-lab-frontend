APP.controller('TaskCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects, $auth, $location, State, Tasks, ProjectInvite, $ionicPlatform) {

    $scope.task = {};
    $scope.allTasks = {};
    State.showFinished = false;

    $scope.$on('project-changed', function(event, args) {
      $scope.init();
    });

    $scope.$on('filter-tasks', function(event, args) {
      $scope.filterTasks();
    });

    $ionicPlatform.on('resume', function () {
      $scope.init();
    });

    var hideLoadingModal = function () {
      State.stopLoading();
      $timeout(function () {
        $scope.$apply();
      });
    };

    var loadTasks = function () {
      Projects.query(function(res) {
          $scope.projects = State.projects = res;
          $scope.activeProject = State.activeProject || ($scope.projects && $scope.projects[0]);
          if(!State.activeProject) State.activeProject = $scope.activeProject;
          if($scope.activeProject) {
            Tasks.query({project_id: $scope.activeProject.id}, function(tasks) {
              $scope.tasks = $scope.allTasks = tasks;
              $scope.filterTasks();
            });
          }
          $timeout(function() {
            if(!$scope.activeProject) {
                $scope.projectModal.show();
            }
          });
          hideLoadingModal();
      });
    };

    $scope.init = State.loadingHandler(function () {
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
        hideLoadingModal();
        $location.path('/signin');
      });
    }, function (err) {
        console.log(err);
        hideLoadingModal();
        $location.path('/signin');
    });

    $scope.doRefresh = function () {
      loadTasks();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.createTask = State.loadingHandler(function (task) {
      if(!$scope.activeProject || !task) {
        hideLoadingModal();
        $scope.projectModal.show();
        return;
      }
      var task = new Tasks({name: task.title});
      task.$save({project_id: $scope.activeProject.id}, function (task) {
        console.log(task);
        $scope.tasks.push(task);
      }, function (err) {
        console.log(err);
        $location.path('/signin');
      });
      $scope.taskModal.hide();

      $scope.task.title = "";
      hideLoadingModal();
    });

    $scope.deleteTask = State.loadingHandler(function (task) {
      if(!task) return;
      task.$delete({project_id: $scope.activeProject.id});
      $scope.doRefresh();
      hideLoadingModal();
    });

    $scope.toggle = function (task) {
      task.done = !task.done;
      Tasks.update({project_id: $scope.activeProject.id, id: task.id}, task, function (){},
        function (err) {
          $location.path('/signin');
        });
      $scope.filterTasks();
    };

    $scope.closeNewTask = function() {
        $scope.taskModal.hide();
    };

    $scope.newTask = function() {
      $ionicModal.fromTemplateUrl('new-task.html', {
          scope: $scope,
          animation: 'slide-in-up',
          focusFirstInput: true
        }).then(function(modal) {
          $scope.taskModal = modal;
          $scope.taskModal.show();
        });
    };

    $scope.filterTasks = function () {
      $scope.tasks = $scope.allTasks.filter(function (t) {
         return (State.showFinished && t.done) || (!State.showFinished && !t.done);
      });
    };
});
