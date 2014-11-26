/**
 * @module Page
 * @summary Page module
 */

/*globals window, angular, document */

angular.module('page', [
    'ui.router'
])
    .controller('page', ['$scope', '$sce', 'item', function ($scope, $sce, item) {
        'use strict';
        
        console.log('page', item);
        $scope.item = item;
        $scope.item.content = $sce.trustAsHtml(item.content);
    }]);