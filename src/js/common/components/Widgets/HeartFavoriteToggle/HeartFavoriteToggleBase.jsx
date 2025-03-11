import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Typography from '@mui/material/Typography';
import isMobileScreenSize from '../../../utils/isMobileScreenSize';
import CampaignActions from '../../../actions/CampaignActions';
import DesignTokenColors from '../../Style/DesignTokenColors';
import numberWithCommas from '../../../utils/numberWithCommas';
import HeartFavoriteToggleIcon from './HeartFavoriteToggleIcon';
import AppObservableStore from '../../../stores/AppObservableStore';

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
      campaignXOpposersCountLocal: 0,
      campaignXSupportersCountLocal: 0,
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
      campaignXSupportersCount: campaignXSupportersCountPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
      voterIsSignedIn: voterIsSignedInPrevious,
      voterOpposes: voterOpposesPrevious,
      voterSupports: voterSupportsPrevious,
    } = prevProps;
    const {
      campaignXSupportersCount,
      campaignXWeVoteId,
      voterIsSignedIn,
      voterOpposes,
      voterSupports,
    } = this.props;
    // console.log('HeartFavoriteToggleBase componentDidUpdate voterOpposes: ', voterOpposes, ', voterSupports: ', voterSupports);
    if (campaignXWeVoteId) {
      if ((campaignXWeVoteId !== campaignXWeVoteIdPrevious) ||
        (campaignXSupportersCount !== campaignXSupportersCountPrevious) ||
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
    const { campaignXOpposersCount, campaignXSupportersCount, voterSupports, voterOpposes } = this.props;
    // console.log('HeartFavoriteToggleBase onPropsChange voterOpposes: ', voterOpposes, ', voterSupports: ', voterSupports);
    this.setState({
      campaignXOpposersCountLocal: campaignXOpposersCount,
      campaignXSupportersCountLocal: campaignXSupportersCount,
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
    const { campaignXWeVoteId, voterIsSignedIn } = this.props;
    const {
      campaignXOpposersCountLocal: campaignXOpposersCountLocalPrevious,
      campaignXSupportersCountLocal: campaignXSupportersCountLocalPrevious,
      showSignInPromptSupports: showSignInPromptSupportsPrevious,
      showSignInPromptOpposes: showSignInPromptOpposesPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    if (!voterIsSignedIn) {
      // Toggle sign in prompt
      this.setState({
        showSignInPromptSupports: support ? !showSignInPromptSupportsPrevious : false,
        showSignInPromptOpposes: oppose ? !showSignInPromptOpposesPrevious : false,
        anchorEl: event ? event.currentTarget : null,
        popoverText,
      });
    } else {
      this.setState({
        voterSupportsLocal: support,
        voterOpposesLocal: oppose,
      }, () => {
        if (support) {
          if (!voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: campaignXSupportersCountLocalPrevious + 1,
            }, () => {
              if (this.props.submitSupport) {
                this.props.submitSupport();
              }
              // Local quick update of supporters_count in CampaignX object
              const supportersCountLocal = this.state.campaignXSupportersCountLocal;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal);
            });
          }
          if (voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: Math.max(0, campaignXOpposersCountLocalPrevious - 1),
            }, () => {
              // Local quick update of opposers_count in CampaignX object
              const opposersCountLocal = this.state.campaignXOpposersCountLocal;
              const supportersCountLocal = false;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal, opposersCountLocal);
            });
          }
        } else if (stopSupporting) {
          if (voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: Math.max(0, campaignXSupportersCountLocalPrevious - 1),
            }, () => {
              if (this.props.submitStopSupporting) {
                this.props.submitStopSupporting();
              }
              // Local quick update of supporters_count in CampaignX object
              const supportersCountLocal = this.state.campaignXSupportersCountLocal;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal);
            });
          }
        } else if (oppose) {
          if (!voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: campaignXOpposersCountLocalPrevious + 1,
            }, () => {
              if (this.props.submitOppose) {
                this.props.submitOppose();
              }
              // Local quick update of opposers_count in CampaignX object
              const opposersCountLocal = this.state.campaignXOpposersCountLocal;
              const supportersCountLocal = false;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal, opposersCountLocal);
            });
          }
          if (voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: Math.max(0, campaignXSupportersCountLocalPrevious - 1),
            }, () => {
              // Local quick update of supporters_count in CampaignX object
              const supportersCountLocal = this.state.campaignXSupportersCountLocal;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal);
            });
          }
        } else if (stopOpposing) {
          if (voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: Math.max(0, campaignXOpposersCountLocalPrevious - 1),
            }, () => {
              if (this.props.submitStopOpposing) {
                this.props.submitStopOpposing();
              }
              // Local quick update of opposers_count in CampaignX object
              const opposersCountLocal = this.state.campaignXOpposersCountLocal;
              const supportersCountLocal = false;
              CampaignActions.campaignLocalAttributesUpdate(campaignXWeVoteId, supportersCountLocal, opposersCountLocal);
            });
          }
        }
      });
    }
  };

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
      popoverText: '',
    });
  }

  supportHoverText = () => {
    const {
      campaignXSupportersCountLocal: campaignXSupportersCountLocalPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    const supportersCount = campaignXSupportersCountLocalPrevious ? Number(campaignXSupportersCountLocalPrevious) : 0;

    if (!voterOpposesLocalPrevious && !voterSupportsLocalPrevious) {
      return 'Favoriting helps us show you what other candidates match your values.';
    } else if (voterOpposesLocalPrevious) {
      return `Favorited by ${supportersCount} people. Favoriting helps us show you what other candidates match your values.`;
    } else {
      return 'Remove Favorite';
    }
  }

  opposeHoverText = () => {
    const {
      campaignXOpposersCountLocal: campaignXOpposersCountLocalPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;

    const opposersCount = campaignXOpposersCountLocalPrevious ? Number(campaignXOpposersCountLocalPrevious) : 0;

    if (!voterOpposesLocalPrevious && !voterSupportsLocalPrevious) {
      return `Disliked by ${opposersCount} people. Disliking helps us show you what other candidates match your values.`;
    } else if (voterSupportsLocalPrevious) {
      return `Disliked by ${opposersCount} people. Disliking helps us show you what other candidates match your values.`;
    } else {
      return 'Remove Dislike';
    }
  }

  render () {
    const {
      voterIsSignedIn,
    } = this.props;
    const {
      campaignXSupportersCountLocal,
      campaignXOpposersCountLocal,
      showSignInPromptOpposes,
      showSignInPromptSupports,
      voterOpposesLocal,
      voterSupportsLocal,
      anchorEl,
      popoverText,
    } = this.state;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const supportToolTip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="supportTooltip">
        <div>
          <span>{this.supportHoverText()}</span>
        </div>
      </Tooltip>
    );

    const opposeToolTip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id="opposeTooltip">
        <div>
          <span>{this.opposeHoverText()}</span>
        </div>
      </Tooltip>
    );

    // console.log('campaignXSupportersCountLocal', campaignXSupportersCountLocal, 'campaignXOpposersCountLocal', campaignXOpposersCountLocal);
    // console.log('HeartFavoriteToggleBase voterSupportsLocal', voterSupportsLocal, 'voterOpposesLocal', voterOpposesLocal);
    return (
      <HeartFavoriteToggleContainer>
        <OverlayTrigger overlay={supportToolTip} placement="top">
          <LikeContainer onClick={(event) => {
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
                {numberWithCommas(campaignXSupportersCountLocal)}
              </span>
            )}
          </LikeContainer>
        </OverlayTrigger>
        <LikeDislikeSeperator>&nbsp;</LikeDislikeSeperator>
        <OverlayTrigger overlay={opposeToolTip} placement="top">
          <DislikeContainer onClick={(event) => {
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
                {numberWithCommas(campaignXOpposersCountLocal)}
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
  campaignXOpposersCount: PropTypes.number,
  campaignXSupportersCount: PropTypes.number,
  campaignXWeVoteId: PropTypes.string,
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
