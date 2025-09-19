import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import apiCalming from '../../common/utils/apiCalming';
import { formatDateToMonthDayYear } from '../../common/utils/dateFormat';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import BallotStore from '../../stores/BallotStore';
import convertToInteger from '../../common/utils/convertToInteger';
import HeaderLogoImage from '../Navigation/HeaderLogoImage';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

class FriendInvitationOnboardingIntro extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showAllStepOne: false,
      showAllStepTwo: false,
      showAllStepThree: false,
    };
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    const electionDayText = BallotStore.currentBallotElectionDate;
    if (!electionDayText) {
      if (apiCalming('voterBallotItemsRetrieve', 30000)) {
        BallotActions.voterBallotItemsRetrieve(0, '', '');
      }
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    // DALE 2022-03-29 If we update this routing (as opposed to deprecate it) this should be updated to use /src/js/common/utils/daysUntil
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log('electionDayText:', electionDayText);
    if (electionDayText) {
      const electionDayTextDateFormatted = electionDayText && window.moment ? window.moment(electionDayText).format('MM/DD/YYYY') : '';
      // console.log('electionDayTextFormatted: ', electionDayTextFormatted, ', electionDayTextDateFormatted:', electionDayTextDateFormatted);
      const electionDate = new Date(electionDayTextDateFormatted);
      if (electionDate) {
        const electionTime = new Date(electionDate).getTime();
        const currentTime = new Date().getTime();

        const distance = electionTime - currentTime;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const daysAdjusted = days + 1;
        this.setState({
          days: daysAdjusted,
          electionDate,
        });
      }
    }
  }

  onClickShowAllStepOne = () => {
    this.setState({
      showAllStepOne: true,
    });
  }

  onClickShowAllStepTwo = () => {
    this.setState({
      showAllStepTwo: true,
    });
  }

  onClickShowAllStepThree = () => {
    this.setState({
      showAllStepThree: true,
    });
  }

  render () {
    renderLog('FriendInvitationOnboardingIntro');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendFirstName, friendLastName, invitationMessage, friendImageUrlHttpsTiny } = this.props;
    const { days, electionDate, showAllStepOne, showAllStepTwo, showAllStepThree } = this.state;
    let showCountDownDays = (days && electionDate);
    if (convertToInteger(days) < 0) {
      showCountDownDays = false;
    }
    return (
      <Wrapper>
        <WeVoteLogoWrapper>
          <HeaderLogoImage src={normalizedImagePath(logoDark)} />
        </WeVoteLogoWrapper>
        <FriendInvitationTopHeader className="FriendInvitationTopHeader">
          Welcome to WeVote.
          {' '}
          {friendFirstName || invitationMessage ? (
            <>
              <div>
                {friendFirstName ? (
                  <>
                    You are
                    {' '}
                    {friendFirstName}
                    {friendLastName && (
                      <>
                        {' '}
                        {friendLastName}
                      </>
                    )}
                    &apos;s friend!
                  </>
                ) : (
                  <>
                    Invitation accepted!
                  </>
                )}
              </div>
              {invitationMessage && (
                <InvitationMessageWrapper>
                  <InvitationMessageDescription>
                    {friendImageUrlHttpsTiny && (
                      <OrganizationImageWrapper>
                        <Suspense fallback={<></>}>
                          <ImageHandler
                            sizeClassName=""
                            imageUrl={friendImageUrlHttpsTiny}
                            alt="organization-photo"
                            kind_of_ballot_item="ORGANIZATION"
                          />
                        </Suspense>
                      </OrganizationImageWrapper>
                    )}
                    <Suspense fallback={<></>}>
                      <ReadMore
                        textToDisplay={invitationMessage}
                        numberOfLines={3}
                      />
                    </Suspense>
                  </InvitationMessageDescription>
                </InvitationMessageWrapper>
              )}
            </>
          ) : (
            <>
              Invitation accepted!
            </>
          )}
        </FriendInvitationTopHeader>
        <FriendInvitationIntroHeader id="weVoteHelpsYouListHeaderText" className="FriendInvitationIntroHeader">
          WeVote helps you:
        </FriendInvitationIntroHeader>
        <FriendInvitationListWrapper>
          <FriendInvitationList>
            <FriendInvitationListTitleRow>
              <Dot><StepNumber>1</StepNumber></Dot>
              <StepTitle>Be ready to vote in 6 minutes</StepTitle>
            </FriendInvitationListTitleRow>
            <FriendInvitationListRow>
              <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
              {showAllStepOne ? (
                <StepText>
                  {showCountDownDays && (
                    <>
                      There are
                      {' '}
                      {days}
                      {' '}
                      days until your next election on
                      {' '}
                      <span className="u-no-break">
                        {formatDateToMonthDayYear(electionDate)}
                        .
                      </span>
                      {' '}
                    </>
                  )}
                  Make a plan for casting your vote. See your entire ballot. Find your polling location.
                </StepText>
              ) : (
                <StepText id="beConfidentInYourChoicesHeader" onClick={this.onClickShowAllStepOne}>
                  {showCountDownDays ? (
                    <>
                      There are
                      {' '}
                      {days}
                      {' '}
                      days until your next election on
                      {' '}
                      <span className="u-no-break">
                        {formatDateToMonthDayYear(electionDate)}
                        .
                      </span>
                      {' '}
                      Make a plan...
                    </>
                  ) : (
                    <>
                      Make a plan for casting your vote. Verify your...
                    </>
                  )}
                  {' '}
                  (
                  <span className="u-cursor--pointer u-link-color">
                    show more
                  </span>
                  )
                </StepText>
              )}
            </FriendInvitationListRow>

            <FriendInvitationListTitleRow>
              <Dot><StepNumber>2</StepNumber></Dot>
              <StepTitle>Be confident in your choices</StepTitle>
            </FriendInvitationListTitleRow>
            <FriendInvitationListRow>
              <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
              {showAllStepTwo ? (
                <StepText>
                  Who&apos;s running for office? We show you what will be on your actual ballot, based on your full address. What do your trusted friends think about what is on the ballot? WeVote helps you make sense of your options.
                </StepText>
              ) : (
                <StepText onClick={this.onClickShowAllStepTwo}>
                  Who&apos;s running for office? We show you...
                  {' '}
                  (
                  <span className="u-cursor--pointer u-link-color">
                    show more
                  </span>
                  )
                </StepText>
              )}
            </FriendInvitationListRow>

            <FriendInvitationListTitleRow>
              <Dot><StepNumber>3</StepNumber></Dot>
              <StepTitle>Help your friends &amp; amplify your impact</StepTitle>
            </FriendInvitationListTitleRow>
            <FriendInvitationListRow>
              <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
              {showAllStepThree ? (
                <StepText>
                  You&apos;ve done your homework deciding how to vote.
                  {' '}
                  Now show your friends how to make sense of their decisions, so they can vote their values.
                  {' '}
                  The more of your friends who vote, the more impact you will have on the outcome of the election.
                </StepText>
              ) : (
                <StepText onClick={this.onClickShowAllStepThree}>
                  Show your friends how to make sense of...
                  {' '}
                  (
                  <span className="u-cursor--pointer u-link-color">
                    show more
                  </span>
                  )
                </StepText>
              )}
            </FriendInvitationListRow>
          </FriendInvitationList>
        </FriendInvitationListWrapper>
      </Wrapper>
    );
  }
}
FriendInvitationOnboardingIntro.propTypes = {
  friendFirstName: PropTypes.string,
  friendLastName: PropTypes.string,
  friendImageUrlHttpsTiny: PropTypes.string,
  invitationMessage: PropTypes.string,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const Wrapper = styled('div')`
  padding-left: 12px;
  padding-right: 12px;
`;

const InvitationMessageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const InvitationMessageDescription = styled('div')`
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #808080;
  flex: 1 1 0;
  font-size: 16px;
  font-weight: 400;
  list-style: none;
  margin-top: 8px;
  max-width: 400px;
  padding: 12px 6px;
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationTopHeader = styled('div')`
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationIntroHeader = styled('div')`
`;

const FriendInvitationListWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const FriendInvitationList = styled('div')`
  margin-bottom: 100px !important;
  max-width: 450px;
`;

const FriendInvitationListTitleRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 14px;
`;

const FriendInvitationListRow = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const Dot = styled('div')(({ theme }) => (`
  padding-top: 2px;
  vertical-align: top;
  ${theme.breakpoints.down('md')} {
    padding-top: 3px;
  }
`));

const OrganizationImageWrapper = styled('span')`
  margin-right: 6px;
  * {
    border-radius: 24px;
    width: 48px;
    height: 48px;
  }
`;

const StepNumber = styled('div')(({ theme }) => (`
  background: ${theme.colors.brandBlue};
  border-radius: 4px;
  color: white;
  font-size: 16px;
  width: 22px;
  height: 22px;
  padding-top: 1px;
  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`));

const StepTitle = styled('div')(({ theme }) => (`
  font-size: 20px;
  font-weight: 500;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  ${theme.breakpoints.down('sm')} {
    font-size: 17px;
  }
`));

const StepText = styled('div')(({ theme }) => (`
  color: #999;
  font-size: 16px;
  font-weight: 200;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  ${theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`));

const StepNumberPlaceholder = styled('div')(({ theme }) => (`
  width: 22px;
  height: 22px;
  ${theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
`));

const WeVoteLogoWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingIntro));
