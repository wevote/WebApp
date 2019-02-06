import Dispatcher from "flux/lib/Dispatcher";
import $ajax from "../utils/service";
import { httpLog } from "../utils/logging";


Dispatcher.prototype.$ajax = $ajax;

Dispatcher.prototype.loadEndpoint = (endpoint, data = {}) => {
  if (this.$ajax instanceof Function !== true) throw new Error("$ajax handler not initialized");

  // console.log("Ajax request in Dispatcher: " + endpoint);
  return this.$ajax({
    endpoint,
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
