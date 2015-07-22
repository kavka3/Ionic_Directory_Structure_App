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

                dataCtrl.items.then(function(data){
                    scope.init(data.data.data);
                });

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

        $scope.init= function (activities) {

            console.log(activities)
            //var deferred = $q.defer();

            $scope.activities=activities;
            $scope.activities.splice(5, 38);
        };

        $scope.cardSwipedLeft= function(index) {
            console.log("card "+index+" swiped left ");
            //$scope.addCard();
        };

        $scope.cardSwipedRight= function(index,id) {
            console.log("card "+index+" swiped right ");
        };

        $scope.cardDestroyed = function(index) {
            $scope.activities.splice(index, 1);
            console.log("activities", $scope.activities);
        };

        //$scope.addCard = function() {
        //    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        //    newCard.id = Math.random();
        //    $scope.cards.push(angular.extend({}, newCard));
        //};

        $scope.openActivity=function(id){
            $scope.onactivitydetail({id:id});
        };

    }]);