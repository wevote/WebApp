import loadable from '@loadable/component';
import { Button, InputAdornment, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import CampaignActions from '../../actions/CampaignActions';
import DonationListForm from '../../components/Donation/DonationListForm';
import InjectedCheckoutForm from '../../components/Donation/InjectedCheckoutForm';
import standardBoxShadow from '../../components/Style/standardBoxShadow';
import { OuterWrapper, PageWrapper } from '../../components/Style/stepDisplayStyles';
import LoadingWheelComp from '../../components/Widgets/LoadingWheelComp';
import DonateStore from '../../stores/DonateStore';
import historyPush from '../../utils/historyPush';
import { renderLog } from '../../utils/logging';
import { SkipForNowButtonPanel, SkipForNowButtonWrapper } from '../../components/Style/CampaignSupportStyles';
import webAppConfig from '../../../config';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import initializejQuery from '../../utils/initializejQuery';


const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);
const VoterFirstRetrieveController = loadable(() => import(/* webpackChunkName: 'VoterFirstRetrieveController' */ '../../components/Settings/VoterFirstRetrieveController'));

class CampaignSupportPayToPromoteProcess extends Component {
  constructor (props) {
    super(props);

    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      loaded: false,
      chipInPaymentValue: '3.00',
      chipInPaymentOtherValue: '',
      preDonation: true,
      showWaiting: false,
      voterFirstName: '',
    };
    this.onOtherAmountFieldChange = this.onOtherAmountFieldChange.bind(this);
    this.onChipIn = this.onChipIn.bind(this);
    this.stopShowWaiting = this.stopShowWaiting.bind(this);
  }

  componentDidMount () {
    initializejQuery(() => {
      // console.log('CampaignSupportPayToPromoteProcess, componentDidMount after init jQuery');
      const { setShowHeaderFooter } = this.props;
      setShowHeaderFooter(false);
      this.setState({ loaded: true });
      this.onAppObservableStoreChange();
      this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
      this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
      this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
      // dumpCookies();
      this.onVoterStoreChange();
      this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
      const { match: { params } } = this.props;
      const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignTitle,
        campaignXWeVoteId,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      if (!campaignXWeVoteId) {
        console.log('CampaignSupportPayToPromoteProcess mount did not receive a campaignXWeVoteId');
        CampaignActions.campaignRetrieveBySEOFriendlyPath(campaignSEOFriendlyPathFromParams);
      } else {
        this.setState({
          campaignTitle,
        });
        if (campaignSEOFriendlyPath) {
          this.setState({
            campaignSEOFriendlyPath,
          });
        } else if (campaignSEOFriendlyPathFromParams) {
          this.setState({
            campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
          });
        }
        if (campaignXWeVoteId) {
          this.setState({
            campaignXWeVoteId,
          });
        } else if (campaignXWeVoteIdFromParams) {
          this.setState({
            campaignXWeVoteId: campaignXWeVoteIdFromParams,
          });
        }
        // Take the "calculated" identifiers and retrieve if missing
        retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
        DonateStore.noDispatchClearStripeErrorState();
      }
    });
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.campaignStoreListener.remove();
    this.donateStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignTitle,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
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

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getVoterFirstName();
    this.setState({
      voterFirstName,
    });
  }

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
    console.log('onChipIn in CampaignSupportPayToPromoteProcess ------------------------------');
    console.log('Donation store changed in CampaignSupportPayToPromoteProcess, Checkout form removed');
    this.setState({
      showWaiting: true,
    });
  }

  goToIWillShare = () => {
    const pathForNextStep = `${this.getCampaignBasePath()}/share-campaign`;
    historyPush(pathForNextStep);
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
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
    renderLog('CampaignSupportPayToPromoteProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignTitle, chipInPaymentValue, chipInPaymentOtherValue, chosenWebsiteName,
      loaded, showWaiting, voterFirstName, campaignXWeVoteId, preDonation,
    } = this.state;
    const htmlTitle = `Payment to support ${campaignTitle} - ${chosenWebsiteName}`;
    if (campaignXWeVoteId === undefined || campaignXWeVoteId === '') {
      // console.error('Must have a campaignXWeVoteId defined in CampaignSupportPayToPromoteProcess to make a "chip in"');
      return (
        <LoadingWheelComp />
      );
    }
    if (!loaded) {
      return (
        <LoadingWheelComp message="Waiting..." />
      );
    }
    let thankYouText = preDonation ?
      'Thank you for helping this campaign reach more voters' :
      `Your Chip In donation to "${campaignTitle}" is on its way!  Thank you`;
    thankYouText += voterFirstName ? `, ${voterFirstName}.` : '.';

    const { location: { pathname } } = window;
    const pieces = pathname.split('/');
    const returnPath = pieces && pieces.length > 3 ? `/${pieces[1]}/${pieces[2]}` : '/start-a-campaign';

    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <IntroductionMessageSection>
                <ContentTitle>
                  {thankYouText}
                </ContentTitle>
              </IntroductionMessageSection>
              <ContributeGridWrapper show={preDonation}>
                <ContributeMonthlyText>
                  Please chip in what you can with a one-time contribution:
                </ContributeMonthlyText>
                <ContributeGridSection>
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '3' || chipInPaymentValue === '3.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('3.00')}
                    >
                      <ButtonInsideWrapper>
                        <WhatYouGet>
                          <span className="u-show-mobile">25 views</span>
                          <span className="u-show-desktop-tablet">25 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $3
                        </PaymentAmount>
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
                        <WhatYouGet>
                          <span className="u-show-mobile">200 views</span>
                          <span className="u-show-desktop-tablet">200 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $15
                        </PaymentAmount>
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
                        <WhatYouGet>
                          <span className="u-show-mobile">750 views</span>
                          <span className="u-show-desktop-tablet">750 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $35
                        </PaymentAmount>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '50' || chipInPaymentValue === '50.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('50.00')}
                    >
                      <ButtonInsideWrapper>
                        <WhatYouGet>
                          <span className="u-show-mobile">1,250 views</span>
                          <span className="u-show-desktop-tablet">1,250 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $50
                        </PaymentAmount>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
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
          </PaymentWrapper>
          <DonationListForm isCampaign leftTabIsMembership={false} />
          <SkipForNowButtonWrapper>
            <SkipForNowButtonPanel show={preDonation}>
              <Button
                classes={{ root: classes.buttonSimpleLink }}
                color="primary"
                id="skipPayToPromote"
                onClick={this.goToIWillShare}
              >
                Sorry, I can&apos;t chip in right now
              </Button>
            </SkipForNowButtonPanel>
          </SkipForNowButtonWrapper>
        </PageWrapper>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
CampaignSupportPayToPromoteProcess.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
};

const styles = () => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonRoot: {
    border: '1px solid #2e3c5d',
    fontSize: 18,
    textTransform: 'none',
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
  },
  buttonRootSelected: {
    border: '1px solid #236AC7',  // as in the Material UI example
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    color: '#236AC7',
    backgroundColor: 'white',
  },
  buttonSimpleLink: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textDecoration: 'underline',
    textTransform: 'none',
    minWidth: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  textFieldRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    boxShadow: standardBoxShadow(),
  },
  textFieldInputRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
  },
  stripeAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    // height: 40,
    fontSize: 14,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      // height: 35,
      fontSize: 14,
    },
  },
});

const ButtonInsideWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

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

const IntroductionMessageSection = styled('div')(({ theme }) => (`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  ${theme.breakpoints.down('md')} {
    padding: 0 1em;
  }
`));

const InnerWrapper = styled('div')`
`;

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
  box-shadow: ${show ? standardBoxShadow() : 'none'};
  border: ${show ? '2px solid darkgrey' : 'none'};
  border-radius: 3px;
  padding: 8px;
`));

const PaymentWrapper  = styled('div')`
  text-align: center;
`;

const WhatYouGet = styled('div')`
  font-size: 1.3rem;
`;

export default withStyles(styles)(CampaignSupportPayToPromoteProcess);
