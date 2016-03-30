(function() {

var APP = angular.module('app', ['ionic'])

.controller('ApplicationCtrl', function ($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects) {
    // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
    $scope.projectModal.hide();
  }


  // Load or initialize projects
  $scope.projects = Projects.all();
  console.log(Projects.getProjects());

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
    
  $scope.showProjectModal = function(){
      $scope.projectModal.show();
  };
    
  // Called to create a new project
  $scope.newProject = function(project) {
    //var projectTitle = prompt('Project name');
    var projectTitle = project.title;
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
   // $scope.sideMenuController.close();
   $ionicSideMenuDelegate.toggleRight();
  };

  $scope.toggleProjects = function() {
      console.log("---------------------------");
      //console.log($scope);
      //$scope.sideMenuController.toggleLeft();
      $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.closeNewProject = function(){
      $scope.projectModal.hide();
  }

  $scope.newTask = function() {
      $scope.taskModal.show();
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

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });
  $ionicModal.fromTemplateUrl('new-project.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope
  });

  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      //while(true) {
        $scope.projectModal.show();
        //var projectTitle = prompt('Your first project title:');
        //if(projectTitle) {
          //createProject(projectTitle);
          //break;
        //}
      //}
    }
  });
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('tasks', {
    url: '/',
    templateUrl: 'templates/task.html',
    controller: 'TaskCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  $ionicConfigProvider.views.transition('android');
  $ionicConfigProvider.scrolling.jsScrolling(true);
  $ionicConfigProvider.views.swipeBackEnabled(false);

});
  window.APP = APP
})();
