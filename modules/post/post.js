/**
 * @module Post
 * @summary Post module
 */

/*globals window, angular, document */

angular.module('post', [
    'ui.router'
])
    .controller('post', ['$scope', '$sce', 'item', function ($scope, $sce, item) {
        'use strict';
        
        console.log('post', item);

        $scope.item = item;
        $scope.item.content = $sce.trustAsHtml(item.content);
    }]);