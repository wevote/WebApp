import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import { cordovaDot } from '../../utils/cordovaUtils';
import ImageHandler from '../ImageHandler';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';
import ReadMore from '../Widgets/ReadMore';
import { renderLog } from '../../utils/logging';
import { convertToInteger, formatDateToMonthDayYear } from '../../utils/textFormat';

class FriendInvitationOnboardingIntro extends Component {
  static propTypes = {
    friendFirstName: PropTypes.string,
    friendLastName: PropTypes.string,
    friendImageUrlHttpsTiny: PropTypes.string,
    invitationMessage: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    const electionDayText = BallotStore.currentBallotElectionDate;
    if (!electionDayText) {
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    const electionDayText = BallotStore.currentBallotElectionDate;
    // console.log('electionDayText:', electionDayText);
    if (electionDayText) {
      // const electionDayTextFormatted = electionDayText ? moment(electionDayText).format('MMM Do, YYYY') : '';
      const electionDayTextDateFormatted = electionDayText ? moment(electionDayText).format('MM/DD/YYYY') : '';
      // console.log('electionDayTextFormatted: ', electionDayTextFormatted, ', electionDayTextDateFormatted:', electionDayTextDateFormatted);
      const electionDate = new Date(electionDayTextDateFormatted);
      if (electionDate) {
        const electionTime = new Date(electionDate).getTime();
        const currentTime = new Date().getTime();

        const distance = electionTime - currentTime;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.setState({
          days,
          electionDate,
        });
      }
    }
  }

  render () {
    renderLog('FriendInvitationOnboardingIntro');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendFirstName, friendLastName, invitationMessage, friendImageUrlHttpsTiny } = this.props;
    const { days, electionDate } = this.state;
    let showCountDownDays = (days && electionDate);
    if (convertToInteger(days) < 0) {
      showCountDownDays = false;
    }
    return (
      <Wrapper>
        <WeVoteLogoWrapper>
          <img
            className="header-logo-img"
            alt="We Vote logo"
            src={cordovaDot(logoDark)}
          />
        </WeVoteLogoWrapper>
        {showCountDownDays && (
          <ElectionCountdownText>
            <ElectionCountdownDays>
              {days}
              {' '}
              days
            </ElectionCountdownDays>
            {' '}
            until your next election on
            {' '}
            <span className="u-no-break">
              {formatDateToMonthDayYear(electionDate)}
              .
            </span>
          </ElectionCountdownText>
        )}
        <FriendInvitationTopHeader className="FriendInvitationTopHeader">
          {friendFirstName || invitationMessage ? (
            <>
              <div>
                Invitation
                {friendFirstName && (
                  <>
                    {' '}
                    from
                    {' '}
                    {friendFirstName}
                    {friendLastName && (
                      <>
                        {' '}
                        {friendLastName}
                      </>
                    )}
                  </>
                )}
                {' '}
                accepted!
              </div>
              {invitationMessage && (
                <InvitationMessageWrapper>
                  <InvitationMessageDescription>
                    {friendImageUrlHttpsTiny && (
                      <OrganizationImageWrapper>
                        <ImageHandler
                          sizeClassName="image-24x24 "
                          imageUrl={friendImageUrlHttpsTiny}
                          alt="organization-photo"
                          kind_of_ballot_item="ORGANIZATION"
                        />
                      </OrganizationImageWrapper>
                    )}
                    <ReadMore
                      textToDisplay={invitationMessage}
                      numberOfLines={3}
                    />
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
        <FriendInvitationIntroHeader className="FriendInvitationIntroHeader">
          We Vote makes
          <span className="u-show-mobile"><br /></span>
          <span className="u-show-desktop-tablet">{' '}</span>
          being a voter easier:
        </FriendInvitationIntroHeader>
        <FriendInvitationListWrapper>
          <FriendInvitationList>
            <FriendInvitationListTitleRow>
              <Dot><StepNumber>1</StepNumber></Dot>
              <StepTitle>Be ready to vote in 6 minutes</StepTitle>
            </FriendInvitationListTitleRow>
            <FriendInvitationListRow>
              <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
              <StepText>Verify your registration. Make a plan for casting your vote. Find your polling location.</StepText>
            </FriendInvitationListRow>

            <FriendInvitationListTitleRow>
              <Dot><StepNumber>2</StepNumber></Dot>
              <StepTitle>Be confident in your choices</StepTitle>
            </FriendInvitationListTitleRow>
            <FriendInvitationListRow>
              <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
              <StepText>Who&apos;s running for office? What do they stand for? With over 12,400 candidates running for 3,600 offices this year, We Vote helps you make sense of your options.</StepText>
            </FriendInvitationListRow>

            <FriendInvitationListTitleRow>
              <Dot><StepNumber>3</StepNumber></Dot>
              <StepTitle>Be the change you want to see in the world</StepTitle>
            </FriendInvitationListTitleRow>
            <FriendInvitationListRow>
              <Dot><StepNumberPlaceholder>&nbsp;</StepNumberPlaceholder></Dot>
              <StepText>You&apos;ve done your homework deciding how to vote. Now show your friends how to make sense of their decisions, so they can vote their values.</StepText>
            </FriendInvitationListRow>
          </FriendInvitationList>
        </FriendInvitationListWrapper>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const Wrapper = styled.div`
  padding-left: 12px;
  padding-right: 12px;
`;

const ElectionCountdownDays = styled.span`
  font-size: 32px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 13px;
  }
`;

const ElectionCountdownText = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #2E3C5D !important;
  width: fit-content;
  padding-bottom: 8px;
  margin-top: 0;
  width: 100%;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 10px;
  }
`;

const InvitationMessageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const InvitationMessageDescription = styled.div`
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
const FriendInvitationTopHeader = styled.div`
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationIntroHeader = styled.div`
`;

const FriendInvitationListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const FriendInvitationList = styled.div`
  max-width: 450px;
`;

const FriendInvitationListTitleRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding-top: 14px;
`;

const FriendInvitationListRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const Dot = styled.div`
  padding-top: 2px;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 3px;
  }
`;

const OrganizationImageWrapper = styled.span`
  padding-right: 4px;
`;

const StepNumber = styled.div`
  background: ${props => props.theme.colors.brandBlue};
  border-radius: 4px;
  color: white;
  font-size: 16px;
  width: 22px;
  height: 22px;
  padding-top: 1px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 14px;
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`;

const StepTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 17px;
  }
`;

const StepText = styled.div`
  color: #555;
  font-size: 16px;
  font-weight: 200;
  padding: 0 8px;
  text-align: left;
  vertical-align: top;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const StepNumberPlaceholder = styled.div`
  width: 22px;
  height: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
`;

const WeVoteLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingIntro));
