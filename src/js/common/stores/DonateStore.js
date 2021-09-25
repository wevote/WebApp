import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/

class DonateStore extends ReduceStore {
  getInitialState () {  // This is a mandatory override, so it can't be static.
    return {
      stripeErrorMessageForVoter: '',
      activePaidPlan: {
        coupon_code: '',
        next_invoice: {
          invoice_date: '',
          amount_due: '',
          period_start: '',
          period_end: '',
          credit_card_last_four: '',
          credit_card_expiration: '',
          billing_contact: '',
        },
        premium_plan_type_enum: '',
        subscription_active: '',
        donation_plan_id: '',
      },
      // defaultPricing: {
      //   chosenFaviconRecommendedPlan: '',
      //   chosenFullDomainRecommendedPlan: '',
      //   chosenGoogleAnalyticsRecommendedPlan: '',
      //   chosenPromotedOrganizationsRecommendedPlan: '',
      //   chosenSocialShareImageRecommendedPlan: '',
      //   chosenSocialShareDescriptionRecommendedPlan: '',
      //   enterprisePlanFullPricePerMonthPayMonthly: 0,
      //   enterprisePlanFullPricePerMonthPayYearly: 0,
      //   proPlanFullPricePerMonthPayMonthly: 0,
      //   proPlanFullPricePerMonthPayYearly: 0,
      //   validForProfessionalPlan: false,
      //   validForEnterprisePlan: false,
      //   status: 'From getInitialState',
      //   success: true,
      // },
      // donationJournalList: [
      //   {
      //     created: '',
      //     amount: '',
      //   },
      // ],
      // subscriptionJournalHistory: [
      //   {
      //     created: '',
      //     amount: '',
      //   },
      // ],
      // lastCouponResponseReceived: {
      //   couponAppliedMessage: '',
      //   couponCodeString: '',
      //   couponDiscountValue: 0,
      //   couponMatchFound: false,
      //   couponReceived: false,
      //   couponStillValid: '',
      //   enterprisePlanCouponPricePerMonthPayMonthly: 0,
      //   enterprisePlanCouponPricePerMonthPayYearly: 0,
      //   listPriceMonthlyCredit: '',
      //   proPlanCouponPricePerMonthPayMonthly: 0,
      //   proPlanCouponPricePerMonthPayYearly: 0,
      //   validForProfessionalPlan: false,
      //   validForEnterprisePlan: false,
      //   status: 'From getInitialState',
      //   success: false,
      // },
    };
  }

  resetState () {
    return this.getInitialState();
  }

  donationSuccess () {
    return this.getState().success;
  }

  donationError () {
    return this.getState().stripeErrorMessageForVoter || '';
  }

  donationResponseReceived () {
    return this.getState().donationResponseReceived;
  }

  // Voter's donation history
  getVoterDonationHistory () {
    return this.getState().donationJournalList || [];
  }

  getVoterPaymentHistory () {
    return this.getState().donationPaymentsList || [];
  }

  getVoterSubscriptionHistory () {
    return this.getState().donationSubscriptionList || [];
  }

  getNumberOfActiveSubscriptions () {
    const subscriptions = this.getVoterSubscriptionHistory();
    let count = 0;
    subscriptions.forEach((item) => {
      const {
        subscription_canceled_at: subscriptionCanceledAt,
        subscription_ended_at: subscriptionEndedAt,
      } = item;
      const isActive = subscriptionCanceledAt === 'None' && subscriptionEndedAt === 'None';
      count = isActive ? count + 1 : count;
    });
    return count;
  }

  getNumberOfPayments () {
    // March 2021: We no longer have payment refunds at this point, so all are valid
    const payments = this.getVoterPaymentHistory();
    return payments.length;
  }

  // // Organization's subscription payment history
  // getSubscriptionJournalHistory () {
  //   return this.getState().subscriptionJournalHistory || [];
  // }

  // getActivePaidPlan () {
  //   return this.getState().activePaidPlan || {};
  // }

  getAmountPaidViaStripe () {
    return this.getState().amountPaidViaStripe || 0;
  }

  getNextInvoice () {
    const activePaidPlan = this.getState().activePaidPlan || null;
    if (activePaidPlan && activePaidPlan.next_invoice) {
      return this.getState().activePaidPlan.next_invoice || {};
    }
    return {};
  }

  // getPremiumPlanTypeEnum () {
  //   return this.getState().premiumPlanTypeEnum || '';
  // }
  //
  // getCouponMessageTest () {
  //   return this.getState().coupon_applied_message;
  // }
  //
  // getCouponMessage () {
  //   const lastCouponResponseReceived = this.getState().lastCouponResponseReceived || {};
  //   if (!lastCouponResponseReceived) {
  //     return '';
  //   } else {
  //     return lastCouponResponseReceived.couponAppliedMessage || '';
  //   }
  // }
  //
  // getDefaultPricing () {
  //   return this.getState().defaultPricing || {};
  // }
  //
  // getLastCouponResponseReceived () {
  //   return this.getState().lastCouponResponseReceived || {};
  // }
  //
  // getOrgSubscriptionAlreadyExists () {
  //   return this.getState().orgSubsAlreadyExists || false;
  // }
  //
  // doesOrgHavePaidPlan () {
  //   return this.getState().doesOrgHavePaidPlan || false;
  // }
  getAll () {
    return this.getState();
  }

  noDispatchClearStripeErrorState () {
    this._state.apiStatus = true;
    this._state.stripeErrorMessageForVoter = '';
    this._state.stripeFailureCode = '';
    this._state.success = true;
    this._state.donationResponseReceived = false;
  }

  reduce (state, action) {
    if (!action.res) return state;
    // // DALE 2019-09-19 Migrate away from orgSubsAlreadyExists and doesOrgHavePaidPlan -- donationHistory/activePaidPlan provides what we need
    // const {
    //   // charge_id: charge,
    //   // subscription_id: subscriptionId,
    //   // org_subs_already_exists: orgSubsAlreadyExists,
    //   // org_has_active_paid_plan: doesOrgHavePaidPlan,
    //   donation_amount: donationAmount,
    //   is_monthly_donation: isMonthlyDonation,
    //   saved_stripe_donation: savedStripeDonation,
    //   success,
    // } = action.res;
    // const { defaultPricing, lastCouponResponseReceived } = state;
    // let activePaidPlan = {};
    // let completeDonationJournalList = [];
    // let couponAppliedMessage = '';
    // let couponCodeString = '';
    // let couponMatchFound = '';
    // let couponStillValid = '';
    // let donationJournalList = [];
    // let enterprisePlanCouponPricePerMonthPayMonthly = '';
    // let enterprisePlanCouponPricePerMonthPayYearly = '';
    // let enterprisePlanFullPricePerMonthPayMonthly = '';
    // let enterprisePlanFullPricePerMonthPayYearly = '';
    // let organizationSaved = false;
    // let premiumPlanTypeEnum = '';
    // let proPlanCouponPricePerMonthPayMonthly = '';
    // let proPlanCouponPricePerMonthPayYearly = '';
    // let proPlanFullPricePerMonthPayMonthly = '';
    // let proPlanFullPricePerMonthPayYearly = '';
    // let subscriptionJournalHistory = [];
    // let validForProfessionalPlan = '';
    // let validForEnterprisePlan = '';
    const donationAmountSafe = action.res.donationAmount || '';
    let amountPaidViaStripe = 0;
    let apiStatus = '';
    let donationPaymentsList = [];
    let donationSubscriptionList = [];
    let isMonthlyDonation = false;
    let savedStripeDonation = false;
    let stripeErrorMessageForVoter = '';
    let stripeFailureCode = '';
    let success = false;
    switch (action.type) {
      case 'donationWithStripe':
        ({
          // active_paid_plan: activePaidPlan,
          // organization_saved: organizationSaved,
          // premium_plan_type_enum: premiumPlanTypeEnum,
          amount_paid: amountPaidViaStripe,
          error_message_for_voter: stripeErrorMessageForVoter,
          is_monthly_donation: isMonthlyDonation,
          saved_stripe_donation: savedStripeDonation,
          status: apiStatus,
          stripe_failure_code: stripeFailureCode,
          success,
        } = action.res);
        // donationJournalList = completeDonationJournalList.filter((item) => (item.is_premium_plan === false));
        // subscriptionJournalHistory = completeDonationJournalList.filter((item) => (item.is_premium_plan === true));
        if (success === false) {
          console.log(`donation with stripe failed:  ${stripeErrorMessageForVoter}  ---  ${apiStatus}`);
        }
        // // console.log('amountPaidViaStripe: ', amountPaidViaStripe);
        // // DALE 2019-09-19 Migrate away from orgSubsAlreadyExists -- donationHistory provides what we need
        // if (organizationSaved) {
        //   OrganizationActions.organizationRetrieve(VoterStore.getLinkedOrganizationWeVoteId());
        // }
        return {
          ...state,
          // activePaidPlan,
          // donationJournalList,
          // orgSubsAlreadyExists,
          // premiumPlanTypeEnum,
          // subscriptionJournalHistory,
          amountPaidViaStripe,
          apiStatus,
          donationAmount: donationAmountSafe,
          donationResponseReceived: true,
          isMonthlyDonation,
          savedStripeDonation,
          stripeErrorMessageForVoter,
          stripeFailureCode,
          success,
        };

      case 'error-donateRetrieve':
        console.log(`error-donateRetrieve${action}`);
        return state;

        // case 'donationCancelSubscription':
        //   // console.log(`donationCancelSubscription: ${action}`);
        //   ({
        //     active_paid_plan: activePaidPlan,
        //     donation_list: completeDonationJournalList,
        //     organization_saved: organizationSaved,
        //   } = action.res);
        //   donationJournalList = completeDonationJournalList.filter((item) => (item.is_premium_plan === false));
        //   subscriptionJournalHistory = completeDonationJournalList.filter((item) => (item.is_premium_plan === true));
        //   if (organizationSaved) {
        //     OrganizationActions.organizationRetrieve(VoterStore.getLinkedOrganizationWeVoteId());
        //   }
        //   return {
        //     ...state,
        //     activePaidPlan,
        //     donationCancelCompleted: false,
        //     donationJournalList,
        //     subscriptionId,
        //     subscriptionJournalHistory,
        //   };

      case 'donationHistory':
        // console.log('Donate Store, donationHistory action.res: ', action.res);
        ({
          // active_paid_plan: activePaidPlan,
          donation_payments_list: donationPaymentsList,
          donation_subscription_list: donationSubscriptionList,
        } = action.res);

        // if (completeDonationJournalList) {
        //   donationJournalList = completeDonationJournalList.filter((item) => (item.is_premium_plan === false));
        //   subscriptionJournalHistory = completeDonationJournalList.filter((item) => (item.is_premium_plan === true));
        // } else {
        //   console.error('undefined completeDonationJournalList in DonateStore donationHistory');
        // }
        return {
          ...state,
          // activePaidPlan,
          donationPaymentsList,
          donationSubscriptionList,
        };

        // case 'donationHistory':
        //    // console.log('Donate Store, donationHistory action.res: ', action.res);
        //    ({
        //      // active_paid_plan: activePaidPlan,
        //      donation_list: completeDonationJournalList,
        //    } = action.res);
        //    donationJournalList = completeDonationJournalList.filter((item) => (item.is_premium_plan === false));
        //    subscriptionJournalHistory = completeDonationJournalList.filter((item) => (item.is_premium_plan === true));
        //    return {
        //      ...state,
        //      // activePaidPlan,
        //      donationJournalList,
        //      subscriptionJournalHistory,
        //    };

        // case 'donationRefund':
        //   // console.log(`donationRefund: ${action}`);
        //   ({
        //     donation_list: completeDonationJournalList,
        //   } = action.res);
        //   donationJournalList = completeDonationJournalList.filter((item) => (item.is_premium_plan === false));
        //   subscriptionJournalHistory = completeDonationJournalList.filter((item) => (item.is_premium_plan === true));
        //   return {
        //     ...state,
        //     charge,
        //     donationJournalList,
        //     donationRefundCompleted: false,
        //     subscriptionJournalHistory,
        //   };

        // case 'doesOrgHavePaidPlan':
        //   // DALE 2019-09-19 Migrate away from this -- donationHistory provides what we need
        //   // console.log(`doesOrgHavePaidPlan: ${action}`);
        //   return {
        //     ...state,
        //     doesOrgHavePaidPlan,
        //   };

        // case 'latestCouponViewed':
        //   // Update the lastCouponResponseReceived with the information that it has been viewed by another component
        //   lastCouponResponseReceived = { ...lastCouponResponseReceived, couponViewed: action.payload };
        //   return {
        //     ...state,
        //     lastCouponResponseReceived,
        //   };

      case 'voterSignOut':
        // console.log("resetting DonateStore");
        return this.resetState();

        // case 'defaultPricing':
        //   ({
        //     enterprise_plan_full_price_per_month_pay_monthly: enterprisePlanFullPricePerMonthPayMonthly,
        //     enterprise_plan_full_price_per_month_pay_yearly: enterprisePlanFullPricePerMonthPayYearly,
        //     pro_plan_full_price_per_month_pay_monthly: proPlanFullPricePerMonthPayMonthly,
        //     pro_plan_full_price_per_month_pay_yearly: proPlanFullPricePerMonthPayYearly,
        //     valid_for_enterprise_plan: validForEnterprisePlan,
        //     valid_for_professional_plan: validForProfessionalPlan,
        //     status: apiStatus,
        //     success: apiSuccess,
        //   } = action.res);
        //   defaultPricing = {
        //     enterprisePlanFullPricePerMonthPayMonthly,
        //     enterprisePlanFullPricePerMonthPayYearly,
        //     proPlanFullPricePerMonthPayMonthly,
        //     proPlanFullPricePerMonthPayYearly,
        //     validForEnterprisePlan,
        //     validForProfessionalPlan,
        //     status: apiStatus,
        //     success: apiSuccess,
        //   };
        //   return {
        //     ...state,
        //     defaultPricing,
        //   };
        //
        // case 'couponSummaryRetrieve':
        //   ({
        //     coupon_applied_message: couponAppliedMessage,
        //     coupon_code_string: couponCodeString,
        //     coupon_match_found: couponMatchFound,
        //     coupon_still_valid: couponStillValid,
        //     enterprise_plan_coupon_price_per_month_pay_monthly: enterprisePlanCouponPricePerMonthPayMonthly,
        //     enterprise_plan_coupon_price_per_month_pay_yearly: enterprisePlanCouponPricePerMonthPayYearly,
        //     pro_plan_coupon_price_per_month_pay_monthly: proPlanCouponPricePerMonthPayMonthly,
        //     pro_plan_coupon_price_per_month_pay_yearly: proPlanCouponPricePerMonthPayYearly,
        //     valid_for_enterprise_plan: validForEnterprisePlan,
        //     valid_for_professional_plan: validForProfessionalPlan,
        //     status: apiStatus,
        //     success: apiSuccess,
        //   } = action.res);
        //   lastCouponResponseReceived = {
        //     couponAppliedMessage,
        //     couponCodeString,
        //     couponMatchFound,
        //     couponReceived: true,
        //     couponStillValid,
        //     couponViewed: false,
        //     enterprisePlanCouponPricePerMonthPayMonthly,
        //     enterprisePlanCouponPricePerMonthPayYearly,
        //     proPlanCouponPricePerMonthPayMonthly,
        //     proPlanCouponPricePerMonthPayYearly,
        //     validForEnterprisePlan,
        //     validForProfessionalPlan,
        //     status: apiStatus,
        //     success: apiSuccess,
        //   };
        //   return {
        //     ...state,
        //     lastCouponResponseReceived,
        //   };

      case 'validateCoupon':
        return {
          ...state,
          annual_price_stripe: action.res.annual_price_stripe,
          coupon_applied_message: action.res.coupon_applied_message,
          coupon_match_found: action.res.coupon_match_found,
          coupon_still_valid: action.res.coupon_still_valid,
          monthly_price_stripe: action.res.monthly_price_stripe,
          status: action.res.status,
          success: action.res.success,
        };

        // // TODO: Dale needs to revive for his new upgrade, contains test code
        // case 'validateCoupon':
        //   ({
        //     coupon_applied_message: couponAppliedMessage,
        //     coupon_match_found: couponMatchFound,
        //     list_price_monthly_credit: listPriceMonthlyCredit,
        //   } = action.res);
        //   return {
        //     success: true,
        //     couponAppliedMessage,
        //     couponMatchFound,
        //     couponStillValid,
        //     discountedPriceMonthlyCredit,
        //     listPriceMonthlyCredit,
        //     status,
        //   };

      case 'clearStripeErrorState':
        return {
          ...state,
          apiStatus: true,
          stripeErrorMessageForVoter: '',
          stripeFailureCode: '',
          success: true,
        };


      default:
        return state;
    }
  }
}

export default new DonateStore(Dispatcher);
