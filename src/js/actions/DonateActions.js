import Dispatcher from "../dispatcher/Dispatcher";


export default {
  donationCancelSubscriptionAction (subscriptionId) {
    Dispatcher.loadEndpoint("donationCancelSubscription", { subscriptionId });
  },

  donationRefund (charge) {
    Dispatcher.loadEndpoint("donationRefund", { charge });
  },

  donationWithStripe (token, email, donationAmount, monthlyDonation) {
    Dispatcher.loadEndpoint("donationWithStripe", {
      token,
      email,
      donation_amount: donationAmount,
      monthly_donation: monthlyDonation,
    });
  },
};
