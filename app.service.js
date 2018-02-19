(function() {
    'use strict';
    angular.module('coviam').service('coviamService', ['$q', '$http', function($q, $http) {

        function _loadData(url) {
            var _defer = $q.defer(),
                _URL = url;
            
            $http.get(_URL)
                .then(function(success) {
                    _defer.resolve(success);
                }, function(error) {
                    _defer.reject(error);
                })
            
            return _defer.promise;
        }

        return {
            loadData: _loadData
        }

    }]);
})();
