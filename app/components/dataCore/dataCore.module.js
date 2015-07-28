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
        self.currentActivities={items:[]};

        $scope.init= function () {
            console.log('dataCore component init');

            $http.get(config.developmentDbUrl+'activity_un_search')
                .success(function(data, status, headers, config) {
                    console.log("dataCore: success get all activities", data);
                    self.items= _.first(data.data,3);//  data.data;
                    //self.loadNext();
                })
                .error(function(data, status, headers, config) {
                    console.log("error get all activities")
                });
        };

        this.slice=function(index){
            self.items.slice(index,1);
        }

        //this.loadNext=function(){
        //
        //    if(_.isEmpty(self.currentActivities.index)){
        //        if(self.items.length>5)
        //        {
        //            self.items.find(function(e,i,arr){
        //                if(i<5)
        //                    self.currentActivities.items.push(e);
        //            });
        //        }
        //        else
        //        {
        //            self.currentActivities=self.items;
        //        }
        //        self.currentActivities.index=0;
        //    }
        //    else{
        //        self.currentActivities=[];
        //        var cnt=0;
        //        self.items.find(function(e,i,arr){
        //            if(self.currentActivities.index<i && cnt<5){
        //                self.currentActivities.items.push(e);
        //                cnt++;
        //            }
        //        });
        //    }
        //}

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