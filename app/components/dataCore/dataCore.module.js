/**
 * Created by oleg on 6/30/2015.
 */

angular.module('dataCore', ['discoverActivities','activityDetails','activities'])

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
    .controller('dataController',['$scope','$http','config','$q','User','ActivityService','MyActivitiesService','Location','ChatsService','DBChats','DBA','DB_CONFIG','TimeService',function($scope,$http,config,$q,User,ActivityService,MyActivitiesService,Location,ChatsService,DBChats,DBA,DB_CONFIG,TimeService){
        var self=this;
        this.items=[];
        self.currentActivities={items:[]};

        $scope.init= function () {
            console.log('dataCore component init');

            $http.get(config.developmentDbUrl+'activity_un_search')
                .success(function(data, status, headers, config) {
                    console.log("dataCore: success get all activities", data);
                    self.items= data.data;
                    self.loadNext();
                })
                .error(function(data, status, headers, config) {
                    console.log("error get all activities")
                });
        };

        this.slice=function(index){
            self.items.slice(index,1);
        };

        this.loadNext=function(){

            if(_.isEmpty(self.currentActivities.items)){
                if(self.items.length>5) {
                    self.currentActivities.items = _.filter(self.items,function(item,index){
                        return index<5;
                    });
                    self.currentActivities.index=4;
                    console.log("items current activities",self.currentActivities.items)
                }
                else
                {
                    self.currentActivities=self.items;
                    self.currentActivities.index=self.items.length-1;
                }
            }
            else{
                self.currentActivities.items=_.union(_.filter(self.items,function(item,index){
                    return index>self.currentActivities.index && index <= self.currentActivities.index+4;
                }),self.currentActivities.items);
                self.currentActivities.index+=4;

                console.log("union ",self.currentActivities.items)

                //var cnt=0;
                //self.items.find(function(e,i,arr){
                //    if(self.currentActivities.index<i && cnt<5){
                //        self.currentActivities.items.push(e);
                //        cnt++;
                //    }
                //});

                console.log("successsssssss");
            }
        };

        this.User=User;

        this.MyActivitiesService = MyActivitiesService;

        this.ActivityService=ActivityService;

        this.Location = Location;

        this.ChatsService = ChatsService;

        this.DBChats = DBChats;

        this.DBA = DBA;

        this.DB_CONFIG = DB_CONFIG;

        this.TimeService = TimeService;
    }])

    .factory('User', function($http, $ionicLoading, $cordovaToast,config){

        var URL = config.developmentDbUrl;

        var profile = {
            name:'user',
            _id:'526139373'
        };

        return {
            signIn: function(dataObj) {
                console.log('before login', dataObj);
                var request = $http.post(URL+'signIn', dataObj)
                    .success(function(data, status, headers, config){
                        //console.log('signIn response',data, status);
                        //$ionicLoading.hide();
                        profile = data.data;
                        return data;
                    })
                    .error(function(data, status, headers, config) {
                        console.log( "signin failure message: ", data, status);

                        if(window.cordova) {
                            $cordovaToast.showLongTop('We`re having some issues..');
                            $cordovaToast.showLongBottom('Please try again later :)');
                        }
                        //$ionicLoading.hide();
                    });
                return request;
            },
            getProfile: function() {
                return profile;
            },
            get: function(field) {
                return profile[field];
            },
            update: function(dataObj) {
                console.log('userObj' , dataObj);
                return $http.post(URL+'user_update', dataObj)
                    .success(function(data, status, headers, config){
                        console.log('user update success', data);
                        return data;
                    })
                    .error(function(data, status, headers, config) {
                        alert( "failure message: " + JSON.stringify({data: data}));
                    });
                //return request;
                //return profile[field];
            }
        };
    })

    .factory('MyActivitiesService', function($http, $ionicLoading, $filter, $rootScope, ActivityService, config) {

    // Might use a resource here that returns a JSON array
    var baseURL = config.developmentDbUrl;;

    var new_activity = {
        id: ''
    };

    // Some fake testing data
    var myActivities = [];

    return {
        getAll: function(userId) {
            //$ionicLoading.show({
            //    template: 'Loading Activities...',
            //    noBackdrop: true
            //});
            return $http.get(baseURL+'activity_un_search?criteria=joinedUsers&value='+userId).then(function(response) {
                console.log('Get my activities', response);
                myActivities = response.data.data;
                myActivities = response.data.result == 'error' ? [] : myActivities;
                //$ionicLoading.hide();
                return response;
            }, function(error) {
                console.error('ERR', error);
            });
        },

        getById: function(activityId){
            return $http.get(baseURL+'activity_un_search?criteria=_id&value='+activityId)
                .success(function(response) {
                    console.log('MyactivitiesService - get activity - ' + response.data.result);
                })
                .error(function(error) {
                    console.error('MyActivitiesService - get activity - Error', error);
                });
        },
        get: function(activityId) {
            /*return $http.get(baseURL+'/activity_un_search?criteria=_id&value='+activityId).then(function(response) {
             console.log('Get activityInfo', response);
             return response.data.data[0];
             }, function(error) {
             console.error('ERR', error);
             });*/
            return ($filter('filter')(myActivities, activityId))[0];
        },
        post: function(dataObj){
            var activity = ActivityService.get(dataObj.activityId);
            var askToJoin = activity.isApprovalNeeded;
            askToJoin = false;
            if(askToJoin){
                dataObj.addressee = activity.creator;
                console.log(dataObj);
                $ionicLoading.show({template: 'Joining Activity..'});
                return $http.post(baseURL + 'like_activity', dataObj)
                    .success(function (data, status, headers, config) {
                        console.log('join activity success', data);
                        $ionicLoading.hide();
                        myActivities.push(data.activity);
                        return data;
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        console.log("failure message: ", data);
                    });
                return;
            }
            else {
                $ionicLoading.show({template: 'Joining Activity..'});
                return $http.post(baseURL + 'user_join_activity', dataObj)
                    .success(function (data, status, headers, config) {
                        console.log('join activity success', data);
                        console.log('myActivities', myActivities, data.activity);
                        $ionicLoading.hide();
                        myActivities.push(data.activity);
                        return data;
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        console.log("failure message: ", data);
                    });
            }
        },
        update: function(dataObj){
            //console.log(dataObj);
            //return;
            return $http.post(baseURL+'activity_update', dataObj)
                .success(function(data, status, headers, config){
                    console.log('Update activity success', data);
                    return data;
                })
                .error(function(data, status, headers, config) {
                    console.log( "Update activity failure message: ", data);
                });
        },
        updateImage: function(dataObj){
            //console.log(dataObj);
            //return;
            return $http.post(baseURL+'update_image', dataObj)
                .success(function(data, status, headers, config){
                    console.log('Update activity success', data);
                    return data;
                })
                .error(function(data, status, headers, config) {
                    console.log( "Update activity failure message: ", data);
                });
        },
        leave: function(dataObj){
            console.log(dataObj);
            $ionicLoading.show({template: 'Leaving Activity..'});
            return $http.post(baseURL+'user_leave_activity', dataObj)
                .success(function(data, status, headers, config){
                    console.log('Leave activity success', data);
                    $ionicLoading.hide();
                    var i;
                    for(i=0;i<myActivities.length;i++){
                        if(myActivities[i]._id == data.data._id) {
                            myActivities.splice(i, 1);
                            return;
                        }
                    }
                    return data;
                })
                .error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log( "failure message: ", data);
                });
        },
        deleteMember: function(dataObj){
            console.log(dataObj);
            $ionicLoading.show({template: 'Leaving Activity..'});
            return $http.post(baseURL+'deleted_member_from_activity', dataObj)
                .success(function(data, status, headers, config){
                    console.log('Leave activity success', data);
                    $ionicLoading.hide();
                    var i;

                    return data;
                })
                .error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log( "failure message: ", data);
                });
        },
        delete: function(dataObj){
            $ionicLoading.show({template: 'Leaving Activity..'});
            return $http.post(baseURL+'remove_activity', dataObj)
                .success(function(data, status, headers, config){
                    console.log('Delete activity success', data);
                    $ionicLoading.hide();
                    return data;
                })
                .error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log( "failure message: ", data);
                });
        }
    }
})

    .factory('ActivityService', function($http, $q, $ionicLoading, $filter, $cordovaToast, $rootScope,config) {

        var baseURL = config.developmentDbUrl;

        var activity = {};
        var activities = [];

        return {
            getAll: function(dataObj) {
                console.log(dataObj);
                $ionicLoading.show({
                    template: 'Finding Nearby Activities..'
                });

                return $http.get(baseURL+'discover_activities?userId='+dataObj.userId+'&long='+dataObj.coords.longitude+'&lat='+dataObj.coords.latitude)
                    .success(function (data, status, headers, config) {
                        console.log('Get nearby activities',data);
                        $ionicLoading.hide();
                        activities = data.data;
                        return data;
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        console.log("ActivityService - Discover activities - Error", status);
                    })
            },
            getById:  function(activityId) {
                console.log(activityId);
                $ionicLoading.show({
                    template: 'Finding Nearby Activities..'
                });
                return $http.get(baseURL+'activity_un_search?criteria=_id&value='+activityId)
                    .success(function (resAct, status, headers, config) {
                        console.log('Get activity',resAct.data.data);
                        $ionicLoading.hide();
                        //activities = data.data;
                        return resAct.data.data;
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        console.log("ActivityService - activity_un_search - Error", status);
                    })
            },
            get: function(id) {
                return ($filter('filter')(activities, id))[0];
            },
            post: function(dataObj) {
                console.log('before submit', dataObj);
                $ionicLoading.show({
                    template: 'Creating Activity..'
                });
                return $http.post(baseURL+'create_activity', JSON.stringify(dataObj))
                    .success(function(data, status, headers, config){
                        $ionicLoading.hide();
                        console.log('ActivityService - Create activity response', data);
                        if(data.result == "success") {
                            console.log('ActivityService - Create activity response - Success', data);
                            activity = data.activity;
                            if(window.cordova)
                                $cordovaToast.showLongBottom('Activity was successfully created');
                        }
                        else {
                            console.log('ActivityService - Create activity response - Error', data);
                            if (window.cordova)
                                $cordovaToast.showLongBottom('Error', data.data);
                        }
                        return activity;
                    })
                    .error(function(data, status, headers, config) {
                        console.log("ActivityService - Create_activity - Error", status);
                    });
            },
            update: function(dataObj) {

                console.log("Activity Service upload image before post ",dataObj);

                $ionicLoading.show({
                    template: 'Updating Activity..'
                });
                return $http.post(baseURL+'activity_update', JSON.stringify(dataObj))
                    .success(function(data, status, headers, config){
                        console.log('Update activity success', data);
                        $ionicLoading.hide();
                        activity = data.activity;
                        return activity;
                    })
                    .error(function(data, status, headers, config) {
                        console.log("ActivityService - Activity_update - Error", status);
                    });
            },
            getLocation: function(){
                return activity.location;
            }
        }
    })

    .factory('Location', function ($rootScope, $q, $timeout, $cordovaGeolocation, $cordovaToast) {

        var bestPracticeOptions = {enableHighAccuracy: true, maximumAge:3000, timeout: 5000};
        var posOptions = {timeout: 5000, enableHighAccuracy: true};
        var watchOptions = { timeout : 5000, enableHighAccuracy: false, maximumAge: 3000 }; // may cause errors if true
        var watch;

        var currentPositionCache;
        var myPosition;

        return {
            getPosition: function () {
                if (!currentPositionCache) {
                    var deffered = $q.defer();
                    navigator.geolocation.getCurrentPosition(function (position) {
                        deffered.resolve(currentPositionCache = position.coords);
                        $timeout(function () {
                            currentPositionCache = undefined;
                        }, 10000);
                    }, function () {
                        //if(window.cordova) {
                        //    $cordovaToast.showLongBottom('Geolocation error');
                        //    $cordovaToast.showLongBottom('Please Make sure your Location service is turned on');
                        //}
                        deffered.reject();
                    });
                    return deffered.promise;
                }
                return $q.when(currentPositionCache);
            },
            getUserPosition: function () {
                if (!myPosition) {
                    console.log(navigator.geolocation);
                    var deffered = $q.defer();
                    navigator.geolocation.getCurrentPosition(function (position) {
                        deffered.resolve(currentPositionCache = position.coords);
                        $timeout(function () {
                            currentPositionCache = undefined;
                        }, 10000);
                        myPosition = position.coords;
                        console.log('geolocation success geolocation success geolocation success geolocation success', JSON.stringify(position));
                    }, function (response) {
                        //if(window.cordova) {
                        //    $cordovaToast.showLongBottom('Geolocation error');
                        //    $cordovaToast.showLongBottom('Please Make sure your Location service is turned on');
                        //}
                        console.log('geolocation error geolocation error geolocation error geolocation error', JSON.stringify(response));
                        deffered.reject();
                    });
                    return deffered.promise;
                }
                return $q.when(myPosition);
            },
            saveUserPosition: function(position){
                myPosition = position;

                $rootScope.userLocation = position;
            },
            //getPosition: function(){
            //    var location = $q.defer();
            //    $cordovaGeolocation
            //        .getCurrentPosition()
            //        .then(function (position) {
            //            myPosition = position;
            //            $rootScope.myPosition = position;
            //            location.resolve(position.coords);
            //            console.log('LocationService - getPosition', position.coords);
            //        }, function(err) {
            //            console.log("error:", JSON.stringify(err));
            //            //$cordovaToast.showLongBottom('Geolocation error');
            //        });
            //    return location.promise;
            //},
            watchPosition: function($myLocation,callback){
                var location = $q.defer();

                watch = $cordovaGeolocation.watchPosition(watchOptions);
                watch.then(
                    null,
                    function(err) {
                        // error
                    },
                    function (position) {
                        myPosition = position;
                        callback(i++, position.coords);
                        location.resolve(position.coords);
                        console.log('updated location service', position);

                        //return position.coords;
                    });
                return location.promise;
            },
            clearWatch: function(){
                watch.clearWatch();
                // OR
                //$cordovaGeolocation.clearWatch(watch)
                //    .then(function(result) {
                //        console.log('cleared watch');
                //    }, function (error) {
                //        // error
                //    });
            },
            getMyPosition: function() {
                return myPosition;
            },
            getDistanceFrom: function(latlngA, latlngB, minDistance){
                var m = minDistance;
                var R = 6371; // Radius of the earth in km
                var dLat = (latlngB.lat-latlngA.lat)*(Math.PI/180);  // Javascript functions in radians
                var dLon = (latlngB.lon-latlngA.lon)*(Math.PI/180);
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(latlngA.lat*(Math.PI/180)) * Math.cos(latlngB.lat*(Math.PI/180)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c; // Distance in km
                //d = (d*1000).toFixed(0);

                d = m ? d < m ? m : d : d;

                d = d >= 1 ? ( d > 10 ? d.toFixed(0) + 'km': d.toFixed(1) + 'km' ) : (d*1000).toFixed(0) + 'm';
                console.log('minimum', m);
                return d;
                //return (d*1000).toFixed(0);
            }
        }
    })

    .factory('ChatsService', function($rootScope, $q, $filter, $window, User, DBChats){

        var chats = [], //TODO: use ionic collection
            newMessages_Chats = [];
        var find = function(field,value) {
            var i, len = chats.length;
            for (i = 0; i < len; i++) {
                var d = chats[i];
                if (d && d[field] === value) {
                    return i;
                }
            }
            return -1;
        };
        var findMessage = function(chatId, field, value) {
            console.log('ddd', chats[chatId]);
            if(chats[chatId] && chats[chatId].messages) {
                var i, len = chats[chatId].messages.length;
                for (i = 0; i < len; i++) {
                    var d = chats[chatId].messages[i];
                    if (d && d[field] === value) {
                        return i;
                    }
                }
            }
            return -1;
        };
        //new version after added SQL
        var isNewMessages = function(chats){
            var i, len = chats.length, isNew = false;
            for (i = 0; i < len; i++) {
                var d = chats[i].messages;
                if(d) {
                    var dw = d.length || 0;
                    if (dw && dw > 0) {
                        newMessages_Chats.push(chats[i]['chatId']);
                        isNew = true;
                    }
                }
            }

            return isNew;
        };

        var clearNewMessage = function(chatId){
            console.log('CHATSERVICE: clear new message', chatId);
            var index = newMessages_Chats.indexOf(chatId);
            if(index > -1){
                newMessages_Chats.splice(index, 1);
            }
            $rootScope.newMessages = false;
            $rootScope.clearChatBubble = chatId;
        };

        var newMessages = function(){
            var i, len = chats.length;
            for (i = 0; i < len; i++) {
                var d = chats[i].messages;
                if(d) {
                    var dw = d.length || 0;
                    if (dw && dw > 0) {

                        return true;
                    }
                }
            }

            return false;
        };
        var addMessage = function(message, isLog){
            var userId = User.get('_id');
            console.log('ChatService addMessage: got message', message);
            if(message.notForCreator && message.notForCreator.notForCreator){
                if(message.notForCreator.activityCreator == userId){ return; }
            }
            if(message.notForCreator && message.notForCreator.notForOthers){
                if(message.notForCreator.activityCreator != userId){console.log('CHatService: not for others'); return; }
            }
            var index = find('chatId', message.chatId);
            if(index != -1){
                console.log(message.creator, User.get('_id'), message.creator == User.get('_id'));
                if(message.creator != userId && !isLog){
                    $rootScope.newMessages = message;
                }
                var exist = find('message',message._id);
                if(exist == -1) {
                    chats[index].messages = chats[index].messages ? chats[index].messages : [];

                    //exist = findMessage(index, 'messageText',message.messageText);

                    //if(exist!=-1) {
                    //    console.log('messageTextmessageText', exist);
                    //    chats[index].messages[exist].loading = false;
                    //}
                    DBChats.addMessage(message);
                    chats[index].messages.push(message);
                    $rootScope.scrollDown = message._id;
                }
            }
            else if(isLog){
                DBChats.addMessage(message);
            }
        };
        var removeChat = function(chatId){
            for(var i = chats.length - 1; i >= 0; i--){
                if(chats[i].chatId == chatId){
                    chats.splice(i,1);
                }
            }
        };

        return {
            /* init: function() {
             chats = JSON.parse($window.localStorage['chats']);
             chats = chats === undefined ? [] : chats;
             console.log('chatschatschatschatschats',chats);
             },*/
            setForResume: function(data){
                var isFinished = $q.defer();
                console.log('IN SET CHATS');
                DBChats.addAllMessages(data)
                    .then(function(isConnected){
                        console.log('CHATS RESUME CONNECTED:  ', isConnected);
                        DBChats.getLocalChats()
                            .then(function(chatRes){
                                chats = chatRes;
                                isFinished.resolve(true);
                            });
                    });

                return isFinished.promise;

                //$window.localStorage['chats'] = JSON.stringify(data);
                //return newMessages();
            },
            set: function(data){
                //chats = data;
                console.log('IN SET CHATS');
                DBChats.addAllMessages(data)
                    .then(function(isConnected){
                        console.log('CHATS CONNECTED:  ', isConnected);
                    });
                DBChats.getLocalChats()
                    .then(function(chatRes){
                        chats = chatRes;
                    });
                return isNewMessages(data);

                //$window.localStorage['chats'] = JSON.stringify(data);
                //return newMessages();
            },
            addChat: function(data) {
                DBChats.addChat(data.chatId);
                chats.push(data);
                console.log('IN ADD CHAT', data, chats);
                return isNewMessages(data);/*newMessages();*/
            },
            add: addMessage,
            getAll: function(){ return chats; },
            remove: function(chatId) {
                removeChat(chatId);
                /*$rootScope.newMessages = newMessages();
                 console.log('chatschatschats' , chats, $rootScope.newMessages);*/
            },
            get: function(chatId) {
                var chat = $q.defer();
                for (var i = 0; i < chats.length; i++){
                    if (chats[i].chatId === chatId) {
                        console.log('ChatService - get Chat', chatId);
                        chat.resolve(chats[i]);
                        var index = newMessages_Chats.indexOf(chatId);
                        if(index > -1){ newMessages_Chats.splice(index, 1); }
                    }
                }
                chat.resolve(null);
                return chat.promise;

            },
            newMessages_Chats: newMessages_Chats,
            clearNewMessage: clearNewMessage
        }
    })

    .factory('DBChats', function($cordovaSQLite, $q, filterFilter, DBA, User){
        var self = this;

        /* function createChatObj(chats){
         var chatsObj = {};
         for(var i = 0; i < chats.length; i++){

         }
         };*/

        self.getAllChats = function(){
            return DBA.query("SELECT chatId FROM chatList")
                .then(function(result){
                    if(result && (result.length =! null)){
                        return DBA.getAll(result);
                    }
                    return null;
                });
        };

        self.getAllMessages = function(){
            return DBA.query("SELECT chatId, creator, messageTime, messageText, messageType, userName FROM chatsMessages")
                .then(function(result){
                    return DBA.getAll(result);
                });
        };

        self.getLocalChats = function() {
            var chats = [];
            return self.getAllChats()
                .then(function (chatRes) {
                    chats = chatRes;
                    return self.getAllMessages()
                        .then(function (msgRes){
                            var messages = msgRes,
                                chatObjectArr = [],
                                i = 0, length = chats.length;
                            for(; i < length; i++){
                                var chat = filterFilter(messages, {chatId: chats[i]['chatId'] });
                                chatObjectArr.push({chatId: chats[i]['chatId'], messages: chat});
                            }

                            return chatObjectArr;
                        })
                });
        };

        self.getMessage = function(chatId) {
            var parameters = [chatId];
            return DBA.query("SELECT chatId, creator, messageTime, messageText, messageType, userName FROM chatsMessages WHERE chatId = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                });
        };

        self.addMessage = function(msg) {
            var parameters = [msg._id, msg.chatId, msg.creator, msg.messageTime, msg.messageText, msg.messageType, msg.userName];
            return DBA.query("INSERT INTO chatsMessages (_id, chatId, creator, messageTime, messageText, messageType, userName) VALUES (?,?,?,?,?,?,?)", parameters);
        };

        self.addChat = function(chatId){
            var parameters = [chatId];
            return DBA.query("INSERT INTO chatList (chatId) VALUES (?)", parameters);
        };

        self.addAllMessages = function(chats){
            var isSet = $q.defer();
            var userId = User.get('_id');
            self.getAllChats()
                .then(function(chatList){
                    for(var i = 0; i < chats.length; i++){
                        if(chats[i]['messages'] && chats[i]['messages'].length > 0){
                            for(var j = 0; j < chats[i]['messages'].length; j++){
                                if(chats[i]['messages'][j].notForCreator && chats[i]['messages'][j].notForCreator.notForCreator){
                                    if(chats[i]['messages'][j].notForCreator.activityCreator == userId){ continue; }
                                }
                                if(chats[i]['messages'][j].notForCreator && chats[i]['messages'][j].notForCreator.notForOthers){
                                    if(chats[i]['messages'][j].notForCreator.activityCreator != userId){
                                        console.log('CHatService: not for others'); continue;
                                    }
                                }
                                chats[i]['messages'][j]['chatId'] = chats[i]['chatId'];
                                self.addMessage(chats[i]['messages'][j]);
                            }
                        }
                        var ifChat = (chatList.filter(function(chat){ return chat.chatId == chats[i]['chatId']; }));
                        if(!ifChat || ifChat.length == 0){ self.addChat(chats[i]['chatId']); }
                    }
                    isSet.resolve(true);
                });
            return isSet.promise;
        };

        /*self.remove = function(member) {
         var parameters = [member.id];
         return DBA.query("DELETE FROM team WHERE id = (?)", parameters);
         }*/

        /*self.update = function(origMember, editMember) {
         var parameters = [editMember.id, editMember.name, origMember.id];
         return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
         }*/

        return self;
    })

    .factory('DBA', function($cordovaSQLite, $q, $ionicPlatform, DB_CONFIG) {
        var self = this;

        // Handle query's and potential errors
        self.query = function (query, parameters) {
            parameters = parameters || [];
            var q = $q.defer();

            $ionicPlatform.ready(function () {
                $cordovaSQLite.execute(db, query, parameters)
                    .then(function (result) {
                        q.resolve(result);
                    }, function (error) {
                        console.warn('I found an error');
                        console.warn(error);
                        q.reject(error);
                    });
            });
            return q.promise;
        };

        //init tables
        self.init = function(){
            //var remove = 'DROP TABLE IF EXISTS chatsMessages';
            // self.query(remove);
            // var remove2 = 'DROP TABLE IF EXISTS specialData';
            // self.query(remove2);
            //
            // var remove1 = 'DROP TABLE IF EXISTS notifications';
            // self.query(remove1);
            // var remove3 = 'DROP TABLE IF EXISTS notificationList';
            // self.query(remove3);
            //
            // var remove4 = 'DROP TABLE IF EXISTS updateMsg';
            //self.query(remove4);
            //var remove5 = 'DROP TABLE IF EXISTS chatList';
            //self.query(remove5);

            angular.forEach(DB_CONFIG.tables, function(table) {
                var columns = [];

                angular.forEach(table.columns, function(column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                self.query(query);
                console.log('Table ' + table.name + ' initialized');
            });
        };

        // Process a result set
        self.getAll = function(result) {
            var output = [];
            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        }

        // Process a single result
        self.getById = function(result) {
            var output = null;
            output = angular.copy(result.rows.item(0));
            return output;
        }

        return self;
    })

    .factory('TimeService', function() {

        moment.locale('en', {
            calendar : {
                lastDay : 'DD/MM',//'[Yesterday at] HH:mm',
                sameDay : '[Today at] HH:mm',
                nextDay : 'ddd',//'[Tomorrow at] HH:mm',
                lastWeek : 'DD/MM',//'[last] dddd [at] HH:mm',
                nextWeek : 'ddd [at] HH:mm',
                sameElse : 'L'
            }
        });

        return {
            fromNow: function(date) {
                return moment(date).fromNow();
            },
            message:{
                time: function(date){
                    return moment(date).format("LT");
                }
            },
            calendar: function(date) {
                return moment(date).calendar();
            },
            getTimeRange: function(day, dayPart){
                var now = new Date();

            }
        }
    })

    .constant('DB_CONFIG', {
        name: 'db',
        tables: [
            {
                name: 'notifications',
                columns: [
                    {name: '_id', type: 'text primary key'},
                    {name: 'creator', type: 'text'},
                    {name: 'notificationType', type: 'integer'}
                ]
            },
            {
                name: 'specialData',
                columns: [
                    {name: '_id', type: 'text'},
                    {name: 'payLoad_key', type: 'text'},
                    {name: 'payLoad_value', type: 'text'}
                ]

            },
            {
                name: 'chatsMessages',
                columns: [
                    {name: '_id', type: 'text primary key'},
                    {name: 'chatId', type: 'text'},
                    {name: 'creator', type: 'text'},
                    {name: 'messageTime', type: 'text'},
                    {name: 'messageText', type: 'text'},
                    {name: 'messageType', type: 'text'},
                    {name: 'userName', type: 'text'}
                ]
            },
            {
                name: 'chatList',
                columns: [
                    {name: 'chatId', type: 'text primary key'}
                ]
            },
            {
                name: 'notificationList',
                columns: [
                    {name: '_id', type: 'text primary key'}
                ]
            },
            {
                name: 'test',
                columns: [
                    {name: 'testName', type: 'text'},
                    {name: 'testField', type: 'integer'}
                ]
            },
            {
                name: 'updateMsg',
                columns: [
                    {name: 'message', type: 'text'},
                    {name: 'canContinue', type: 'integer'},
                    {name: 'link', type: 'text'}
                ]
            },
            {
                name: 'pushConfirm',
                columns: [
                    {name: 'isAsked', type: 'integer'},
                    {name: 'isApproved', type: 'integer'}
                ]
            }
        ]
    });