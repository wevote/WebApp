import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BallotFilter from "../Navigation/BallotFilter";
import BookmarkItem from "./BookmarkItem";
import EditAddress from "../../components/Widgets/EditAddress";
import Helmet from "react-helmet";
import LoadingWheel from "../LoadingWheel";
import moment from "moment";
import SelectAddressModal from "../../components/Ballot/SelectAddressModal";
import VoterStore from "../../stores/VoterStore";

export default class Bookmarks extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      bookmarks: [],
      showSelectAddressModal: false,
    };

    this.toggleSelectAddressModal = this.toggleSelectAddressModal.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.onBallotStoreChange();
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setState({ bookmarks: BallotStore.bookmarks });
  }

  toggleSelectAddressModal () {
    // Clear out any # from anchors in the URL
    if (!this.state.showSelectAddressModal)
      browserHistory.push("/bookmarks");

    this.setState({ showSelectAddressModal: !this.state.showSelectAddressModal });
  }

  render () {
    if (!this.state.bookmarks) {
      return LoadingWheel;
    }
    const election_name = BallotStore.currentBallotElectionName;
    const election_day_text = BallotStore.currentBallotElectionDate;
    const electionTooltip = election_day_text ? <Tooltip id="tooltip">Election day {moment(election_day_text).format("MMM Do, YYYY")}</Tooltip> : <span />;
    let voter_address_object = VoterStore.getAddressObject();

    return <div className="ballot">
      { this.state.showSelectAddressModal ? <SelectAddressModal show={this.state.showSelectAddressModal}
                                                                toggleFunction={this.toggleSelectAddressModal} /> : null }
      <div className="ballot__heading">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <Helmet title="Bookmarks- We Vote" />
                <OverlayTrigger placement="top" overlay={electionTooltip} >
                  <header className="ballot__header__group">
                    <h1 className="h1 ballot__election-name ballot__header__title">
                      <span className="u-push--sm">{election_name}</span>
                    </h1>
                    <span className="hidden-xs hidden-print pull-right ballot__header__address">
                      <EditAddress address={voter_address_object} toggleSelectAddressModal={this.toggleSelectAddressModal} />
                    </span>
                  </header>
                </OverlayTrigger>
                <div className="visible-xs-block hidden-print ballot__header__address--xs">
                  <EditAddress address={voter_address_object} toggleSelectAddressModal={this.toggleSelectAddressModal} />
                </div>
                <div className="ballot__filter__container">
                  <div className="ballot__filter hidden-print">
                    <BallotFilter ballot_type="BOOKMARKS"
                                  length={BallotStore.ballotLength}
                                  length_remaining={BallotStore.ballot_remaining_choices_length} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content-container">
        <div className="container-fluid">
          <div className="container-main">
            { !this.state.bookmarks.length && <p>No bookmarks yet</p> }
            <div className="bookmarks-list">
              { this.state.bookmarks.map((bookmark) => <BookmarkItem key={bookmark.ballot_item_display_name} bookmark={bookmark}/>) }
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
