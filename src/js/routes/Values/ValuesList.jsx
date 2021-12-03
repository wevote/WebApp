import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import SearchBar from '../../components/Search/SearchBar';
import IssueStore from '../../stores/IssueStore';
import VoterStore from '../../stores/VoterStore';
import { isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../components/Widgets/ReadMore'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../components/Widgets/DelayedLoad'));
const IssueCard = React.lazy(() => import(/* webpackChunkName: 'IssueCard' */ '../../components/Values/IssueCard'));


export default class ValuesList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allIssues: [],
      searchQuery: '',
      currentIssue: {},
    };

    this.searchFunction = this.searchFunction.bind(this);
    this.clearFunction = this.clearFunction.bind(this);
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    const { currentIssue } = this.props;
    const allIssues = IssueStore.getAllIssues();
    this.setState({
      allIssues,
      currentIssue,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { currentIssue } = nextProps;
    const allIssues = IssueStore.getAllIssues();
    this.setState({
      allIssues,
      currentIssue,
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
  }

  onIssueStoreChange () {
    const allIssues = IssueStore.getAllIssues();
    this.setState({
      allIssues,
    });
  }

  searchFunction (searchQuery) {
    this.setState({ searchQuery });
  }

  clearFunction () {
    this.searchFunction('');
  }

  render () {
    renderLog('ValuesList');  // Set LOG_RENDER_EVENTS to log all renders
    const { allIssues, searchQuery, currentIssue } = this.state;
    let issuesList = [];
    // let issuesNotFollowedByVoterList = [];
    // let issuesNotCurrentIssue = [];
    if (allIssues) {
      if (this.props.displayOnlyIssuesNotFollowedByVoter) {
        issuesList = allIssues.filter((issue) => issue.issue_we_vote_id !== currentIssue.issue_we_vote_id).filter((issue) => !IssueStore.isVoterFollowingThisIssue(issue.issue_we_vote_id));
      } else {
        issuesList = allIssues;
      }
    }

    // console.log('ValuesList all issues:', issuesList);

    if (searchQuery.length > 0) {
      const searchQueryLowercase = searchQuery.toLowerCase();
      issuesList = filter(issuesList,
        (oneIssue) => oneIssue.issue_name.toLowerCase().includes(searchQueryLowercase) ||
            oneIssue.issue_description.toLowerCase().includes(searchQueryLowercase));
    }

    const issuesToShowBeforeDelayedLoad = 6;
    let issuesRenderedCount = 0;
    let issueCardHtml = '';
    const issuesListForDisplay = issuesList.map((issue) => {
      issuesRenderedCount += 1;
      issueCardHtml = (
        <Column
          className="col col-12 col-md-6 u-stack--lg"
          key={`column-issue-list-key-${issue.issue_we_vote_id}`}
        >
          <Suspense fallback={<></>}>
            <IssueCard
              followToggleOn
              includeLinkToIssue
              issue={issue}
              issueImageSize="SMALL"
              key={`issue-list-key-${issue.issue_we_vote_id}`}
            />
          </Suspense>
        </Column>
      );
      if (issuesRenderedCount <= issuesToShowBeforeDelayedLoad) {
        return issueCardHtml;
      } else {
        // We create a delay after the first 6 issues are rendered, so the initial page load is a little faster
        return (
          <Suspense fallback={<></>}>
            <DelayedLoad
              key={`delayed-issue-list-key-${issue.issue_we_vote_id}`}
              showLoadingText={issuesRenderedCount === (issuesToShowBeforeDelayedLoad + 1)}
              waitBeforeShow={500}
            >
              {issueCardHtml}
            </DelayedLoad>
          </Suspense>
        );
      }
    });

    return (
      <PageContentContainer>
        {this.props.displayOnlyIssuesNotFollowedByVoter ? (
          <Row className="row">
            {issuesListForDisplay}
          </Row>
        ) : (
          <div className="opinions-followed__container">
            <Helmet title="Values - We Vote" />
            <section className="card">
              <div className="card-main" style={{ paddingTop: `${isCordova() ? '0px' : '16px'}` }}>
                <h1 className="h1">
                  Values
                  {(allIssues && allIssues.length > 0) && (
                    <>
                      {' '}
                      (
                      {allIssues.length}
                      )
                    </>
                  )}
                </h1>
                <p>
                  <Suspense fallback={<></>}>
                    <ReadMore
                      textToDisplay="Follow the values and issues you care about, so we can highlight the advocates (organizations and public figures) that care about the same issues you do. All of the advocates under values or issues you follow will be added to your Personalized Score."
                      numberOfLines={3}
                    />
                  </Suspense>
                </p>
                <SearchBar
                  clearButton
                  searchButton
                  placeholder="Search by name or Description"
                  searchFunction={this.searchFunction}
                  clearFunction={this.clearFunction}
                  searchUpdateDelayTime={0}
                />
                <br />
                <>
                  {allIssues && allIssues.length ? (
                    <Row className="row">
                      {issuesListForDisplay}
                    </Row>
                  ) :
                    null}
                </>
              </div>
            </section>
          </div>
        )}
      </PageContentContainer>
    );
  }
}
ValuesList.propTypes = {
  displayOnlyIssuesNotFollowedByVoter: PropTypes.bool,
  currentIssue: PropTypes.object,
};

const Row = styled.div`
  // margin-left: -16px;
  // margin-right: -16px;
  // width: calc(100% + 32px);
`;

const Column = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 24px !important;
  }
`;
