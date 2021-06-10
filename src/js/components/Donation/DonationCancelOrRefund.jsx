import React, { Component } from 'react';
import { Button, Grid, Modal } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import { renderLog } from '../../utils/logging';

export default class DonationCancelOrRefund extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.cancelOrRefund = this.cancelOrRefund.bind(this);
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  cancelOrRefund = (item) => {
    console.log(`cancel subscription or refund charge ${item}`);
    const { charge_id: chargeId, subscriptionId } = item;
    if (this.props.refundDonation) {
      DonateActions.donationRefund(chargeId);
    } else {
      DonateActions.donationCancelSubscriptionAction(subscriptionId);
    }

    this.setState({ showModal: false });
  };

  render () {
    renderLog('DonationCancelOrRefund');

    const { item, refundDonation, active, cancelText, showOrganizationPlan } = this.props;
    const { amount, funding, brand, last4, expires } = item;
    let label = refundDonation ? 'Refund Donation' : 'Cancel Membership';
    if (showOrganizationPlan) {
      label = refundDonation ? 'Refund Plan Payment' : 'Cancel Paid Plan';
    }

    if (!active) {
      return cancelText.length > 0 ? 'canceled' : null;
    }

    return (
      <>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          // disableElevation
          onClick={this.openModal}
          style={{ textTransform: 'unset' }}
        >
          {label}
        </Button>
        <Modal
          open={this.state.showModal}
          onClose={this.closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <StyledModalFrame>
            <h2>{label}</h2>
            <p>
              We Vote is a nonprofit and nonpartisan organization that relies the generous support from voters like you. Thank you!
            </p>

            <Grid container spacing={1} style={{ paddingLeft: '0px', backgroundColor: '#08000008', margin: '8px 0 24px 0' }}>
              <Grid item xs={6} style={{ maxWidth: '40%' }}>
                <div>Created:</div>
              </Grid>
              <Grid item xs="auto">
                <div>{moment.utc(item.created).local().format('MMM D, YYYY,  h:mm a')}</div>
              </Grid>

              <Grid item xs={6} style={{ maxWidth: '40%' }}>
                <div>{refundDonation ? 'Amount:' : 'Monthly:'}</div>
              </Grid>
              <Grid item xs={6}>
                <div>{`$${amount}`}</div>
              </Grid>

              <Grid item xs={6} style={{ maxWidth: '40%' }}>
                <div>Funding:</div>
              </Grid>
              <Grid item xs={6}>
                <div>{funding || 'Credit'}</div>
              </Grid>

              <Grid item xs={6} style={{ maxWidth: '40%' }}>
                <div>Card brand:</div>
              </Grid>
              <Grid item xs={6}>
                <div>{brand}</div>
              </Grid>

              <Grid item xs={6} style={{ maxWidth: '40%' }}>
                <div>Last digits:</div>
              </Grid>
              <Grid item xs={6}>
                <div>{last4}</div>
              </Grid>

              <Grid item xs={6} style={{ maxWidth: '40%' }}>
                <div>Card expires:</div>
              </Grid>
              <Grid item xs={6}>
                <div>{expires}</div>
              </Grid>
            </Grid>

            <ButtonSpacer>
              <Button variant="outlined" color="primary" onClick={this.closeModal}>
                I changed my mind
              </Button>
            </ButtonSpacer>

            <ButtonSpacer>
              <Button variant="outlined" color="primary" onClick={() => this.cancelOrRefund(item)}>
                {refundDonation ? 'Refund this donation' : 'Cancel this subscription'}
              </Button>
            </ButtonSpacer>
          </StyledModalFrame>
        </Modal>
      </>
    );
  }
}

DonationCancelOrRefund.propTypes = {
  item: PropTypes.object.isRequired,
  refundDonation: PropTypes.bool, // true to enable refunding of donations, false to enable cancellation of subscriptions
  active: PropTypes.bool,
  cancelText: PropTypes.string,
  showOrganizationPlan: PropTypes.bool,
};

const StyledModalFrame = styled.div`
  color: black;
  background-color: white;
  width: 340px;
  padding: 16px 32px 24px;
  position: absolute;
  left: 45%;
  top: 30%;
  border: 2px solid #000;
  outline: 0;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%);
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: 0;
    top: 0;
  }
`;

const ButtonSpacer = styled.div`
  margin: 8px 0;
`;
