import { Info, ThumbDown, ThumbUp } from '@mui/icons-material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { isCordova } from '../../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../../common/utils/logging';
import {
  NetworkScore,
} from '../../Style/ScoreDisplayStyles';
import OrganizationStore from '../../../stores/OrganizationStore';
import StickyPopover from '../../Ballot/StickyPopover';
import FriendsOnlyIndicator from '../FriendsOnlyIndicator';
import PositionItemScorePopover from './PositionItemScorePopover';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../../ImageHandler'));

class BallotItemVoterGuideSupportOpposeDisplay extends Component {
  static closePositionsPopover () {
    document.body.click();
  }

  constructor (props) {
    super(props);
    this.mobile = 'ontouchstart' in document.documentElement;
    this.networkScoreRef = React.createRef();
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('BallotItemVoterGuideSupportOpposeDisplay componentDidMount');
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onOrganizationStoreChange();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('BallotItemVoterGuideSupportOpposeDisplay caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { positionWeVoteId } = this.props;
    const positionItem = OrganizationStore.getPositionByPositionWeVoteId(positionWeVoteId);
    const {
      is_information_only: organizationInformationOnlyBallotItem,
      is_oppose: organizationOpposesBallotItem,
      is_public_position: isPublicPosition,
      is_support: organizationSupportsBallotItem,
      speaker_image_url_https_tiny: organizationImageUrlHttpsTiny,
    } = positionItem;
    // organizationImageUrlHttpsTiny: PropTypes.string,
    this.setState({
      isPublicPosition,
      organizationImageUrlHttpsTiny,
      organizationInformationOnlyBallotItem,
      organizationOpposesBallotItem,
      organizationSupportsBallotItem,
    });
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  handleEnterHoverLocalArea = () => {
    if (this.props.handleLeaveCandidateCard) {
      this.props.handleLeaveCandidateCard();
    }
  };

  handleLeaveHoverLocalArea = () => {
    if (this.props.handleEnterCandidateCard) {
      this.props.handleEnterCandidateCard();
    }
  };

  render () {
    renderLog('BallotItemVoterGuideSupportOpposeDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    const { positionWeVoteId } = this.props;
    const {
      isPublicPosition,
      organizationImageUrlHttpsTiny,
      organizationInformationOnlyBallotItem,
      organizationOpposesBallotItem,
      organizationSupportsBallotItem,
    } = this.state;
    // console.log('BallotItemVoterGuideSupportOpposeDisplay render, organizationSupportsBallotItem/organizationOpposesBallotItem:', organizationSupportsBallotItem, organizationOpposesBallotItem);

    const noOpinionsExist = !(organizationSupportsBallotItem || organizationOpposesBallotItem || organizationInformationOnlyBallotItem);

    const positionsPopover = (
      <PositionItemScorePopover
        positionWeVoteId={positionWeVoteId}
      />
    );

    return (
      <Wrapper
        onMouseEnter={this.handleEnterHoverLocalArea}
        onMouseLeave={this.handleLeaveHoverLocalArea}
      >
        { organizationSupportsBallotItem && (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick={!this.props.onClickFunction}
            showCloseIcon
          >
            <OrganizationSupportWrapper>
              <OrganizationSupportSquare>
                <OrganizationSupportIconWrapper>
                  <ThumbUp />
                </OrganizationSupportIconWrapper>
              </OrganizationSupportSquare>
              <OverlayImage className="image-border-support " style={isCordova() ? { width: 20 } : {}}>
                <OrganizationIconWrapper>
                  {organizationImageUrlHttpsTiny ? (
                    <Suspense fallback={<></>}>
                      <ImageHandler
                        alt="organization-photo-16x16"
                        imageUrl={organizationImageUrlHttpsTiny}
                        kind_of_ballot_item="ORGANIZATION"
                        sizeClassName="image-16x16"
                      />
                    </Suspense>
                  ) : <TinyImageSpacer />}
                </OrganizationIconWrapper>
                <FriendsOnlyIndicatorWrapper>
                  <FriendsOnlyIndicator isFriendsOnly={!isPublicPosition} />
                </FriendsOnlyIndicatorWrapper>
              </OverlayImage>
            </OrganizationSupportWrapper>
          </StickyPopover>
        )}

        { organizationOpposesBallotItem && (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick={!this.props.onClickFunction}
            showCloseIcon
          >
            <OrganizationOpposeWrapper>
              <OrganizationOpposeSquare>
                <OrganizationOpposeIconWrapper>
                  <ThumbDown />
                </OrganizationOpposeIconWrapper>
              </OrganizationOpposeSquare>
              <OverlayImage className="image-border-oppose ">
                <OrganizationIconWrapper>
                  {organizationImageUrlHttpsTiny ? (
                    <Suspense fallback={<></>}>
                      <ImageHandler
                        alt="organization-photo-16x16"
                        imageUrl={organizationImageUrlHttpsTiny}
                        kind_of_ballot_item="ORGANIZATION"
                        sizeClassName="image-16x16 "
                      />
                    </Suspense>
                  ) : <TinyImageSpacer />}
                </OrganizationIconWrapper>
                <FriendsOnlyIndicatorWrapper>
                  <FriendsOnlyIndicator isFriendsOnly={!isPublicPosition} />
                </FriendsOnlyIndicatorWrapper>
              </OverlayImage>
            </OrganizationOpposeWrapper>
          </StickyPopover>
        )}

        { organizationInformationOnlyBallotItem && (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick={!this.props.onClickFunction}
            showCloseIcon
          >
            <OrganizationInformationOnlyWrapper>
              <OrganizationInformationOnlySquare>
                <OrganizationInfoOnlyIconWrapper>
                  <Info />
                </OrganizationInfoOnlyIconWrapper>
              </OrganizationInformationOnlySquare>
              <OverlayImage className="image-border-gray-border ">
                <OrganizationIconWrapper>
                  {organizationImageUrlHttpsTiny ? (
                    <Suspense fallback={<></>}>
                      <ImageHandler
                        alt="organization-photo-16x16"
                        imageUrl={organizationImageUrlHttpsTiny}
                        kind_of_ballot_item="ORGANIZATION"
                        sizeClassName="image-16x16 "
                      />
                    </Suspense>
                  ) : <TinyImageSpacer />}
                </OrganizationIconWrapper>
                <FriendsOnlyIndicatorWrapper>
                  <FriendsOnlyIndicator isFriendsOnly={!isPublicPosition} />
                </FriendsOnlyIndicatorWrapper>
              </OverlayImage>
            </OrganizationInformationOnlyWrapper>
          </StickyPopover>
        )}

        {/* Gray overview display. Show if no organization opinion */}
        {noOpinionsExist && (
          <StickyPopover
            delay={{ show: 700, hide: 100 }}
            popoverComponent={positionsPopover}
            placement="bottom"
            id="ballot-support-oppose-count-trigger-click-root-close"
            openOnClick={!this.props.onClickFunction}
            showCloseIcon
          >
            <NetworkScore
              hideNumbersOfAllPositions
            >
              &nbsp;
            </NetworkScore>
          </StickyPopover>
        )}
      </Wrapper>
    );
  }
}
BallotItemVoterGuideSupportOpposeDisplay.propTypes = {
  handleLeaveCandidateCard: PropTypes.func,
  handleEnterCandidateCard: PropTypes.func,
  onClickFunction: PropTypes.func,
  positionWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  decidedIcon: {
    fontSize: 32,
    [theme.breakpoints.down('lg')]: {
      fontSize: 28,
    },
  },
  endorsementIcon: {
    width: 12,
    height: 12,
  },
});

const FriendsOnlyIndicatorWrapper = styled('div')`
  margin-top: 0 !important;
  display: flex;
`;

const Wrapper = styled('div')`
  margin-top: .1rem;
  width: 100%;
`;

const OrganizationSupportWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationSupportSquare = styled('div')(({ theme }) => (`
  align-items: center;
  background: white;
  border: 3px solid ${theme.colors.supportGreenRgb};
  border-radius: 5px;
  color: ${theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
`));

const OrganizationSupportIconWrapper = styled('div')`
  margin-left: 2px;
  margin-top: -10px;
`;

const OrganizationOpposeWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationOpposeSquare = styled('div')(({ theme }) => (`
  background: white;
  border: 3px solid ${theme.colors.opposeRedRgb};
  color: ${theme.colors.opposeRedRgb};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
`));

const OrganizationOpposeIconWrapper = styled('div')`
  margin-left: 0;
  margin-top: -10px;
`;

const OrganizationInformationOnlyWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const OrganizationInformationOnlySquare = styled('div')(({ theme }) => (`
  color: ${theme.colors.grayMid};
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 3px solid ${theme.colors.grayMid};
  font-size: 20px;
  font-weight: bold;
`));

const OrganizationInfoOnlyIconWrapper = styled('div')`
  margin-left: 1px;
  margin-top: -10px;
`;

const OverlayImage = styled('div')`
  // border: 2px solid {({ theme }) => theme.colors.supportGreenRgb};
  // color: {({ theme }) => theme.colors.supportGreenRgb};
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40px;
  height: 20px;
  background-color: white;
  // margin-left: -2px;
  margin-top: -10px;
  z-index: 2;
`;

const OrganizationIconWrapper = styled('div')`
  margin-top: 0 !important;
  padding: 0 !important;
  width: 22px;
  display: flex;
  // justify-content: center;
`;

const TinyImageSpacer = styled('div')`
  background: white;
  border-radius: 3px;
  margin: 0 !important;
  padding: 0 !important;
  width: 14px;
  height: 14px;
`;

export default withTheme(withStyles(styles)(BallotItemVoterGuideSupportOpposeDisplay));
