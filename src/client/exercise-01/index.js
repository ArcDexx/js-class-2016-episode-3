
import 'angular';
import 'angular-ui-router';

const appModule = angular.module('app_module', []);


appModule.controller('AppController', ['$scope', function ($scope) {
  this.title = 'Exercise 01';

  $scope.$watch(() => console.count('$digest'));
}]);


appModule.component('layout', {
  templateUrl: 'client/exercise-01/layout.html'
});

appModule.controller('HelloController',
   ['$timeout', function ($timeout) {
    this.names = [];

    this.addName = function () {
      this.names.push(this.name);
      this.name = '';
      console.log('added a name:', this);


      $timeout(() => this.names.shift(), 1000);

    };
  }]
);

// angular manual initialisation since we use a script loader
console.log('* Bootstrapping angular...');
angular.element(document).ready(function() {
  angular.bootstrap(document, ['app_module'], {strictDi: true});
});
