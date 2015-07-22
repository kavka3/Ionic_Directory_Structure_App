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

        $scope.showDetails=false;

        $scope.init= function () {
            console.log('main component init');
        };

        $scope.ondiscoveractivitiesinit=function(discoverActivities){
            console.log("discoverActivities init in MAIN");
            $scope.discoverActivities=discoverActivities;
        }

        $scope.onactivitydetailsinit=function(activityDetails){
            console.log("activityDetails init in MAIN");
            $scope.activityDetails=activityDetails;
        }

        $scope.onactivitydetail=function(id){
            $scope.showDetails=true;
            $scope.activityDetails.loadactivity(id);
        }

    }]);