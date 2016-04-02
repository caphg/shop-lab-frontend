(function() {

var APP = angular.module('app', ['ionic', 'ng-token-auth', 'ngResource'])

.controller('ApplicationCtrl', function ($scope, State, $ionicSideMenuDelegate, Projects, $ionicModal, $rootScope, ProjectInvite) {
    $scope.invitation = {};

    $scope.init = function () {
      $scope.st = State;
    }

    var createProject = function(projectTitle) {
      var project = new Projects({name: projectTitle});
      project.$save(function (project) {
        console.log(project);
        State.projects.push(project);
        $scope.selectProject(project);
        $scope.projectModal.hide();
      });
    };

    $scope.showProjectModal = function(project){
        $scope.projectModal.show();
    };

    $scope.showInviteModal = function(project){
        $scope.invitation.project_id = project.id;
        $scope.inviteModal.show();
    };
    // Called to create a new project
    $scope.newProject = function(project) {
      var projectTitle = project.title;
      if(projectTitle) {
        createProject(projectTitle);
      }
    };

    // Called to select the given project
    $scope.selectProject = function(project) {
      State.activeProject = project;
      $ionicSideMenuDelegate.toggleRight();
      $rootScope.$broadcast('project-changed');
    };

    $scope.toggleProjects = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.delete = function (project) {
      if(project.id == State.activeProject.id) {
        State.activeProject = null;
      }
      project.$delete();
      $rootScope.$broadcast('project-changed');
    };

    $scope.newInvite = function(invitation) {
      ProjectInvite.invite(invitation.email, $scope.invitation.project_id).then(function () {
        State.showInfo("Invitation sent!");
      });
    };

    $scope.closeNewProject = function(){
        $scope.projectModal.hide();
    };

    $scope.closeInvite = function(){
        $scope.inviteModal.hide();
    };

    $ionicModal.fromTemplateUrl('new-project.html', function(modal) {
      $scope.projectModal = modal;
    }, {
      scope: $scope,
      focusFirstInput: true
    });

    $ionicModal.fromTemplateUrl('new-invite.html', function(modal) {
      $scope.inviteModal = modal;
    }, {
      scope: $scope,
      focusFirstInput: true
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
