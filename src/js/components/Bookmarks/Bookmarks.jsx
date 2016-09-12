import React, { Component } from "react";
import BallotStore from "../../stores/BallotStore";
import BallotFilter from "../Navigation/BallotFilter";
import BookmarkItem from "./BookmarkItem";
import LoadingWheel from "../LoadingWheel";

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
    return <div>
      <BallotFilter ballot_type="BOOKMARKS" />
      {
        bookmarks.length === 0 && <p>No bookmarks yet</p>
      }
      <div>
      {
        bookmarks.map(bookmark => {
          return <BookmarkItem key={bookmark.ballot_item_display_name} bookmark={bookmark}/>;
        })
      }
      </div>
      </div>;
  }
}
