/**
 * The idea of this APIS.js file is to abstract away the details
 * of many repetitive service calls that we will be using.
 *
 * Our models will be callable VIA an import.
 * so it should work like this:
 *     import service from utils/service;
 *
 *
 */

'use strict';
import * as cookies from './cookies';
import assign from 'object-assign';
import * as request from 'superagent';

const url = require('url');
const config = require('config');

const defaults = {
  type: 'get',
  crossDomain: true,
  dataType: 'json',
  url: config.url,
};


const service = {};

service.get = function (options) {
  var opts = assign(defaults, options)
  opts.url = url.resolve(opts.url, opts.endpoint);

  return new Promise( (resolve, reject) => request
    .get(opts.url)
    .accept(opts.dataType)
    .query(opts.query)
    .withCredentials()
    .end((err, res) => {
      if (err || !res.body.status) {
        opts.error(err || res.body);
        reject(err || res.body);
      }
      else {
        opts.success(res.body);
        resolve(res.body);
      }
    })
  );
}

export default service;
