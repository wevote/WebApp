import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import MeasureStore from '../../stores/MeasureStore';
import AppStore from '../../stores/AppStore';
import ReadMore from '../Widgets/ReadMore';
import { capitalizeString } from '../../utils/textFormat';
import BallotItemSupportOpposeComment from '../Widgets/BallotItemSupportOpposeComment';
// import SupportStore from '../../stores/SupportStore';

class MeasureItem extends Component {
  static propTypes = {
    measureWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: '',
      measureSubtitle: '',
      measureText: '',
      measureWeVoteId: '',
      electionDisplayName: '',
      regionalDisplayName: '',
      stateCode: '',
      stateDisplayName: '',
      showPositionStatementActionBar: true,
      scrolledDown: AppStore.getScrolledDown(),
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
  }

  componentDidMount () {
    this.onMeasureStoreChange();
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    // this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // this.setState({
    //   supportProps: SupportStore.get(this.props.we_vote_id)
    // });
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.appStoreListener.remove();
    // this.supportStoreListener.remove();
  }

  onMeasureStoreChange () {
    const measure = MeasureStore.getMeasure(this.props.measureWeVoteId);
    this.setState({
      ballotItemDisplayName: measure.ballot_item_display_name,
      measureSubtitle: measure.measure_subtitle,
      measureText: measure.measure_text,
      measureWeVoteId: measure.we_vote_id,
      electionDisplayName: measure.election_display_name,
      regionalDisplayName: measure.regional_display_name,
      stateCode: measure.state_code,
      stateDisplayName: measure.state_display_name,
    });
  }

  onAppStoreChange () {
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  // onSupportStoreChange () {
  //   this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  // }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb/`; // back-to-default-ballot
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  render () {
    renderLog(__filename);
    // const { supportProps, transitioning } = this.state;
    let {
      ballotItemDisplayName, measureSubtitle, stateDisplayName,
    } = this.state;
    const {
      measureText, measureWeVoteId, electionDisplayName, regionalDisplayName, stateCode,
      scrolledDown,
    } = this.state;
    console.log(scrolledDown);
    if (stateDisplayName === undefined && stateCode) {
      stateDisplayName = stateCode.toUpperCase();
    }

    const numberOfLines = 2;
    measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    // const positionsInYourNetwork = SupportStore.get(measureWeVoteId) && (SupportStore.get(measureWeVoteId).oppose_count || SupportStore.get(measureWeVoteId).support_count);

    return (
      <div className="card-main">
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            {ballotItemDisplayName}
          </h2>
          { electionDisplayName || regionalDisplayName || stateDisplayName ?
            (
              <div className="card-main__measure-election u-bold u-gray-darker">
                <p>
                  { electionDisplayName || 'Appearing on the ballot in ' }
                  { electionDisplayName ? <span> &middot; </span> : null }
                  { regionalDisplayName || null }
                  { regionalDisplayName && stateDisplayName ? ', ' : null }
                  { stateDisplayName }
                </p>
              </div>
            ) :
            null }
          <div
            className="u-cursor--pointer"
            onClick={() => this.goToMeasureLink(measureWeVoteId)}
          >
            {measureSubtitle}
          </div>
          { measureText ? (
            <div className="measure_text u-gray-mid">
              <ReadMore
                num_of_lines={numberOfLines}
                text_to_display={measureText}
              />
            </div>
          ) :
            null
          }
          {
            !scrolledDown && (
              <BallotItemSupportOpposeComment
                ballotItemWeVoteId={measureWeVoteId}
                showPositionStatementActionBar={this.state.showPositionStatementActionBar}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default MeasureItem;
