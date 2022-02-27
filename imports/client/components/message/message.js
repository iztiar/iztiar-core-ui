/*
 * A template to display popover messages
 *
 * Relies on Bootstrap classes.
 */
import './message.html';

// Local (client only) Messages collection
Messages = new Mongo.Collection( null );

// type: a language-agnostic error code
//       this may be catched by the code
//       say: 'success', 'warning' or 'error'
// message: the message to be displayed to the user
messageError = function( o ){
    Messages.insert({
        type: o.type,
        message: o.message
    })
};

messageSuccess = function( m ){
    Messages.insert({
        type: 'success',
        message: m
    })
};

// general message
messageWarning = function( m ){
    Messages.insert({
        type: 'warning',
        message: m
    })
};

Template.message_template.helpers({
    messages: function(){
        return Messages.find();
    }
});

Template.message_display.helpers({
    messageClass: function( it ){
        return it.type === 'success' ? 'alert-success' :
                ( it.type === 'warning' ? 'alert-warning' :
                    ( it.type === 'error' ? 'alert-danger' : 'alert-secondary' ));
    },
    messageText: function( it ){
        return it.message;
    }
});

Template.message_display.onRendered( function(){
    var msg = this.data.msg;
    Meteor.setTimeout( function(){
        Messages.remove( msg._id );
    }, 3000 );
});
