APP.factory('Projects', function($resource) {
  return $resource(CONFIG.apiUrl + '/api/projects/:id', {id: '@id'});
});

APP.factory('ProjectInvite', function($http, $q) {
  return {
    invite: function (email, project_id) {
        return $http.post(CONFIG.apiUrl + '/api/invitations', {email: email, project_id: project_id});
    },
    accept: function (id) {
        return $http.post(CONFIG.apiUrl + '/api/invitations/accept', {id: id});
    },
    decline: function (id) {
        return $http.post(CONFIG.apiUrl + '/api/invitations/decline', {id: id});
    },
    query: function () {
        return $http.get(CONFIG.apiUrl + '/api/invitations');
    }
  };
});