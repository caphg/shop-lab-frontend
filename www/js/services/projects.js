APP.factory('Projects', function($resource) {
  return $resource(CONFIG.apiUrl + '/api/projects/:id');
});