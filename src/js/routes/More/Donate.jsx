import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  Form, InputGroup, FormControl,
} from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import DonationForm from '../../components/Donation/DonationForm';
import DonationError from '../../components/Donation/DonationError';
import DonateStore from '../../stores/DonateStore';
import DonationListForm from '../../components/Donation/DonationListForm';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import WelcomeAppbar from '../../components/Navigation/WelcomeAppbar';
import Section from '../../components/Welcome/Section';
import Footer from '../../components/Welcome/Footer';

class Donate extends Component {
  static getProps () {
    return {};
  }

  static propTypes = {
  };

  constructor (props) {
    super(props);

    this.state = {
      showCustomInput: false,
      custom_amount: '',
      donateMonthly: true,
      donationErrorMessage: '',
      radioSelected: 'monthly',
    };

    this._toggleCustomAmount = this._toggleCustomAmount.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._updateCustomAmount = this._updateCustomAmount.bind(this);
    this._toggleDonateMonthly = this._toggleDonateMonthly.bind(this);
    this._donateStoreChange = this._donateStoreChange.bind(this);
  }

  componentDidMount () {
    this._donateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this._donateStoreChange);
    AnalyticsActions.saveActionDonateVisit(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  _donateStoreChange () {
    if (!DonateStore.donationSuccess()) {
      this.setState({ donationErrorMessage: DonateStore.donationError() });
    }
  }

  _toggleDonateMonthly (event) {
    if (event.target.value === 'once') {
      this.setState({
        donateMonthly: false, radioSelected: 'once',
      });
    } else {
      this.setState({
        donateMonthly: true, radioSelected: 'monthly',
      });
    }
  }

  _toggleCustomAmount () {
    const { showCustomInput } = this.state;
    this.setState({
      showCustomInput: !showCustomInput,
    });
  }

  _updateCustomAmount (event) {
    this.setState({ custom_amount: event.target.value });
  }

  /*
  An enter keystroke in the react-bootstrap InputGroup, (or in the original react "input-group",)
  causes a page reload, and you lose context.  So swallow the 'Enter' keystroke event while in
  the InputGroup.
   */
  _handleKeyPress (event) { // eslint-disable-line
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  render () {
    renderLog(__filename);
    const donateMailtoUrl = "mailto:donate@WeVoteEducation.org?subject=Donate to We Vote's 501(c)(3)&body=I am interested in making at tax deductible donating to We Vote's 501(c)(3).";

    return (
      <Wrapper>
        <Helmet title="Donate - We Vote" />
        <WelcomeAppbar pathname="/more/pricing" />
        <HeaderForDonate>
          <DonateTitle>Donate</DonateTitle>
        </HeaderForDonate>
        <Section noTopMargin>
          <DonateDescriptionContainer>
            We Vote is a nonprofit technology startup,
            {' '}
            <Link to="/more/about">
              built by volunteers
            </Link>
            {' '}
            to strengthen American democracy.
            {' '}
            <OpenExternalWebSite
              url="https://projects.propublica.org/nonprofits/organizations/811052585"
              target="_blank"
              body={(
                <span>
                  Our annual budgets are very small&nbsp;
                  <i className="fas fa-external-link-alt" />
                </span>
              )}
            />
            , so every donation helps us pay for critical services. Over 50 awesome people like yourself have donated to make We Vote possible.
            {' '}
            {this.state.donationErrorMessage.length > 0 ?
              <DonationError errorMessage={this.state.donationErrorMessage} /> :
              <span>Please give what you can to help us reach more voters.</span>}
          </DonateDescriptionContainer>
          <DonateDescriptionContainer>
            <Form className="d-flex flex-row">
              {/* <div key={'default-radio'} */}
              <Form.Check
                type="radio"
                label="Monthly"
                bsPrefix="radio"
                value="monthly"
                style={{ margin: 24 }}
                onChange={this._toggleDonateMonthly}
                checked={this.state.radioSelected === 'monthly'}
              />
              {' '}
              <Form.Check
                type="radio"
                label="One-Time"
                name="radioGroup"
                bsPrefix="radio"
                value="once"
                style={{ margin: 24 }}
                onChange={this._toggleDonateMonthly}
                checked={this.state.radioSelected === 'once'}
              />
              {' '}
            </Form>
            <DonationForm
              donationAmount={500}
              donateButtonText="$5"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={1500}
              donateButtonText="$15"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={2700}
              donateButtonText="$27"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={5000}
              donateButtonText="$50"
              donateMonthly={this.state.donateMonthly}
            />
            <DonationForm
              donationAmount={10000}
              donateButtonText="$100"
              donateMonthly={this.state.donateMonthly}
            />
            <Button
              color="primary"
              onClick={this._toggleCustomAmount}
              style={{ margin: 5 }}
              variant="contained"
            >
              <span className="u-no-break">Other Amount</span>
            </Button>
            {this.state.showCustomInput ? (
              <span>
                <InputGroup className="mb-3" style={{ width: '50%' }}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  {/* <FormControl aria-label="Amount" /> */}
                  <FormControl
                    type="text"
                    onKeyPress={this._handleKeyPress}
                    onChange={this._updateCustomAmount}
                    value={this.state.custom_amount}
                    placeholder="250.00"
                  />
                  <InputGroup.Append>
                    <DonationForm
                      donationAmount={parseInt(parseFloat(this.state.custom_amount.replace(/[^0-9.]+/g, '')) * 100, 10)}
                      donateMonthly={this.state.donateMonthly}
                      donateButtonText="Go"
                      donateOther
                    />
                  </InputGroup.Append>
                </InputGroup>
              </span>
            ) : null
            }
            {Number.isNaN(this.state.custom_amount) || this.state.custom_amount === '0' ? (
              <span>
                <p>Please enter a valid number</p>
              </span>
            ) : null
            }
            <div className="d-none d-sm-block"><br /></div>
            <br />
            These contributions or gifts are not tax deductible. These donations are for We Vote&apos;s 501(c)(4) nonprofit.
            We Vote&apos;s 501(c)(3) nonprofit also
            {' '}
            {/* This is a mailto! Shouldn't be visible in iPhone or Android apps. */}
            <a href={donateMailtoUrl} title="I would like to donate to We Vote's 501(c)(3)" rel="noopener noreferrer" target="_blank">
              accepts tax deductible donations
              {' '}
              <i className="fas fa-external-link-alt" />
              .
            </a>
          </DonateDescriptionContainer>
          <DonateDescriptionContainer>
            <DonationListForm />
          </DonateDescriptionContainer>
        </Section>
        <Footer />
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonContained: {
    borderRadius: 32,
    height: 50,
    [theme.breakpoints.down('md')]: {
      height: 36,
    },
  },
  buttonMaxWidth: {
    width: '100%',
  },
  iconButton: {
    color: 'white',
  },
  pricingChoiceLink: {
    color: 'white',
    fontSize: 12,
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
  },
  pricingSwitch: {
    marginTop: 18,
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;

const HeaderForDonate = styled.div`
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

const DonateTitle = styled.h1`
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

// }
const DonateDescriptionContainer = styled.div`
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

export default withStyles(styles)(Donate);
