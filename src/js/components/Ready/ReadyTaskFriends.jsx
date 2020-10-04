import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrowForward, CheckCircle } from '@material-ui/icons';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import register0Percent from '../../../img/global/svg-icons/ready/register-0-percent.svg';
import register100Percent from '../../../img/global/svg-icons/ready/register-100-percent.svg';
import {
  ButtonLeft,
  ButtonText,
  Icon,
  PercentComplete,
  ReadyCard,
  StyledButton,
  StyledCheckbox,
  StyledCheckboxCompleted,
  SubTitle,
  Title,
  TitleRowWrapper,
} from './ReadyTaskStyles';

class ReadyTaskFriends extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      // numberOfFriendsReady: 0,
      // numberOfFriendsRegistered: 0,
      // numberOfFriendsWithBallot: 0,
      // numberOfFriendsWithPlan: 0,
      // numberOfFriendsYouWillRemind: 0,
      // numberOfYourPositionsThisElection: 0,
      numberOfFriendsReady: 5,
      numberOfFriendsRegistered: 4,
      numberOfFriendsWithBallot: 7,
      numberOfFriendsWithPlan: 12,
      numberOfFriendsYouWillRemind: 6,
      numberOfYourPositionsThisElection: 9,
    };
  }

  goToNextStep = () => {
    historyPush('/register');
  }

  render () {
    const { classes } = this.props;
    const {
      numberOfFriendsReady, numberOfFriendsRegistered, numberOfFriendsWithBallot,
      numberOfFriendsWithPlan, numberOfFriendsYouWillRemind, numberOfYourPositionsThisElection,
    } = this.state;

    return (
      <ReadyCard showprogresscolor={numberOfFriendsReady} className="card">
        <Icon>
          {numberOfFriendsReady ?  (
            <img
              src={cordovaDot(register100Percent)}
              width="50"
              height="50"
              alt="Are your friends ready?"
            />
          ) : (
            <img
              src={cordovaDot(register0Percent)}
              width="50"
              height="50"
              alt="Are your friends ready?"
            />
          )}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title>
              {numberOfFriendsReady ? (
                <>
                  <span className="u-show-mobile-iphone5-or-smaller">
                    Friends Ready?
                  </span>
                  <span className="u-show-mobile-bigger-than-iphone5">
                    Friends Ready?
                  </span>
                  <span className="u-show-tablet">
                    Are Your Friends Ready?
                  </span>
                  <span className="u-show-desktop">
                    Are Your Friends Ready to Vote?
                  </span>
                </>
              ) : (
                <>
                  <span className="u-show-mobile">
                    Are Your Friends Ready?
                  </span>
                  <span className="u-show-desktop-tablet">
                    Are Your Friends Ready to Vote?
                  </span>
                </>
              )}
            </Title>
            <PercentComplete showprogresscolor={numberOfFriendsReady || undefined}>
              {!!(numberOfFriendsReady) && (
                <>
                  {numberOfFriendsReady}
                  <span className="u-show-mobile-iphone5-or-smaller">
                    {' '}
                    Ready
                  </span>
                  <span className="u-show-mobile-bigger-than-iphone5">
                    {' '}
                    Ready
                  </span>
                  <span className="u-show-desktop-tablet">
                    {' '}
                    Ready
                  </span>
                </>
              )}
            </PercentComplete>
          </TitleRowWrapper>
          <SubTitle>
            {numberOfFriendsReady ? `Great work! ${numberOfFriendsReady} of your friends or followers are ready (or getting ready) to vote.` : 'Help your friends make sense of their ballot, so they can vote their values too.'}
          </SubTitle>
          {/* *************************************** */}
          {/* BUTTON: Ask friends to register to vote */}
          {/* *************************************** */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfFriendsRegistered || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfFriendsRegistered ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfFriendsRegistered ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfFriendsRegistered}
                      {' '}
                      Friends Registered
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfFriendsRegistered}
                      {' '}
                      Friends have Verified Registration
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Ask Friends to Register
                      <span className="u-show-mobile-bigger-than-iphone5">
                        <ArrowForward classes={{ root: classes.arrowRoot }} />
                      </span>
                    </span>
                    <span className="u-show-desktop-tablet">
                      Ask Friends to Verify Registration
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </span>
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* ******************************* */}
          {/* BUTTON: Encourage friends to vote */}
          {/* ******************************* */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfFriendsWithBallot || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfFriendsWithBallot ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfFriendsWithBallot ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfFriendsWithBallot}
                      {' '}
                      Friends with Ballot
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfFriendsWithBallot}
                      {' '}
                      Friends Looking at Ballot
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile-iphone5-or-smaller">
                      Send Ballot
                    </span>
                    <span className="u-show-mobile-bigger-than-iphone5">
                      Send Ballot to Friends
                    </span>
                    <span className="u-show-desktop-tablet">
                      Encourage Friends to Look at Ballot
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* ******************************************** */}
          {/* BUTTON: Endorse candidates, change the world */}
          {/* ******************************************** */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfYourPositionsThisElection || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfYourPositionsThisElection ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfYourPositionsThisElection ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfYourPositionsThisElection}
                      {' '}
                      Ballot Items Endorsed
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfYourPositionsThisElection}
                      {' '}
                      Ballot Items You Support or Oppose
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Endorse Candidates
                    </span>
                    <span className="u-show-desktop-tablet">
                      Endorse Candidates, Change the World
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* *********************************************** */}
          {/* BUTTON: Ask friends to share their plan to vote */}
          {/* *********************************************** */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfFriendsWithPlan || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfFriendsWithPlan ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfFriendsWithPlan ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfFriendsWithPlan}
                      {' '}
                      Friends Shared Plan
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfFriendsWithPlan}
                      {' '}
                      Friends have Shared Their Plan to Vote
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Friends Have Plan?
                    </span>
                    <span className="u-show-desktop-tablet">
                      Make Sure Friends Have Plan to Vote
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* *********************************************** */}
          {/* BUTTON: Commit to Remind 3 Friends to Vote */}
          {/* *********************************************** */}
          <StyledButton
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfFriendsYouWillRemind || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfFriendsYouWillRemind ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfFriendsYouWillRemind ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfFriendsYouWillRemind}
                      {' '}
                      Friends you&apos;ll Remind
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfFriendsYouWillRemind}
                      {' '}
                      Friends you&apos;ll Remind on Election Day
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Remind Three Friends
                    </span>
                    <span className="u-show-desktop-tablet">
                      Remind Three Friends on Election Day
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
        </div>
      </ReadyCard>
    );
  }
}
ReadyTaskFriends.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  arrowRoot: {
    fontSize: 14,
    marginBottom: 3,
    marginLeft: 4,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
});

export default withTheme(withStyles(styles)(ReadyTaskFriends));
