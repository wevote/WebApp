import { ArrowForward, CheckCircle } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React from 'react';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper } from './ReadyTaskStyles';

const register0Percent = '../../../img/global/svg-icons/ready/register-0-percent.svg';
const register100Percent = '../../../img/global/svg-icons/ready/register-100-percent.svg';

class ReadyTaskFriends extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      // numberOfContactsImported: 0,
      // numberOfFriendsAdded: 0,
      numberOfFriendsReady: 0,
      numberOfFriendsRegistered: 0,
      numberOfFriendsWithPlan: 0,
      numberOfFriendsYouWillRemind: 0,
      numberOfContactsImported: 770,
      numberOfFriendsAdded: 7,
      // numberOfFriendsReady: 5,
      // numberOfFriendsRegistered: 4,
      // numberOfFriendsWithPlan: 12,
      // numberOfFriendsYouWillRemind: 6,
    };
  }

  goToNextStep = () => {
    historyPush('/register');
  }

  render () {
    renderLog('ReadyTaskFriends');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      numberOfFriendsReady, numberOfFriendsRegistered, numberOfFriendsAdded,
      numberOfFriendsWithPlan, numberOfFriendsYouWillRemind, numberOfContactsImported,
    } = this.state;

    return (
      <ReadyCard showprogresscolor={numberOfFriendsReady} className="card">
        <Icon>
          {numberOfFriendsReady ?  (
            <img
              src={normalizedImagePath(register100Percent)}
              width="50"
              height="50"
              alt="Find your friends"
            />
          ) : (
            <img
              src={normalizedImagePath(register0Percent)}
              width="50"
              height="50"
              alt="Find your friends"
            />
          )}
        </Icon>
        <div>
          <TitleRowWrapper>
            <Title>
              Find your friends
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
            {numberOfFriendsReady ? `Great work! You have added ${numberOfFriendsReady} friends.` : 'Find your friends they can help you vote your values.'}
          </SubTitle>
          {/* ******************************* */}
          {/* BUTTON: Add friends */}
          {/* ******************************* */}
          <StyledButton
            classes={{ root: classes.toDoButton }}
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfFriendsAdded || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfFriendsAdded ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfFriendsAdded ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfFriendsAdded}
                      {' '}
                      friends added
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfFriendsAdded}
                      {' '}
                      friends added
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile-iphone5-or-smaller">
                      Add friends
                    </span>
                    <span className="u-show-mobile-bigger-than-iphone5">
                      Add friends
                    </span>
                    <span className="u-show-desktop-tablet">
                      Add friends
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* ******************************************** */}
          {/* BUTTON: Import contacts */}
          {/* ******************************************** */}
          <StyledButton
            classes={{ root: classes.toDoButton }}
            className="u-cursor--pointer"
            color="primary"
            completed={numberOfContactsImported || undefined}
            onClick={this.goToNextStep}
            variant="outlined"
            withoutsteps="1"
          >
            <ButtonLeft>
              {numberOfContactsImported ? <StyledCheckboxCompleted><CheckCircle /></StyledCheckboxCompleted> : <StyledCheckbox /> }
              <ButtonText>
                {numberOfContactsImported ? (
                  <>
                    <span className="u-show-mobile">
                      {numberOfContactsImported}
                      {' '}
                      contacts imported
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfContactsImported}
                      {' '}
                      contacts imported
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Import your contacts
                    </span>
                    <span className="u-show-desktop-tablet">
                      Import your contacts
                    </span>
                    <ArrowForward classes={{ root: classes.arrowRoot }} />
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* *************************************** */}
          {/* BUTTON: Ask friends to register to vote */}
          {/* *************************************** */}
          <StyledButton
            classes={{ root: classes.toDoButton }}
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
                      friends registered
                    </span>
                    <span className="u-show-desktop-tablet">
                      {numberOfFriendsRegistered}
                      {' '}
                      friends have verified registration
                    </span>
                  </>
                ) : (
                  <>
                    <span className="u-show-mobile">
                      Ask friends to register
                      <span className="u-show-mobile-bigger-than-iphone5">
                        <ArrowForward classes={{ root: classes.arrowRoot }} />
                      </span>
                    </span>
                    <span className="u-show-desktop-tablet">
                      Ask friends to verify registration
                      <ArrowForward classes={{ root: classes.arrowRoot }} />
                    </span>
                  </>
                )}
              </ButtonText>
            </ButtonLeft>
          </StyledButton>
          {/* *********************************************** */}
          {/* BUTTON: Ask friends to share their plan to vote */}
          {/* *********************************************** */}
          <StyledButton
            classes={{ root: classes.toDoButton }}
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
            classes={{ root: classes.toDoButton }}
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
  toDoButton: {
    display: 'flex',
    justifyContent: 'start',
  },
});

export default withTheme(withStyles(styles)(ReadyTaskFriends));
