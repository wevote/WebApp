import Dispatcher from "../dispatcher/Dispatcher";

module.exports = {

  donationWithStripe: function (token, email, donation_amount, monthly_donation) {
    Dispatcher.loadEndpoint("donationWithStripe", { token: token, email: email, donation_amount: donation_amount,
                            monthly_donation: monthly_donation });
  }
};
