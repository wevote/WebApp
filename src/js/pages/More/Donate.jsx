import { Launch } from '@mui/icons-material';
import { Button, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import DonateActions from '../../common/actions/DonateActions';
import DonationListForm from '../../common/components/Donation/DonationListForm';
import InjectedCheckoutForm from '../../common/components/Donation/InjectedCheckoutForm';
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
import DonateStore from '../../common/stores/DonateStore';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer, standardBoxShadow } from '../../components/Style/pageLayoutStyles';
import { Section } from '../../components/Welcome/sectionStyles';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';

const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);


class Donate extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);

    this.state = {
      isMonthly: true,
      joining: true,
      preDonation: true,
      showWaiting: false,
      value: '7.00',
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
        For every $7 donated, we reach 50 Americans.
        {' '}
        Please join us with a monthly donation.
        {' '}
        <OpenExternalWebSite
          linkIdAttribute="annualBudget"
          url="https://projects.propublica.org/nonprofits/organizations/811052585"
          target="_blank"
          body={(
            <span>
              Our budgets are small&nbsp;
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
        , so every donation helps us reach more voters, and pay for critical services, like servers and data fees.
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
      <PageContentContainer>
        <Wrapper>
          <Helmet title="Donate - We Vote" />
          <ContentTitle>
            {preDonation ? 'Want to make sure more Americans vote?' : 'Thank you for your donation!'}
          </ContentTitle>
          <InnerWrapper>
            {preDonation ? this.preDonateDescription() : this.postDonationDescription()}
            {preDonation ? (
              <>
                <ContributeGridWrapper>
                  <ContributeMonthlyText>
                    <FormControl component="fieldset"
                                 className={classes.formControl}
                    >
                      <RadioGroup row>
                        <FormControlLabel
                          control={<Radio checked={isMonthly} onChange={this.handleChange} name="isMonthly" style={{ color: 'black' }} />}
                          label="Donate monthly"
                        />
                        <FormControlLabel
                          control={<Radio checked={!isMonthly} onChange={this.handleChange} name="oneTime" style={{ color: 'black' }} />}
                          label="One time donation"
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
            {preDonation && (
              <Section>
                <DonateDescriptionContainer>
                  Contributions or gifts made on this page are not tax deductible, and fund We Vote USA, a 501(c)(4) nonprofit. Over 50 awesome people like yourself have donated to make We Vote possible.
                  {' '}
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
      </PageContentContainer>
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

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  text-align: center !important;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

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

const DonateDescriptionContainer = styled('div')`
  // margin: 1em auto;
  margin-bottom: 12px;
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

const PaymentWrapper  = styled('div', {
  shouldForwardProp: (prop) => !['joining'].includes(prop),
})(({ joining }) => (`
  display: ${joining ? '' : 'none'};
  text-align: center;
`));

const DonateCaveat = styled('p')`
  font-size: 17px;
  text-align: center;
  margin-top: 1em;
  font-style: italic;
`;

const PaymentCenteredWrapper  = styled('div')(({ theme }) => (`
  width: 500px;
  ${theme.breakpoints.down('sm')} {
    width: 300px;
  }
  display: inline-block;
  background-color: rgb(246, 244,246);
  box-shadow: ${standardBoxShadow('medium')};
  border: 2px solid darkgrey;
  border-radius: 3px;
  padding: 8px;
`));


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

export default withStyles(styles)(Donate);
