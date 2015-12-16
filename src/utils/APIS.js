/**
 * The idea of this APIS.js file is to abstract away the details
 * of many repetitive service calls that we will be using.
 *
 * Our models will be callable VIA an import.
 * so it should work like this:
 *     import { voterCount } from utils/APIS;
 *
 *     voterCount().then(data => setDeviceId(data.device_id));
 */

'use strict';
import * as cookies from './cookies';
import assign from 'object-assign';

import * as request from 'superagent';


window._request = request;

// basic endpoint url configuration
const protocol = 'http://';
const host = 'localhost';
const port = ':8000';
const base_path = '/apis/v1/';

let CONFIG = {
    BASE: `${protocol}${host}${port}${base_path}`,
    HEADERS: {
        //Cookie: document.cookie
    }
};


function checkParams(params, params_in) {
    let keys;
    if (!params instanceof Array)
        throw new Error('params must be array');

    keys = Object.keys(params_in);

    if (params.length !== keys.length)
        return false; // params not valid

    return keys.every( key => {
        var index = params.indexOf(key);
        return index >= 0 ? params.splice(index, 1) : false;
    });
}

function get(url, callback) {
    return request
        .get(CONFIG.BASE + url)
        .set(CONFIG.HEADERS)
        .end(callback);
}

function post(url, data, callback) {
    return request
        .post(CONFIG.BASE + url)
        .set(CONFIG.HEADERS)
        .end(callback);
}

module.exports = window.APIS = {
    /********** This is a custom method for getting
     ********** the users location information
     **********/
    locationService: cb => {
    },

    /********** Voter Basic Data **********/
    deviceIdGenerate: cb => get('deviceIdGenerate', cb),
    voterAddressRetrieve: cb => get('voterAddressRetrieve', cb),

    voterAddressSave: (text_for_map_search, cb) => {
        var csrfmiddlewaretoken = 'NpSeKcfbbSycWQZkSpuv9n7BdAUO6wAz';
        post('voterAddressSave/', {
            text_for_map_search,
            csrfmiddlewaretoken
        },cb);
    },

    voterCount: cb => request.get('voterCount', cb),

    voterCreate: voter_device_id => {
        const params = { voter_device_id };
        if (checkParams(['voter_device_id'], params))
            return request.get('voterCreate', {params});
        else
            throw new Error('missing voter_device_id', params);
    },
    voterRetrieve: voter_device_id => {
        const params = { voter_device_id };
        if (checkParams(['voter_device_id'], params))
            return request.get('voterRetrieve', {params});
        else
            throw new Error('missing voter_device_id', params);
    },

    /********** Org, People & Voter Guides **********/
    organizationCount: () => request.get('organizationCount'),


    /********** Ballot Contest Data **********/
    ballotItemOptionsRetrieve: params => {
        if (checkParams(['voter_device_id', 'api_key'], params))
            return request.get('ballotItemOptionsRetrieve', {params});
        else
            throw new Error('incorrect parameters', params);
    },

    electionsRetrieve:  params => {
        if (checkParams(['voter_device_id', 'api_key'], params))
            return request.get('electionsRetrieve', {params});
        else
            throw new Error('incorrect parameters', params);
    },

    voterBallotItemsRetrieve: params => {
        if (checkParams(['voter_device_id', 'api_key'], params))
            return request.get('voterBallotItemsRetrieve', {params});
        else
            throw new Error('incorrect parameters', params);
    },

    /********** Candidates & Measures **********/
    candidatesRetrieve: office_we_vote_id => {
        var params = { office_we_vote_id };
        if (checkParams(['office_we_vote_id'], params))
            return request.get('candidatesRetrieve', {params});
        else
            throw new Error('missing office_we_vote_id parameter', params);

    }

};
