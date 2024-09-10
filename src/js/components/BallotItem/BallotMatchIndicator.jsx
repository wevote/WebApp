import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';

const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));

class BallotMatchIndicator extends Component {
  constructor (props) {
    super(props);
    this.scrollElement = React.createRef();
    this.state = {
    };
  }

  componentDidMount () {
  }

  render () {
    const { oneCandidate } = this.props;
    const scoreExplanationTooltip = isMobileScreenSize() ? (<span />) : (
      <Tooltip className="u-z-index-9020" id={`scoreDescription-${oneCandidate.we_vote_id}`}>
        Your personalized score
        {oneCandidate.ballot_item_display_name && (
          <>
            {' '}
            for
            {' '}
            {oneCandidate.ballot_item_display_name}
          </>
        )}
        {' '}
        is the number of people who support this candidate, from among the people you trust. Trust by clicking the plus sign.
      </Tooltip>
    );

    const pigsCanFly = false;
    return (
      <BallotMatchIndicatorContainer>
        <Suspense fallback={<></>}>
          <BallotItemSupportOpposeScoreDisplay
            ballotItemWeVoteId={oneCandidate.we_vote_id}
            onClickFunction={this.onClickShowOrganizationModalWithPositions}
            hideEndorsementsOverview
            hideNumbersOfAllPositions
          />
        </Suspense>
        {pigsCanFly && (
          <InfoCircleOuterWrapper>
            <OverlayTrigger
              placement="bottom"
              overlay={scoreExplanationTooltip}
            >
              <ScoreWrapper>
                <InfoCircleIconWrapper>
                  <InfoCircleIcon />
                </InfoCircleIconWrapper>
              </ScoreWrapper>
            </OverlayTrigger>
          </InfoCircleOuterWrapper>
        )}
      </BallotMatchIndicatorContainer>
    );
  }
}
BallotMatchIndicator.propTypes = {
  oneCandidate: PropTypes.object,
};

const BallotMatchIndicatorContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  padding-right: 0;
`;

const InfoCircleIconWrapper = styled('div')`
  margin-bottom: -4px;
  margin-left: 3px;
`;

const InfoCircleOuterWrapper = styled('div')`
  color: #999;
  line-height: 20px;
  margin-top: 0;
`;

const ScoreWrapper = styled('div')`
  display: flex;
`;

export default BallotMatchIndicator;
