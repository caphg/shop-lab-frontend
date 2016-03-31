(function() {

var APP = angular.module('app', ['ionic', 'ng-token-auth', 'ngResource'])

.controller('ApplicationCtrl', function ($scope, State, $ionicSideMenuDelegate, Projects, $ionicModal) {

    $scope.init = function () {
      $scope.st = State;
    }

    var createProject = function(projectTitle) {
      Projects.newProject(projectTitle).then(function (resp) {
        console.log(resp);
        State.projects.push(resp);
        Projects.save($scope.projects);
        $scope.selectProject(newProject, State.length-1);
        $scope.projectModal.hide();
      });
    };

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
      State.activeProject = project;
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
    };

    $ionicModal.fromTemplateUrl('new-project.html', function(modal) {
      $scope.projectModal = modal;
    }, {
      scope: $scope
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $authProvider) {
  $stateProvider
  .state('tasks', {
    url: '/',
    templateUrl: 'templates/task.html',
    controller: 'TaskCtrl',
    cache: false
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/register.html',
    controller: 'SignupCtrl'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/login.html',
    controller: 'SigninCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  $ionicConfigProvider.views.transition('android');
  $ionicConfigProvider.scrolling.jsScrolling(true);
  $ionicConfigProvider.views.swipeBackEnabled(false);

  $authProvider.configure({
      apiUrl: CONFIG.apiUrl
  });

});
  window.APP = APP
})();
