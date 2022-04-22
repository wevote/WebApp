import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';
import { removeTwitterNameFromDescription } from '../../utils/textFormat';
import StickyPopover from '../Ballot/StickyPopover';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));


// VoterGuideDisplayForList is used by GuideList for viewing voter guides you can follow on the Candidate
// and Opinions (you can follow) Components
// Please see VoterGuide/OrganizationCard for the Component displayed by TwitterHandle
class VoterGuideDisplayForList extends PureComponent {
  render () {
    renderLog('VoterGuideDisplayForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.props.organizationWeVoteId === undefined) {
      // console.log('VoterGuideDisplayForList this.props.organization_we_vote_id === undefined');
      return null;
    }

    // We package up the above variables to mimic a position
    const position = this.props;

    const {
      organizationWeVoteId,
      voterGuideImageUrlLarge,
    } = this.props; // twitter_followers_count,
    const numOfLines = 2;
    const voterGuideDisplayName = this.props.voterGuideDisplayName ? this.props.voterGuideDisplayName : '';
    const twitterDescription = this.props.twitterDescription ? this.props.twitterDescription : '';
    // console.log('VoterGuideDisplayForList twitterDescription: ', twitterDescription);

    // If the voter_guide_display_name is in the twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voterGuideDisplayName, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = this.props.twitterHandle ? `/${this.props.twitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    let positionDescription = '';
    const isOnBallotItemPage = true; // From 'actor's' perspective: actorSupportsBallotItemLabel
    if (position.voteSmartRating) {
      positionDescription = <PositionRatingSnippet {...position} />;
    } else if (position.isSupport || position.isOppose) {
      positionDescription = <PositionSupportOpposeSnippet {...position} isOnBallotItemPage={isOnBallotItemPage} />;
    } else if (position.isInformationOnly) {
      positionDescription = <PositionInformationOnlySnippet {...position} isOnBallotItemPage={isOnBallotItemPage} />;
    } else {
      // console.log('VoterGuideDisplayForList NO positionDescription');
    }
    const organizationPopoverCard = (<OrganizationPopoverCard linksOpenExternalWebsite organizationWeVoteId={organizationWeVoteId} />);

    return (
      <Wrapper id="voterGuideDisplayForList">
        <div className="card-child__media-object-anchor">
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={organizationPopoverCard}
            placement="auto"
            id="organization-sticky-popover"
          >
            <Link to={voterGuideLink} className="u-no-underline">
              <Suspense fallback={<></>}>
                <ImageHandler className="card-child__avatar" sizeClassName="image-lg " imageUrl={voterGuideImageUrlLarge} />
              </Suspense>
            </Link>
          </StickyPopover>
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <StickyPopover
              delay={{ show: 700, hide: 100 }}
              popoverComponent={organizationPopoverCard}
              placement="auto"
              id="organization-sticky-popover"
            >
              <Link id="organizationOrPublicFigureLink" to={voterGuideLink}>
                <h4 className="card-child__display-name">{voterGuideDisplayName}</h4>
              </Link>
            </StickyPopover>

            { twitterDescriptionMinusName ? (
              <Suspense fallback={<></>}>
                <ReadMore
                  className="card-child__organization-description"
                  textToDisplay={twitterDescriptionMinusName}
                  numberOfLines={numOfLines}
                />
              </Suspense>
            ) : null}
            { positionDescription }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {this.props.children}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}
VoterGuideDisplayForList.propTypes = {
  children: PropTypes.object, // This is how we pass in the FollowToggle
  organizationWeVoteId: PropTypes.string,
  voterGuideImageUrlLarge: PropTypes.string,
  voterGuideDisplayName: PropTypes.string,
  candidateName: PropTypes.string,
  speakerDisplayName: PropTypes.string,
  twitterDescription: PropTypes.string,
  twitterFollowersCount: PropTypes.number,
  twitterHandle: PropTypes.string,
  isSupport: PropTypes.bool,
  isPositiveRating: PropTypes.bool,
  isOppose: PropTypes.bool,
  isNegativeRating: PropTypes.bool,
  isInformationOnly: PropTypes.bool,
  voteSmartRating: PropTypes.string,
  speakerText: PropTypes.string,
  moreInfoUrl: PropTypes.string,
};

const styles = (theme) => ({
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
});

const Wrapper = styled('div')`
  padding: 8px;
  background-color: #f8f8f8 !default;
  border: 1px solid #e7e7e7;
  margin: -1px 0 6px 0; // stylelint-disable-line sh-waqar/declaration-use-variable
  @include breakpoints(max mid-small) {
    margin-left: -(16px); // stylelint-disable-line sh-waqar/declaration-use-variable
    margin-right: -(16px); // stylelint-disable-line sh-waqar/declaration-use-variable
  }
  display: flex;
  align-items: flex-start;
  position: relative;
`;

export default withStyles(styles)(VoterGuideDisplayForList);
