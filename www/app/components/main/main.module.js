/**
 * Created by oleg on 6/30/2015.
 */

angular.module('main', ['dataCore'])

    .directive('main',function(){
        return {
            'restrict':'E',
            'scope':{

            },
            'transclude':false,
            'controller':'mainController',
            'templateUrl':'./app/components/main/main.view.html',
            'link':function(scope,element,attrs){
                scope.init();
            }
        }

    })
    .controller('mainController',['$scope',function($scope){

        $scope.init= function () {
            console.log('main component init');
        };

        $scope.ondiscoveractivitiesinit=function(discoverActivities){
            console.log("discover activities init");
            $scope.discoverActivities=discoverActivities;
        }

        $scope.onactivitydetailsinit=function(activityDetails){
            console.log("activity details init");
            $scope.activityDetails=activityDetails;
        }

        $scope.onactivitydetail=function(id){
            $scope.activityDetails.loadactivity(id);
        }

    }]);