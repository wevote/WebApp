import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Info, ThumbUp, ThumbDown } from '@material-ui/icons';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';
import FriendsOnlyIndicator from './FriendsOnlyIndicator';
import PositionItemScorePopover from './PositionItemScorePopover';
import StickyPopover from '../Ballot/StickyPopover';

class BallotItemVoterGuideSupportOpposeDisplay extends Component {
  static closePositionsPopover () {
    document.body.click();
  }

  static propTypes = {
    handleLeaveCandidateCard: PropTypes.func,
    handleEnterCandidateCard: PropTypes.func,
    organizationImageUrlHttpsTiny: PropTypes.string,
    organizationInformationOnlyBallotItem: PropTypes.bool,
    organizationOpposesBallotItem: PropTypes.bool,
    organizationSupportsBallotItem: PropTypes.bool,
    positionItem: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.mobile = 'ontouchstart' in document.documentElement;
    this.networkScoreRef = React.createRef();
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('BallotItemVoterGuideSupportOpposeDisplay componentDidMount');
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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('BallotItemVoterGuideSupportOpposeDisplay caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('BallotItemVoterGuideSupportOpposeDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      organizationImageUrlHttpsTiny,
      organizationInformationOnlyBallotItem,
      organizationOpposesBallotItem,
      organizationSupportsBallotItem,
      positionItem,
    } = this.props;
    // console.log('BallotItemVoterGuideSupportOpposeDisplay render, organizationSupportsBallotItem/organizationOpposesBallotItem:', organizationSupportsBallotItem, organizationOpposesBallotItem);

    const {
      is_public_position: isPublicPosition,
    } = positionItem;

    const noOpinionsExist = !(organizationSupportsBallotItem || organizationOpposesBallotItem || organizationInformationOnlyBallotItem);

    const positionsPopover = (
      <PositionItemScorePopover
        positionItem={positionItem}
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
            openOnClick
            showCloseIcon
          >
            <OrganizationSupportWrapper>
              <OrganizationSupportSquare>
                <OrganizationSupportIconWrapper>
                  <ThumbUp />
                </OrganizationSupportIconWrapper>
              </OrganizationSupportSquare>
              <OverlayImage className="image-border-support ">
                <OrganizationIconWrapper>
                  {organizationImageUrlHttpsTiny ? (
                    <ImageHandler
                      alt="organization-photo-16x16"
                      imageUrl={organizationImageUrlHttpsTiny}
                      kind_of_ballot_item="ORGANIZATION"
                      sizeClassName="image-16x16 "
                    />
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
            openOnClick
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
                    <ImageHandler
                      alt="organization-photo-16x16"
                      imageUrl={organizationImageUrlHttpsTiny}
                      kind_of_ballot_item="ORGANIZATION"
                      sizeClassName="image-16x16 "
                    />
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
            openOnClick
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
                    <ImageHandler
                      alt="organization-photo-16x16"
                      imageUrl={organizationImageUrlHttpsTiny}
                      kind_of_ballot_item="ORGANIZATION"
                      sizeClassName="image-16x16 "
                    />
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
            openOnClick
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

const styles = theme => ({
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

const FriendsOnlyIndicatorWrapper = styled.div`
  margin-top: -3px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: -2px !important;
  }
`;

const Wrapper = styled.div`
  margin-top: .1rem;
  width: 100%;
`;

const NetworkScore = styled.div`
  align-items: center;
  background: ${({ hideNumbersOfAllPositions, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (hideNumbersOfAllPositions && 'rgb(240, 240, 240)') || '#888')};
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  height: 40px;
  justify-content: center;
  width: 40px;
  @media print{
    border-width: 1 px;
    border-style: solid;
    border-color: ${({ hideNumbersOfAllPositions, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive }) => ((voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (hideNumbersOfAllPositions && 'rgb(240, 240, 240)') || '#888')};
  }
`;

const OrganizationSupportWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const OrganizationSupportSquare = styled.div`
  align-items: center;
  background: white;
  border: 3px solid ${({ theme }) => theme.colors.supportGreenRgb};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  width: 40px;
`;

const OrganizationSupportIconWrapper = styled.div`
  margin-left: 2px;
  margin-top: -10px;
`;

const OrganizationOpposeWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const OrganizationOpposeSquare = styled.div`
  background: white;
  border: 3px solid ${({ theme }) => theme.colors.opposeRedRgb};
  color: ${({ theme }) => theme.colors.opposeRedRgb};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationOpposeIconWrapper = styled.div`
  margin-left: 0px;
  margin-top: -10px;
`;

const OrganizationInformationOnlyWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const OrganizationInformationOnlySquare = styled.div`
  color: ${({ theme }) => theme.colors.grayMid};
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 3px solid ${({ theme }) => theme.colors.grayMid};
  font-size: 20px;
  font-weight: bold;
`;

const OrganizationInfoOnlyIconWrapper = styled.div`
  margin-left: 1px;
  margin-top: -10px;
`;

const OverlayImage = styled.div`
  // border: 2px solid ${({ theme }) => theme.colors.supportGreenRgb};
  // color: ${({ theme }) => theme.colors.supportGreenRgb};
  display: flex;
  width: 36px;
  height: 20px;
  margin-left: -2px;
  margin-top: -12px;
  z-index: 2;
`;

const OrganizationIconWrapper = styled.div`
  margin-top: -3px !important;
  padding: 0 !important;
  width: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: -2px !important;
  }
`;

const TinyImageSpacer = styled.div`
  background: white;
  border-radius: 3px;
  margin: 0px !important;
  margin-top: 3px !important; // Override setting in OrganizationIconWrapper
  padding: 0px !important;
  width: 16px;
  height: 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 2px !important; // Override setting in OrganizationIconWrapper
  }
`;

export default withTheme(withStyles(styles)(BallotItemVoterGuideSupportOpposeDisplay));
