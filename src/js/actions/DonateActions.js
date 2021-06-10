import Dispatcher from '../dispatcher/Dispatcher';


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

  donationCancelSubscriptionAction (subscriptionId, planTypeEnum = '') {
    Dispatcher.loadEndpoint('donationCancelSubscription',
      {
        plan_type_enum: planTypeEnum,
        stripe_subscription_id: subscriptionId,
      });
  },

  donationRefund (charge) {
    Dispatcher.loadEndpoint('donationRefund', { charge });
  },

  donationRefreshDonationList () {
    Dispatcher.loadEndpoint('donationHistory');
  },

  donationWithStripe (token,  clientIP, paymentMethodId, email, donationAmount, monthlyDonation, isOrganizationPlan, planType, couponCode) {
    Dispatcher.loadEndpoint('donationWithStripe', {
      token,
      client_ip: clientIP,
      payment_method_id: paymentMethodId,
      email,
      donation_amount: donationAmount,
      monthly_donation: monthlyDonation,
      is_organization_plan: isOrganizationPlan,
      plan_type_enum: planType,
      coupon_code: couponCode,
    });
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
  // validateCoupon (planType, couponCode) {
  //   Dispatcher.loadEndpoint('validateCoupon', {
  //     plan_type_enum: planType,
  //     coupon_code: couponCode,
  //   });
  // },
};
