import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/esm/styles';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';


class MeasureItemReadyToVote extends Component {
  static propTypes = {
    measureWeVoteId: PropTypes.string.isRequired,
    ballotItemDisplayName: PropTypes.string.isRequired,
  };

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
      <React.Fragment>
        <Wrapper>
          { (voterOpposesBallotItem || voterSupportsBallotItem) && (  // eslint-disable-line no-nested-ternary
            <InnerWrapper>
              <BioColumn>
                <BioInformation>
                  <MeasureNameText>{ballotItemDisplayName}</MeasureNameText>
                </BioInformation>
              </BioColumn>
              <OfficeColumn>
                <BallotItemSupportOpposeCountDisplay ballotItemWeVoteId={measureWeVoteId} />
              </OfficeColumn>
            </InnerWrapper>
          )
          }
        </Wrapper>
        <HR />
      </React.Fragment>
    );
  }
}

const styles = ({
});

const Wrapper = styled.div`
  padding: 24px 24px 20px 24px;
  transition: all 200ms ease-in;
  border: 1px solid transparent;
  border-radius: 4px;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  width: 100%;
`;

const BioColumn = styled.div`
  display: flex;
`;

const OfficeColumn = styled.div`
  display: flex;
`;

const MeasureNameText = styled.p`
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

const BioInformation = styled.div`
  display: flex;
  flex-flow: column;
  margin-left: 8px;
`;

const HR = styled.hr`
  margin: 0 24px;
`;

export default withStyles(styles)(MeasureItemReadyToVote);
