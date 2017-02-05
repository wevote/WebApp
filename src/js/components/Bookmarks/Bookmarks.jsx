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
    this.state = {};
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this._onChange.bind(this));
    this._onChange();
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
  }

  _onChange (){
    this.setState({bookmarks: BallotStore.bookmarks });
  }

  render () {
    const {bookmarks} = this.state;
    if (!bookmarks){
      return LoadingWheel;
    }
    var voter_address = VoterStore.getAddress();
    const election_name = BallotStore.currentBallotElectionName;
    const election_date = BallotStore.currentBallotElectionDate;
    const electionTooltip = election_date ? <Tooltip id="tooltip">Ballot for {election_date}</Tooltip> : <span />;

    return <div className="ballot">
      <div className="ballot__heading u-stack--lg">
        <OverlayTrigger placement="top" overlay={electionTooltip} >
          <h1 className="h1 ballot__election-name">{election_name}</h1>
        </OverlayTrigger>
        <p className="ballot__date_location">
          {voter_address}
          <span> (<Link to="/settings/location">Edit</Link>)</span>
        </p>
        <div className="ballot__filter"><BallotFilter ballot_type="BOOKMARKS" /></div>
      </div>
      {
        bookmarks.length === 0 && <p>No bookmarks yet</p>
      }
      <div className="bookmarks-list">
        {
          bookmarks.map(bookmark => {
            return <BookmarkItem key={bookmark.ballot_item_display_name} bookmark={bookmark}/>;
          })
        }
      </div>
    </div>;
  }
}
