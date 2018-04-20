import Dispatcher from "flux/lib/Dispatcher";
import { $ajax } from "../utils/service"; 
import { httpLog } from "../utils/logging";


Dispatcher.prototype.$ajax = $ajax;

Dispatcher.prototype.loadEndpoint = function (endpoint, data = {}) {
  if (this.$ajax instanceof Function !== true) throw new Error("$ajax handler not initialized");

  //console.log("Ajax request in Dispatcher: " + endpoint);
  this.$ajax({
    endpoint,
    data: data,
    success: (res) => {
      httpLog("AJAX Response to endpoint: " + endpoint);
      this.dispatch({ type: endpoint, res });
    },

    error: (err) => this.dispatch({ type: "error-" + endpoint, err }),
  });
};

export default new Dispatcher();
