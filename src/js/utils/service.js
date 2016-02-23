/**
 * The idea of this APIS.js file is to abstract away the details
 * of many repetitive service calls that we will be using.
 * @author Nick Fiorini <nf071590@gmail.com>
 */
"use strict";

const DEBUG = false;
const url = require("url");

const assign = require("object-assign");
const ajax = require("../vendor/jquery.js").ajax;
const webAppConfig = require("../config");
const cookies = require("./cookies");

import * as request from "superagent";

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

  options.data = assign({}, defaults.data(), options.data || {});
  options.crossDomain = true;
  options.success = options.success || defaults.success;
  options.error = options.error || defaults.error;
  options.url = url.resolve(defaults.baseUrl, options.endpoint) + "/";

  return ajax(options);
}

export function get (options) {
  var opts = assign(defaults, options);

  opts.url = url.resolve(opts.baseUrl, opts.endpoint);
  // We add voter_device_id to all endpoint calls
  opts.query.voter_device_id = cookies.getItem("voter_device_id");

  return new Promise( (resolve, reject) => new request.Request("GET", opts.url)
    .accept(opts.dataType)
    .query(opts.query)
    .withCredentials()
    .end((err, res) => {
      if (err) {
        if (opts.error instanceof Function === true)
          opts.error(err || res.body);

        reject(err);
      } else {
        if (opts.success instanceof Function === true)
          opts.success(res.body);
        else if (DEBUG)
          console.warn(res.body);

        resolve(res.body);
      }
    })
  );
}

export function $post (options) {
  var opts = assign(defaults, options);
  opts.url = url.resolve(opts.baseUrl, opts.endpoint) + "/";

  return new Promise( (resolve, reject) => new request.Request("POST", opts.url)
    .accept(opts.dataType)
    .withCredentials()
    .send(opts.send)
    .end((err, res) => {
      if (err) {
        if (opts.error instanceof Function === true)
          opts.error(err || res.body);

        reject(err);
      } else {
        if (opts.success instanceof Function === true)
          opts.success(res.body);
        else if (DEBUG)
          console.warn(res.body);

        resolve(res.body);
      }
    })
  );
}


export function voterBallotItemsRetrieveFromGoogleCivic (text_for_map_search, success ) {
  return get({
    endpoint: "voterBallotItemsRetrieveFromGoogleCivic",
    query: { text_for_map_search }, success
  });
}

export function candidatesRetrieve (office_we_vote_id, success ) {
  return get({
    endpoint: "candidatesRetrieve",
    query: { office_we_vote_id }, success
  });
}

// get the ballot items
export function voterBallotItemsRetrieve (success) {
  return get({
    endpoint: "voterBallotItemsRetrieve",
    success });
}

export function positionOpposeCountForBallotItem (id, kind_of_ballot_item, success ) {
  return get({
    endpoint: "positionOpposeCountForBallotItem",
    query: { id, kind_of_ballot_item }, success
  });
}

// get measure support an opposition
export function positionSupportCountForBallotItem (id, kind_of_ballot_item, success ) {
  return get({
    endpoint: "positionSupportCountForBallotItem",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterPositionRetrieve (ballot_item_we_vote_id, kind_of_ballot_item, success ) {
  return get({
    endpoint: "voterPositionRetrieve",
    query: { ballot_item_we_vote_id, kind_of_ballot_item }, success
  });
}

export function voterStarStatusRetrieve (id, kind_of_ballot_item, success ) {
  return get({
    endpoint: "voterStarStatusRetrieve",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterStarOnSave (id, kind_of_ballot_item, success ) {
  return get({
    endpoint: "voterStarOnSave",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterStarOffSave (id, kind_of_ballot_item, success ) {
  return get({
    endpoint: "voterStarOffSave",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterSupportingSave (id, kind_of_ballot_item, success ) {
  console.log("voterSupportingSave, id:, ", id);

  return get({
    endpoint: "voterSupportingSave",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterStopSupportingSave (id, kind_of_ballot_item, success ) {
  console.log("voterStopSupportingSave, we_vote_id:, ", id);

  return get({
    endpoint: "voterStopSupportingSave",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterOpposingSave (id, kind_of_ballot_item, success ) {
  console.log("voterOpposingSave, id:, ", id);

  return get({
    endpoint: "voterOpposingSave",
    query: { id, kind_of_ballot_item }, success
  });
}

export function voterStopOpposingSave (id, kind_of_ballot_item, success ) {
  console.log("voterStopOpposingSave, we_vote_id:, ", id);

  return get({
    endpoint: "voterStopOpposingSave",
    query: { id, kind_of_ballot_item }, success
  });
}

export function deviceIdGenerate (success) {
  console.log("generating device id...");

  return get({ endpoint: "deviceIdGenerate", success });
}

export function createVoter (success) {
  console.log("creating voter id");

  return get({ endpoint: "voterCreate", success });
}

export function voterLocationRetrieveFromIP (success) {
  console.log("retrieve location from IP");

  return get({ endpoint: "voterLocationRetrieveFromIP", success });
}

export function voterRetrieve (success) {
  return get({ endpoint: "voterRetrieve", success });
}
