(function() {
    angular.module('coviam').controller('coviamController', ['$q', '$scope', '$mdDialog', 'coviamService', function($q, $scope, $mdDialog, coviamService) {
        var vm = $scope;
        vm.pageNumber = 1;
        vm.sampleUrl = 'https://swapi.co/api/people/';
    
        vm.loadData = function(url) {
            var _defer = $q.defer();
            vm.showLoader = true;
            coviamService.loadData(url).then(function(result) {
                vm.people = result.data;
                vm.showLoader = false;
                _defer.resolve();
            })
            return _defer.promise;
        }
    
        function _getData(url) {
            vm.loadData(url).then(function() {
                _getFilmData();
            });
        }
    
        function _getFilmData() {
            angular.forEach(vm.people.results, function(result) {
                result['filmTitles'] = [];
                angular.forEach(result.films, function(url) {
                    coviamService.loadData(url).then(function(response) {
                        result['filmTitles'].push(response.data);
                    })
                })
            })
        }
    
        _getData(vm.sampleUrl);
    
        vm.nextPage = function() {
            vm.pageNumber += 1;
            _getData(vm.people.next);
        }
    
        vm.previousPage = function() {
            vm.pageNumber -= 1;
            _getData(vm.people.previous);
        }
    
        vm.gotoPage = function(event, pageNo) {
            if(event.keyCode === 13) {
                var url = vm.sampleUrl;
                url += '?page=' + pageNo; 
                _getData(url);
                if(pageNo.length<1) {
                    vm.pageNumber = 1;
                }
            }
        }
    
        vm.getFilmDetails = function(ev, data) {
            var _data = data;
            $mdDialog.show({
                controller: dialogController,
                templateUrl: 'dialog.template.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: {
                    params: _data
                }
            })
        }
    
        function dialogController($scope, $mdDialog, locals, coviamService) {
            var ctrl = $scope;
            ctrl.stars = [];
            ctrl.data = locals.params;
    
            ctrl.cancel = function() {
                $mdDialog.cancel();
            }
    
            function getCharactersName() {
                angular.forEach(ctrl.data.characters, function(url) {
                    coviamService.loadData(url).then(function(response) {
                        ctrl.stars.push(response.data.name);
                    })
                })
            }
    
            ctrl.getNames = function() {
                return ctrl.stars.join(', ');
            }
    
            getCharactersName();
        }
    }]);
    
})();
