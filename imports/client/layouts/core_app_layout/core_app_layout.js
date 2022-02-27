/*
 * This is the core_app_layout main window, and also the only displayed page after the user has logged-in.
 */
import '/imports/client/components/message/message.js';
import '/imports/client/components/main_tabs/main_tabs.js';
import './core_core_app_layout.html';

Template.core_app_layout.onCreated( function(){
    const self = this;
    console.log( 'Template.core_app_layout.onCreated()' );
});

Template.core_app_layout.onRendered( function(){
    const self = this;
    console.log( 'Template.core_app_layout.onRendered()' );

    // some code because the account-ldap package doesn't provide any sign-out hook
    /*
    self.autorun(() => {
        if( !Meteor.userId()){
            Session.set( 'currentUser', null );
            FlowRouter.go( '/' );
        }
    });
    */

    // if we do not have any data context, and a user is logged-in, then defaults to 'targets'
    /*
    self.autorun(() => {
        if( Meteor.userId()){
            const o = Session.get( 'layoutContext' );
            if( !o || !o.tab ){
                FlowRouter.go( '/targets' );
            }
        }
    });
    **/
});

Template.core_app_layout.helpers({
    // get back data passed from the router through BlazeLayout as a 'layoutContext' object
    // see /imports/startup/client/routes.js
    getLayoutContext( o ){
        console.log( 'Template.core_app_layout.helpers.getLayoutContext() %o', o );
        Session.set( 'layoutContext', o );
    }
});

Template.core_app_layout.onDestroyed( function(){
    const self = this;
    console.log( 'Template.core_app_layout.onDestroyed()' );
});
