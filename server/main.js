import { Meteor } from 'meteor/meteor';

// evaluation of both/ and server/ imports hierarchies
import '/imports/startup/both';
import '/imports/startup/server';

// actual startup of the server application occurs only once all things have been imported
//  several calls are possible and will be executed in sequence
Meteor.startup(() => {
    console.log( 'server/Meteor.startup(): Meteor.settings=%o', Meteor.settings );
    console.log( 'server/Meteor.startup(): NODE_ENV=\''+process.env['NODE_ENV']+'\'' );
    console.log( 'server/Meteor.startup(): IZTIAR_ENV=\''+process.env['IZTIAR_ENV']+'\'' );
});

Meteor.startup(() => {
    // code to run on server at startup
});
