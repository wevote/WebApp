import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import FriendInvitationOnboardingValuesList from './FriendInvitationOnboardingValuesList';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import ShowMoreFooter from '../Navigation/ShowMoreFooter';
import { historyPush } from '../../utils/cordovaUtils';

class ValuesToFollowPreview extends Component {
  static propTypes = {
    followToggleOnItsOwnLine: PropTypes.bool,
    includeLinkToIssue: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      issuesToFollow: [],
    };
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.onIssueStoreChange();
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
      // IssueActions.issueDescriptionsRetrieveCalled(); // TODO: Move this to AppActions? Currently throws error: "Cannot dispatch in the middle of a dispatch"
    }
    IssueActions.issuesFollowedRetrieve();
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      issuesToFollow: IssueStore.getIssuesVoterCanFollow(),
    });
  }

  goToValuesLink () {
    historyPush('/values/list');
  }

  render () {
    renderLog('ValuesToFollowPreview');  // Set LOG_RENDER_EVENTS to log all renders
    const { followToggleOnItsOwnLine, includeLinkToIssue } = this.props;
    const { issuesToFollow } = this.state;
    let issuesToFollowLength = 0;
    if (issuesToFollow) {
      issuesToFollowLength = issuesToFollow.length;
    }

    return (
      <div className="opinions-followed__container">
        <section className="card">
          <div className="card-main">
            <SectionTitle>
              Values to Follow
              {!!(issuesToFollowLength) && (
                <>
                  {' '}
                  (
                  {issuesToFollowLength}
                  )
                </>
              )}
            </SectionTitle>
            <SectionInformation>
              <i className="fas fa-info-circle" />
              Follow values/issues to see opinions from people who share your values.
            </SectionInformation>
            <Row className="row">
              <FriendInvitationOnboardingValuesList
                displayOnlyIssuesNotFollowedByVoter
                followToggleOnItsOwnLine={followToggleOnItsOwnLine}
                includeLinkToIssue={includeLinkToIssue}
                oneColumn
              />
            </Row>
            <ShowMoreFooter
              showMoreId="valuesToFollowPreviewShowMoreId"
              showMoreLink={() => this.goToValuesLink()}
              showMoreText="Explore all values"
            />
          </div>
        </section>
      </div>
    );
  }
}

const Row = styled.div`
  margin: 0 !important;
`;

const SectionInformation = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  width: fit-content;
`;

export default withTheme((ValuesToFollowPreview));
