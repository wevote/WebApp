/**
 * The idea of this APIS.js file is to abstract away the details
 * of many repetitive service calls that we will be using.
 * @author Nick Fiorini <nf071590@gmail.com>
 */

'use strict';
const DEBUG = false;

import assign from 'object-assign';
import * as request from 'superagent';

const url = require('url');
const web_app_config = require('config');

const defaults = {
  dataType: 'json',
  WE_VOTE_SERVER_API_ROOT_URL: web_app_config.WE_VOTE_SERVER_API_ROOT_URL,
};

const service = {};

service.get = function (options) {
  var opts = assign(defaults, options);
  opts.WE_VOTE_SERVER_API_ROOT_URL = url.resolve(opts.WE_VOTE_SERVER_API_ROOT_URL, opts.endpoint);

  return new Promise( (resolve, reject) => request
    .get(opts.WE_VOTE_SERVER_API_ROOT_URL)
    .accept(opts.dataType)
    .query(opts.query)
    .withCredentials()
    .end((err, res) => {
      if (err || !res.body.status) {
        if (opts.error instanceof Function === true)
          opts.error(err || res.body);
        else
          console.error(err || res.body);

        reject(err || res.body);
      }
      else {
        if (opts.success instanceof Function === true)
          opts.success(res.body);
        else if (DEBUG)
          console.warn(res.body);

        resolve(res.body);
      }
    })
  );
};

export default service;
