/**
 * Created by oleg on 6/30/2015.
 */

angular.module('discoverActivities', ['ionic.contrib.ui.tinderCards'])

    .directive('discover',function(){
        return {
            'require':'^data',
            'restrict':'E',
            'scope':{
                ondiscoveractivitiesinit:'&ondiscoveractivitiesinit',
                onactivitydetail:'&onactivitydetail'
            },
            'transclude':false,
            'controller':'discoverController',
            'templateUrl':'./app/components/discoverActivities/discoverActivities.view.html',
            'link':function(scope,element,attrs,dataCtrl){

                scope.init(dataCtrl);

                //dataCtrl.items.then(function(data){
                //    scope.init(data.data.data);
                //});

                //dataCtrl.getActivities()
                //    .success(function(response){
                //        console.log("discoverActivities: success get all activities", response);
                //        scope.init(response.data);
                //    })
                //    .error(function(response){
                //        console.log("discoverActivities: error get all activities", response);
                //    });

                scope.ondiscoveractivitiesinit({scope:scope});
            }
        }

    })
    .controller('discoverController',['$scope',function($scope){

        $scope.init= function (dataCore) {
            console.log('discoverActivities component init',dataCore);
            $scope.dataCore=dataCore;
            //$scope.activities=activities;
            //$scope.activities.splice(5, 38);
        };

        $scope.cardSwipedLeft= function(index) {
            console.log("card "+index+" swiped left ");
        };

        $scope.cardSwipedRight= function(index,id) {
            console.log("card "+index+" swiped right ");
        };

        $scope.cardDestroyed = function(index) {
            console.log("index",index);
            console.log("before slice", $scope.dataCore.items);
            $scope.dataCore.items.slice(index, 1);
            console.log("after slice", $scope.dataCore.items);
        };

        $scope.openActivity=function(activity){
            $scope.onactivitydetail({activity:activity});
        };

    }]);