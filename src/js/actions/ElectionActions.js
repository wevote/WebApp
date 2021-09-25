import Dispatcher from '../common/dispatcher/Dispatcher';

export default {

  electionsRetrieve () {
    Dispatcher.loadEndpoint('electionsRetrieve', {});
  },
};
