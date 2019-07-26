import Dispatcher from '../dispatcher/Dispatcher';


export default {
  donationCancelSubscriptionAction (subscriptionId) {
    Dispatcher.loadEndpoint('donationCancelSubscription',
      {
        subscription_id: subscriptionId,
      });
  },

  donationRefund (charge) {
    Dispatcher.loadEndpoint('donationRefund', { charge });
  },

  donationRefreshDonationList () {
    Dispatcher.loadEndpoint('donationHistory',
      {
      });
  },

  donationWithStripe (token, email, donationAmount, monthlyDonation) {
    Dispatcher.loadEndpoint('donationWithStripe', {
      token,
      email,
      donation_amount: donationAmount,
      monthly_donation: monthlyDonation,
    });
  },
};
