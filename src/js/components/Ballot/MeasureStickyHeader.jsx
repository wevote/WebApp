import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
import MeasureStore from '../../stores/MeasureStore';

class MeasureStickyHeader extends Component {
  static propTypes = {
    measureWeVoteId: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      // measureWeVoteId: props.measureWeVoteId,
    };
  }

  componentDidMount () {
    this.onMeasureStoreChange();
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    // this.supportStoreListener.remove();
  }

  onMeasureStoreChange () {
    const measure = MeasureStore.getMeasure(this.props.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      // measureSubtitle: measure.measure_subtitle,
      // measureText: measure.measure_text,
      // measureWeVoteId: measure.we_vote_id,
      // electionDisplayName: measure.election_display_name,
      // regionalDisplayName: measure.regional_display_name,
      // stateCode: measure.state_code,
      // stateDisplayName: measure.state_display_name,
    });
  }

  render () {
    const { measureWeVoteId } = this.props;
    const { ballotItemDisplayName } = this.state;
    const ballotItemDisplay = ballotItemDisplayName ? ballotItemDisplayName.split(':') : [];
    return (
      <Wrapper>
        <MeasureInfo>
          <Title>{ballotItemDisplay[0]}</Title>
          <SubTitle>{ballotItemDisplay[1]}</SubTitle>
          <ActionContainer>
            <BallotItemSupportOpposeComment
              ballotItemWeVoteId={measureWeVoteId}
              showPositionStatementActionBar={false}
            />
          </ActionContainer>
        </MeasureInfo>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  padding-top: 48px;
  padding-left: 32px;
  top: 0;
  left: 0;
  background: white;
  z-index: 2;
  width: 100vw;
  display: flex;
  flex-flow: row;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  transition: all 100ms ease-in;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-left: 16px;
  }
`;

const MeasureInfo = styled.div`
  max-width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 16px;
    margin: auto 0;
  }
`;

const SubTitle = styled.p`
  font-size: 18px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 12px;
  }
`;

const ActionContainer = styled.div`
  margin-top: -24px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: -12px;
    margin-left: -12px;
  }
`;

export default MeasureStickyHeader;
