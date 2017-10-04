import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  electionsRetrieve: function () {
    Dispatcher.loadEndpoint("electionsRetrieve", {});
  },
};
