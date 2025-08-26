import { Launch } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Button, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import TagManager from 'react-gtm-module';
import { Helmet } from 'react-helmet-async';
import styled, { createGlobalStyle } from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import DonateActions from '../../common/actions/DonateActions';
import DonationListForm from '../../common/components/Donation/DonationListForm';
import DonorboxCordova from '../../common/components/Donation/DonorboxCordova';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import DonateStore from '../../common/stores/DonateStore';
import initializejQuery from '../../common/utils/initializejQuery';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import { Section } from '../../components/Welcome/sectionStyles';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

const DonorboxEmbed = React.lazy(() => import(/* webpackChunkName: 'DonorboxEmbed' */ '../../common/components/Donation/DonorboxEmbed'));

/* global $ */

// const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);

const donationPhoto = normalizedImagePath('/img/global/photos/woman-voting-donation-page.png');

class Donate extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);

    this.state = {
      isC4Donation: false,
      isMonthly: true,
      joining: true,
      preDonation: true,
      okToDonateWithoutAuth: true,
      // showWaiting: false,
      value: '7.00',
      readMore: false,
      windowWidth: window.innerWidth,
      dataLayerSent: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onAmountFieldChange = this.onAmountFieldChange.bind(this);
    this.onDonateStoreChange = this.onDonateStoreChange.bind(this);
    this.onSuccessfulDonation = this.onSuccessfulDonation.bind(this);
    this.onVerifyCaptcha = this.onVerifyCaptcha.bind(this);
    this.onVoterStoreChange = this.onVoterStoreChange.bind(this);
  }

  componentDidMount () {
    const { dataLayerSent } = this.state;
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange);
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange);
    AnalyticsActions.saveActionDonateVisit(VoterStore.electionId());
    DonateActions.donationRefreshDonationList();
    window.scrollTo(0, 0);
    window.addEventListener('resize', this.handleResize);

    if (!dataLayerSent && VoterStore.getVoterWeVoteId()) {
      const dataLayerObject = {
        actionDetails: {
          actionType: 'landing',
        },
        event: 'landing',
        pageDetails: getPageDetails(),
        userDetails: VoterStore.getAnalyticsUserDetails(),
      };
      TagManager.dataLayer({ dataLayer: dataLayerObject });
      this.setState({ dataLayerSent: true });
    }
  }

  componentDidUpdate () {
    const { isC4Donation, dataLayerSent } = this.state;
    if (isC4Donation) {
      initializejQuery(() => {
        const { $ } = window;
        const spot = $('#CaptchaSpot');
        spot.css({ margin: '0 auto', width: '31%', 'padding-top': '16px' });
      });
    }

    if (!dataLayerSent && VoterStore.getVoterWeVoteId()) {
      const dataLayerObject = {
        actionDetails: {
          actionType: 'landing',
        },
        event: 'landing',
        pageDetails: getPageDetails(),
        userDetails: VoterStore.getAnalyticsUserDetails(),
      };
      TagManager.dataLayer({ dataLayer: dataLayerObject });
      this.setState({ dataLayerSent: true });
    }
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    this.voterStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  onDonateStoreChange () {
    const { isC4Donation } = this.state;
    if (isC4Donation) {
      if (DonateStore.donationSuccess() && DonateStore.donationResponseReceived()) {
        this.onSuccessfulDonation();
      } else {
        this.forceUpdate();
      }
    }
  }

  onVoterStoreChange () {
    this.setState({});
  }


  /*
  An enter keystroke in the react-bootstrap InputGroup, (or in the original react "input-group")
  causes a page reload, and you lose context.  So swallow the 'Enter' keystroke event while in
  the InputGroup.
  */
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  handleChange = (event) => {
    const { name } = event.currentTarget;
    const isMonthly = name === 'isMonthly';
    this.setState({ isMonthly });
  };

  handleResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  onSuccessfulDonation () {
    console.log('onSuccessfulDonation in Donate ------------------------------');
    console.log('Donation store changed in Donate, Checkout form removed');
    this.setState({
      // showWaiting: true,
      preDonation: false,
    });
  }

  onAmountFieldChange (event) {
    console.log(event.target.value);
    this.setState({
      value: event.target.value,
    });
  }

  onVerifyCaptcha (token) {
    const { isC4Donation } = this.state;
    if (isC4Donation) {
      // console.log('------------ onVerifyCaptcha: ', token);
      $.ajax({
        endpoint: 'googleRecaptchaVerify',
        data: { token },
        success: (res) => {
          const { allowedToDonate, captchaScore, blockedByCaptcha, blockedByOther } = res;
          const weVoteId = VoterStore.getVoterWeVoteId();
          const time = weVoteId !== '' ? 0 : 1000;  // Only during testing, if you start the session on this page, the captcha results can beat the voter_retrieve
          setTimeout(() => {
            const isSignedin = VoterStore.getVoterIsSignedIn();
            const pass = allowedToDonate || isSignedin ? 'passed' : 'failed';
            const signed = isSignedin ? '(signed in)' : '(not signed in)';
            console.log(`reCAPTCHA ${pass} this user ${signed} with score: ${captchaScore}, blockedByCaptcha: ${blockedByCaptcha}, blockedByOther: ${blockedByOther}`);
            this.setState({
              okToDonateWithoutAuth: allowedToDonate,
              isSignedin,
            });
            if (!allowedToDonate) {
              $.ajax({
                endpoint: 'logToCloudWatch',
                data: { message: `reCAPTCHA FAILED verification signedIn ${isSignedin}, results ${JSON.stringify(res)}` },
              });
            }
          }, time);
        },
      });
    }
  }

  postDonationDescription  = () => (
    <DonateCaveat>
      New subscriptions may take a few minutes to appear in this list.  The first payment for new subscriptions may also be delayed.
    </DonateCaveat>
  );

  preDonateDescription = () => (
    <span id="first_paragraph">
      Thank you for being a voter! For every $10 donated, you help 50 Americans be voters too.
      {/* When people feel prepared to vote, they’re more likely to cast a ballot — especially in local and primary elections, where participation is lowest. At */}
      {/* WeVote our mission is to close the confidence gap that keeps so many voters on the sidelines. */}
    </span>
  );

  preDonateDescriptionBottom = (isC4Donation) => (
    <span id="second_paragraph">
      <OpenExternalWebSite
        linkIdAttribute="annualBudget"
        url={isC4Donation ? 'https://projects.propublica.org/nonprofits/organizations/811052585' : 'https://projects.propublica.org/nonprofits/organizations/472691544'}
        target="_blank"
        body={(
          <span id="budgets_small">
            Our budgets are small,
            <Launch
              style={{
                height: 14,
                marginLeft: 2,
                marginTop: '-3px',
                width: 14,
              }}
            />
          </span>
        )}
      />
      so every
      {' '}
      {isC4Donation ? '' : 'tax-deductible '}
      donation helps us reach more voters.
      <br />
      <br />
      Expenses include server costs ($600 - $2,500 per month), data fees (~$40,000 per year), collaboration tools and other hard costs.
    </span>
  );

  donationDescriptionReadMore = (readMore, isC4Donation) => (
    <DonationDescriptionContainer>
      <DonationDescription id="donation_copy">
        When people feel prepared to vote, they’re more likely to cast a ballot — especially in local elections, where participation is lowest.
        {' '}
        At WeVote, our mission is to close the confidence gap so more voters bring their voices into our democracy.
      </DonationDescription>
      {readMore && (
        <>
          <p>
            We don’t take sides. Instead, we help people feel informed and ready to vote.
            Because WeVote is 100% volunteer-run, your donation directly powers
            our work.
            Our tools are free for voters, but not free to build and maintain.
          </p>
          <p>
            $1 equips 1 voter with personalized, nonpartisan ballot
            information
          </p>
          <p>
            $50 brings WeVote to 500 new voters
          </p>
          <p>
            $100 educates 1 college intern
          </p>
          <p>
            $250 brings in top volunteers by fueling recruiting systems for 1 month
          </p>
          <p>
            $500 powers our digital infrastructure for 1 week
          </p>
        </>
      )}
      <DonationDescription>
        Give now to help more Americans feel confident and prepared to vote.
        <br />
        {!readMore && (
          <ReadMoreButton
            onClick={() => {
              const dataLayerObject = {
                event: 'action',
                actionDetails: {
                  actionType: 'showMore',
                  buttonId: 'readMoreButton',
                },
                pageDetails: getPageDetails(),
                userDetails: VoterStore.getAnalyticsUserDetails(),
              };

              TagManager.dataLayer({ dataLayer: dataLayerObject });

              this.setState({ readMore: true });
            }}
          >
            Read more
          </ReadMoreButton>
        )}
      </DonationDescription>
      {readMore && (
        <OpenExternalWebSiteWrapper>
          <StyledLink
            to="/donatefaq"
            target="_blank"
            rel="noopener noreferrer"
          >
            Questions about donating?
            <Launch
              style={{
                height: 14,
                marginLeft: 2,
                marginTop: '-3px',
                width: 14,
              }}
            />
          </StyledLink>
        </OpenExternalWebSiteWrapper>
      )}
    </DonationDescriptionContainer>
  );

  changeValue (newValue) {
    const { joining } = this.state;
    if (!joining) {
      const { showFooter } = this.props;
      showFooter(false);
    }
    this.setState({
      value: newValue,
      joining: true,
    });
  }

  render () {
    renderLog('Donate');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { isC4Donation, isSignedin, joining, value, isMonthly, preDonation, okToDonateWithoutAuth, windowWidth } = this.state;

    // Default donation goes to c3, unless we specify a donation to the c4
    let c3DonationHtml = '';
    let c4DonationHtml = '';

    if (!isC4Donation) {
      c3DonationHtml = (
        <C3DonationWrapper>
          <AddShadowToHeader />
          <ResetMargin />
          <Wrapper>
            <Helmet>
              <title>Donate - WeVote</title>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <script src="https://donorbox.org/widget.js" paypalExpress="true" defer />
            </Helmet>
            {/* <ContentTitle id="want_to_vote"> */}
            {/*  Want more Americans to vote? */}
            {/* </ContentTitle> */}
            <CenteredText className="u-show-mobile">
              <Section noTopMargin>
                <DonateDescriptionContainer>
                  {/* {this.preDonateDescription()} */}
                  {/* {' '} */}
                  {/* {this.preDonateDescriptionBottom(isC4Donation)} */}
                  {this.donationDescriptionReadMore(this.state.readMore, isC4Donation)}
                </DonateDescriptionContainer>
                <InnerWrapper>
                  <DonorboxWrapper>
                    <Suspense fallback={<div>Loading...</div>}>
                      {isWebApp() ? <DonorboxEmbed /> : <DonorboxCordova />}
                    </Suspense>
                  </DonorboxWrapper>
                </InnerWrapper>
              </Section>
            </CenteredText>
            {windowWidth > 532 && (
              <TwoColumns>
                <TextAndDonorboxColumn className="u-show-desktop-tablet">
                  {/* {this.preDonateDescription()} */}
                  {/* {' '} */}
                  {/* {this.preDonateDescriptionBottom(isC4Donation)} */}
                  {this.donationDescriptionReadMore(this.state.readMore, isC4Donation)}
                  <InnerWrapper>
                    <DonorboxWrapper>
                      <Suspense fallback={<div>Loading...</div>}>
                        <DonorboxEmbed />
                      </Suspense>
                    </DonorboxWrapper>
                  </InnerWrapper>
                </TextAndDonorboxColumn>
                <DonationImageContainer>
                  <DonationImage
                    src={donationPhoto}
                  />
                </DonationImageContainer>
              </TwoColumns>
            )}
            <br />
            <br />
          </Wrapper>
        </C3DonationWrapper>
      );
    } else {
      c4DonationHtml = (
        <C4DonationWrapper>
          <Wrapper>
            <Helmet title="Donate - WeVote" />
            <ContentTitle>
              {preDonation ? 'Want more Americans to vote?' : 'Thank you for your donation!'}
            </ContentTitle>
            <InnerWrapper>
              {preDonation ? (
                <CenteredText>
                  <Section noTopMargin>
                    <DonateDescriptionContainer>
                      {this.preDonateDescription()}
                    </DonateDescriptionContainer>
                  </Section>
                </CenteredText>
              ) : this.postDonationDescription()}
              {preDonation ? (
                <>
                  <GoogleReCaptchaProvider
                    reCaptchaKey={webAppConfig.GOOGLE_RECAPTCHA_KEY}
                    container={{ element: 'CaptchaSpot' }}
                  >
                    {okToDonateWithoutAuth || isSignedin ? (
                      <>
                        <ContributeGridWrapper>
                          <ContributeMonthlyText>
                            <FormControl component="fieldset"
                                         className={classes.formControl}
                            >
                              <RadioGroup row>
                                <FormControlLabel
                                  control={(
                                    <Radio
                                      checked={isMonthly}
                                      onChange={this.handleChange}
                                      name="isMonthly"
                                      style={{ color: 'black' }}
                                    />
                                  )}
                                  label="Donate monthly"
                                  id="donateMonthlyRadio"
                                />
                                <FormControlLabel
                                  control={(
                                    <Radio
                                      checked={!isMonthly}
                                      onChange={this.handleChange}
                                      name="oneTime"
                                      style={{ color: 'black' }}
                                    />
                                  )}
                                  label="One time donation"
                                  id="oneTimeDonationRadio"
                                />
                              </RadioGroup>
                            </FormControl>
                          </ContributeMonthlyText>
                          <ContributeGridSection>
                            {['7', '12', '36', '150'].map((price) => (
                              <ContributeGridItem key={`gridItem-${price}`}>
                                <Button
                                  classes={{ root: classes.buttonRoot }}
                                  variant="contained"
                                  sx={{
                                    ':hover': {
                                      color: 'white',
                                    },
                                  }}
                                  onClick={() => this.changeValue(`${price}.00`)}
                                >
                                  {`$${price}`}
                                </Button>
                              </ContributeGridItem>
                            ))}
                            <ContributeGridItemJoin joining={joining}>
                              {!joining ? (
                                <Button
                                  classes={{ root: classes.buttonRoot }}
                                  color="primary"
                                  variant="contained"
                                  style={{
                                    width: '100%',
                                    backgroundColor: 'darkblue',
                                    color: 'white',
                                  }}
                                  onClick={() => this.changeValue('5.00')}
                                >
                                  Join
                                </Button>
                              ) : (
                                <TextField
                                  id="currency-input"
                                  label="Amount"
                                  variant="outlined"
                                  value={value}
                                  onChange={this.onAmountFieldChange}
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
                                  style={{
                                    marginTop: 6,
                                    textAlign: 'center',
                                    width: 150,
                                  }}
                                />
                              )}
                            </ContributeGridItemJoin>
                          </ContributeGridSection>
                        </ContributeGridWrapper>
                        {/* <PaymentWrapper joining={joining}>
                          <PaymentCenteredWrapper>
                            <Elements stripe={stripePromise}>
                              <InjectedCheckoutForm
                                value={value}
                                classes={{}}
                                isMonthly={isMonthly}
                                showWaiting={showWaiting}
                              />
                            </Elements>
                          </PaymentCenteredWrapper>
                        </PaymentWrapper> */}
                      </>
                    ) : (
                      <ReCaptchaFailed>
                        Please sign in to donate
                      </ReCaptchaFailed>
                    )}
                    <GoogleReCaptcha onVerify={this.onVerifyCaptcha} style={{ margin: '0 auto', width: '40%' }} />
                  </GoogleReCaptchaProvider>
                </>
              ) : null}
              {preDonation && (
                <Section noTopMargin>
                  <DonateDescriptionContainer>
                    {this.preDonateDescriptionBottom(isC4Donation)}
                  </DonateDescriptionContainer>
                </Section>
              )}
              <DonationListForm
                isCampaign={false}
                leftTabIsMembership={false}
              />
              {preDonation && (
                <Section>
                  <DonateDescriptionContainer>
                    Contributions or gifts made on this page are not tax
                    deductible, and fund We Vote USA, a 501(c)(4) nonprofit.
                    Over 50 awesome people like yourself have donated to make We
                    Vote possible.
                    {' '}
                    WeVote also has a 501(c)(3) nonprofit that welcomes
                    {' '}
                    {/* This is a mailto! Shouldn't be visible in iPhone or Android apps. */}
                    <a
                      href="https://donorbox.org/we-vote-tax-deductible?default_interval=m&amount=10"
                      title="I would like to donate to WeVote's tax-deductible 501(c)(3)"
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ color: '#4371cc' }}
                    >
                      tax deductible donations
                      {' '}
                      <Launch
                        style={{
                          height: 14,
                          marginLeft: 2,
                          marginTop: '-3px',
                          width: 14,
                        }}
                      />
                      .
                    </a>
                  </DonateDescriptionContainer>
                </Section>
              )}
            </InnerWrapper>
          </Wrapper>
        </C4DonationWrapper>
      );
    }

    return (
      <DonatePageContentContainer>
        {isC4Donation ? c4DonationHtml : c3DonationHtml}
      </DonatePageContentContainer>
    );
  }
}
Donate.propTypes = {
  classes: PropTypes.object,
  showFooter: PropTypes.bool,
};

const styles = (theme) => ({
  buttonContained: {
    borderRadius: 32,
    height: 50,
    [theme.breakpoints.down('md')]: {
      height: 36,
    },
  },
  buttonRoot: {
    fontSize: 18,
    textTransform: 'none',
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
  },
  textFieldRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    boxShadow: standardBoxShadow('medium'),
  },
  textFieldInputRoot: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 18,
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

const C3DonationWrapper = styled('div')`
  min-height: 100%;
`;

const C4DonationWrapper = styled('div')`
`;

const CenteredText = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`;

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  text-align: center !important;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const DonorboxWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 300px;
`;

const Wrapper = styled('div')`
  display: flex;
  overflow-x: hidden;
  height: 100%;

  @media (max-width: 532px) {
    flex-direction: column;
  }
`;

const InnerWrapper = styled('div')`
  margin-bottom: 16px;
`;

const DonateDescriptionContainer = styled('div')`
  margin: 1.5em auto .25em;
  width: 960px;
  max-width: 90vw;
  text-align: left;
  @media (min-width: 960px) and (max-width: 991px) {
    > * {
      width: 90%;
      margin: 0 auto;
    }
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    margin: 0 auto;
  }
`;

// const PaymentWrapper  = styled('div', {
//   shouldForwardProp: (prop) => !['joining'].includes(prop),
// })(({ joining }) => (`
//   display: ${joining ? '' : 'none'};
//   text-align: center;
// `));

const ReCaptchaFailed  = styled('div')`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  padding: 32px;
`;

const DonateCaveat = styled('p')`
  font-size: 17px;
  text-align: center;
  margin-top: 1em;
  font-style: italic;
`;

// const PaymentCenteredWrapper  = styled('div')(({ theme }) => (`
//   width: 500px;
//   ${theme.breakpoints.down('sm')} {
//     width: 300px;
//   }
//   display: inline-block;
//   background-color: rgb(246, 244,246);
//   box-shadow: ${standardBoxShadow('medium')};
//   border: 2px solid darkgrey;
//   border-radius: 3px;
//   padding: 8px;
// `));


const ContributeGridWrapper = styled('div')(({ theme }) => (`
  background-color: #ebebeb;
  padding: 10px;
  border: 1px solid darkgrey;
  margin: auto auto 20px auto;
  width: 500px;
  ${theme.breakpoints.down('sm')} {
    width: 300px;
`));

const ContributeGridSection = styled('div')`
  display: grid;
  grid-template-columns: auto auto;
  background-color: #ebebeb;
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

const ContributeGridItemJoin = styled('div', {
  shouldForwardProp: (prop) => !['joining'].includes(prop),
})(({ joining }) => (`
  ${joining ?
    'padding: 5px 10px;' :
    'padding: 5px 10px;'
  };
  background-color: #ebebeb;
  font-size: 30px;
  text-align: center;
  grid-column: auto / span 2;
`));

const DonationImageContainer = styled('div')`
  display: flex;
  height: 100%;
  overflow: hidden;
  margin-left: -8%;
`;

const TextAndDonorboxColumn = styled('div')`
  max-width: 400px;
  background-color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const DonationImage = styled('img')`
  height: 100%;
  object-fit: cover;
  display: block;
  position: fixed;
  padding-top: ${isTablet() ? '40px' : ''};
`;

const DonationDescriptionContainer = styled('div')`
  padding: 0 20px;
  margin-top: 50px;

  @media (max-width: 532px) {
    margin-top: 30px;
    padding: 0;
  }
`;

const DonationDescription = styled('p')`
`;

const TwoColumns = styled('div')`
  margin-left: 13%;
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

const ReadMoreButton = styled('button')`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${DesignTokenColors.primary700};
  padding: 8px 0;
  text-decoration: underline;
  text-decoration-color: ${DesignTokenColors.primary700};
  &:hover {
    opacity: 0.6;
  }
`;

const DonatePageContentContainer = styled(PageContentContainer)`
  min-width: 100%;
  background-color: #0d5470;
  padding-top: 20px;
`;

const OpenExternalWebSiteWrapper = styled('div')`
  margin: 8px 0 24px 0;
`;


const ResetMargin = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const AddShadowToHeader = createGlobalStyle`
  .HeaderBarWrapper {
    box-shadow: ${standardBoxShadow('wide')};
    border-bottom: 1px solid rgb(170, 170, 170);
  }
`;

const StyledLink = styled(Link)`
  color: ${DesignTokenColors.primary600};
  text-decoration: none;

  &:hover {
    color: ${DesignTokenColors.primary700};
    text-decoration: underline;
  }
`;


export default withStyles(styles)(Donate);
