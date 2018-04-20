import Dispatcher from "../dispatcher/Dispatcher";

export default {

  electionsRetrieve: function () {
    Dispatcher.loadEndpoint("electionsRetrieve", {});
  },
};
