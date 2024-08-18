import { LockOutlined } from '@mui/icons-material';
import { Button, InputAdornment, TextField } from '@mui/material';
import { styled as muiStyled } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import DonationListForm from '../Donation/DonationListForm';
import InjectedCheckoutForm from '../Donation/InjectedCheckoutForm';
import standardBoxShadow from '../Style/standardBoxShadow';
import { OuterWrapper } from '../Style/stepDisplayStyles';
import LoadingWheelComp from '../Widgets/LoadingWheelComp';
import DonateStore from '../../stores/DonateStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import { payToPromoteProcessStyles } from '../Style/CampaignSupportStyles';
import webAppConfig from '../../../config';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
// import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';
import SplitIconButton from '../Widgets/SplitIconButton';

const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);

const futureFeaturesDisabled = true;
const iconButtonStyles = {
  width: window.innerWidth < 1280 ? 250 : 300,
  margin: '16px',
};

class PayToPromoteProcess extends Component {
  constructor (props) {
    super(props);

    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      loaded: false,
      chipInPaymentValue: '3.00',
      chipInPaymentOtherValue: '',
      preDonation: true,
      showWaiting: false,
      // voterFirstName: '',
    };
    this.onOtherAmountFieldChange = this.onOtherAmountFieldChange.bind(this);
    this.onChipIn = this.onChipIn.bind(this);
    this.stopShowWaiting = this.stopShowWaiting.bind(this);
  }

  componentDidMount () {
    initializejQuery(() => {
      // console.log('PayToPromoteProcess, componentDidMount after init jQuery');
      const { campaignXWeVoteId, chipInPaymentValueDefault } = this.props;
      this.setState({ loaded: true });
      // this.onAppObservableStoreChange();
      // this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
      this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
      this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
      // dumpCookies();
      // this.onVoterStoreChange();
      // this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
      if (chipInPaymentValueDefault) {
        this.setState({ chipInPaymentValue: chipInPaymentValueDefault });
      }
      const {
        campaignSEOFriendlyPath,
        campaignTitle,
      } = getCampaignXValuesFromIdentifiers('', campaignXWeVoteId);
      if (campaignXWeVoteId) {
        this.setState({
          campaignTitle,
        });
        if (campaignSEOFriendlyPath) {
          this.setState({
            campaignSEOFriendlyPath,
          });
        }
        if (campaignXWeVoteId) {
          this.setState({
            campaignXWeVoteId,
          });
        }
        // Take the "calculated" identifiers and retrieve if missing
        retrieveCampaignXFromIdentifiersIfNeeded('', campaignXWeVoteId);
        DonateStore.noDispatchClearStripeErrorState();
      }
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    // this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.donateStoreListener.remove();
    // this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  // onAppObservableStoreChange () {
  //   const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
  //   this.setState({
  //     chosenWebsiteName,
  //   });
  // }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const {
      campaignSEOFriendlyPath,
      campaignTitle,
    } = getCampaignXValuesFromIdentifiers('', campaignXWeVoteId);
    this.setState({
      campaignTitle,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    }
  }

  onDonateStoreChange () {
    // console.log('onDonateStore DonateStore:', DonateStore.getAll());
    if (DonateStore.donationSuccess()  && DonateStore.donationResponseReceived()) {
      console.log('onDonateStoreChange successful donation detected');
      this.setState({
        preDonation: false,
      });
    }
  }

  static getProps () {
    return {};
  }

  // onVoterStoreChange () {
  //   const voterFirstName = VoterStore.getVoterFirstName();
  //   this.setState({
  //     voterFirstName,
  //   });
  // }

  onOtherAmountFieldChange (event) {
    if (event && event.target) {
      this.setState({
        chipInPaymentValue: '',
        chipInPaymentOtherValue: event.target.value.length > 0 ? event.target.value : '',
      });
    }
  }

  onChipIn () {
    // return Promise.then(() => {
    console.log('onChipIn in PayToPromoteProcess ------------------------------');
    console.log('Donation store changed in PayToPromoteProcess, Checkout form removed');
    this.setState({
      showWaiting: true,
    });
  }

  onDonationTempSubmit = () => {
    this.setState({
      preDonation: false,
    });
  }

  goToIWillShare = () => {
    const pathForNextStep = `${this.getCampaignXBasePath()}share-campaign`;
    historyPush(pathForNextStep);
  }

  getCampaignXBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}/`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}/`;
    }
    return campaignBasePath;
  }

  changeValueFromButton (newValue) {
    this.setState({
      chipInPaymentValue: newValue,
      chipInPaymentOtherValue: '',
    });
  }

  stopShowWaiting () {
    this.setState({
      showWaiting: false,
    });
  }

  render () {
    renderLog('PayToPromoteProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, lowerDonations } = this.props;
    const {
      campaignTitle, chipInPaymentValue, chipInPaymentOtherValue,
      loaded, showWaiting, campaignXWeVoteId, preDonation,
    } = this.state;
    if (campaignXWeVoteId === undefined || campaignXWeVoteId === '') {
      // console.error('Must have a campaignXWeVoteId defined in PayToPromoteProcess to make a "chip in"');
      return (
        <LoadingWheelComp />
      );
    }
    if (!loaded) {
      return (
        <LoadingWheelComp message="Waiting..." />
      );
    }

    const { location: { pathname } } = window;
    const pieces = pathname.split('/');
    const returnPath = pieces && pieces.length > 3 ? `/${pieces[1]}/${pieces[2]}` : '/start-a-campaign';

    return (
      <PaymentToPromoteWrapper>
        <OuterWrapper>
          <InnerWrapper>
            <ContributeGridWrapper show={preDonation}>
              <ContributeMonthlyText>
                Chip in to reach more voters:
              </ContributeMonthlyText>
              <ContributeGridSection>
                {lowerDonations && (
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '1' || chipInPaymentValue === '1.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('1.00')}
                    >
                      <ButtonInsideWrapper>
                        <PaymentAmount>
                          $1
                        </PaymentAmount>
                        <WhatYouGet>
                          <span className="u-show-mobile">5 voters</span>
                          <span className="u-show-desktop-tablet">5 voters reached</span>
                        </WhatYouGet>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                )}
                <ContributeGridItem>
                  <Button
                    classes={(chipInPaymentValue === '3' || chipInPaymentValue === '3.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                    variant="contained"
                    onClick={() => this.changeValueFromButton('3.00')}
                  >
                    <ButtonInsideWrapper>
                      <PaymentAmount>
                        $3
                      </PaymentAmount>
                      <WhatYouGet>
                        <span className="u-show-mobile">15 voters</span>
                        <span className="u-show-desktop-tablet">15 voters reached</span>
                      </WhatYouGet>
                    </ButtonInsideWrapper>
                  </Button>
                </ContributeGridItem>
                <ContributeGridItem>
                  <Button
                    classes={(chipInPaymentValue === '15' || chipInPaymentValue === '15.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                    variant="contained"
                    onClick={() => this.changeValueFromButton('15.00')}
                  >
                    <ButtonInsideWrapper>
                      <PaymentAmount>
                        $15
                      </PaymentAmount>
                      <WhatYouGet>
                        <span className="u-show-mobile">75 voters</span>
                        <span className="u-show-desktop-tablet">75 voters reached</span>
                      </WhatYouGet>
                    </ButtonInsideWrapper>
                  </Button>
                </ContributeGridItem>
                <ContributeGridItem>
                  <Button
                    classes={(chipInPaymentValue === '35' || chipInPaymentValue === '35.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                    variant="contained"
                    onClick={() => this.changeValueFromButton('35.00')}
                  >
                    <ButtonInsideWrapper>
                      <PaymentAmount>
                        $35
                      </PaymentAmount>
                      <WhatYouGet>
                        <span className="u-show-mobile">175 voters</span>
                        <span className="u-show-desktop-tablet">175 voters reached</span>
                      </WhatYouGet>
                    </ButtonInsideWrapper>
                  </Button>
                </ContributeGridItem>
                {!lowerDonations && (
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '50' || chipInPaymentValue === '50.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('50.00')}
                    >
                      <ButtonInsideWrapper>
                        <PaymentAmount>
                          $50
                        </PaymentAmount>
                        <WhatYouGet>
                          <span className="u-show-mobile">250 voters</span>
                          <span className="u-show-desktop-tablet">250 voters reached</span>
                        </WhatYouGet>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                )}
                <ContributeGridItemOtherItem>
                  <TextField
                    id="currency-input"
                    label="Other Amount"
                    variant="outlined"
                    value={chipInPaymentOtherValue}
                    onChange={this.onOtherAmountFieldChange}
                    InputLabelProps={{
                      classes: {
                        root: classes.textFieldInputRoot,
                        focused: classes.textFieldInputRoot,
                      },
                      shrink: true,
                    }}
                    InputProps={{
                      classes: {
                        root: classes.textFieldInputRoot,
                        focused: classes.textFieldInputRoot,
                      },
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    style={{ marginTop: 6, textAlign: 'center', width: '100%' }}
                  />
                </ContributeGridItemOtherItem>
              </ContributeGridSection>
            </ContributeGridWrapper>
          </InnerWrapper>
        </OuterWrapper>
        <PaymentWrapper>
          {futureFeaturesDisabled ? (
            <PaymentCenteredWrapper show>
              <ButtonContainer>
                {preDonation ? (
                  <SplitIconButton
                    buttonText="Submit my choice"
                    backgroundColor="#0834CD"
                    separatorColor="#0834CD"
                    styles={iconButtonStyles}
                    adjustedIconWidth={40}
                    externalUniqueId="becomeAMember"
                    icon={<LockStyled />}
                    id="stripeCheckOutForm"
                    onClick={this.onDonationTempSubmit}
                  />
                ) : (
                  <div>
                    Thank you for your choice!
                    We are still building our payment processing system, but have recorded your choice.
                  </div>
                )}
              </ButtonContainer>
            </PaymentCenteredWrapper>
          ) : (
            <PaymentCenteredWrapper show={preDonation}>
              {preDonation ? (
                <Elements stripe={stripePromise}>
                  <InjectedCheckoutForm
                    value={chipInPaymentOtherValue || chipInPaymentValue}
                    classes={{}}
                    stopShowWaiting={this.stopShowWaiting}
                    onDonation={this.onChipIn}
                    showWaiting={showWaiting}
                    isChipIn
                    campaignXWeVoteId={campaignXWeVoteId}
                  />
                </Elements>
              ) : (
                <Button
                  id="buttonReturn"
                  classes={{ root: classes.buttonDefault }}
                  color="primary"
                  variant="contained"
                  onClick={() => historyPush(returnPath)}
                >
                  {`Return to the "${campaignTitle}" Campaign`}
                </Button>
              )}
            </PaymentCenteredWrapper>
          )}
        </PaymentWrapper>
        <DonationListForm isCampaign leftTabIsMembership={false} />
      </PaymentToPromoteWrapper>
    );
  }
}
PayToPromoteProcess.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  chipInPaymentValueDefault: PropTypes.string,
  classes: PropTypes.object,
  lowerDonations: PropTypes.bool,
};

const ButtonContainer = styled('div')`
  margin-top: 10px;
`;

const ButtonInsideWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ContributeGridWrapper = styled('div', {
  shouldForwardProp: (prop) => !['show'].includes(prop),
})(({ show, theme }) => (`
  background-color: #ebebeb;
  padding: 10px;
  border: 1px solid darkgrey;
  margin: auto auto 20px auto;
  visibility: ${show ? 'visible' : 'hidden'};
  height: ${show ? 'inherit' : '5px'};
  width: 500px;
  ${theme.breakpoints.down('sm')} {
    width: 300px;
`));

const ContributeGridSection = styled('div')`
  background-color: #ebebeb;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 2px 10px;
`;

const ContributeMonthlyText = styled('div')`
  font-weight: 600;
  padding: 0 0 2px 18px;
`;

const ContributeGridItem = styled('div')`
  background-color: #ebebeb;
  padding: 5px 10px;
  font-size: 30px;
  text-align: center;
`;

const ContributeGridItemOtherItem = styled('div')`
  background-color: #ebebeb;
  padding: 5px 10px;
  font-size: 30px;
  text-align: center;
  grid-column: auto / span 2;
`;

const InnerWrapper = styled('div')`
`;

const LockStyled = muiStyled(LockOutlined)({ color: 'white' });

const PaymentAmount = styled('div')`
  font-size: 1.1rem;
`;

const PaymentCenteredWrapper = styled('div', {
  shouldForwardProp: (prop) => !['show'].includes(prop),
})(({ show, theme }) => (`
  width: 500px;
  ${theme.breakpoints.down('sm')} {
    width: 300px;
  }
  display: inline-block;
  background-color: ${show ? 'rgb(246, 244,246)' : 'inherit'};
  // box-shadow: ${show ? standardBoxShadow() : 'none'};
  border: ${show ? '1px solid darkgrey' : 'none'};
  border-radius: 3px;
  padding: 8px;
`));

const PaymentToPromoteWrapper  = styled('div')`
  margin-bottom: 15px;
`;

const PaymentWrapper  = styled('div')`
  text-align: center;
`;

const WhatYouGet = styled('div')`
  font-size: 1.3rem;
`;

export default withStyles(payToPromoteProcessStyles)(PayToPromoteProcess);
