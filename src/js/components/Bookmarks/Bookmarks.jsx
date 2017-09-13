import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BallotFilter from "../Navigation/BallotFilter";
import BookmarkItem from "./BookmarkItem";
import EditAddress from "../../components/Widgets/EditAddress";
import Helmet from "react-helmet";
import LoadingWheel from "../LoadingWheel";
import SelectAddressModal from "../../components/Ballot/SelectAddressModal";
import VoterStore from "../../stores/VoterStore";

export default class Bookmarks extends Component {
  static propTypes = {
  };

  constructor (props){
    super(props);
    this.state = {
      bookmarks: [],
      showSelectAddressModal: false,
    };

    this._toggleSelectAddressModal = this._toggleSelectAddressModal.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
    this._onBallotStoreChange();
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  _onBallotStoreChange () {
    this.setState({bookmarks: BallotStore.bookmarks });
  }

  _toggleSelectAddressModal () {
    // Clear out any # from anchors in the URL
    if (!this.state.showSelectAddressModal)
      browserHistory.push("/bookmarks");

    this.setState({
      showSelectAddressModal: !this.state.showSelectAddressModal
    });
  }

  render () {
    if (!this.state.bookmarks) {
      return LoadingWheel;
    }
    const election_name = BallotStore.currentBallotElectionName;
    const election_date = BallotStore.currentBallotElectionDate;
    const electionTooltip = election_date ? <Tooltip id="tooltip">Ballot for {election_date}</Tooltip> : <span />;
    let voter_address_object = VoterStore.getAddressObject();

    return <div className="ballot">
      { this.state.showSelectAddressModal ? <SelectAddressModal show={this.state.showSelectAddressModal}
                                                                toggleFunction={this._toggleSelectAddressModal} /> : null }
      <div className="ballot__heading">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <Helmet title="Bookmarks- We Vote" />
                <OverlayTrigger placement="top" overlay={electionTooltip} >
                  <header className="ballot__header-group">
                    <h1 className="h1 ballot__election-name ballot__header-title">
                      <span className="u-push--sm">{election_name}</span>
                    </h1>
                    <span className="hidden-xs hidden-print pull-right ballot__header-address">
                      <EditAddress address={voter_address_object} _toggleSelectAddressModal={this._toggleSelectAddressModal} />
                    </span>
                  </header>
                </OverlayTrigger>
                <div className="visible-xs-block hidden-print ballot__header-address-xs">
                  <EditAddress address={voter_address_object} _toggleSelectAddressModal={this._toggleSelectAddressModal} />
                </div>
                <div className="ballot__filter-container">
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
      {
        this.state.bookmarks.length === 0 && <p>No bookmarks yet</p>
      }
      <div className="bookmarks-list">
        {
          this.state.bookmarks.map(bookmark => {
            return <BookmarkItem key={bookmark.ballot_item_display_name} bookmark={bookmark}/>;
          })
        }
      </div>
    </div>;
  }
}
