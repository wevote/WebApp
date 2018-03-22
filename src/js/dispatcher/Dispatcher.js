var Dispatcher = require("flux/lib/Dispatcher");

Dispatcher.prototype.$ajax = require("../utils/service").$ajax;

Dispatcher.prototype.loadEndpoint = function (endpoint, data = {}) {
  if (this.$ajax instanceof Function !== true) throw new Error("$ajax handler not initialized");

  //console.log("Ajax request in Dispatcher: " + endpoint);
  this.$ajax({
    endpoint,
    data: data,
    success: (res) => {
      // console.log("Ajax response to endpoint: " + endpoint);
      this.dispatch({ type: endpoint, res });
    },

    error: (err) => this.dispatch({ type: "error-" + endpoint, err }),
  });
};

module.exports = new Dispatcher();
