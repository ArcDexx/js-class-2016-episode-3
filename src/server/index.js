#!/usr/bin/env node

/** ROOT OF A JS fullstack app
 *
 * Server wrapper with optional cluster launch.
 * https://discussion.heroku.com/t/recommended-use-of-nodes-cluster-module/96
 */

console.log('\n\n\n*** Hello from cluster master ! ***\n');

require('./common/logger-setup'); // first of first
require('./common/polyfill-intl');
const config = require('./common/config');

console.log('* [cluster master] config = ', global.pretty(config));


const env = process.env.NODE_ENV || 'development';
console.log('* [cluster master] env = ' + env);

if(env === 'production') {
  // cluster launch, heroku compatible with nice features
  // https://github.com/brianc/node-forky
  console.log('* [cluster master] CLUSTER launch...');
  var forky = require('forky');

  // https://github.com/brianc/node-forky/blob/master/examples/master.js
  forky.log = function() { console.log.apply(console, arguments); };

  var forky_options = {
    path: __dirname + '/web/index',
    enable_logging: true,
    workers: 3 // TODO config. Heroku = 8 so complains about memory
  };
  forky(forky_options);
}
else {
  // normal, plain launch (one instance)
  console.log('* [cluster master] SIMPLE launch...');
  require('./web/index');
}