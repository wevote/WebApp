/**
 * The idea of the service.js file is to abstract away the
 * details of many repetitive service calls that we will be using.
 * @author Nick Fiorini <nf071590@gmail.com>
 */
"use strict";
const url = require("url");
const assign = require("object-assign");
const ajax = require("../vendor/jquery.js").ajax;
const webAppConfig = require("../config");
const cookies = require("./cookies");

const defaults = {
  dataType: "json",
  baseUrl: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  url: webAppConfig.WE_VOTE_SERVER_API_ROOT_URL,
  query: {},
  type: "GET",
  data: function () {
    return cookies.getItem("voter_device_id") ? {
      voter_device_id: cookies.getItem("voter_device_id")
    } : {};
  },
  success: (res) => console.warn("Success function not defined:", res),
  error: (err) => console.error(err.message)
};

export function $ajax (options) {
  if (!options.endpoint) throw new Error("$ajax missing endpoint option");

  options.url = url.resolve(defaults.baseUrl, options.endpoint) + "/";
  options.data = assign({}, defaults.data(), options.data || {});
  options.error = options.error || defaults.error;
  options.success = options.success || defaults.success;
  options.crossDomain = true;

  return ajax(options);
}
