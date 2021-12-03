import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ElectionActions from '../../actions/ElectionActions';
import BallotElectionListWithFilters from '../../components/Ballot/BallotElectionListWithFilters';
import ElectionStore from '../../stores/ElectionStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';

export default class Elections extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    this.electionListListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    ElectionActions.electionsRetrieve();
    AnalyticsActions.saveActionElections(VoterStore.electionId());
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.electionListListener.remove();
  }

  onElectionStoreChange () {
    // console.log('onElectionStoreChange');
    this.setState({});
  }

  render () {
    renderLog('Elections');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <Helmet title="Elections - We Vote" />
        <h1 className="h1">Supported Elections</h1>
        <div className="elections-list-container">
          <BallotElectionListWithFilters
            ballotBaseUrl="/ballot"
            showPriorElectionsList
            stateToShow="all"
          />
        </div>
      </PageContentContainer>
    );
  }
}
