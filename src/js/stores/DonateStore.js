import Dispatcher from "../dispatcher/Dispatcher";
import FluxMapStore from "flux/lib/FluxMapStore";
const cookies = require("../utils/cookies");

class DonateStore extends FluxMapStore {

  reduce (state, action) {

    switch (action.type) {
      case "donationWithStripe":
        return {
          ...state,
          donation_amount: action.res.donation_amount,
          error_message_for_voter: action.res.error_message_for_voter,
          monthly_donation: action.res.monthly_donation,
          saved_stripe_donation: action.res.saved_stripe_donation,
          success: action.res.success,
        };

      case "error-donateRetrieve":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

module.exports = new DonateStore(Dispatcher);
