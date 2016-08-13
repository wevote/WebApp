import React, { Component } from "react";
import BallotStore from "../../stores/BallotStore";
import BallotTitleDropdown from "../Navigation/BallotTitleDropdown";
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
    this.listener = BallotStore.addListener(this._onChange.bind(this));
    this._onChange();
  }

  componentWillUnmount (){
    this.listener.remove();
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
      <div className="bs-text-center"><BallotTitleDropdown ballot_type="BOOKMARKS" /></div>
      {
        bookmarks.length === 0 && <p>No bookmarks yet</p>
      }
      <ul>
      {
        bookmarks.map(bookmark => {
          return <BookmarkItem key={bookmark.ballot_item_display_name} bookmark={bookmark}/>;
        })
      }
      </ul>
      </div>;
  }
}
