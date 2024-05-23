import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import HeartFavoriteToggle from '../Widgets/HeartFavoriteToggle/HeartFavoriteToggleBase';
import { renderLog } from '../../utils/logging';
import numberWithCommas from '../../utils/numberWithCommas';
import CampaignStore from '../../stores/CampaignStore';

class CampaignSupportThermometer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      finalElectionDateInPast: false,
      supportersCountNextGoal: CampaignStore.getCampaignXSupportersCountNextGoalDefault(),
      supportersCount: 0,
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      campaignXWeVoteId: previousCampaignXWeVoteId,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    const {
      supportersCount: supportersCountPrevious,
    } = prevState;
    // console.log('CampaignSupportThermometer componentDidUpdate campaignXWeVoteId:', campaignXWeVoteId);
    if (previousCampaignXWeVoteId !== campaignXWeVoteId) {
      this.clearCampaignValues();
      this.campaignTimer = setTimeout(() => {
        this.onCampaignStoreChange();
      }, 500);
    } else if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      const {
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
        supporters_count: supportersCount,
      } = campaignX;
      let supportersCountChanged = false;
      if (campaignXWeVoteIdFromDict) {
        supportersCountChanged = supportersCount !== supportersCountPrevious;
      }
      if (campaignXWeVoteId !== previousCampaignXWeVoteId || supportersCountChanged) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    if (this.campaignTimer) {
      clearTimeout(this.campaignTimer);
    }
    this.campaignTimer = null;
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignSupportThermometer onCampaignStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('CampaignSupportThermometer onCampaignStoreChange campaignX:', campaignX);
      const {
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
        final_election_date_in_past: finalElectionDateInPast,
        supporters_count: supportersCount,
        supporters_count_next_goal: supportersCountNextGoal,
      } = campaignX;
      const supportersCountNextGoalWithFloor = supportersCountNextGoal ||  CampaignStore.getCampaignXSupportersCountNextGoalDefault();
      if (campaignXWeVoteIdFromDict) {
        this.setState({
          finalElectionDateInPast,
          supportersCount,
          supportersCountNextGoal: supportersCountNextGoalWithFloor,
        });
      }
    }
  }

  clearCampaignValues = () => {
    // When we transition from one campaign to another campaign, there
    // can be a delay in getting the new campaign's values. We want to clear
    // out the values currently being displayed, while waiting for new values
    // to arrive.
    this.setState({
      finalElectionDateInPast: false,
      supportersCount: 0,
      supportersCountNextGoal: 0,
    });
  }

  render () {
    renderLog('CampaignSupportThermometer');  // Set LOG_RENDER_EVENTS to log all renders
    const { inCompressedMode } = this.props;
    const { finalElectionDateInPast, supportersCount, supportersCountNextGoal } = this.state;
    let calculatedPercentage = 0;
    if (supportersCount && supportersCountNextGoal) {
      calculatedPercentage = (supportersCount / supportersCountNextGoal) * 100;
    }
    const minimumPercentageForDisplay = 5;
    const percentageForDisplay = (calculatedPercentage < minimumPercentageForDisplay) ? minimumPercentageForDisplay : calculatedPercentage;
    const numberWithCommasText = numberWithCommas(supportersCount);
    let supportersText;
    if (finalElectionDateInPast) {
      if (supportersCount === 0) {
        supportersText = `${numberWithCommasText} supporters.`;
      } else if (supportersCount === 1) {
        supportersText = `${numberWithCommasText} supporter.`;
      } else {
        supportersText = `${numberWithCommasText} supported.`;
      }
    } else if (supportersCount === 0) {
      supportersText = 'Be the first.';
    } else if (supportersCount === 1) {
      supportersText = `${numberWithCommasText} supporter.`;
    } else {
      supportersText = `${numberWithCommasText} have supported.`;
    }

    return (
      <CampaignSupportThermometerWrapper>
        <HeartPlusDetailsWrapper>
          <HeartWrapper>
            <HeartFavoriteToggle />
          </HeartWrapper>
          <HeartDetailsWrapper>
            <SupportersText inCompressedMode={inCompressedMode}>
              {supportersText}
            </SupportersText>
            {!!(supportersCountNextGoal && !inCompressedMode && !finalElectionDateInPast) && (
              <GoalText>
                {' '}
                Help them get to
                {' '}
                {numberWithCommas(supportersCountNextGoal)}
                !
              </GoalText>
            )}
          </HeartDetailsWrapper>
        </HeartPlusDetailsWrapper>
        <ProgressBarWrapper>
          <ProgressBar percentage={percentageForDisplay}>
            <span id="progress-bar" />
            <span id="right-arrow" />
          </ProgressBar>
        </ProgressBarWrapper>
      </CampaignSupportThermometerWrapper>
    );
  }
}
CampaignSupportThermometer.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  inCompressedMode: PropTypes.bool,
};

const styles = () => ({
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    marginTop: '-9px !important',
  },
  button: {
    marginBottom: 12,
  },
});

const GoalText = styled('span')`
  font-size: 14px;
  font-weight: 800;
`;

const ProgressBar = styled('div', {
  shouldForwardProp: (prop) => !['percentage'].includes(prop),
})(({ percentage }) => (`
  background: #ccc;
  border-radius: 6px;
  display: flex;
  width: 100%;
  height: 12px;
  margin: 0 0 12px;
  span#progress-bar {
    width: ${percentage}%;
    display: block;
    height: 12px;
    border-radius: 6px 0 0 6px;
    background: linear-gradient(
      to right,
      #a7194b,
      #fe2712
    );
  };
  span#right-arrow {
    top: -6px;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #fe2712;
    border-top: 6px solid transparent;
  };
`));

const ProgressBarWrapper = styled('div')`
  margin-top: 6px;
`;

const SupportersText = styled('div', {
  shouldForwardProp: (prop) => !['inCompressedMode'].includes(prop),
})(({ inCompressedMode }) => (`
  color: black !important;
  font-size: ${inCompressedMode ? '14px' : '14px'};
  font-weight: ${inCompressedMode ? '400' : '400'};
`));

const HeartPlusDetailsWrapper = styled('div')`
  display: flex;
  justify-content: left;
`;

const HeartDetailsWrapper = styled('div')`
`;

const HeartWrapper = styled('div')`
  margin-right: 8px;
`;

const CampaignSupportThermometerWrapper = styled('div')`
`;

export default withStyles(styles)(CampaignSupportThermometer);
