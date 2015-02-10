/**
 * @module App
 * @summary First module loaded
 */

/*globals window, angular, document, settings */

angular.module('app', [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'page',
    'post'
])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        'use strict';
        
        // workaround to access state provider later
        settings.stateProvider = $stateProvider;
        $urlRouterProvider.otherwise('/');
    }])

    .run(['Routes', function (Routes) {
        'use strict';

        /*
        // add a base route
        Routes.add({slug: 'posts', type: 'app', resolve: '?json_route=/pages'}, function (response) {
            var i = 0;
            // loop through pages from wordpress and add those routes
            for (i = 0; i < response.data.length; i += 1) {
                response.data[i].resolve = '?json_route=/pages/' + response.data[i].ID;
                Routes.add(response.data[i], function (item) {
                    return item.data;
                });
            }
            
            return response.data;
        });*/
        
        Routes.getPages();
    }])

    .controller('app', ['$rootScope', '$scope', '$http', '$sce', '$state', 'Routes', 'item', function ($rootScope, $scope, $http, $sce, $state, Routes, item) {
        'use strict';
        
        console.log('app', item);
        
        // put pages data into scope of navigation
        $rootScope.pages = item;
        $rootScope.navbarCollapsed = true;
        
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.navbarCollapsed = true;
        });
        
        /**
         * @method toBase64
         */
        $scope.toBase64 = function (input) {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                output = '',
                chr1 = '',
                chr2 = '',
                chr3 = '',
                enc1 = '',
                enc2 = '',
                enc3 = '',
                enc4 = '',
                i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        };
        
        $scope.getItemByKey = function (items, key, slug) {
            var i = 0;
            for (i = 0; i < items.length; i += 1) {
                if (slug === items[i][key]) {
                    return items[i];
                }
            }
        };
        
        $scope.post = function () {
            
            console.log('post');
            /*
            $http.post('/oauth1').then(function (response) {
                console.log('post.request', response);
            });
            $http.post('?json_route=/posts', { title: 'Post from Angular!', content_raw: '<p>Hello there sir</p>' }).then(function (response) {
                console.log('post.complete', response);
            });
            */
        };
        
        // set header auth  
        $http.defaults.headers.common.Authorization = 'Basic ' + $scope.toBase64('admin:password');
        //$http.defaults.headers.common['api-version'] = 1;
        //$http.defaults.headers.common['Access-Control-Allow-Origin'] = 'YES';
        
        Routes.getPosts();
    }])

    .factory('Routes', ['$rootScope', '$http', '$sce', '$state', function ($rootScope, $http, $sce, $state) {
        'use strict';
        return {
            add: function (item, callback) {
                var me = this;
                if (!$state.get(item.slug)) {
                    console.log('Routes.add', item);
                    // add route with standardised controller, template and data pattern
                    settings.stateProvider.state(item.slug, {
                        url: '/' + item.slug,
                        resolve: {
                            'item': ['$http', '$stateParams', function ($http, $stateParams) {
                                if (item.resolve) { return $http.get(item.resolve).then(callback); } else { return true; }
                            }]
                        },
                        views: {
                            'main': {
                                controller: item.type,
                                templateUrl: settings.theme + '/modules/' + item.type + '/' + item.type + '.html'
                            }
                        }
                    });
                }
            },
            getItemByKey: function (items, key, slug) {
                var i = 0;
                for (i = 0; i < items.length; i += 1) {
                    if (slug === items[i][key]) {
                        return items[i];
                    }
                }
            },
            getPages: function () {
                var me = this;
                $http.get('?json_route=/pages').then(function (response) {
                    // trust html as safe and put blog posts into scope of page
                    var i = 0;
                    for (i = 0; i < response.data.length; i += 1) {
                        response.data[i].content = $sce.trustAsHtml(response.data[i].content);
                    }
                    $rootScope.pages = response.data;

                    // add post route
                    if (!$state.get('posts')) {
                        settings.stateProvider.state('posts', {
                            url: '/',
                            resolve: {
                                'item': ['$http', '$stateParams', function ($http, $stateParams) {
                                    return $http.get('?json_route=/posts').then(function (item) { return item.data; });
                                }]
                            },
                            views: {
                                'main': {
                                    controller: 'app',
                                    templateUrl: settings.theme + '/modules/app/app.html'
                                }
                            }
                        });
                        settings.stateProvider.state('page', {
                            url: '/page/:slug',
                            resolve: {
                                'item': ['$http', '$stateParams', function ($http, $stateParams) {
                                    return $http.get('?json_route=/pages/' + me.getItemByKey($rootScope.pages, 'slug', $stateParams.slug).ID).then(function (item) { return item.data; });
                                }]
                            },
                            views: {
                                'main': {
                                    controller: 'page',
                                    templateUrl: settings.theme + '/modules/page/page.html'
                                }
                            }
                        });
                    }
                });
            },
            getPosts: function () {
                var me = this;
                $http.get('?json_route=/posts').then(function (response) {
                    // trust html as safe and put blog posts into scope of page
                    var i = 0;
                    for (i = 0; i < response.data.length; i += 1) {
                        response.data[i].content = $sce.trustAsHtml(response.data[i].content);
                    }
                    $rootScope.posts = response.data;

                    // add post route
                    if (!$state.get('post')) {
                        settings.stateProvider.state('post', {
                            url: '/posts/:slug',
                            resolve: {
                                'item': ['$http', '$stateParams', function ($http, $stateParams) {
                                    return $http.get('?json_route=/posts/' + me.getItemByKey($rootScope.posts, 'slug', $stateParams.slug).ID).then(function (item) { return item.data; });
                                }]
                            },
                            views: {
                                'main': {
                                    controller: 'post',
                                    templateUrl: settings.theme + '/modules/post/post.html'
                                }
                            }
                        });
                    }
                });
            }
        };
    }]);