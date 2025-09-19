import PropTypes from 'prop-types';
import React, { Component } from 'react';

// Dummy PayToPromoteProcess class, which at Cordova compile time, is copied over the production class to remove any trace of Stripe from Cordova
class PayToPromoteProcess extends Component {
  render () {
    return (
      <div>
        Disabled
      </div>
    );
  }
}
PayToPromoteProcess.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  chipInPaymentValueDefault: PropTypes.string,
  classes: PropTypes.object,
  lowerDonations: PropTypes.bool,
};
export default PayToPromoteProcess;
