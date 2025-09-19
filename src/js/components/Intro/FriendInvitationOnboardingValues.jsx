import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import HeaderLogoImage from '../Navigation/HeaderLogoImage';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';

const FriendInvitationOnboardingFriendValuesList = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationOnboardingFriendValuesList' */ '../Values/FriendInvitationOnboardingFriendValuesList'));
const FriendInvitationOnboardingValuesList = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationOnboardingValuesList' */ '../Values/FriendInvitationOnboardingValuesList'));
const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';


class FriendInvitationOnboardingValues extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  onClickToggleAllTopHeaderExplanation = () => {
    const { showAllTopHeaderExplanation } = this.state;
    this.setState({
      showAllTopHeaderExplanation: !showAllTopHeaderExplanation,
    });
  }

  render () {
    renderLog('FriendInvitationOnboardingValues');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendFirstName, friendLastName, friendImageUrlHttpsTiny, friendIssueWeVoteIdList } = this.props;
    const { showAllTopHeaderExplanation } = this.state;
    return (
      <Wrapper>
        <WeVoteLogoWrapper>
          <HeaderLogoImage src={normalizedImagePath(logoDark)} />
        </WeVoteLogoWrapper>
        <FriendInvitationTopHeader>
          <div className="FriendInvitationTopHeader">
            Follow what you care about.
          </div>
          {showAllTopHeaderExplanation ? (
            <div className="FriendInvitationTopHeaderExplanation" onClick={this.onClickToggleAllTopHeaderExplanation}>
              <InfoCircleIcon />
              Opinions will be highlighted on your ballot based on what you follow. Follow as many values/issues as you would like.
              {' '}
              We promise to never sell your email address.
              {' '}
              You can stop following values/issues at any time in the &quot;Opinions&quot; section.
              {' '}
              (
              <span className="u-cursor--pointer u-link-color">
                show less
              </span>
              )
            </div>
          ) : (
            <div className="FriendInvitationTopHeaderExplanation" onClick={this.onClickToggleAllTopHeaderExplanation}>
              <InfoCircleIcon />
              Opinions will be highlighted on your ballot based on what you follow. Follow as many values/issues...
              {' '}
              (
              <span id="showMoreLink" className="u-cursor--pointer u-link-color">
                show more
              </span>
              )
            </div>
          )}
        </FriendInvitationTopHeader>
        {!!(friendIssueWeVoteIdList && friendIssueWeVoteIdList.length) && (
          <PopularValuesWrapper>
            <FriendInvitationValuesHeader className="FriendInvitationValuesHeader">
              {friendImageUrlHttpsTiny && (
                <Suspense fallback={<></>}>
                  <ImageHandler
                    sizeClassName="image-24x24 "
                    imageUrl={friendImageUrlHttpsTiny}
                    alt="organization-photo"
                    kind_of_ballot_item="ORGANIZATION"
                  />
                </Suspense>
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
              <Suspense fallback={<></>}>
                <FriendInvitationOnboardingFriendValuesList
                  friendIssueWeVoteIdList={friendIssueWeVoteIdList}
                />
              </Suspense>
            </ValuesWrapper>
          </PopularValuesWrapper>
        )}
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
            <Suspense fallback={<></>}>
              <FriendInvitationOnboardingValuesList
                displayOnlyIssuesNotFollowedByVoter
                friendIssueWeVoteIdList={friendIssueWeVoteIdList}
              />
            </Suspense>
          </ValuesWrapper>
        </PopularValuesWrapper>
      </Wrapper>
    );
  }
}
FriendInvitationOnboardingValues.propTypes = {
  friendFirstName: PropTypes.string,
  friendLastName: PropTypes.string,
  friendImageUrlHttpsTiny: PropTypes.string,
  friendIssueWeVoteIdList: PropTypes.array,
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
  margin: 0 !important;
  padding-bottom: 64px;
  padding-left: 24px;
  padding-right: 24px;
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationTopHeader = styled('div')`
  margin-bottom: 24px;
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationValuesHeader = styled('div')`
`;

const PopularValuesWrapper = styled('div')`
`;

const ValuesWrapper = styled('div')`
`;

const WeVoteLogoWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboardingValues));
