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

    this.toggleCustomAmount = this.toggleCustomAmount.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCustomAmount = this.updateCustomAmount.bind(this);
    this.toggleDonateMonthly = this.toggleDonateMonthly.bind(this);
    this.donateStoreChange = this.donateStoreChange.bind(this);
  }

  componentDidMount () {
    this.donateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.donateStoreChange);
    AnalyticsActions.saveActionDonateVisit(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
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

  donateStoreChange () {
    if (!DonateStore.donationSuccess()) {
      this.setState({ donationErrorMessage: DonateStore.donationError() });
    }
  }

  toggleDonateMonthly (event) {
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

  toggleCustomAmount () {
    const { showCustomInput } = this.state;
    this.setState({
      showCustomInput: !showCustomInput,
    });
  }

  updateCustomAmount (event) {
    this.setState({ custom_amount: event.target.value });
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
            <Link to="/more/about" style={{ color: '#4371cc' }} onlyActiveOnIndex>
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
            <Form className="donate-frequency">
              <div className="donate-frequency__radio-button-div">
                <Form.Check
                  type="radio"
                  label="Monthly"
                  bsPrefix="radio"
                  value="monthly"
                  // classes={{ root: classes.radioButtonMargins }}
                  onChange={this.toggleDonateMonthly}
                  checked={this.state.radioSelected === 'monthly'}
                />
              </div>
              <div className="donate-frequency__radio-button-div">
                <Form.Check
                  type="radio"
                  label="One-Time"
                  name="radioGroup"
                  bsPrefix="radio"
                  value="once"
                  // classes={{ root: classes.radioButtonMargins }}
                  onChange={this.toggleDonateMonthly}
                  checked={this.state.radioSelected === 'once'}
                />
              </div>
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
              onClick={this.toggleCustomAmount}
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
                    onKeyPress={this.handleKeyPress}
                    onChange={this.updateCustomAmount}
                    value={this.state.custom_amount}
                    placeholder="250.00"
                  />
                  <InputGroup.Append>
                    <DonationForm
                      donationAmount={parseInt(parseFloat(this.state.custom_amount.replace(/[^0-9.]+/g, '')) * 100)}
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
          </DonateDescriptionContainer>
          <DonateDescriptionContainer>
            Contributions or gifts made on this page are not tax deductible, and fund the We Vote&apos;s 501(c)(4) nonprofit.
            We Vote also has a 501(c)(3) nonprofit that welcomes
            {' '}
            {/* This is a mailto! Shouldn't be visible in iPhone or Android apps. */}
            <a href={donateMailtoUrl}
               title="I would like to donate to We Vote's 501(c)(3)"
               rel="noopener noreferrer"
               target="_blank"
               style={{ color: '#4371cc' }}
            >
              tax deductible donations
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
