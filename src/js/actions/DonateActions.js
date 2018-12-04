import Dispatcher from "../dispatcher/Dispatcher";


export default {

  donationCancelSubscriptionAction (subscription_id) {
    Dispatcher.loadEndpoint("donationCancelSubscription", { subscription_id });
  },

  donationRefund (charge) {
    Dispatcher.loadEndpoint("donationRefund", { charge });
  },

  donationWithStripe (token, email, donation_amount, monthly_donation) {
    Dispatcher.loadEndpoint("donationWithStripe", {
      token,
      email,
      donation_amount,
      monthly_donation,
    });
  },
};
