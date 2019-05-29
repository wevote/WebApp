import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BallotItemSupportOpposeCountDisplay from '../Widgets/BallotItemSupportOpposeCountDisplay';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import SupportStore from '../../stores/SupportStore';
import { Wrapper, InnerWrapper, BioColumn, OfficeColumn, OfficeText, BioInformation, HR } from './BallotItemReadyToVote';


export default class MeasureItemReadyToVote extends Component {
  static propTypes = {
    measureWeVoteId: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.getMeasureLink = this.getMeasureLink.bind(this);
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

  getMeasureLink () {
    return `/measure/${this.props.measureWeVoteId}/`;
  }

  render () {
    renderLog(__filename);
    const { supportProps } = this.state;

    const { measureWeVoteId, ballot_item_display_name: ballotItemDisplayName } = this.props;

    return (
      <React.Fragment>
        <Wrapper onClick={() => historyPush(this.getMeasureLink())}>
          { supportProps && supportProps.is_support && (  // eslint-disable-line no-nested-ternary
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
