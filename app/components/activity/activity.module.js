/**
 * Created by oleg on 6/30/2015.
 */

angular.module('activity', [])

    .directive('activity',function(){
        return {
            'require':'^data',
            'restrict':'E',
            'scope':{
                onactivitydetailsinit:'&onactivitydetailsinit'
            },
            'transclude':false,
            'controller':'activityController',
            'templateUrl':'./app/components/activity/activity.view.html',
            'link':function(scope,element,attrs,dataCtrl){
                //scope.init();
                scope.onactivitydetailsinit({scope:scope});
            }
        }

    })
    .controller('activityController',['$scope',function($scope){

        $scope.init= function () {
            console.log('activity component init');
        };

        $scope.loadactivity=function(id){
            console.log("load activity",id)
            alert(id);  //do something
        };

    }]);