APP.factory('State', ['$location', '$ionicPopup', '$ionicLoading', 'ProjectInvite', '$rootScope',
function ($location, $ionicPopup, $ionicLoading, ProjectInvite, $rootScope) {

    var State = {
        _loading: false,
        error: '',
        message: '',
        redirectParams: null,
        activeProject: null,
        projects: null,
        user: null,
        showFinished: false,
        statusText: 'In Progress',
        isLoading: false,
        showError: function(msg) {
            $ionicPopup.alert({
                title: 'Error',
                template: msg
            });
        },
        showInfo: function(msg) {
            $ionicPopup.alert({
                title: 'Info',
                template: msg
            });
        },
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
        },
        confirmProjectDelete: function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Sure?',
                template: 'Deleting List will delete all of its data.'
            });
            return confirmPopup;
        },
        filterTasks: function () {
            State.showFinished = !State.showFinished;
            if(State.showFinished) {
                State.statusText = 'Completed';
            } else {
                State.statusText = 'In Progress';
            }
            $rootScope.$broadcast('filter-tasks');
        },
        loadingHandler: function (callback) {
            return function () {
                if (State.loading) return;
                State.loading = true;
                return callback.apply(this, arguments);
            };
        },
        stopLoading: function () {
            State.loading = false;
        }
    };

    Object.defineProperties(State, {
        loading: {
            get: function () {
                return this._loading;
            },
            set: function (value) {
                this._loading = value;

                if (value) {
                    $ionicLoading.show({
                        template: '<i class="icon ion-loading-d"></i> Loading...'
                    });
                }
                else {
                    $ionicLoading.hide();
                }
            }
        }
    });

    return State;
}]);
