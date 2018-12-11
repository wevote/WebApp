import Dispatcher from "../dispatcher/Dispatcher";

export default {

  electionsRetrieve () {
    Dispatcher.loadEndpoint("electionsRetrieve", {});
  },
};
