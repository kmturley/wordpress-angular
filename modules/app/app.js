/**
 * @module App
 * @summary First module loaded
 */

/*globals window, angular, document, settings */

angular.module('app', [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'page'
])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        'use strict';
        
        // workaround to access state provider later
        settings.stateProvider = $stateProvider;
        $urlRouterProvider.otherwise('/app');
    }])

    .run(['Routes', function (Routes) {
        'use strict';
        
        // add a base route
        Routes.add({slug: 'app', type: 'app', resolve: '?json_route=/pages'}, function (response) {
            var i = 0;
            // loop through pages from wordpress and add those routes
            for (i = 0; i < response.data.length; i += 1) {
                response.data[i].resolve = '?json_route=/pages/' + response.data[i].ID;
                Routes.add(response.data[i], function (item) {
                    return item.data;
                });
            }
            return response.data;
        });
    }])

    .controller('app', ['$rootScope', '$http', '$sce', 'item', function ($rootScope, $http, $sce, item) {
        'use strict';
        // put pages data into scope of navigation
        $rootScope.pages = item;
        
        $http.get('?json_route=/posts').then(function (response) {
            // trust html as safe and put blog posts into scope of page
            var i = 0;
            for (i = 0; i < response.data.length; i += 1) {
                response.data[i].content = $sce.trustAsHtml(response.data[i].content);
            }
            $rootScope.posts = response.data;
        });
    }])

    .factory('Routes', ['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {
        'use strict';
        return {
            add: function (item, callback) {
                var me = this;
                if (!$state.get(item.slug)) {
                    // add route with standardised controller, template and data pattern
                    settings.stateProvider.state(item.slug, {
                        url: '/' + item.slug,
                        resolve: {
                            'item': function ($http) {
                                if (item.resolve) { return $http.get(item.resolve).then(callback); } else { return true; }
                            }
                        },
                        views: {
                            'main': {
                                controller: item.type,
                                templateUrl: settings.theme + '/modules/' + item.type + '/' + item.type + '.html'
                            }
                        }
                    });
                }
            }
        };
    }]);