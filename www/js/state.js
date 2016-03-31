APP.factory('State', ['$location', '$ionicPopup', '$ionicLoading',
function ($location, $ionicPopup, $ionicLoading) {

    var State = {
        error: '',
        message: '',
        redirectParams: null,
        activeProject: {title: 'Sign In'},
        projects: null,
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

    };

    return State;
}]);
