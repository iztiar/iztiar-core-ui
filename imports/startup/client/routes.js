/*
 * /imports/startup/client/routes.js
 */
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/client/layouts/core_app_layout/core_app_layout.js';

// at the moment, no login
/*
function checkLoggedIn(){
    if( !Meteor.userId()){
        FlowRouter.go( '/' );
    }
};
*/

// Set up all routes in the app
FlowRouter.route( '/', {
    action(){
        BlazeLayout.render( 'core_app_layout', {});
    }
});
/*
FlowRouter.route( '/plugins', {
    //triggersEnter: [ checkLoggedIn ],
    action(){
        BlazeLayout.render( 'app_layout', { layoutContext: {
            tab: 'plugins'
        }});
    }
});
*/

// A catch-all route which redirects to /
FlowRouter.route( '*', {
    action(){
        FlowRouter.go( '/' );
    },
});
