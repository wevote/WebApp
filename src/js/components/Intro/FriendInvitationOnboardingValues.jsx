import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { cordovaDot } from '../../utils/cordovaUtils';
import DelayedLoad from '../Widgets/DelayedLoad';
import FriendInvitationOnboardingFriendValuesList from '../Values/FriendInvitationOnboardingFriendValuesList';
import FriendInvitationOnboardingValuesList from '../Values/FriendInvitationOnboardingValuesList';
import ImageHandler from '../ImageHandler';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';
import { renderLog } from '../../utils/logging';


class FriendInvitationOnboardingValues extends Component {
  static propTypes = {
    friendFirstName: PropTypes.string,
    friendLastName: PropTypes.string,
    friendImageUrlHttpsTiny: PropTypes.string,
    friendIssueWeVoteIdList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('FriendInvitationOnboardingValues');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendFirstName, friendLastName, friendImageUrlHttpsTiny, friendIssueWeVoteIdList } = this.props;
    return (
      <Wrapper>
        <WeVoteLogoWrapper>
          <img
            className="header-logo-img"
            alt="We Vote logo"
            src={cordovaDot(logoDark)}
          />
        </WeVoteLogoWrapper>
        <FriendInvitationTopHeader className="FriendInvitationTopHeader">
          Follow what you care about.
        </FriendInvitationTopHeader>
        {!!(friendIssueWeVoteIdList && friendIssueWeVoteIdList.length) && (
          <PopularValuesWrapper>
            <FriendInvitationValuesHeader className="FriendInvitationValuesHeader">
              {friendImageUrlHttpsTiny && (
                <ImageHandler
                  sizeClassName="image-24x24 "
                  imageUrl={friendImageUrlHttpsTiny}
                  alt="organization-photo"
                  kind_of_ballot_item="ORGANIZATION"
                />
              )}
              {friendFirstName ? (
                <>
                  {friendFirstName}
                  {friendLastName && (
                    <>
                      {' '}
                      {friendLastName}
                    </>
                  )}
                  {' '}
                  follows:
                </>
              ) : (
                <>
                  Your friend follows:
                </>
              )}
            </FriendInvitationValuesHeader>
            <ValuesWrapper>
              <FriendInvitationOnboardingFriendValuesList
                friendIssueWeVoteIdList={friendIssueWeVoteIdList}
              />
            </ValuesWrapper>
          </PopularValuesWrapper>
        )}
        <DelayedLoad
          showLoadingText
          waitBeforeShow={2000}
        >
          <PopularValuesWrapper>
            <FriendInvitationValuesHeader className="FriendInvitationValuesHeader">
              {(friendIssueWeVoteIdList && friendIssueWeVoteIdList.length) ? (
                <>
                  Choose from some popular others:
                </>
              ) : (
                <>
                  Choose from some popular options:
                </>
              )}
            </FriendInvitationValuesHeader>
            <ValuesWrapper>
              <FriendInvitationOnboardingValuesList
                displayOnlyIssuesNotFollowedByVoter
                friendIssueWeVoteIdList={friendIssueWeVoteIdList}
              />
            </ValuesWrapper>
          </PopularValuesWrapper>
        </DelayedLoad>
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
  margin: 0 !important;
  padding-bottom: 64px;
  padding-left: 24px;
  padding-right: 24px;
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationTopHeader = styled.div`
  margin-bottom: 24px;
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationValuesHeader = styled.div`
`;

const PopularValuesWrapper = styled.div`
`;

const ValuesWrapper = styled.div`
`;

const WeVoteLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingValues));
