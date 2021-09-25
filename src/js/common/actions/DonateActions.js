import Dispatcher from '../dispatcher/Dispatcher';

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/

export default {
  // couponSummaryRetrieve (couponCode) {
  //   Dispatcher.loadEndpoint('couponSummaryRetrieve', {
  //     coupon_code: couponCode,
  //   });
  // },
  //
  // defaultPricing () {
  //   Dispatcher.loadEndpoint('defaultPricing', {});
  // },

  donationCancelSubscriptionAction (subscriptionId, premiumPlanTypeEnum = '') {
    Dispatcher.loadEndpoint('donationCancelSubscription',
      {
        premium_plan_type_enum: premiumPlanTypeEnum,
        stripe_subscription_id: subscriptionId,
      });
  },

  donationRefund (charge) {
    Dispatcher.loadEndpoint('donationRefund', { charge });
  },

  donationRefreshDonationList () {
    Dispatcher.loadEndpoint('donationHistory');
  },

  donationWithStripe (token, email, donationAmount, isChipIn, isMonthlyDonation, isPremiumPlan, clientIP, campaignXWeVoteId, paymentMethodId, couponCode, premiumPlanType) {
    Dispatcher.loadEndpoint('donationWithStripe', {
      token,
      email,
      donation_amount: donationAmount,
      is_chip_in: isChipIn,
      is_monthly_donation: isMonthlyDonation,
      is_premium_plan: isPremiumPlan,
      client_ip: clientIP,
      campaignx_we_vote_id: campaignXWeVoteId,
      payment_method_id: paymentMethodId,
      coupon_code: couponCode,
      premium_plan_type_enum: premiumPlanType,
    });
  },

  clearStripeErrorState (clearStripeErrorState) {
    Dispatcher.dispatch({ type: 'clearStripeErrorState', payload: clearStripeErrorState });
  },


  // setLatestCouponViewed (latestCouponViewed) {
  //   Dispatcher.dispatch({ type: 'latestCouponViewed', payload: latestCouponViewed });
  // },
  //
  // doesOrgHavePaidPlan () {
  //   // DALE 2019-09-19 Migrate away from this -- donationHistory provides what we need
  //   Dispatcher.loadEndpoint('doesOrgHavePaidPlan', {});
  // },
  //
  // validateCoupon (premiumPlanType, couponCode) {
  //   Dispatcher.loadEndpoint('validateCoupon', {
  //     premium_plan_type_enum: premiumPlanType,
  //     coupon_code: couponCode,
  //   });
  // },
};
