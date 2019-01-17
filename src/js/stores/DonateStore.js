import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";

class DonateStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  resetState () {
    return this.getInitialState();
  }

  donationSuccess () {
    return this.getState().success;
  }

  donationError () {
    return this.getState().errorMessageForVoter || "";
  }

  donationResponseReceived () {
    return this.getState().donationResponseReceived;
  }

  donationCancelCompleted () {
    this.setState({ donationCancelCompleted: true });
  }

  donationRefundCompleted () {
    this.setState({ donationRefundCompleted: true });
  }

  donationSubscriptionUpdated () {
    this.setState({ donationSubscriptionUpdated: true });
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    switch (action.type) {
      case "donationWithStripe":
        return {
          ...state,
          donationAmount: action.res.donation_amount,
          errorMessageForVoter: action.res.error_message_for_voter,
          monthlyDonation: action.res.monthly_donation,
          savedStripeDonation: action.res.saved_stripe_donation,
          success: action.res.success,
          donationResponseReceived: true,
        };

      case "error-donateRetrieve":
        console.log(`error-donateRetrieve${action}`);
        return state;

      case "donationCancelSubscription":
        console.log(`donationCancelSubscription: ${action}`);
        return {
          subscriptionId: action.res.subscription_id,
          donationCancelCompleted: false,
        };

      case "donationRefund":
        console.log(`donationRefund: ${action}`);
        return {
          charge: action.res.charge,
          donationRefundCompleted: false,
        };

      case "voterSignOut":
        // console.log("resetting DonateStore");
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new DonateStore(Dispatcher);
