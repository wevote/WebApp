/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
import { httpLog } from '../../utils/logging';
import $ajax from '../../utils/service';

const Dispatcher = require('flux').Dispatcher;

Dispatcher.prototype.$ajax = $ajax;

Dispatcher.prototype.loadEndpoint = function (endpoint, data = {}) {
  if (!(this.$ajax instanceof Function)) throw new Error('$ajax handler not initialized');

  // Making single pure actions, to work around existing actions where multiple requests are fired
  // often from Actions fired from within stores (we really need to avoid that)
  let endpointAdjusted = endpoint;
  if (endpoint === 'voterAddressOnlyRetrieve') {
    endpointAdjusted = 'voterAddressRetrieve';
  }

  // console.log(`Ajax request in Dispatcher: ${endpoint}`);
  return this.$ajax({
    endpoint: endpointAdjusted,
    data,
    success: (res) => {
      httpLog(`AJAX Response to endpoint: ${endpoint}`);
      this.dispatch({ type: endpoint, res });
    },

    error: (err) => {
      httpLog(`AJAX ERROR Response to endpoint: ${endpoint}`);
      this.dispatch({ type: `error-${endpoint}`, err });
    },
  });
};

export default new Dispatcher();
