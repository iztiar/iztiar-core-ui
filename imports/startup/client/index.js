/*
 *  Client-only UI initialization code.
 *  All third-party imports go here.
 */

// popperjs 2.11.2 (required by bootstrap)
import '@popperjs/core/dist/cjs/popper.js';

// bootstrap 5.1.3 (at least required by ITabbed interface)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// FontAwesome 5.15.4
// It is made globally available in the application
// see also https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/hosting-font-awesome-yourself
// (importing css complains about unable to read webfonts; import js works just fine)
import '/imports/client/third-party/fontawesome-free-5.15.4-web/js/all.js';

import './routes.js';

console.log( '/imports/startup/client: Meteor.settings=%o', Meteor.settings );
