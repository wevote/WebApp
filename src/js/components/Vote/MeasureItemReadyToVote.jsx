import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { Wrapper, InnerWrapper, BioColumn, OfficeColumn, OfficeText, BioInformation, HR } from './BallotItemReadyToVote';


export default class MeasureItemReadyToVote extends Component {
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
