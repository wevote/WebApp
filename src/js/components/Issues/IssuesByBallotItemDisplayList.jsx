import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import $ from "jquery";
import { cordovaDot } from "../../utils/cordovaUtils";
import VoterGuideStore from "../../stores/VoterGuideStore";
import IssueStore from "../../stores/IssueStore";
import { renderLog } from "../../utils/logging";
import SupportStore from "../../stores/SupportStore";

// Show a voter a horizontal list of all of the issues they are following that relate to this ballot item
export default class IssuesByBallotItemDisplayList extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string,
    ballotItemWeVoteId: PropTypes.string.isRequired,
    currentBallotIdInUrl: PropTypes.string,
    issuesListHidden: PropTypes.bool,
    overlayTriggerOnClickOnly: PropTypes.bool,
    popoverBottom: PropTypes.bool,
    urlWithoutHash: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      ballotItemDisplayName: false,
      canScrollDesktop: false,
      canScrollMobile: false,
      canScrollLeftDesktop: false,
      canScrollLeftMobile: false,
      canScrollRightDesktop: true,
      canScrollRightMobile: true,
      issuesUnderThisBallotItem: [],
      issuesUnderThisBallotItemVoterIsFollowing: [],
      issuesUnderThisBallotItemVoterIsNotFollowing: [],
      issuesVoterIsFollowing: [],
      maximumNumberOfIssuesToDisplay: 26,
      showModal: false,
      transitioning: false,
    };
    this.closeIssuesLabelPopover = this.closeIssuesLabelPopover.bind(this);
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.setScrollState();
    this.setState({
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
      ballotItemDisplayName: this.props.ballotItemDisplayName ? this.props.ballotItemDisplayName : "this candidate",
      issuesUnderThisBallotItem: IssueStore.getIssuesUnderThisBallotItem(this.props.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsFollowing: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.props.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsNotFollowing: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.props.ballotItemWeVoteId),
      issuesVoterIsFollowing: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setScrollState();
    this.setState({
      ballotItemWeVoteId: nextProps.ballotItemWeVoteId,
      ballotItemDisplayName: nextProps.ballotItemDisplayName ? nextProps.ballotItemDisplayName : "this candidate",
      issuesUnderThisBallotItem: IssueStore.getIssuesUnderThisBallotItem(nextProps.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsFollowing: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(nextProps.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsNotFollowing: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(nextProps.ballotItemWeVoteId),
      issuesVoterIsFollowing: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  closeIssuesLabelPopover () {
    document.body.click();
  }

  onIssueStoreChange () {
    this.setScrollState();
    this.setState({
      issuesUnderThisBallotItem: IssueStore.getIssuesUnderThisBallotItem(this.state.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsFollowing: IssueStore.getIssuesUnderThisBallotItemVoterIsFollowing(this.state.ballotItemWeVoteId),
      issuesUnderThisBallotItemVoterIsNotFollowing: IssueStore.getIssuesUnderThisBallotItemVoterNotFollowing(this.state.ballotItemWeVoteId),
      issuesVoterIsFollowing: IssueStore.getIssuesVoterIsFollowing(),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
  }

  scrollLeft (visibleTag) {
    const element = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-issue-list-${visibleTag}`]);
    let position = $(element).scrollLeft();
    let width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position - width,
    }, 350, () => {
      let newPosition = $(element).scrollLeft();
      if (visibleTag === "desktop") {
        this.setState({
          canScrollLeftDesktop: newPosition > 0,
          canScrollRightDesktop: true,
        });
      } else {
        this.setState({
          canScrollLeftMobile: newPosition > 0,
          canScrollRightMobile: true,
        });
      }
    });
  }

  scrollRight (visibleTag) {
    const element = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-issue-list-${visibleTag}`]);
    let position = $(element).scrollLeft();
    let width = Math.round($(element).width());
    $(element).animate({
      scrollLeft: position + width,
    }, 350, () => {
      let newPosition = $(element).scrollLeft();
      if (visibleTag === "desktop") {
        this.setState({
          canScrollLeftDesktop: newPosition > 0,
          canScrollRightDesktop: position + width === newPosition,
        });
      } else {
        this.setState({
          canScrollLeftMobile: newPosition > 0,
          canScrollRightMobile: position + width === newPosition,
        });
      }
    });
  }

  setScrollState () {
    const desktopList = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-issue-list-desktop`]);
    const mobileList = findDOMNode(this.refs[`${this.state.ballotItemWeVoteId}-issue-list-mobile`]);
    let desktopListVisibleWidth = $(desktopList).width();
    let desktopListWidth = $(desktopList).children().eq(0).children().eq(0).width();
    let mobileListVisibleWidth = $(mobileList).width();
    let mobileListWidth = $(mobileList).children().eq(0).children().eq(0).width();
    this.setState({
      canScrollDesktop: desktopListVisibleWidth <= desktopListWidth,
      canScrollMobile: mobileListVisibleWidth <= mobileListWidth,
    });
  }

  render () {
    renderLog(__filename);
    let issuesUnderThisBallotItemVoterIsFollowingFound = this.state.issuesUnderThisBallotItemVoterIsFollowing && this.state.issuesUnderThisBallotItemVoterIsFollowing.length;
    let issuesUnderThisBallotItemVoterIsNotFollowingFound = this.state.issuesUnderThisBallotItemVoterIsNotFollowing && this.state.issuesUnderThisBallotItemVoterIsNotFollowing.length;

    // console.log("this.state.ballotItemWeVoteId: ", this.state.ballotItemWeVoteId);
    // console.log("this.state.issuesUnderThisBallotItem: ", this.state.issuesUnderThisBallotItem);
    // console.log("this.state.issuesUnderThisBallotItemVoterIsFollowing: ", this.state.issuesUnderThisBallotItemVoterIsFollowing);
    // console.log("this.state.issuesUnderThisBallotItemVoterIsNotFollowing: ", this.state.issuesUnderThisBallotItemVoterIsNotFollowing);
    if (!issuesUnderThisBallotItemVoterIsFollowingFound && !issuesUnderThisBallotItemVoterIsNotFollowingFound) {
      return null;
    }

    let localCounter = 0;
    const issuesVoterIsFollowingHtml = this.state.issuesUnderThisBallotItemVoterIsFollowing.map((oneIssue) => {
      if (!oneIssue) {
        return null;
      }
      localCounter++;
      if (localCounter <= this.state.maximumNumberOfIssuesToDisplay) {
        return <span className="u-push--sm issue-icon-list__issue-block"
                     key={`issue-icon-${oneIssue.issue_we_vote_id}`}
                     >
          {/* <img src={cordovaDot("/img/global/svg-icons/issue-generic.svg")}
                 className="issue-icon-list__issue-icon"
                 /> */}
            <span className="u-margin-left--xs issue-icon-list__issue-label-name">{oneIssue.issue_name}</span>
          </span>;
      } else {
        return null;
      }
    });
    localCounter = 0;
    const issuesVoterIsNotFollowingHtml = this.state.issuesUnderThisBallotItemVoterIsNotFollowing.map((oneIssue) => {
      if (!oneIssue) {
        return null;
      }
      localCounter++;
      if (localCounter <= this.state.maximumNumberOfIssuesToDisplay) {
        return <span className="u-push--sm issue-icon-list__issue-block"
                     key={`issue-icon-${oneIssue.issue_we_vote_id}`}
                     >
          {/* <img src={cordovaDot("/img/global/svg-icons/issue-generic.svg")}
                 className="issue-icon-list__issue-icon"
                 /> */}
            <span className="u-margin-left--xs issue-icon-list__issue-label-name">{oneIssue.issue_name}</span>
          </span>;
      } else {
        return null;
      }
    });

    let ballotItemSupportProps = SupportStore.get(this.state.ballotItemWeVoteId);
    let networkSupportCount = parseInt(ballotItemSupportProps.support_count) || 0;
    let networkOpposeCount = parseInt(ballotItemSupportProps.oppose_count) || 0;
    let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(this.state.ballotItemWeVoteId);
    let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(this.state.ballotItemWeVoteId);
    let totalSupportCount = networkSupportCount + organizationsToFollowSupport.length;
    let totalOpposeCount = networkOpposeCount + organizationsToFollowOppose.length;

    const endorsementsLabel =
      <span className="issues-list-stacked__support-label u-no-break">
        <span className="u-push--md">
          { totalSupportCount ?
            <span className="u-no-break u-push--xs issue-icon-list__endorsements-label"><img
              src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")}
              className="u-push--xs"
              width="20"
              height="20"/>{totalSupportCount}</span> :
            null
          }
          { totalOpposeCount ?
            <span className="u-no-break u-push--xs issue-icon-list__endorsements-label"><img
              src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")}
              className="u-push--xs"
              width="20"
              height="20"/>{totalOpposeCount}</span> :
            null
          }
          { totalSupportCount || totalOpposeCount ?
            <span className="issue-icon-list__endorsements-label">Endorsements</span> :
            null
          }
        </span>
      </span>;

    return (
      <div className="issues-list-stacked__support-list u-flex u-justify-between u-items-center">
        {/* Click to scroll left through list Desktop */}
        {/*
        */}
        { this.state.canScrollDesktop && this.state.canScrollLeftDesktop ?
          <i className="fa fa-2x fa-chevron-left issues-list-stacked__support-list__scroll-icon u-cursor--pointer d-none d-sm-block d-print-none" aria-hidden="true" onClick={this.scrollLeft.bind(this, "desktop")} /> :
          <i className="fa fa-2x fa-chevron-left network-positions-stacked__support-list__scroll-icon--disabled d-none d-sm-block d-print-none" aria-hidden="true" />
        }
        {/* Click to scroll left through list Mobile */}
        {/*
        */}
        { this.state.canScrollMobile && this.state.canScrollLeftMobile ?
          <i className="fa fa-2x fa-chevron-left issues-list-stacked__support-list__scroll-icon u-cursor--pointer d-block d-sm-none d-print-none" aria-hidden="true" onClick={this.scrollLeft.bind(this, "mobile")} /> :
          <i className="fa fa-2x fa-chevron-left network-positions-stacked__support-list__scroll-icon--disabled d-block d-sm-none d-print-none" aria-hidden="true" />
        }
        <div className="issues-list-stacked__support-list__container-wrap">
          {/* Show a break-down of the current positions in your network */}
          <span ref={`${this.state.ballotItemWeVoteId}-issue-list-desktop`} className="issues-list-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs d-none d-sm-block">
            <ul className="issues-list-stacked__support-list__items">
              <li className="issues-list-stacked__support-list__item">
                {endorsementsLabel}
                { this.props.issuesListHidden ?
                  null :
                  <span>
                    {/* Issues the voter is already following */}
                    {issuesVoterIsFollowingHtml}
                    {/* Issues the voter is not following yet */}
                    {issuesVoterIsNotFollowingHtml}
                  </span>
                }
              </li>
            </ul>
          </span>
          <span ref={`${this.state.ballotItemWeVoteId}-issue-list-mobile`} className="issues-list-stacked__support-list__container u-flex u-justify-between u-items-center u-inset__v--xs d-block d-sm-none">
            <ul className="issues-list-stacked__support-list__items">
              <li className="issues-list-stacked__support-list__item">
                {endorsementsLabel}
                { this.props.issuesListHidden ?
                  null :
                  <span>
                    {/* Issues the voter is already following */}
                    {issuesVoterIsFollowingHtml}
                    {/* Issues the voter is not following yet */}
                    {issuesVoterIsNotFollowingHtml}
                  </span>
                }
              </li>
            </ul>
          </span>
        </div>
        {/* Click to scroll right through list Desktop */}
        {/*
        { this.state.canScrollDesktop && this.state.canScrollRightDesktop ?
          <i className="fa fa-2x fa-chevron-right issues-list-stacked__support-list__scroll-icon u-cursor--pointer d-none d-sm-block d-print-none" aria-hidden="true" onClick={this.scrollRight.bind(this, "desktop")} /> :
          <i className="fa fa-2x fa-chevron-right network-positions-stacked__support-list__scroll-icon--disabled d-none d-sm-block d-print-none" aria-hidden="true" />
        }
        */}
        {/* Click to scroll right through list Mobile */}
        {/*
        { this.state.canScrollMobile && this.state.canScrollRightMobile ?
          <i className="fa fa-2x fa-chevron-right issues-list-stacked__support-list__scroll-icon u-cursor--pointer d-block d-sm-none d-print-none" aria-hidden="true" onClick={this.scrollRight.bind(this, "mobile")} /> :
          <i className="fa fa-2x fa-chevron-right network-positions-stacked__support-list__scroll-icon--disabled d-block d-sm-none d-print-none" aria-hidden="true" />
        }
        */}
      </div>
    );
  }
}
