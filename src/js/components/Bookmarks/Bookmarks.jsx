import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BallotFilter from "../Navigation/BallotFilter";
import BookmarkItem from "./BookmarkItem";
import LoadingWheel from "../LoadingWheel";
import VoterStore from "../../stores/VoterStore";

export default class Bookmarks extends Component {
  static propTypes = {
  };

  constructor (props){
    super(props);
    this.state = { bookmarks: [] };
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

  render () {
    if (!this.state.bookmarks){
      return LoadingWheel;
    }
    var text_for_map_search = VoterStore.getTextForMapSearch();
    const election_name = BallotStore.currentBallotElectionName;
    const election_date = BallotStore.currentBallotElectionDate;
    const electionTooltip = election_date ? <Tooltip id="tooltip">Ballot for {election_date}</Tooltip> : <span />;

    return <div className="ballot">
      <div className="ballot__heading">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
            <div className="col-md-12">
              <OverlayTrigger placement="top" overlay={electionTooltip} >
                <header className="ballot__header-group">
                <h1 className="h1 ballot__election-name">{election_name}</h1>
                </header>
              </OverlayTrigger>
              <p className="ballot__date_location">
                {text_for_map_search}
                <span> (<Link to="/settings/location">Edit</Link>)</span>
              </p>
            </div>
            </div>
          <div className="ballot__filter-container">
            <div className="ballot__filter hidden-print">
              <BallotFilter ballot_type="BOOKMARKS"
                length={BallotStore.ballotLength}
                length_remaining={BallotStore.ballot_remaining_choices_length} />
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
      </div>
      </div>
    </div>;
  }
}
