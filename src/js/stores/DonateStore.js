import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class DonateStore extends ReduceStore {
  getInitialState () {  // This is a mandatory override, so it can't be static.
    return {
      defaultPricing: {
        chosenFaviconRecommendedPlan: '',
        chosenFullDomainRecommendedPlan: '',
        chosenGoogleAnalyticsRecommendedPlan: '',
        chosenPromotedOrganizationsRecommendedPlan: '',
        chosenSocialShareImageRecommendedPlan: '',
        chosenSocialShareDescriptionRecommendedPlan: '',
        enterprisePlanFullPricePerMonthPayMonthly: 0,
        enterprisePlanFullPricePerMonthPayYearly: 0,
        proPlanFullPricePerMonthPayMonthly: 0,
        proPlanFullPricePerMonthPayYearly: 0,
        validForProfessionalPlan: false,
        validForEnterprisePlan: false,
        status: 'From getInitialState',
        success: true,
      },
      lastCouponResponseReceived: {
        couponAppliedMessage: '',
        couponCodeString: '',
        couponDiscountValue: 0,
        couponMatchFound: false,
        couponReceived: false,
        couponStillValid: '',
        enterprisePlanCouponPricePerMonthPayMonthly: 0,
        enterprisePlanCouponPricePerMonthPayYearly: 0,
        listPriceMonthlyCredit: '',
        proPlanCouponPricePerMonthPayMonthly: 0,
        proPlanCouponPricePerMonthPayYearly: 0,
        validForProfessionalPlan: false,
        validForEnterprisePlan: false,
        status: 'From getInitialState',
        success: false,
      },
    };
  }

  resetState () {
    return this.getInitialState();
  }

  donationSuccess () {
    return this.getState().success;
  }

  donationError () {
    return this.getState().errorMessageForVoter || '';
  }

  donationResponseReceived () {
    return this.getState().donationResponseReceived;
  }

  // Voter's donation history
  getVoterDonationHistory () {
    return this.getState().donationHistory || {};
  }

  getCouponMessageTest () {
    return this.getState().coupon_applied_message;
  }

  getCouponMessage () {
    const { lastCouponResponseReceived } = this.state;
    if (!lastCouponResponseReceived) {
      return '';
    } else {
      return lastCouponResponseReceived.couponAppliedMessage || '';
    }
  }

  getDefaultPricing () {
    return this.getState().defaultPricing || {};
  }

  getLastCouponResponseReceived () {
    return this.getState().lastCouponResponseReceived || {};
  }

  getOrgSubscriptionAlreadyExists () {
    return this.getState().orgSubsAlreadyExists || false;
  }

  doesOrgHavePaidPlan () {
    return this.getState().doesOrgHavePaidPlan || false;
  }

  reduce (state, action) {
    if (!action.res) return state;
    const {
      error_message_for_voter: errorMessageForVoter,
      saved_stripe_donation: savedStripeDonation,
      status,
      success,
      donation_amount: donationAmount,
      donation_list: donationHistory,
      charge_id: charge,
      subscription_id: subscriptionId,
      monthly_donation: monthlyDonation,
      org_subs_already_exists: orgSubsAlreadyExists,
      org_has_active_paid_plan: doesOrgHavePaidPlan,
    } = action.res;
    const donationAmountSafe = donationAmount || '';
    let { defaultPricing, lastCouponResponseReceived } = state;
    let apiStatus = '';
    let apiSuccess = false;
    let couponAppliedMessage = '';
    let couponCodeString = '';
    let couponMatchFound = '';
    let couponStillValid = '';
    let enterprisePlanCouponPricePerMonthPayMonthly = '';
    let enterprisePlanCouponPricePerMonthPayYearly = '';
    let enterprisePlanFullPricePerMonthPayMonthly = '';
    let enterprisePlanFullPricePerMonthPayYearly = '';
    let proPlanCouponPricePerMonthPayMonthly = '';
    let proPlanCouponPricePerMonthPayYearly = '';
    let proPlanFullPricePerMonthPayMonthly = '';
    let proPlanFullPricePerMonthPayYearly = '';
    let validForProfessionalPlan = '';
    let validForEnterprisePlan = '';
    switch (action.type) {
      case 'donationWithStripe':
        if (success === false) {
          console.log(`donation with stripe failed:  ${errorMessageForVoter}  ---  ${status}`);
        }
        return {
          ...state,
          donationAmount: donationAmountSafe,
          errorMessageForVoter,
          monthlyDonation,
          savedStripeDonation,
          success,
          orgSubsAlreadyExists,
          donationResponseReceived: true,
        };

      case 'error-donateRetrieve':
        console.log(`error-donateRetrieve${action}`);
        return state;

      case 'donationCancelSubscription':
        console.log(`donationCancelSubscription: ${action}`);
        return {
          ...state,
          subscriptionId,
          donationHistory,
          donationCancelCompleted: false,
        };

      case 'donationHistory':
        // console.log('Donate Store, donationHistory: ', action);
        return {
          ...state,
          donationHistory,
        };

      case 'donationRefund':
        console.log(`donationRefund: ${action}`);
        return {
          ...state,
          charge,
          donationHistory,
          donationRefundCompleted: false,
        };

      case 'doesOrgHavePaidPlan':
        console.log(`doesOrgHavePaidPlan: ${action}`);
        return {
          doesOrgHavePaidPlan,
        };

      case 'latestCouponViewed':
        // Update the lastCouponResponseReceived with the information that it has been viewed by another component
        lastCouponResponseReceived = { ...lastCouponResponseReceived, couponViewed: action.payload };
        return { ...state, lastCouponResponseReceived };

      case 'voterSignOut':
        // console.log("resetting DonateStore");
        return this.resetState();

      case 'defaultPricing':
        ({
          enterprise_plan_full_price_per_month_pay_monthly: enterprisePlanFullPricePerMonthPayMonthly,
          enterprise_plan_full_price_per_month_pay_yearly: enterprisePlanFullPricePerMonthPayYearly,
          pro_plan_full_price_per_month_pay_monthly: proPlanFullPricePerMonthPayMonthly,
          pro_plan_full_price_per_month_pay_yearly: proPlanFullPricePerMonthPayYearly,
          valid_for_enterprise_plan: validForEnterprisePlan,
          valid_for_professional_plan: validForProfessionalPlan,
          status: apiStatus,
          success: apiSuccess,
        } = action.res);
        defaultPricing = {
          enterprisePlanFullPricePerMonthPayMonthly,
          enterprisePlanFullPricePerMonthPayYearly,
          proPlanFullPricePerMonthPayMonthly,
          proPlanFullPricePerMonthPayYearly,
          validForEnterprisePlan,
          validForProfessionalPlan,
          status: apiStatus,
          success: apiSuccess,
        };
        return {
          ...state,
          defaultPricing,
        };

      case 'couponSummaryRetrieve':
        ({
          coupon_applied_message: couponAppliedMessage,
          coupon_code_string: couponCodeString,
          coupon_match_found: couponMatchFound,
          coupon_still_valid: couponStillValid,
          enterprise_plan_coupon_price_per_month_pay_monthly: enterprisePlanCouponPricePerMonthPayMonthly,
          enterprise_plan_coupon_price_per_month_pay_yearly: enterprisePlanCouponPricePerMonthPayYearly,
          pro_plan_coupon_price_per_month_pay_monthly: proPlanCouponPricePerMonthPayMonthly,
          pro_plan_coupon_price_per_month_pay_yearly: proPlanCouponPricePerMonthPayYearly,
          valid_for_enterprise_plan: validForEnterprisePlan,
          valid_for_professional_plan: validForProfessionalPlan,
          status: apiStatus,
          success: apiSuccess,
        } = action.res);
        lastCouponResponseReceived = {
          couponAppliedMessage,
          couponCodeString,
          couponMatchFound,
          couponReceived: true,
          couponStillValid,
          couponViewed: false,
          enterprisePlanCouponPricePerMonthPayMonthly,
          enterprisePlanCouponPricePerMonthPayYearly,
          proPlanCouponPricePerMonthPayMonthly,
          proPlanCouponPricePerMonthPayYearly,
          validForEnterprisePlan,
          validForProfessionalPlan,
          status: apiStatus,
          success: apiSuccess,
        };
        return {
          ...state,
          lastCouponResponseReceived,
        };

      case 'validateCoupon':
        return {
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

      default:
        return state;
    }
  }
}

export default new DonateStore(Dispatcher);
