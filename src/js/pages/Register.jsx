import { Button, Card, CardContent, FormControl, InputLabel, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CheckCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AnalyticsActions from '../actions/AnalyticsActions';
import BallotActions from '../actions/BallotActions';
import ReadyActions from '../actions/ReadyActions';
import LoadingWheel from '../common/components/Widgets/LoadingWheel';
import BrowserPushMessage from '../components/Widgets/BrowserPushMessage';
import { messageService } from '../stores/AppObservableStore';
import BallotStore from '../stores/BallotStore';
import VoterStore from '../stores/VoterStore';
import { formatDateToMonthDayYear } from '../common/utils/dateFormat';
import { formatStateName } from '../utils/formatStateName';
import { renderLog } from '../common/utils/logging';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';

const voteDotOrg = '../../img/global/logos/vote_dot_org_logo-530x200.png';
const turboVote = '../../img/global/logos/turbovote-logo.png';

/* Styled Input confuses lint in this case, so we disable */
/* eslint-disable jsx-a11y/label-has-associated-control */

class Register extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedState: '',
      majorStep: 'A',
      minorStep: '1',
    };
    this.handleChooseStateChange = this.handleChooseStateChange.bind(this);
  }

  componentDidMount () {
    this.onAppObservableStoreChange();
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (!BallotStore.ballotFound) {
      // console.log('WebApp doesn't know the election or have ballot data, so ask the API server to return best guess');
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
    ReadyActions.voterPlansForVoterRetrieve();
    AnalyticsActions.saveActionReadyVisit(VoterStore.electionId());
  }

  shouldComponentUpdate (nextState) {
    return this.state.majorStep !== nextState.majorStep;
  }

  componentDidCatch (error, info) {
    console.log('Register.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  // goToBallot = () => {
  //   historyPush('/ballot');
  // }

  handleChooseStateChange (e) {
    if (e.target.value !== 'all') {
      this.setState({ selectedState: e.target.value, minorStep: '2a' });
    } else {
      this.setState({ selectedState: e.target.value });
    }
    // console.log(e.target.value);
  }

  onAppObservableStoreChange () {
    // this.setState({
    //   chosenReadyIntroductionText: AppObservableStore.getChosenReadyIntroductionText(),
    //   chosenReadyIntroductionTitle: AppObservableStore.getChosenReadyIntroductionTitle(),
    // });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog('Ready');  // Set LOG_RENDER_EVENTS to log all renders
    const { voter } = this.state;
    const { classes } = this.props;
    if (!voter) {
      return LoadingWheel;
    }

    console.log(this.state.majorStep);

    const renderMajorStepA = () => (
      <>
        <Section>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>What state are you planning to vote in?</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-age-native-simple" />
            <Select
                classes={{ select: classes.select }}
                native
                value={this.state.selectedState}
                onChange={this.handleChooseStateChange}
                label=""
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple',
                }}
            >
              <option aria-label="-- Select state --" value="all">-- Select state --</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </Select>
          </FormControl>
        </Section>
        {(this.state.minorStep === '2a' || this.state.minorStep === '3') && (
        <Section>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Have you voted in
            {formatStateName(this.state.selectedState)}
            {' '}
            in the last year?
          </h3>
          <Button
                onClick={() => {
                  this.setState({ majorStep: 'B', minorStep: '4' });
                }}
                id="didVoteInLastYearButton"
                variant="outlined"
                color="primary"
                // eslint-disable-next-line no-nested-ternary
                className={this.state.votedInLastYear === 'yes' ? classes.selectedButton : this.state.minorStep === '3' ? classes.button : classes.activeButton}
                fullWidth
          >
            Yes
          </Button>
          <Button
                onClick={() => {
                  this.setState({ majorStep: 'A', minorStep: '3', votedInLastYear: 'no' });
                }}
                id="didNotVoteInLastYearButton"
                variant="outlined"
                color="primary"
                // eslint-disable-next-line no-nested-ternary
                className={this.state.votedInLastYear === 'no' ? classes.selectedButton : this.state.minorStep === '3' ? classes.button : classes.activeButton}
                fullWidth
          >
            {this.state.votedInLastYear === 'no' && <CheckCircle />}
            No
          </Button>
          <Button
                id="notRegisteredButton"
                onClick={() => {
                  this.setState({ majorStep: 'C', minorStep: '6b' });
                }}
                variant="outlined"
                color="primary"
                // eslint-disable-next-line no-nested-ternary
                className={this.state.votedInLastYear === 'not-registered' ? classes.selectedButton : this.state.minorStep === '3' ? classes.button : classes.activeButton}
                fullWidth
          >
            I&apos;m not registered.
          </Button>
        </Section>
        )}
        {this.state.minorStep === '3' && (
        <Section>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            Have you registered in the last 3 weeks?
          </h3>
          <Button
                onClick={() => {
                  this.setState({ majorStep: 'B', minorStep: '4' });
                }}
                variant="outlined"
                color="primary"
                className={this.state.registeredInLastThreeWeeks === 'yes' ? classes.selectedButton : classes.activeButton}
                fullWidth
          >
            Yes
          </Button>
          <Button
                onClick={() => {
                  this.setState({ majorStep: 'C', minorStep: '5' });
                }}
                variant="outlined"
                color="primary"
                className={this.state.registeredInLastThreeWeeks === 'no' ? classes.selectedButton : classes.activeButton}
                fullWidth
          >
            No
          </Button>
        </Section>
        )}
      </>
    );

    const renderMajorStepB = () => (
      <Section>
        <h3 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 0 }}>
          Congratulations, you&apos;re self-verified!
        </h3>
        <img style={{ width: 100, margin: '32px auto', textAlign: 'center', display: 'block' }} src="../../../img/global/svg-icons/ready/register-100-percent.svg" alt="" />
        <p style={{ textAlign: 'center' }}>
          Your registration freshness date is
          {' '}
          {formatDateToMonthDayYear(new Date())}
          .
        </p>
        <p style={{ textAlign: 'center' }}>We recommend an annual freshness check.</p>
        <br />
        <br />
        <br />
        <br />
        <Button className={classes.button} variant="outlined" fullWidth color="primary">Advanced Verification</Button>
        <Button className={classes.nextButton} onClick={() => { this.setState({ majorStep: 'D' }); }} variant="contained" fullWidth color="primary">Continue</Button>
      </Section>
    );

    const renderMajorStepC = () => (
      <>
        {this.state.minorStep === '6b' && (
          <Section>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
              We recommend you register now here, and then return when you are done.
            </h3>
            <CustomButton variant="outlined" color="primary">
              <img style={{ height: 'auto', width: 75 }} src={voteDotOrg} />
              Register Through Vote.org
            </CustomButton>
            <CustomButton variant="outlined" color="primary">
              Register Through VoteAmerica.com
            </CustomButton>
            <CustomButton variant="outlined" color="primary">
              <img style={{ height: 'auto', width: 75 }} src={turboVote} />
              Register Through turbovote.org
            </CustomButton>
            <CustomButton variant="outlined" color="primary">
              Register Through rockthevote.com
            </CustomButton>
          </Section>
        )}
        {this.state.minorStep === '5' && (
          <>
            <Section>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
                We recommend confirming you are registered to vote.
              </h3>
              <p>All fields with a red asterisk are required.</p>
              <p>You will need to sign in when you submit this form in order to see your results.</p>
              <Row>
                <Column>
                  <label htmlFor="firstName">First Name</label>
                  <Input id="firstName" placeholder="Type here..." />
                </Column>
                <Column>
                  <label htmlFor="lastName">Last Name</label>
                  <Input id="lastName" placeholder="Type here..." />
                </Column>
              </Row>
              <hr />
              <Row>
                <Column>
                  <label>Street Address</label>
                  <Input placeholder="Type here..." />
                </Column>
                <Column>
                  <label>Apartment</label>
                  <Input placeholder="(Optional)" />
                </Column>
              </Row>
              <Row>
                <Column>
                  <label>City</label>
                  <Input placeholder="Type here..." />
                </Column>
                <Column>
                  <label>State</label>
                  <FormControl variant="outlined" className={classes.formControlTwo}>
                    <Select
                      classes={{ select: classes.selectTwo }}
                      native
                      value={this.state.selectedState}
                      onChange={this.handleChooseStateChange}
                      label=""
                      inputProps={{
                        name: 'age',
                        id: 'outlined-age-native-simple',
                      }}
                    >
                      <option aria-label="-- Select state --" value="all">-- Select state --</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </Select>
                  </FormControl>
                </Column>
                <Column>
                  <label>Zip Code</label>
                  <Input placeholder="Type here..." />
                </Column>
              </Row>
              <hr />
              <Row>
                <Column>
                  <label>Date of Birth</label>
                  <FormControl variant="outlined" classes={{ root: classes.formControl }}>
                    <Select classes={{ select: classes.selectTwo }} native value={this.state.month} onChange={this.handleMonthChange}>
                      <option aria-label="-- Select month --" value="">-- Select month --</option>
                      <option value="1">Jan</option>
                      <option value="2">Feb</option>
                      <option value="3">Mar</option>
                      <option value="4">Apr</option>
                      <option value="5">May</option>
                      <option value="6">Jun</option>
                      <option value="7">Jul</option>
                      <option value="8">Aug</option>
                      <option value="9">Sep</option>
                      <option value="10">Oct</option>
                      <option value="11">Nov</option>
                      <option value="12">Dec</option>
                    </Select>
                  </FormControl>
                </Column>
                <Column>
                  <FormControl variant="outlined" classes={{ root: classes.formControl }}>
                    <Select classes={{ select: classes.selectTwo }} native value={this.state.day} onChange={this.handlDayChange}>
                      <option aria-label="-- Select day --" value="">-- Select day --</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                      <option value="16">16</option>
                      <option value="17">17</option>
                      <option value="18">18</option>
                      <option value="19">19</option>
                      <option value="20">20</option>
                      <option value="21">21</option>
                      <option value="22">22</option>
                      <option value="23">23</option>
                      <option value="24">24</option>
                      <option value="25">25</option>
                      <option value="26">26</option>
                      <option value="27">27</option>
                      <option value="28">28</option>
                      <option value="29">29</option>
                      <option value="30">30</option>
                      <option value="31">31</option>
                    </Select>
                  </FormControl>
                </Column>
                <Column>
                  <FormControl variant="outlined" classes={{ root: classes.formControl }}>
                    <Select classes={{ select: classes.selectTwo }} native value={this.state.year} onChange={this.handleYearChange}>
                      <option aria-label="-- Select year --" value="">-- Select year --</option>
                      <option value="2002">2002</option>
                      <option value="2001">2001</option>
                      <option value="2000">2000</option>
                      <option value="1999">1999</option>
                      <option value="1998">1998</option>
                      <option value="1997">1997</option>
                      <option value="1996">1996</option>
                      <option value="1995">1995</option>
                      <option value="1994">1994</option>
                      <option value="1993">1993</option>
                      <option value="1992">1992</option>
                      <option value="1991">1991</option>
                      <option value="1990">1990</option>
                      <option value="1989">1989</option>
                      <option value="1988">1988</option>
                      <option value="1987">1987</option>
                      <option value="1986">1986</option>
                      <option value="1985">1985</option>
                      <option value="1984">1984</option>
                      <option value="1983">1983</option>
                      <option value="1982">1982</option>
                      <option value="1981">1981</option>
                      <option value="1980">1980</option>
                      <option value="1979">1979</option>
                      <option value="1978">1978</option>
                      <option value="1977">1977</option>
                      <option value="1976">1976</option>
                      <option value="1975">1975</option>
                      <option value="1974">1974</option>
                      <option value="1973">1973</option>
                      <option value="1972">1972</option>
                      <option value="1971">1971</option>
                      <option value="1970">1970</option>
                      <option value="1969">1969</option>
                      <option value="1968">1968</option>
                      <option value="1967">1967</option>
                      <option value="1966">1966</option>
                      <option value="1965">1965</option>
                      <option value="1964">1964</option>
                      <option value="1963">1963</option>
                      <option value="1962">1962</option>
                      <option value="1961">1961</option>
                      <option value="1960">1960</option>
                      <option value="1959">1959</option>
                      <option value="1958">1958</option>
                      <option value="1957">1957</option>
                      <option value="1956">1956</option>
                      <option value="1955">1955</option>
                      <option value="1954">1954</option>
                      <option value="1953">1953</option>
                      <option value="1952">1952</option>
                      <option value="1951">1951</option>
                      <option value="1950">1950</option>
                      <option value="1949">1949</option>
                      <option value="1948">1948</option>
                      <option value="1947">1947</option>
                      <option value="1946">1946</option>
                      <option value="1945">1945</option>
                      <option value="1944">1944</option>
                      <option value="1943">1943</option>
                      <option value="1942">1942</option>
                      <option value="1941">1941</option>
                      <option value="1940">1940</option>
                    </Select>
                  </FormControl>
                </Column>
              </Row>
            </Section>
            <StickyFooter>
              <Column>
                <Button fullWidth variant="outlined" color="primary">
                  I&apos;m Not Registered
                </Button>
              </Column>
              <Column>
                <Button fullWidth variant="contained" color="primary">Submit</Button>
              </Column>
            </StickyFooter>
          </>
        )}
      </>
    );

    const renderMajorStepD = () => {

    };

    return (
      <PageContentContainer>
        <PageContainer className="container-fluid">
          <Helmet title="Register to Vote - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="row" style={{ paddingTop: 32 }}>
            <div className="col-sm-12 col-lg-8">
              <Card>
                <CardContent>
                  <span>{this.state.majorStep}</span>
                  <span>{this.state.minorStep}</span>
                  <br />
                  <br />
                  <br />
                  <Button color="primary" variant={this.state.majorStep === 'A' ? 'contained' : 'outlined'} size="small">
                    1
                  </Button>
                  {' '}
                  <Button disabled={!this.state.stepOneCompleted} color="primary" variant={this.state.majorStep === 'B' ? 'contained' : 'outlined'} size="small">
                    2
                  </Button>
                  {' '}
                  <Button disabled={!this.state.stepTwoCompleted} color="primary" variant={this.state.majorStep === 'C' ? 'contained' : 'outlined'} size="small">
                    3
                  </Button>
                  {' '}
                  <Button disabled={!this.state.stepThreeCompleted} color="primary" variant={this.state.majorStep === 'D' ? 'contained' : 'outlined'} size="small">
                    4
                  </Button>
                  {' '}
                  <br />
                  {this.state.majorStep === 'A' && renderMajorStepA()}
                  {this.state.majorStep === 'B' && renderMajorStepB()}
                  {this.state.majorStep === 'C' && renderMajorStepC()}
                  {this.state.majorStep === 'D' && renderMajorStepD()}
                </CardContent>
              </Card>

            </div>
          </div>
        </PageContainer>
      </PageContentContainer>
    );
  }
}
Register.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  formControlTwo: {
    width: '100%',
  },
  select: {
    padding: '12px 12px',
    margin: '0px 1px',
    background: 'white !important',
  },
  selectTwo: {
    padding: '12px 12px',
    margin: '0px',
    background: 'white !important',
  },
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  nextButton: {
    padding: '10px 8px',
  },
  button: {
    background: 'white !important',
    marginBottom: '12px',
    padding: '10px 8px',
  },
  activeButton: {
    background: 'white !important',
    marginBottom: '12px',
    padding: '10px 8px',
    fontWeight: 'bold',
    border: '2px solid #2E3C5D !important',
  },
  selectedButton: {
    background: 'white !important',
    marginBottom: '12px',
    padding: '10px 8px',
    fontWeight: 'bold',
    border: '2px solid #2E3C5D !important',
  },
});

const CustomButton = styled(Button)`
  width: 100%;
  font-size: 18px !important;
  padding: 24px 12px !important;
  margin: 12px 0 !important;
  background: white !important;
  span.MuiButton-label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  img {
    margin-right: 10%;
  }
`;

const StickyFooter = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index:999999999;
  height: 100px;
  left: 0;
  background: white;
  display: flex;
  align-items: center;
  padding: 0px 32px;
  box-shadow: 0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12);
`;

const Row = styled.div`
  margin: 0 -12px 0 -12px;
  @media (min-width: 769px) {
    display: flex;
  }
  width: 100%;
`;

const Column = styled.div`
  padding: 12px;
  @media(min-width: 769px) {
    width: 50%;
  }
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 10px 14px !important;
  transition-duration: .2s;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  :hover {
    border: 1px solid #2e3c5d;
  }
  :focus {
    outline: 1px #2e3c5d auto;
    border: 1px solid #2e3c5d;
  }
`;

const Section = styled.div`
  margin-bottom: 48px;
`;

// const EditAddressWrapper = styled.div`
//   margin-bottom: 8px !important;
//   margin-left: 0 !important;
//   padding-left: 0 !important;
//   padding-right: 0 !important;
// `;

const PageContainer = styled.div`
  padding-top: 0 !important;
`;

// const Title = styled.h2`
//   font-size: 26px;
//   font-weight: 800;
//   margin: 0 0 12px;
//   @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
//     font-size: 18px;
//   }
// `;

// const Paragraph = styled.div`

// `;

export default withStyles(styles)(Register);
