import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Typography from '@mui/material/Typography';
import TagManager from 'react-gtm-module';
import isMobileScreenSize from '../../../utils/isMobileScreenSize';
import CampaignActions from '../../../actions/CampaignActions';
import DesignTokenColors from '../../Style/DesignTokenColors';
import numberWithCommas from '../../../utils/numberWithCommas';
import HeartFavoriteToggleIcon from './HeartFavoriteToggleIcon';
import AppObservableStore from '../../../stores/AppObservableStore';
import CandidateStore from '../../../../stores/CandidateStore';
import VoterStore from '../../../../stores/VoterStore';
import { getPageDetails } from '../../../../utils/lookupPageNameAndPageTypeDict';


// WV-399: Creating popover for sign in prompt using MUI Popover component.
// Popover text passed into helper functions setting like/dislike text for handleActionClick.
// voterIsSignedIn in handleActionClick to update state for anchorEl and popoverText hooking into Like/Dislike containers.
// Conditional rendered Popover component with anchorEl and popoverText state.
// Styled Popover component to match design system.

const CustomPopoverPaper = styled('div')`
  background-color: #fff;
  color: #333;
  padding: 16px 16px 0 16px;
  max-width: 350px;

  .MuiTypography-root {
    font-size: 1rem;
    margin-bottom: 8px;
    font-family: "Poppins", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  .signInText {
    color: #065FD4;
    cursor: pointer;
  }
`;

class HeartFavoriteToggleBase extends Component {
  constructor (props) {
    super(props);
    this.state = {
      opposersCountLocal: 0,
      supportersCountLocal: 0,
      voterOpposesDelayed: false,  // Mark as opposed after sign in finishes
      voterSupportsDelayed: false,  // Mark as supported after sign in finishes
      voterOpposesLocal: false,
      voterSupportsLocal: false,
      anchorEl: null, // Anchors to capture element for popover
      popoverText: '', // Text for the popover
    };
  }

  componentDidMount () {
    this.onPropsChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('SupportButton componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
      opposersCount: opposersCountPrevious,
      organizationWeVoteId: organizationWeVoteIdPrevious,
      supportersCount: supportersCountPrevious,
      voterIsSignedIn: voterIsSignedInPrevious,
      voterOpposes: voterOpposesPrevious,
      voterSupports: voterSupportsPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
      opposersCount,
      organizationWeVoteId,
      supportersCount,
      voterIsSignedIn,
      voterOpposes,
      voterSupports,
    } = this.props;
    // console.log('HeartFavoriteToggleBase componentDidUpdate voterOpposes: ', voterOpposes, ', voterSupports: ', voterSupports);
    if (campaignXWeVoteId) {
      if ((campaignXWeVoteId !== campaignXWeVoteIdPrevious) ||
        (opposersCount !== opposersCountPrevious) ||
        (supportersCount !== supportersCountPrevious) ||
        (voterOpposes !== voterOpposesPrevious) ||
        (voterSupports !== voterSupportsPrevious)) {
        this.onPropsChange();
      }
    } else if (organizationWeVoteId) {
      if ((organizationWeVoteId !== organizationWeVoteIdPrevious) ||
        (opposersCount !== opposersCountPrevious) ||
        (supportersCount !== supportersCountPrevious) ||
        (voterOpposes !== voterOpposesPrevious) ||
        (voterSupports !== voterSupportsPrevious)) {
        this.onPropsChange();
      }
    }
    if (voterIsSignedIn && (voterIsSignedInPrevious !== voterIsSignedIn)) {
      // If the voter tried to Oppose or Support before signing in, complete the action
      const { voterOpposesDelayed, voterSupportsDelayed } = this.state;
      // console.log('componentDidUpdate voterOpposesDelayed: ', voterOpposesDelayed, ', voterSupportsDelayed:', voterSupportsDelayed);
      if (voterOpposesDelayed || voterSupportsDelayed) {
        this.setState({
          voterSupportsDelayed: false,
          voterOpposesDelayed: false,
        });
        this.timer = setTimeout(() => {
          if (voterOpposesDelayed) {
            this.handleOpposeClick();
          } else if (voterSupportsDelayed) {
            this.handleSupportClick();
          }
        }, 500);
      }
    }
  }

  onPropsChange () {
    const { opposersCount, supportersCount, voterSupports, voterOpposes } = this.props;
    // console.log('HeartFavoriteToggleBase onPropsChange opposersCount: ', opposersCount, ', supportersCount: ', supportersCount);
    // console.log('HeartFavoriteToggleBase onPropsChange voterOpposes: ', voterOpposes, ', voterSupports: ', voterSupports);
    this.setState({
      opposersCountLocal: opposersCount,
      supportersCountLocal: supportersCount,
      voterSupportsLocal: voterSupports,
      voterOpposesLocal: voterOpposes,
    });
  }

  handleSignInClick = (voterSupports = false, voterOpposes = false) => {
    AppObservableStore.setShowSignInModal(true);
    this.setState({
      voterSupportsDelayed: voterSupports,
      voterOpposesDelayed: voterOpposes,
    });
  };

  handleOpposeClick = (event) => {
    const oppose = true;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = false;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Don’t like this politician?');
  }

  handleStopOpposingClick = (event) => {
    const oppose = false;
    const support = false;
    const stopOpposing = true;
    const stopSupporting = false;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Don’t like this politician?');
  }

  handleStopSupportingClick = (event) => {
    const oppose = false;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = true;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Like this politician?');
  }

  handleSupportClick = (event) => {
    const oppose = false;
    const support = true;
    const stopOpposing = false;
    const stopSupporting = false;
    this.handleActionClick(event, support, oppose, stopSupporting, stopOpposing, 'Like this politician?');
  }

  handleActionClick = (event, support = true, oppose = false, stopSupporting = false, stopOpposing = false, popoverText = '') => {
    // eslint-disable-next-line no-unused-vars
    const { campaignXWeVoteId, organizationWeVoteId, voterIsSignedIn } = this.props;
    const {
      opposersCountLocal: opposersCountLocalPrevious,
      supportersCountLocal: supportersCountLocalPrevious,
      showSignInPromptSupports: showSignInPromptSupportsPrevious,
      showSignInPromptOpposes: showSignInPromptOpposesPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    if (!voterIsSignedIn) {
      let actionType = '';
      if (support) {
        actionType = showSignInPromptSupportsPrevious ? 'favoriteSignedOutUndo' : 'favoriteSignedOut';
      } else if (oppose) {
        actionType = showSignInPromptOpposesPrevious ? 'dislikeSignedOutUndo' : 'dislikeSignedOut';
      }

      // Toggle sign in prompt
      this.setState({
        showSignInPromptSupports: support ? !showSignInPromptSupportsPrevious : false,
        showSignInPromptOpposes: oppose ? !showSignInPromptOpposesPrevious : false,
        anchorEl: event ? event.currentTarget : null,
        popoverText,
      }, () => {
        if (support || oppose) {
          const dataLayerObject = {
            actionDetails: { actionType },
            event: 'action',
            pageDetails: getPageDetails(),
            userDetails: VoterStore.getAnalyticsUserDetails(),
          };

          if (campaignXWeVoteId) {
            dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(campaignXWeVoteId);
          }

          TagManager.dataLayer({ dataLayer: dataLayerObject });
        }
      });
    } else {
      // console.log('handleActionClick support: ', support, ', oppose: ', oppose, ', stopSupporting: ', stopSupporting, ', stopOpposing: ', stopOpposing);
      this.setState({
        voterSupportsLocal: support,
        voterOpposesLocal: oppose,
      }, () => {
        if (support) {
          if (!voterSupportsLocalPrevious) {
            const newState = {
              voterSupportsLocal: true,
              voterOpposesLocal: false,
              supportersCountLocal: supportersCountLocalPrevious + 1,
              opposersCountLocal: voterOpposesLocalPrevious ?
                Math.max(0, opposersCountLocalPrevious - 1) :
                opposersCountLocalPrevious,
            };

            this.setState(newState, () => {
              if (this.props.submitSupport) {
                this.props.submitSupport();
              }

              const dataLayerObject = {
                actionDetails: {
                  actionType: 'favorite',
                },
                event: 'action',
                pageDetails: getPageDetails(),
                userDetails: VoterStore.getAnalyticsUserDetails(),
              };

              if (campaignXWeVoteId) {
                dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(campaignXWeVoteId);
                CampaignActions.campaignLocalAttributesUpdate(
                  campaignXWeVoteId,
                  newState.supportersCountLocal,
                  newState.opposersCountLocal,
                );
              }

              TagManager.dataLayer({ dataLayer: dataLayerObject });
            });
          }
        } else if (stopSupporting) {
          if (voterSupportsLocalPrevious) {
            const newState = {
              voterSupportsLocal: false,
              supportersCountLocal: Math.max(0, supportersCountLocalPrevious - 1),
            };

            this.setState(newState, () => {
              if (this.props.submitStopSupporting) {
                this.props.submitStopSupporting();
              }

              const dataLayerObject = {
                actionDetails: {
                  actionType: 'favoriteUndo',
                },
                event: 'action',
                pageDetails: getPageDetails(),
                userDetails: VoterStore.getAnalyticsUserDetails(),
              };

              if (campaignXWeVoteId) {
                dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(campaignXWeVoteId);
                CampaignActions.campaignLocalAttributesUpdate(
                  campaignXWeVoteId,
                  newState.supportersCountLocal,
                );
              }

              TagManager.dataLayer({ dataLayer: dataLayerObject });
            });
          }
        } else if (oppose) {
          if (!voterOpposesLocalPrevious) {
            const newState = {
              voterSupportsLocal: false,
              voterOpposesLocal: true,
              opposersCountLocal: opposersCountLocalPrevious + 1,
              supportersCountLocal: voterSupportsLocalPrevious ?
                Math.max(0, supportersCountLocalPrevious - 1) :
                supportersCountLocalPrevious,
            };

            this.setState(newState, () => {
              if (this.props.submitOppose) {
                this.props.submitOppose();
              }

              const dataLayerObject = {
                actionDetails: {
                  actionType: 'dislike',
                },
                event: 'action',
                pageDetails: getPageDetails(),
                userDetails: VoterStore.getAnalyticsUserDetails(),
              };

              if (campaignXWeVoteId) {
                dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(campaignXWeVoteId);
                CampaignActions.campaignLocalAttributesUpdate(
                  campaignXWeVoteId,
                  newState.supportersCountLocal,
                  newState.opposersCountLocal,
                );
              }

              TagManager.dataLayer({ dataLayer: dataLayerObject });
            });
          }
        } else if (stopOpposing) {
          if (voterOpposesLocalPrevious) {
            const newState = {
              voterOpposesLocal: false,
              opposersCountLocal: Math.max(0, opposersCountLocalPrevious - 1),
            };

            this.setState(newState, () => {
              if (this.props.submitStopOpposing) {
                this.props.submitStopOpposing();
              }

              const dataLayerObject = {
                actionDetails: {
                  actionType: 'dislikeUndo',
                },
                event: 'action',
                pageDetails: getPageDetails(),
                userDetails: VoterStore.getAnalyticsUserDetails(),
              };

              if (campaignXWeVoteId) {
                CampaignActions.campaignLocalAttributesUpdate(
                  campaignXWeVoteId,
                  this.state.supportersCountLocal,
                  newState.opposersCountLocal,
                );
              }
              TagManager.dataLayer({ dataLayer: dataLayerObject });
            });
          }
        }
      });
    }
  }

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
      popoverText: '',
    });
  }

  supportHoverText = () => {
    const { campaignXWeVoteId, organizationWeVoteId } = this.props;
    const {
      supportersCountLocal: supportersCountLocalPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    const supportersCount = supportersCountLocalPrevious ? Number(supportersCountLocalPrevious) : 0;

    if (!voterOpposesLocalPrevious && !voterSupportsLocalPrevious) {
      if (organizationWeVoteId) {
        return 'Favoriting helps us match you to candidates who share your values.';
      } else if (campaignXWeVoteId) {
        return 'Favoriting helps us match you to other candidates who share your values.';
      }
      return 'Favoriting helps us match you to other candidates who share your values.';
    } else if (voterOpposesLocalPrevious) {
      if (organizationWeVoteId) {
        return `Favorited by ${supportersCount} people. Favoriting helps us match you to candidates who share your values.`;
      } else if (campaignXWeVoteId) {
        return `Favorited by ${supportersCount} people. Favoriting helps us match you to other candidates who share your values.`;
      }
      return `Favorited by ${supportersCount} people. Favoriting helps us match you to other candidates who share your values.`;
    } else {
      return 'Remove Favorite';
    }
  }

  opposeHoverText = () => {
    const { campaignXWeVoteId, organizationWeVoteId } = this.props;
    const {
      opposersCountLocal: opposersCountLocalPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    const opposersCount = opposersCountLocalPrevious ? Number(opposersCountLocalPrevious) : 0;

    if (!voterOpposesLocalPrevious && !voterSupportsLocalPrevious) {
      if (organizationWeVoteId) {
        return `Disliked by ${opposersCount} people. Disliking helps us match you to candidates who share your values.`;
      } else if (campaignXWeVoteId) {
        return `Disliked by ${opposersCount} people. Disliking helps us match you to other candidates who share your values.`;
      }
      return `Disliked by ${opposersCount} people. Disliking helps us match you to other candidates who share your values.`;
    } else if (voterSupportsLocalPrevious) {
      if (organizationWeVoteId) {
        return `Disliked by ${opposersCount} people. Disliking helps us match you to candidates who share your values.`;
      } else if (campaignXWeVoteId) {
        return `Disliked by ${opposersCount} people. Disliking helps us match you to other candidates who share your values.`;
      }
      return `Disliked by ${opposersCount} people. Disliking helps us match you to other candidates who share your values.`;
    } else {
      return 'Remove Dislike';
    }
  }

  render () {
    const {
      voterIsSignedIn,
    } = this.props;
    const {
      supportersCountLocal,
      opposersCountLocal,
      showSignInPromptOpposes,
      showSignInPromptSupports,
      voterOpposesLocal,
      voterSupportsLocal,
      anchorEl,
      popoverText,
    } = this.state;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const supportToolTip = isMobileScreenSize() ? (<></>) : (
      <Tooltip className="u-z-index-9020" id="supportTooltip">
        <div>
          <span>{this.supportHoverText()}</span>
        </div>
      </Tooltip>
    );

    const opposeToolTip = isMobileScreenSize() ? (<></>) : (
      <Tooltip className="u-z-index-9020" id="opposeTooltip">
        <div>
          <span>{this.opposeHoverText()}</span>
        </div>
      </Tooltip>
    );

    // console.log('supportersCountLocal', supportersCountLocal, 'opposersCountLocal', opposersCountLocal);
    // console.log('HeartFavoriteToggleBase voterSupportsLocal', voterSupportsLocal, 'voterOpposesLocal', voterOpposesLocal);
    return (
      <HeartFavoriteToggleContainer>
        <OverlayTrigger overlay={supportToolTip} placement="top">
          <LikeContainer
            alt="Follow"
            onClick={(event) => {
              if (voterSupportsLocal) {
                return this.handleStopSupportingClick(event);
              } else {
                return this.handleSupportClick(event);
              }
            }}
          >
            <HeartFavoriteToggleIcon
              isFavorite
              voterSupports={voterSupportsLocal}
            />
            {!voterOpposesLocal && (
              <span>
                {numberWithCommas(supportersCountLocal)}
              </span>
            )}
          </LikeContainer>
        </OverlayTrigger>
        <LikeDislikeSeperator>&nbsp;</LikeDislikeSeperator>
        <OverlayTrigger overlay={opposeToolTip} placement="top">
          <DislikeContainer
            alt="Dislike"
            onClick={(event) => {
              if (voterOpposesLocal) {
                return this.handleStopOpposingClick(event);
              } else {
                return this.handleOpposeClick(event);
              }
            }}
          >
            <HeartFavoriteToggleIcon
              isDislike
              voterOpposes={voterOpposesLocal}
            />
            {voterOpposesLocal && (
              <span>
                {numberWithCommas(opposersCountLocal)}
              </span>
            )}
          </DislikeContainer>
        </OverlayTrigger>
        {(!voterIsSignedIn && (showSignInPromptOpposes || showSignInPromptSupports)) && (
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => this.handlePopoverClose()}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            slotProps={{
              paper: {
                component: CustomPopoverPaper,
              },
            }}
          >
            <h2 className="MuiTypography-root">{popoverText}</h2>
            <Typography variant="body1">Sign in to make your opinion count.</Typography>
            <Typography>
              <Button
                className="signInText"
                onClick={() => this.handleSignInClick(showSignInPromptSupports, showSignInPromptOpposes)}
                style={{ marginLeft: '-8px' }}
                id="likeDislikeSignIn"
              >
                Sign in
              </Button>
            </Typography>
          </Popover>
        )}
      </HeartFavoriteToggleContainer>
    );
  }
}

HeartFavoriteToggleBase.propTypes = {
  opposersCount: PropTypes.number,
  supportersCount: PropTypes.number,
  campaignXWeVoteId: PropTypes.string,
  organizationWeVoteId: PropTypes.string,
  submitOppose: PropTypes.func,
  submitStopOpposing: PropTypes.func,
  submitStopSupporting: PropTypes.func,
  submitSupport: PropTypes.func,
  voterIsSignedIn: PropTypes.bool,
  voterSupports: PropTypes.bool,
  voterOpposes: PropTypes.bool,
};


const HeartFavoriteToggleContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  background: ${DesignTokenColors.whiteUI};
`;

const LikeContainer = styled('button')`
  all: unset;
  display: flex;
  padding-right: 8px;
  cursor: pointer;
  &:focus {
    border: 1px solid black; /* Black border on focus */
  }
`;

const LikeDislikeSeperator = styled('div')`
  max-width: 1px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};
`;

const DislikeContainer = styled('button')`
  all: unset;
  display: flex;
  padding-left: 8px;
  cursor: pointer;
  &:focus {
    border: 1px solid black; /* Black border on focus */
  }
`;

export default HeartFavoriteToggleBase;
