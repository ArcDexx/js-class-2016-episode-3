import path from 'path';

///////////////// middlewares modules /////////////////
// https://blog.jscrambler.com/setting-up-5-useful-middlewares-for-an-express-api/

// live-reload client each time client files change
// https://www.npmjs.org/package/express-livereload
import client_livereload from 'express-livereload';

// Serve static files
// http://expressjs.com/en/4x/api.html#express.static
import {static as serve_static_files} from 'express';

// activate file compression
import compress_response_body from 'compression';

// add a unique uid to each requests
import assign_uuid from 'connect-uuid';

// adds a X-Response-Time header to responses.
// https://github.com/expressjs/response-time
import response_time from 'response-time';

// locale negotiation
import locale_detector from '../../../incubator/localizer';

// "express debug toolbar"
// https://github.com/devoidfury/express-debug
import express_debug from 'express-debug';

import is_page_request from '../../../incubator/is-page-request';

// Serve directory listings
// https://github.com/expressjs/serve-index
// TOREVIEW
//import serve_directory_listing from 'serve-index';
//app.use('/ht', middleware.serve_directory_listing('../../client', {'icons': true}));

// TOREVIEW
//var method_unifier = require('method-override'); // https://github.com/expressjs/method-override

// TOREVIEW
//var bodyParser = require('body-parser'); // for, well, parsing body.
// mainly useful for REST (POST, PUT)
// https://github.com/expressjs/body-parser

// TOREVIEW
// https://github.com/ericf/express-slash

import handle_errors from './error';
import fallback_to_404 from './404';

import logger from './logger';

////////////////////////////////////////////////////////////////////////

import config from '../../../config';
import app_infos from '../../../../common/static_data/app_infos';

const cwd = process.cwd();

function create(server, app) {
  const middlewares = {};

  ////////////////////////////////////

  // special tool ! If used
  // - will automatically attach itself as a middleware (!)
  // - require at last one existing middleware already set (!)
  if(config.web.express_debug_enabled) {
    // this bogus tools requires at last one middleware, so add an empty one :-(
    app.use((req, res, next) => next());
    express_debug(app, { /* settings */ });
  }

  ////////////////////////////////////

  middlewares.identify_page_requests = function (req, res, next) {
    req.is_page_request = is_page_request(req);
    next();
  };

  ////////////////////////////////////

  // special tool ! If used
  // - will open its own server
  // - will automatically attach itself as a middleware (!)
  if(config.web.livereload.enabled) {
    console.log('* using express-livereload watching "' + config.web.livereload.watched_dir + '"…');
    client_livereload(app, {
      // options are documented in the underlying module :
      // https://github.com/napcs/node-livereload#api-options
      watchDir: config.web.livereload.watched_dir,
      debug: config.web.livereload.debug,
      port: config.web.livereload.port,
      exts: config.web.livereload.watched_extensions
    });
  }

  ////////////////////////////////////
  middlewares.detect_best_locale = locale_detector(
    app_infos.supported_locales,
    {
      //logger: logger
    }
  );

  ////////////////////////////////////

  middlewares.log_requests = logger;
  middlewares.serve_static_files = serve_static_files;
  middlewares.add_response_time_header = response_time();
  middlewares.compress_response_body = compress_response_body();
  middlewares.assign_uuid = assign_uuid();
  middlewares.handle_errors = handle_errors;
  middlewares.handle_unmatched_with_404 = fallback_to_404;

  ////////////////////////////////////

  return middlewares;
}

export default create;
