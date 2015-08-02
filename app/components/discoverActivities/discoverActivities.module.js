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
                scope.ondiscoveractivitiesinit({scope:scope});
            }
        }

    })
    .controller('discoverController',['$scope',function($scope){

        $scope.activities=[];

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

            //$scope.dataCore.items.splice(index,1);

            $scope.dataCore.currentActivities.items.splice(index,1);

            if (index==1){
                $scope.dataCore.loadNext();
            }




            //console.log("index",index);
            //console.log("before slice", $scope.dataCore.items);
            //$scope.dataCore.items.splice(index, 1);
            ////$scope.dataCore.splice(index);
            //console.log("after slice", $scope.dataCore.items);
        };

        $scope.openActivity=function(activity){
            $scope.onactivitydetail({activity:activity});
        };

    }]);