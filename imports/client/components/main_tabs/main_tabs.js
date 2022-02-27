/*
 * Display the main tabs when a user is logged-in.
 * The 'app_layout' make sure we only use this component if a user is logged-in.
 */
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
//import '/imports/client/components/admin_tab/admin_tab.js';
import '/imports/client/components/dyn_tab/dyn_tab.js';
import '/imports/client/components/plugins_tab/plugins_tab.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './main_tabs.html';

Template.main_tabs.onCreated( function(){
    const self = this;
    console.log( 'Template.main_tabs.onCreated()' );

    self.adomong = {
        // these tabs are always displayed
        tabs: [
            { id: 'plugins', label: 'Plugins', route: '/plugins', component: 'plugins_tab' }
        ],
        dyntabs: new ReactiveVar( null ),
        dynready: new ReactiveVar( false ),
        dynInitialTab: new ReactiveVar( null )
    };
});

Template.main_tabs.onRendered( function(){
    const self = this;
    console.log( 'Template.main_tabs.onRendered()' );

    // add a tab for each loaded plugin
    self.autorun(() => {
        let array = self.adomong.tabs;
        Meteor.call( 'listPlugins', ( err, list ) => {
            if( err ){
                console.log( err );
            } else {
                //console.log( data );
                list.forEach(( o ) => {
                    array.push({ id: Random.id( 8 ), label:o.name, route:'#', component: 'dyn_tab', type: 'dynPlugin', origId: o.name });
                })
                self.adomong.dyntabs.set( array );
                self.adomong.dynready.set( true );
                //console.log( array );
            }
        });
    });

    // setup the currently active tab
    //  (but only when we have got the 'listPlugins' method result)
    self.autorun(() => {
        if( self.adomong.dynready.get()){
            const context = Session.get( 'layoutContext' ) || { tab: 'plugins' };
            self.adomong.dynInitialTab.set( context.tab );
        }
    });

    // initialize tabs
    //  (but only when we have got the initial active tab above)
    self.autorun(() => {
        const dynInitialTab = self.adomong.dynInitialTab.get();
        if( dynInitialTab ){
            $( '.c-main-tabs' ).ITabbed({
                tab: dynInitialTab
            });
        }
    });
});

Template.main_tabs.helpers({
    // set the header 'active' if the tab is displayed
    tabActive( it ){
        const self = Template.instance();
        const dynInitialTab = self.adomong.dynInitialTab.get();
        //return dynInitialTab === it.id ? 'active' : '';
        return '';
    },
    // returns the list of tabs
    tabItems(){
        const self = Template.instance();
        const tabs = self.adomong.dyntabs.get();
        console.log( tabs );
        return tabs;
    }
});

Template.main_tabs.onDestroyed( function(){
    const self = this;
    console.log( 'Template.main_tabs.onDestroyed()' );
});
