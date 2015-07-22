/**
 * Created by oleg on 6/29/2015.
 */
    angular.module('config', [])
    .constant('config', {
        push: {
            ios: {
                badge: true,
                sound: true,
                alert: true
            },
            android: {
                "senderID": "59336322951"
            }
        },
        senderID:'59336322951',
        fbAppId:'466269356751173',
        productionDbUrl:'https://salty-peak-2515.herokuapp.com/',
        developmentDbUrl:'https://floating-depths-2240.herokuapp.com/'
    });