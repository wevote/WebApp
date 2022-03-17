import { Button, FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import AnalyticsActions from '../../actions/AnalyticsActions';
import DonateActions from '../../common/actions/DonateActions';
import DonationListForm from '../../common/components/Donation/DonationListForm';
import InjectedCheckoutForm from '../../common/components/Donation/InjectedCheckoutForm';
import ExternalLinkIcon from '../../common/components/Widgets/ExternalLinkIcon';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import DonateStore from '../../common/stores/DonateStore';
import { renderLog } from '../../common/utils/logging';
import { Section } from '../../components/Welcome/sectionStyles';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';

const WelcomeAppbar = React.lazy(() => import(/* webpackChunkName: 'WelcomeAppbar' */ '../../components/Navigation/WelcomeAppbar'));
const WelcomeFooter = React.lazy(() => import(/* webpackChunkName: 'WelcomeFooter' */ '../../components/Welcome/WelcomeFooter'));

const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);


class Donate extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);

    this.state = {
      isMonthly: false,
      joining: true,
      preDonation: true,
      showWaiting: false,
      value: '10.00',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onAmountFieldChange = this.onAmountFieldChange.bind(this);
    this.onDonateStoreChange = this.onDonateStoreChange.bind(this);
    this.onSuccessfulDonation = this.onSuccessfulDonation.bind(this);
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange);
    AnalyticsActions.saveActionDonateVisit(VoterStore.electionId());
    DonateActions.donationRefreshDonationList();
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  onDonateStoreChange () {
    if (DonateStore.donationSuccess() && DonateStore.donationResponseReceived()) {
      this.onSuccessfulDonation();
    } else {
      this.forceUpdate();
    }
  }

  /*
  An enter keystroke in the react-bootstrap InputGroup, (or in the original react "input-group",)
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

  onSuccessfulDonation () {
    console.log('onSuccessfulDonation in Donate ------------------------------');
    console.log('Donation store changed in Donate, Checkout form removed');
    this.setState({
      showWaiting: true,
      preDonation: false,
    });
  }

  onAmountFieldChange (event) {
    console.log(event.target.value);
    this.setState({
      value: event.target.value,
    });
  }

  postDonationDescription  = () => (
    <DonateCaveat>
      New subscriptions may take a few minutes to appear in this list.  The first payment for new subscriptions may also be delayed.
    </DonateCaveat>
  );

  preDonateDescription = () => (
    <Section noTopMargin>
      <DonateDescriptionContainer>
        We Vote is a nonprofit technology startup,
        {' '}
        <Link to="/more/about" style={{ color: '#4371cc' }}>
          built by volunteers
        </Link>
        {' '}
        to strengthen American democracy.
        {' '}
        <OpenExternalWebSite
          linkIdAttribute="annualBudget"
          url="https://projects.propublica.org/nonprofits/organizations/811052585"
          target="_blank"
          body={(
            <span>
              Our annual budgets are very small&nbsp;
              <ExternalLinkIcon largeBlue />
            </span>
          )}
        />
        , so every donation helps us pay for critical services. Over 50 awesome people like yourself have donated to make We Vote possible.
        {' '}
      </DonateDescriptionContainer>
      <DonateDescriptionContainer style={{ paddingBottom: 12 }}>
        Contributions or gifts made on this page are not tax deductible, and fund We Vote USA, a 501(c)(4) nonprofit.
        We Vote also has a 501(c)(3) nonprofit that welcomes
        {' '}
        {/* This is a mailto! Shouldn't be visible in iPhone or Android apps. */}
        <a href={"mailto:donate@WeVoteEducation.org?subject=Donate to We Vote's 501(c)(3)&body=I am interested in making at tax deductible donating to We Vote's 501(c)(3)."}
           title="I would like to donate to We Vote's 501(c)(3)"
           rel="noopener noreferrer"
           target="_blank"
           style={{ color: '#4371cc' }}
        >
          tax deductible donations
          {' '}
          <ExternalLinkIcon largeBlue />
          .
        </a>
      </DonateDescriptionContainer>
    </Section>
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
    const { joining, showWaiting, value, isMonthly, preDonation } = this.state;

    return (
      <Wrapper>
        <Helmet title="Donate - We Vote" />
        <Suspense fallback={<></>}>
          <WelcomeAppbar pathname="/more/pricing" />
        </Suspense>
        <HeaderForDonate>
          <DonateTitle>{preDonation ? 'Donate' : 'Thank you for your donation!'}</DonateTitle>
        </HeaderForDonate>
        <InnerWrapper>
          {preDonation ? this.preDonateDescription() : this.postDonationDescription()}
          {preDonation ? (
            <>
              <ContributeGridWrapper>
                <ContributeMonthlyText>
                  <FormControl component="fieldset"
                               className={classes.formControl}
                  >
                    <FormLabel component="legend">
                      Make a donation by credit card
                    </FormLabel>
                    <RadioGroup row>
                      <FormControlLabel
                        control={<Radio checked={!isMonthly} onChange={this.handleChange} name="oneTime" style={{ color: 'black' }} />}
                        label="One time Donation"
                      />
                      <FormControlLabel
                        control={<Radio checked={isMonthly} onChange={this.handleChange} name="isMonthly" style={{ color: 'black' }} />}
                        label="Donate monthly"
                      />
                    </RadioGroup>
                  </FormControl>
                </ContributeMonthlyText>
                <ContributeGridSection>
                  {['5', '10', '20', '50'].map((price) => (
                    <ContributeGridItem key={`gridItem-${price}`}>
                      <Button
                        classes={{ root: classes.buttonRoot }}
                        variant="contained"
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
                          width: 100,
                        }}
                      />
                    )}
                  </ContributeGridItemJoin>
                </ContributeGridSection>
              </ContributeGridWrapper>
              <PaymentWrapper joining={joining}>
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
              </PaymentWrapper>
            </>
          ) : null}
          <DonationListForm
            isCampaign={false}
            leftTabIsMembership={false}
          />
        </InnerWrapper>
        <Suspense fallback={<></>}>
          <WelcomeFooter />
        </Suspense>
      </Wrapper>
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
    [theme.breakpoints.down('lg')]: {
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
    boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0px rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
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

const Wrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

const InnerWrapper = styled('div')`
  margin-bottom: 16px;
`;

const HeaderForDonate = styled('div')`
  position: relative;
  height: 190px;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 190px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 150px;
  }
`;

const DonateTitle = styled('h1')`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-top: 3em;
  margin-bottom: 0;
  padding-bottom: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
    margin-top: 3em;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 18px;
    margin-top: 5em;
  }
`;

const DonateDescriptionContainer = styled('div')`
  margin: 1em auto;
  margin-bottom: 0;
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

const PaymentWrapper  = styled('div')`
  display: ${({ joining }) => ((joining) ? '' : 'none')};
  text-align: center;
`;

const DonateCaveat = styled('p')`
  font-size: 17px;
  text-align: center;
  margin-top: 1em;
  font-style: italic;
`;

const PaymentCenteredWrapper  = styled('div')`
  width: 500px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 300px;
  }
  display: inline-block;
  background-color: rgb(246, 244,246);
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0px rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  border: 2px solid darkgrey;
  border-radius: 3px;
  padding: 8px;
`;


const ContributeGridWrapper = styled('div')`
  background-color: #ebebeb;
  padding: 10px;
  border: 1px solid darkgrey;
  margin: auto auto 20px auto;
  width: 500px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 300px;
`;

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

const ContributeGridItemJoin = styled('div')`
  ${({ joining }) => ((joining) ?
    'padding: 5px 10px;' :
    'padding: 5px 10px;'
  )};
  background-color: #ebebeb;
  font-size: 30px;
  text-align: center;
  grid-column: auto / span 2;
`;


// const OuterWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   margin: 0 0 5px 0;
// `;


export default withStyles(styles)(Donate);
