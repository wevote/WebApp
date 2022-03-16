import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from '@mui/material/styles/styled';
import SupportStore from '../../stores/SupportStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import { renderLog } from '../../common/utils/logging';

const BallotItemSupportOpposeCountDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeCountDisplay' */ '../Widgets/BallotItemSupportOpposeCountDisplay'));


class MeasureItemReadyToVote extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    const { measureWeVoteId } = this.props;
    if (measureWeVoteId) {
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
      if (ballotItemStatSheet) {
        const { voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet;
        this.setState({
          voterOpposesBallotItem,
          voterSupportsBallotItem,
        });
      }
    }
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onSupportStoreChange () {
    const { measureWeVoteId } = this.props;
    if (measureWeVoteId) {
      const ballotItemStatSheet = SupportStore.getBallotItemStatSheet(measureWeVoteId);
      if (ballotItemStatSheet) {
        const { voterOpposesBallotItem, voterSupportsBallotItem } = ballotItemStatSheet;
        this.setState({
          voterOpposesBallotItem,
          voterSupportsBallotItem,
        });
      }
    }
  }

  render () {
    renderLog('MeasureItemReadyToVote');  // Set LOG_RENDER_EVENTS to log all renders
    const { measureWeVoteId, ballotItemDisplayName } = this.props;
    const { voterOpposesBallotItem, voterSupportsBallotItem } = this.state;

    return (
      <>
        <Wrapper>
          { (voterOpposesBallotItem || voterSupportsBallotItem) && (  // eslint-disable-line no-nested-ternary
            <InnerWrapper>
              <BioColumn>
                <BioInformation>
                  <MeasureNameText>{ballotItemDisplayName}</MeasureNameText>
                </BioInformation>
              </BioColumn>
              <OfficeColumn>
                <Suspense fallback={<></>}>
                  <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={measureWeVoteId} />
                </Suspense>
              </OfficeColumn>
            </InnerWrapper>
          )}
        </Wrapper>
        <HR />
      </>
    );
  }
}
MeasureItemReadyToVote.propTypes = {
  measureWeVoteId: PropTypes.string.isRequired,
  ballotItemDisplayName: PropTypes.string.isRequired,
};

const styles = ({
});

const Wrapper = styled('div')`
  padding: 24px 24px 20px 24px;
  transition: all 200ms ease-in;
  border: 1px solid transparent;
  border-radius: 4px;
`;

const InnerWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  width: 100%;
`;

const BioColumn = styled('div')`
  display: flex;
`;

const OfficeColumn = styled('div')`
  display: flex;
  float: right;
`;

const MeasureNameText = styled('p')`
  font-size: 18px;
  font-weight: 500;
  margin: auto 0;
  margin-right: 16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
  @media print {
    font-size: 24px !important;
  }
`;

const BioInformation = styled('div')`
  display: flex;
  flex-flow: column;
  margin-left: 8px;
`;

const HR = styled('hr')`
  margin: 0 24px;
`;

export default withStyles(styles)(MeasureItemReadyToVote);
