import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import IssueActions from '../../actions/IssueActions';
import apiCalming from '../../common/utils/apiCalming';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import SearchBar from '../../components/Search/SearchBar2024';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import IssueStore from '../../stores/IssueStore';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
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
    if (apiCalming('issueDescriptionsRetrieve', 3600000)) { // Only once per 60 minutes
      IssueActions.issueDescriptionsRetrieve();
    }
    if (apiCalming('issuesFollowedRetrieve', 60000)) { // Only once per minute
      IssueActions.issuesFollowedRetrieve();
    }
    const { currentIssue, includedOnAnotherPage } = this.props;
    if (!includedOnAnotherPage) {
      window.scrollTo(0, 0);
    }
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
    const { displayOnlyIssuesNotFollowedByVoter, hideAdvocatesCount, includedOnAnotherPage } = this.props;
    const { allIssues, searchQuery, currentIssue } = this.state;
    let issuesList = [];
    // let issuesNotFollowedByVoterList = [];
    // let issuesNotCurrentIssue = [];
    if (allIssues) {
      if (displayOnlyIssuesNotFollowedByVoter) {
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
              hideAdvocatesCount={hideAdvocatesCount}
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
          <Suspense fallback={<></>} key={`delayed-issue-list-key-${issue.issue_we_vote_id}`}>
            <DelayedLoad
              showLoadingText={issuesRenderedCount === (issuesToShowBeforeDelayedLoad + 1)}
              waitBeforeShow={500}
            >
              {issueCardHtml}
            </DelayedLoad>
          </Suspense>
        );
      }
    });

    const generatedContent = (
      <div>
        {displayOnlyIssuesNotFollowedByVoter ? (
          <Row className="row">
            {issuesListForDisplay}
          </Row>
        ) : (
          <div className="opinions-followed__container">
            <section className="card">
              <div className="card-main" style={{ paddingTop: `${isCordova() ? '0px' : '16px'}` }}>
                <h1 className="h1">
                  All Topics
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
                  searchUpdateDelayTime={250}
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
      </div>
    );

    if (includedOnAnotherPage) {
      return (
        <ValuesListWrapper>
          {generatedContent}
        </ValuesListWrapper>
      );
    } else {
      return (
        <PageContentContainer>
          <Helmet title="Values - We Vote" />
          {generatedContent}
        </PageContentContainer>
      );
    }
  }
}
ValuesList.propTypes = {
  currentIssue: PropTypes.object,
  displayOnlyIssuesNotFollowedByVoter: PropTypes.bool,
  hideAdvocatesCount: PropTypes.bool,
  includedOnAnotherPage: PropTypes.bool,
};

const Column = styled('div')`
  @media (max-width: 768px) {
    margin-bottom: 24px !important;
  }
`;

const Row = styled('div')`
  // margin-left: -16px;
  // margin-right: -16px;
  // width: calc(100% + 32px);
`;

const ValuesListWrapper = styled('div')`
`;
