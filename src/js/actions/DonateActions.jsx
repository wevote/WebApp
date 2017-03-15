import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  donationWithStripe: function (token) {
    Dispatcher.loadEndpoint("donationWithStripe", { token: token });
  }
};
