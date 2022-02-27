/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 *
 *  Modules story:
 *  1. first choice was jQuery Tabs
 *      https://api.jqueryui.com/tabs/
 *      Cancelled as non scrollable.
 * 
 *  2. second choice has been jqxTabs
 *      Cancelled as only scrollable with non-resizable arrows
 *      https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxtabs/jquery-tabs-getting-started.htm
 * 
 *  3. next choice was scrollingTabs
 *      both scrollable and swypeable
 *      https://www.jqueryscript.net/other/jQuery-Plugin-To-Create-Responsive-Scrolling-Bootstrap-Tabs.html
 *      which is itself based on Bootstrap
 *      https://getbootstrap.com/docs/5.1/components/navs-tabs/#javascript-behavior
 *
 *  A ITabbed-able page should be built as:
 *  1. a <ul></ul> index section
 *      where each <li> item must hold
 *      > a 'data-itabbed-id' attribute which holds the item identifier
 *      > a 'data-itabbed-route' attribute which holds the target route for the tab
 *  2. the content of each item.
 * 
 *  The .ITabbed() funtion accepts one of:
 *  - an object with
 *      > a 'tab' key which specifies the tab to be activated.
 * 
 *  The DOM must be:
 * 
 *      <div>                                                   <- the parent on which the ITabbed() interface is called
 *                                                                  the interface automatically adds a 'itabbed' class on this element
 *                                                                  and defines and manages here an 'itabbed-clicked' event
 *
 *          <class='nav-tabs'>                                  <- the parent of the navigation tabs
 *                                                                  the underlying scrollingTabs() plugin is applied on this element
 * 
 *              <li>                                            <- the navigation tabs
 *                                                                  each 'li' element must have one 'a.nav-link' child
 * 
 *                  <a class='nav-link' itabbed-id='name'>      <- the navigation anchors
 *                                                                  each 'a.nav-link' must be identified by a 'itabbed-id' attribute
 * 
 *          <div>                                               <- a parent div for the panes
 * 
 *              <div class='tab-pane' id='name'>                <- the panes themselves
 *                                                                  each pane must be identified by the 'id' attribute
 * 
 *              <div class='tab-pane' id='name'>
 *      </div>
 *
 *  Properties:
 *  - tab (optional) tab identifier
 *  + all jQuery Tabs options.
 *
 *  Boilerplate from https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 */
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '/imports/client/third-party/scrollingTabs/dist/jquery.bs4-scrolling-tabs.min.css';
import '/imports/client/third-party/scrollingTabs/dist/jquery.bs4-scrolling-tabs.min.js';

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ){
	"use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    const pluginName = "ITabbed";

    // The actual plugin constructor
    function myPlugin( element, options ){
        this.name = pluginName;
        this.dom = element;
        this.$dom = $( element );
        this._init( options );
    }

    // Avoid myPlugin.prototype conflicts
    $.extend( myPlugin.prototype, {
        // plugin initialization at instanciation time
        // - set 'itabbed' class on the parent element
        // - initialize 'scrollingTabs()' plugin on the 'nav-tabs' child element
        // - install 'itabbed-clicked' handler
        _init: function( options ){
            const self = this;
            //console.log( 'ITabbed:_init() options=%o', options );
            // set a 'itabbed' class on the root element
            this.$dom.addClass( 'itabbed' );
            // initialize the 'scrollingTabs' third-party plugin
            const settings = $.extend( true, {}, $.fn[pluginName].defaults, options );
            //console.log( settings );
            this.$dom.find( '.nav-tabs' ).scrollingTabs( settings.scrollingTabsOptions );
            // the 'itabbed-clicked' event is defined as one of the plugin defaults
            this.$dom.on( 'itabbed-clicked', function( ev, o ){
                if( o && o.name ){
                    self._activate( o.name );
                }
            });
            // deal with options passed on with plugin call
            this._initialized_run( options );
        },
        // once the plugin is initialized, deal with the options
        _initialized_run: function( options ){
            console.log( 'ITabbed:_initialized_run() options=%o', options );
            this.$dom.find( '.nav-tabs' ).scrollingTabs( 'refresh' );
            if( typeof options === 'object' ){
                if( options.tab ){
                    this._activate( options.tab );
                } else {
                    console.log( 'ITabbed:initialized_run() no initial tab specified, selectionning the first one' );
                    this._activate( this._byIndex( 0 ) );
                }
            } else {
                console.log( 'ITabbed:initialized_run() ERROR options=%o while object expected', options );
            }
        },
        // activating a tab means
        //  - desactivating the previous tab
        //  - activating and showing the designated tab
        //  - go to the route
        _activate: function( name ){
            //console.log( 'ITabbed:_activate( \''+name+'\' )' );
            this.$dom.find( '.nav-link' ).removeClass( 'active' );
            this.$dom.find( '.tab-pane' ).removeClass( 'active show' );
            this.$dom.find( '.nav-link[itabbed-id='+name+']' ).addClass( 'active' );
            this.$dom.find( '.tab-pane[id='+name+']' ).addClass( 'active show' );
        },
        // return the jQuery tab at the specified index
        _byIndex: function( idx ){
            return $( this.$dom.find('.nav-link')[idx] );
        },
        // return the named tab
        _byName: function( name ){
            return this._byIndex( this._index( name ));
        },
        // select the named tab
        _go: function( name ){
            const $tab = this._byName( name );
            const route = $tab.attr( 'href' );
            FlowRouter.go( route );
        },
        // return the index of the named tab
        //  defaulting to the first tab (at index 0)
        _index: function( name ){
            const tabs = this._tabs();
            return tabs[name];
        },
        // return a hash tabid -> tabidx (marked as 'data-copter-itabbed-id')
        //  NB: only works after full initialization
        _tabs: function(){
            //console.log( 'classes='+element.attr('class'));
            let o = {}
            let idx = 0;
            this.$dom.find( '.nav-link' ).each( function(){
                const id = $( this ).attr('itabbed-id');
                o[id] = idx;
                idx += 1;
            });
            return o;
        }
    });

    // this is the actual jQuery plugin, i.e. a function attached to $.fn
    // a lightweight wrapper around the constructor, preventing against multiple instantiations
    // we attach this constructor on the DOM element to identify it as already initialized
    $.fn[pluginName] = function( options ){
        return this.each( function(){
            var _plugin = $( this ).data( pluginName );
            if( _plugin ){
                console.log( 'ITabbed: reusing already initialized plugin' );
                myPlugin.prototype._initialized_run.call( _plugin, options );
            } else {
                console.log( 'ITabbed: allocating new plugin instance' );
                $( this ).data( pluginName, new myPlugin( this, options ));
            }
        });
    };

    // define publicly overridable defaults in the same namespace that the plugin
    // default values, overridable by the user at global level
    $.fn[pluginName].defaults = {
        scrollingTabsOptions: {
            scrollToTabEdge: true,
            enableSwiping: true,
            disableArrowsOnFullyScrolled: false,
            bootstrapVersion: 4,
            tabClickHandler: function( ev ){
                // element is expected to be the .nav-link which holds the itabbed-id attribute
                const $element = $( this );
                const name = $element.attr( 'itabbed-id' );
                //console.log( 'ITabbed:tabClickHandler() switching to \''+name+'\'' );
                $element.trigger( 'itabbed-clicked', { name: name });
            },
            cssClassLeftArrow: 'fas fa-chevron-left',
            cssClassRightArrow: 'fas fa-chevron-right'
        }
    };

})( jQuery, window, document );
