import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import CandidateStore from '../../stores/CandidateStore';
import MeasureStore from '../../stores/MeasureStore';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import SvgImage from '../../common/components/Widgets/SvgImage';


class PositionRowEmpty extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisBallotItemLength: 0,
    };
  }

  componentDidMount () {
    // console.log('PositionRowEmpty componentDidMount');
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty componentDidMount, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    } else if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
    }
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));

    if (allCachedPositionsForThisBallotItem) {
      const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
      this.setState({
        allCachedPositionsForThisBallotItemLength,
      });
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.measureStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty onCandidateStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('cand')) {
      allCachedPositionsForThisBallotItem = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      if (allCachedPositionsForThisBallotItem) {
        const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
        this.setState({
          allCachedPositionsForThisBallotItemLength,
        });
      }
    }
  }

  onMeasureStoreChange () {
    const { ballotItemWeVoteId } = this.props;
    // console.log('PositionRowEmpty onMeasureStoreChange, ballotItemWeVoteId:', ballotItemWeVoteId);
    let allCachedPositionsForThisBallotItem;
    if (ballotItemWeVoteId.includes('meas')) {
      allCachedPositionsForThisBallotItem = MeasureStore.getAllCachedPositionsByCandidateWeVoteId(ballotItemWeVoteId);
      if (allCachedPositionsForThisBallotItem) {
        const allCachedPositionsForThisBallotItemLength = Object.keys(allCachedPositionsForThisBallotItem).length;
        this.setState({
          allCachedPositionsForThisBallotItemLength,
        });
      }
    }
  }

  render () {
    renderLog('PositionRowEmpty');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemWeVoteId } = this.props;
    const { allCachedPositionsForThisBallotItemLength } = this.state;
    if (allCachedPositionsForThisBallotItemLength > 0) {
      return null;
    }
    const avatar = normalizedImagePath('../../img/global/svg-icons/avatar-generic.svg');
    const imagePlaceholder = (
      <SvgImage imageName={avatar} />
    );
    return (
      <OuterWrapper>
        <NoOneChoosesWrapper>
          &nbsp;
        </NoOneChoosesWrapper>
        <CandidateEndorsementsContainer key={`PositionRowEmpty-${ballotItemWeVoteId}`}>
          <RowItemWrapper>
            <OrganizationPhotoOuterWrapper>
              <OrganizationPhotoInnerWrapper>
                { imagePlaceholder }
              </OrganizationPhotoInnerWrapper>
            </OrganizationPhotoOuterWrapper>
            <HorizontalSpacer />
            <YesNoScoreTextWrapper>
              <OrganizationSupportWrapper>
                <OrganizationSupportSquare>
                  <AddScoreWrapper className="u-link-color-on-hover">
                    <ToScoreLabel1>
                      No endorsements found for this candidate. Ask your friends how they are going to vote.
                    </ToScoreLabel1>
                  </AddScoreWrapper>
                </OrganizationSupportSquare>
              </OrganizationSupportWrapper>
            </YesNoScoreTextWrapper>
          </RowItemWrapper>
        </CandidateEndorsementsContainer>
      </OuterWrapper>
    );
  }
}
PositionRowEmpty.propTypes = {
  ballotItemWeVoteId: PropTypes.string.isRequired,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const AddScoreWrapper = styled('div')`
  align-items: center;
  color: #ccc;
  display: flex;
  flex-flow: column;
  font-weight: normal;
  justify-content: flex-start;
  padding-top: 4px;
`;

const CandidateEndorsementsContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const NoOneChoosesWrapper = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  line-height: 20px;
`;

const OuterWrapper = styled('div')`
  border-left: 1px dotted #dcdcdc;
  height: 100%;
  width: 64px;
`;

const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

const OrganizationPhotoInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  height: 50px;
  width: 50px;
  justify-content: center;
  & img, & svg, & path {
    border: 1px solid #ccc;
    border-radius: 48px;
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const OrganizationPhotoOuterWrapper = styled('div')`
  display: flex;
  justify-content: start;
  padding: 8px 3px 6px 4px;
  width: 128px;
`;

const OrganizationSupportSquare = styled('div')(({ theme }) => (`
  align-items: center;
  background: white;
  color: ${theme.colors.supportGreenRgb};
  cursor: pointer;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  width: 40px;
`));

const OrganizationSupportWrapper = styled('div')`
  position: relative;
  z-index: 1;
`;

const RowItemWrapper = styled('div')`
  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ToScoreLabel1 = styled('div')`
  font-size: 14px;
  margin-top: 0;
`;

const YesNoScoreTextWrapper = styled('div')`
  padding: 3px 3px 4px 4px;
  width: 64px;
`;

export default withTheme(withStyles(styles)(PositionRowEmpty));
