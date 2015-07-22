/**
 * Created by oleg on 6/30/2015.
 */

angular.module('dataCore', ['discoverActivities','activity'])

.directive('data',function(){
        return {
            'restrict':'E',
            'scope':{

            },
            'transclude':false,
            'controller':'dataController',
            'link':function(scope,element,attrs){
                scope.init();
            }
        }
    })
.controller('dataController',['$scope','$http','config',function($scope,$http,config){

        $scope.init= function () {
            console.log('dataCore component init');
        };

        this.items = $http.get(config.developmentDbUrl+'activity_un_search')
            .success(function(data, status, headers, config) {
                console.log("dataCore: success get all activities", data);
            })
            .error(function(data, status, headers, config) {
                console.log("error get all activities")
            });

        //this.getActivities=function() {
        //
        //    console.log("config", config.developmentDbUrl);
        //
        //    return $http.get(config.developmentDbUrl+'activity_un_search')
        //        .success(function(data, status, headers, config) {
        //            //console.log("dataCore: success get all activities", data);
        //        })
        //        .error(function(data, status, headers, config) {
        //            //console.log("error get all activities")
        //        });
        //
        //    //return [{activity: 'activity1'}, {activity: 'activity2'}];
        //}

    }]);