import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class DonateStore extends ReduceStore {
  getInitialState () {  // This is a mandatory override, so it can't be static.
    return {
      defaultPricing: {
        enterprisePlanFullPricePerMonthPayMonthly: 0,
        enterprisePlanFullPricePerMonthPayAnnually: 0,
        proPlanFullPricePerMonthPayMonthly: 15000,
        proPlanFullPricePerMonthPayAnnually: 12500,
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
        discountedPriceMonthlyCredit: '',
        enterprisePlanCouponPricePerMonthPayMonthly: 0,
        enterprisePlanCouponPricePerMonthPayAnnually: 0,
        listPriceMonthlyCredit: '',
        proPlanCouponPricePerMonthPayMonthly: 0,
        proPlanCouponPricePerMonthPayAnnually: 0,
        validForProfessionalPlan: true,
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

  reduce (state, action) {
    if (!action.res) return state;
    const { error_message_for_voter: errorMessageForVoter, saved_stripe_donation: savedStripeDonation, status, success, donation_amount: donationAmount,
      donation_list: donationHistory, charge_id: charge, subscription_id: subscriptionId, monthly_donation: monthlyDonation,
      org_subs_already_exists: orgSubsAlreadyExists,
    } = action.res;
    const donationAmountSafe = donationAmount || '';
    let { defaultPricing, lastCouponResponseReceived } = state;
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

      case 'latestCouponViewed':
        // Update the lastCouponResponseReceived with the information that it has been viewed by another component
        lastCouponResponseReceived = { ...lastCouponResponseReceived, couponViewed: action.payload };
        return { ...state, lastCouponResponseReceived };

      case 'voterSignOut':
        // console.log("resetting DonateStore");
        return this.resetState();

      case 'defaultPricing':
        defaultPricing = {
          enterprisePlanFullPricePerMonthPayMonthly: 0,
          enterprisePlanFullPricePerMonthPayAnnually: 0,
          proPlanFullPricePerMonthPayMonthly: 15000,
          proPlanFullPricePerMonthPayAnnually: 12500,
          status: action.res.status,
          success: action.res.success,
        };
        return {
          ...state,
          defaultPricing,
        };

      case 'validateCoupon':
        lastCouponResponseReceived = {
          couponDiscountValue: 10,
          discountedPriceMonthlyCredit: action.res.discounted_price_monthly_credit,
          listPriceMonthlyCredit: action.res.list_price_monthly_credit,
          //
          couponAppliedMessage: action.res.coupon_applied_message,
          couponCodeString: '25OFF',
          couponMatchFound: action.res.coupon_match_found,
          couponReceived: true,
          couponStillValid: action.res.coupon_still_valid,
          couponViewed: false,
          proPlanCouponPricePerMonthPayMonthly: 14000,
          proPlanCouponPricePerMonthPayAnnually: 11500,
          enterprisePlanCouponPricePerMonthPayMonthly: 0,
          enterprisePlanCouponPricePerMonthPayAnnually: 0,
          validForProfessionalPlan: true,
          validForEnterprisePlan: false,
          status: action.res.status,
          success: action.res.success,
        };
        return {
          ...state,
          lastCouponResponseReceived,
        };

      default:
        return state;
    }
  }
}

export default new DonateStore(Dispatcher);
