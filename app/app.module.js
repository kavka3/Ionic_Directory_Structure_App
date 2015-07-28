/**
 * Created by oleg on 6/30/2015.
 */

require('./shared/config/config.module.js');
require('./components/activityDetails/activityDetails.module.js');
require('./components/discoverActivities/discoverActivities.module.js');
require('./components/dataCore/dataCore.module.js');
require('./components/main/main.module.js');
window._=require('underscore');

global.collide=require('./bower_components/collide/collide.js');
require('./bower_components/ionic-contrib-tinder-cards/ionic.tdcards.js');


var app=angular.module('starter', ['ionic','config','dataCore','main']);