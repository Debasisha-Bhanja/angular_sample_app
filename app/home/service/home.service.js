(function () {
  'use strict';

  /* @ngInject */
  angular
    .module('home.services', [])
    .factory('PostData', Post)

  /* @ngInject */
  function Post ($resource, BaseUrl) {
	 console.info('Service ....');
    return "Post Data";
  }

 

})();

