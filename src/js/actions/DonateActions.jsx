import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  donationWithStripe: function (token, donationAmount, monthlyDonation = false) {
    Dispatcher.loadEndpoint("donationWithStripe", { token: token, donationAmount: donationAmount, monthlyDonation: monthlyDonation });
  }
};
