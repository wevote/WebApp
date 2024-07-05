import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DesignTokenColors from '../../Style/DesignTokenColors';
import numberWithCommas from '../../../utils/numberWithCommas';
import HeartFavoriteToggleIcon from './HeartFavoriteToggleIcon';

class HeartFavoriteToggleBase extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXOpposersCountLocal: 0,
      campaignXSupportersCountLocal: 0,
      voterOpposesLocal: false,
      voterSupportsLocal: false,
    };
  }

  componentDidMount () {
    this.onPropsChange();
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

  componentDidUpdate (prevProps) {
    // console.log('SupportButton componentDidUpdate');
    const {
      campaignXSupportersCount: campaignXSupportersCountPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
      voterOpposes: voterOpposesPrevious,
      voterSupports: voterSupportsPrevious,
    } = prevProps;
    const {
      campaignXSupportersCount,
      campaignXWeVoteId,
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
  }

  handleSignInClick = () => {
    const { voterSignedInWithEmail } = this.props;
    if (!voterSignedInWithEmail) {
      if (this.props.submitSupport) {
        this.props.submitSupport();
      }
    }
  };

  handleOpposeClick = () => {
    const oppose = true;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = false;
    this.handleActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  handleStopOpposingClick = () => {
    const oppose = false;
    const support = false;
    const stopOpposing = true;
    const stopSupporting = false;
    this.handleActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  handleStopSupportingClick = () => {
    const oppose = false;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = true;
    this.handleActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  handleSupportClick = () => {
    const oppose = false;
    const support = true;
    const stopOpposing = false;
    const stopSupporting = false;
    this.handleActionClick(support, oppose, stopSupporting, stopOpposing);
  }

  handleActionClick = (support = true, oppose = false, stopSupporting = false, stopOpposing = false) => {
    const { voterSignedInWithEmail } = this.props;
    const {
      campaignXOpposersCountLocal: campaignXOpposersCountLocalPrevious,
      campaignXSupportersCountLocal: campaignXSupportersCountLocalPrevious,
      showSignInPromptSupports: showSignInPromptSupportsPrevious,
      voterOpposesLocal: voterOpposesLocalPrevious,
      voterSupportsLocal: voterSupportsLocalPrevious,
    } = this.state;
    if (!voterSignedInWithEmail) {
      // Toggle sign in prompt
      this.setState({
        showSignInPromptSupports: (support) ? !showSignInPromptSupportsPrevious : false,
        showSignInPromptOpposes: (oppose) ? !showSignInPromptSupportsPrevious : false,
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
            });
          }
          if (voterOpposesLocalPrevious) {
            this.setState({
              campaignXOpposersCountLocal: Math.max(0, campaignXOpposersCountLocalPrevious - 1),
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
            });
          }
          if (voterSupportsLocalPrevious) {
            this.setState({
              campaignXSupportersCountLocal: Math.max(0, campaignXSupportersCountLocalPrevious - 1),
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
            });
          }
        }
      });
    }
  };

  render () {
    const {
      voterSignedInWithEmail,
    } = this.props;
    const {
      campaignXSupportersCountLocal,
      campaignXOpposersCountLocal,
      showSignInPromptOpposes,
      showSignInPromptSupports,
      voterOpposesLocal,
      voterSupportsLocal,
    } = this.state;
    // console.log('campaignXSupportersCountLocal', campaignXSupportersCountLocal, 'campaignXOpposersCountLocal', campaignXOpposersCountLocal);
    // console.log('HeartFavoriteToggleBase voterSupportsLocal', voterSupportsLocal, 'voterOpposesLocal', voterOpposesLocal);
    return (
      <HeartFavoriteToggleContainer>
        <LikeContainer onClick={() => {
          if (voterSupportsLocal) {
            return this.handleStopSupportingClick();
          } else {
            return this.handleSupportClick();
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
          {/* Add "like this politician?" popout */}
          {(!voterSignedInWithEmail && showSignInPromptSupports) && (
            <span onClick={() => this.handleSignInClick()}> sign in</span>
          )}
        </LikeContainer>
        <DislikeContainer onClick={() => {
          if (voterOpposesLocal) {
            return this.handleStopOpposingClick();
          } else {
            return this.handleOpposeClick();
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
          {/* Add "Don't like this politician?" popout */}
          {(!voterSignedInWithEmail && showSignInPromptOpposes) && (
            <span onClick={() => this.handleSignInClick()}> sign in</span>
          )}
        </DislikeContainer>
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
  voterSignedInWithEmail: PropTypes.bool,
  voterSupports: PropTypes.bool,
  voterOpposes: PropTypes.bool,
};

const HeartFavoriteToggleContainer = styled.div`
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

const LikeContainer = styled.div`
  display: flex;
  padding-right: 8px;
  border-right: 1px solid ${DesignTokenColors.neutralUI100};
  cursor: pointer;
`;

const DislikeContainer = styled.div`
  display: flex;
  padding-left: 8px;
  cursor: pointer;
`;

export default HeartFavoriteToggleBase;
