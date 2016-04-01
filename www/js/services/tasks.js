APP.factory('Tasks', function($resource) {
  return $resource(CONFIG.apiUrl + '/api/projects/:project_id/items/:id', {project_id: '@project_id', id: '@id'}, 
    {
        'update': {method: 'PUT'}
    }
  );
});