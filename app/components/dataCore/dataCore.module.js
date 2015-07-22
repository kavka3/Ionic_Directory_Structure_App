/**
 * Created by oleg on 6/30/2015.
 */

angular.module('dataCore', ['discoverActivities','activityDetails'])

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
    .controller('dataController',['$scope','$http','config','$q',function($scope,$http,config,$q){
            var self=this;
            this.items=[];

            $scope.init= function () {
                console.log('dataCore component init');

                $http.get(config.developmentDbUrl+'activity_un_search')
                    .success(function(data, status, headers, config) {
                        console.log("dataCore: success get all activities", data);
                        self.items=data.data;
                    })
                    .error(function(data, status, headers, config) {
                        console.log("error get all activities")
                    });


                //return q.promise();
            };

            //this.items = $http.get(config.developmentDbUrl+'activity_un_search')
            //    .success(function(data, status, headers, config) {
            //        console.log("dataCore: success get all activities", data);
            //        $scope.items=data;
            //    })
            //    .error(function(data, status, headers, config) {
            //        console.log("error get all activities")
            //    });

            //this.getActivity=function(id){
            //    var items = $scope.items.data;
            //    for(var i=0; i<items.length; i++)
            //    {
            //        if(items[i]._id==id)
            //        {
            //            return items[i];
            //        }
            //    }
            //}

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