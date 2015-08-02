/**
 * Created by Pedro on 5/26/2015.
 */

angular.module('starter.services',[])

    .factory('User', function($http, $ionicLoading, $cordovaToast){

        //qvar URL = 'https://vast-plains-3834.herokuapp.com';
        var URL = BASE_URL;

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

                        $cordovaToast.showLongTop('We`re having some issues..');
                        $cordovaToast.showLongBottom('Please try again later :)');
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
