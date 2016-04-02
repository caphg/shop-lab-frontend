APP.factory('State', ['$location', '$ionicPopup', '$ionicLoading', 'ProjectInvite',
function ($location, $ionicPopup, $ionicLoading, ProjectInvite) {

    var State = {
        error: '',
        message: '',
        redirectParams: null,
        activeProject: null,
        projects: null,
        user: null,
        navigate: function (url, params) {
            console.info('Navigating to '+url);
            State.message = '';
            State.error = '';
            State.redirectParams = params;
            $location.path(url);
        },
        reload: function() {
            $window.location.reload();
        },
        showInvitePopup: function(user, project, invitation_id) {
           var confirmPopup = $ionicPopup.confirm({
             title: 'Accept Invitation',
             template: 'User ' + user + ' would like to invite you to his List ' + project
           });

           confirmPopup.then(function(res) {
             if(res) {
                ProjectInvite.accept(invitation_id);
             } else {
                ProjectInvite.decline(invitation_id);
             }
           });
         }
    };

    return State;
}]);
