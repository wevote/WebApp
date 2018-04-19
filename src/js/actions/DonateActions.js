import Dispatcher from "../dispatcher/Dispatcher";

export default {

  donationCancelSubscriptionAction: function (subscription_id) {
    Dispatcher.loadEndpoint("donationCancelSubscription", { subscription_id: subscription_id });
  },

  donationRefund: function (charge) {
    Dispatcher.loadEndpoint("donationRefund", { charge: charge });
  },

  donationWithStripe: function (token, email, donation_amount, monthly_donation) {
    Dispatcher.loadEndpoint("donationWithStripe", { token: token, email: email, donation_amount: donation_amount,
      monthly_donation: monthly_donation });
  },

};
