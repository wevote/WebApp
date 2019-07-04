import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
    this.setState({ supportProps: SupportStore.get(this.props.measureWeVoteId) });
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
    this.setState({ supportProps: SupportStore.get(this.props.measureWeVoteId) });
  }

  render () {
    renderLog(__filename);
    const { supportProps } = this.state;

    const { measureWeVoteId, ballotItemDisplayName } = this.props;

    return (
      <React.Fragment>
        <Wrapper>
          { supportProps && (supportProps.is_support || supportProps.is_oppose) && (  // eslint-disable-line no-nested-ternary
            <InnerWrapper>
              <BioColumn>
                <BioInformation>
                  <OfficeText>{ballotItemDisplayName}</OfficeText>
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

const OfficeText = styled.p`
  font-weight: 500;
  margin: auto 0;
  margin-right: 16px;
`;

const BioInformation = styled.div`
  display: flex;
  flex-flow: column;
  margin-left: 8px;
`;

const HR = styled.hr`
  margin: 0 24px;
`;

export default MeasureItemReadyToVote;
