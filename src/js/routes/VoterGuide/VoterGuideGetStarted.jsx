import React, { Component } from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterStore from "../../stores/VoterStore";

const delayBeforeApiSearchCall = 500;


export default class VoterGuideGetStarted extends Component {
  constructor (props) {
    super(props);
    this.state = {
      autoFocus: true,
      linkedOrganizationWeVoteId: "",
      searchResultsOrganizationName: "",
      twitterHandleEntered: "",
      twitterSearchStatus: "",
    };
    this.hitEnterKey = this.hitEnterKey.bind(this);
    this.onOrganizationStoreChange = this.onOrganizationStoreChange.bind(this);
    this.resetState = this.resetState.bind(this);
    this.saveAndGoToOrganizationInfo = this.saveAndGoToOrganizationInfo.bind(this);
    this.validateTwitterHandle = this.validateTwitterHandle.bind(this);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.election_id());
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.setState({
      autoFocus: true,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideGetStarted componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      this.setState({
        linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
      });
      let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization: organization,
        });
        this.leaveThisComponentIfProfileComplete(voter, organization);
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
    this.organizationStoreListener.remove();
    this.timer = null;
  }

  onOrganizationStoreChange () {
    let twitterHandleFound = OrganizationStore.getOrganizationSearchResultsTwitterHandle();

    let twitterSearchStatus = "";
    if (this.state.twitterHandleEntered.length) {
      if (twitterHandleFound.length) {
        twitterSearchStatus += "Voter guide found!";
      } else {
        twitterSearchStatus += "Voter guide not found.";
      }
    }
    let voter = VoterStore.getVoter();
    let organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    this.leaveThisComponentIfProfileComplete(voter, organization);

    this.setState({
      isLoading: false,
      isTwitterHandleValid: twitterHandleFound.length,
      organization: organization,
      searchResultsOrganizationName: OrganizationStore.getOrganizationSearchResultsOrganizationName(),
      searchResultsTwitterHandle: OrganizationStore.getOrganizationSearchResultsTwitterHandle(),
      searchResultsWebsite: OrganizationStore.getOrganizationSearchResultsWebsite(),
      twitterSearchStatus: twitterSearchStatus,
      twitterHandle: twitterHandleFound,
    });
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideGetStarted onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId: linkedOrganizationWeVoteId });
    }
  }

  resetState () {
    this.setState({
      autoFocus: true,
      isLoading: false,
      isTwitterHandleValid: false,
      twitterSearchStatus: "",
      twitterHandle: "",
    });
  }

  goToBallotLink () {
    let sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  goToOrganizationType () {
    historyPush("/voterguideorgtype");
  }

  saveAndGoToOrganizationInfo () {
    if (this.state.isLoading) {
      return false;
    } else {
      if (this.state.linkedOrganizationWeVoteId) {
        OrganizationActions.organizationGetStartedSave(this.state.linkedOrganizationWeVoteId, this.state.searchResultsOrganizationName, this.state.searchResultsWebsite);
      }
      historyPush("/voterguideorgtype");
      return true;
    }
  }

  hitEnterKey () {
    this.setState({
      autoFocus: false,
    });
  }

  leaveThisComponentIfProfileComplete (voter, organization) {
    if (voter && organization) {
      let validOrganizationNameExists = this.validOrganizationNameExists(voter, organization);
      if (voter && voter.is_signed_in) {
        // If voter is signed in, skip "/voterguideorgtype"
        historyPush("/voterguideorginfo");
      } else if (voter && voter.organization_type && voter.organization_type !== "I") {
        // If voter is NOT an INDIVIDUAL, skip "/voterguideorgtype"
        historyPush("/voterguideorginfo");
      } else if (validOrganizationNameExists) {
        // If they have already chosen a valid name, then don't ask for Twitter handle
        historyPush("/voterguideorginfo");
      }
    }
  }

  validOrganizationNameExists (voter, organization) {
    // We want to keep encouraging organizations to enter a Website
    if (voter && organization) {
      let voter_and_organization_name_matches = false;
      if (voter.first_name && organization.organization_name) {
        if (voter.first_name === organization.organization_name) {
          voter_and_organization_name_matches = true;
        }
      }
      // Everyone requires a valid organization name
      if (organization.organization_name && organization.organization_name.length > 3 && !organization.organization_name.startsWith("Voter-") && !voter_and_organization_name_matches) {
        return true;
      }
    }
    return false;
  }

  validateTwitterHandle (event) {
    clearTimeout(this.timer);
    if (event.target.value.length) {
      this.validateTwitterHandleAction(event.target.value);
      this.setState({
        isLoading: true,
        twitterHandleEntered: event.target.value,
        twitterSearchStatus: "Searching...",
      });
    } else {
      this.resetState();
    }
  }

  validateTwitterHandleAction (twitterHandle) {
    this.timer = setTimeout(() => {
      OrganizationActions.organizationSearch("", twitterHandle, true);
    }, delayBeforeApiSearchCall);
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter || !this.state.organization) {
      return null;
    }

    let actionButtonHtml;
    if (this.state.isLoading) {
      actionButtonHtml = <button type="button" className="btn btn-lg btn-success"
                    disabled >One Moment...</button>;
    } else if (this.state.isTwitterHandleValid) {
      actionButtonHtml = <button type="button" className="btn btn-lg btn-success"
                    onClick={this.saveAndGoToOrganizationInfo}>Use This Information&nbsp;&nbsp;&gt;</button>;
    } else {
      actionButtonHtml = <button type="button" className="btn btn-lg btn-success"
                    onClick={this.goToOrganizationType}>Skip Twitter&nbsp;&nbsp;&gt;</button>;
    }

    return <div>
      <Helmet title="Create Your Voter Guide - We Vote" />
        <div className="intro-story container well u-inset--md">
          <img src={cordovaDot("/img/global/icons/x-close.png")} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
          <div className="create-voter-guide__h1 xs-text-left">Create Your Voter Guide</div>
          <div className="create-voter-guide__steps xs-text-left">
            Step 1 of 5
          </div>
          <div className="create-voter-guide__description xs-text-left" />
          <div className="row">
            <div className="col-2">&nbsp;</div>
            <div className="col-8">
              <form onSubmit={(e) => {this.saveAndGoToOrganizationInfo(); e.preventDefault();}}>
                <div className="form-group">
                  { this.state.twitterSearchStatus.length ?
                    <p className={ !this.state.isLoading ?
                                     this.state.isTwitterHandleValid ?
                                     "voter-guide-get-started__status-success" :
                                     "voter-guide-get-started__status-error" :
                                   "u-stack--md" }>
                      {this.state.twitterSearchStatus}
                    </p> :
                    <p className="u-stack--md">See if your voter guide already exists.</p>
                  }
                  <input type="text"
                         className={this.state.twitterSearchStatus.length ?
                                     "form-control input-lg " :
                                     "form-control input-lg u-margin-top--sm" }
                         name="twitterHandle"
                         placeholder="Enter Twitter Handle"
                         onKeyDown={this.resetState}
                         onChange={this.validateTwitterHandle}
                         autoFocus={this.state.autoFocus} />
                </div>
              </form>
            </div>
            <div className="col-2">&nbsp;</div>
          </div>
          <div className="row">
            <div className="col-xs-2 col-md-4">&nbsp;</div>
            <div className="col-xs-8 col-md-4">
              <div>
                <div className="u-margin-top--lg u-f2">{this.state.searchResultsOrganizationName}</div>
                {this.state.searchResultsTwitterHandle ? <div className="u-f2">@{this.state.searchResultsTwitterHandle}</div> : null }
                {this.state.searchResultsWebsite ? <div className="u-f2">{this.state.searchResultsWebsite}</div> : null }
              </div>
            </div>
            <div className="col-xs-2 col-md-4">&nbsp;</div>
          </div>
          <footer className="create-voter-guide__footer">
            {actionButtonHtml}
          </footer>
        </div>
      </div>;
  }
}
