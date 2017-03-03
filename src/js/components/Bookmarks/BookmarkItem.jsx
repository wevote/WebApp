import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import BookmarkAction from "../Widgets/BookmarkAction";
import SupportStore from "../../stores/SupportStore";

export default class Bookmarks extends Component {
  static propTypes = {
    bookmark: PropTypes.object.isRequired,
  };
  constructor (props) {
    super(props);
    this.state = {transitioning: false};
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this._onChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.bookmark.we_vote_id) });
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  _onChange () {
    this.setState({ supportProps: SupportStore.get(this.props.bookmark.we_vote_id), transitioning: false });
  }
  render () {
    const {kind_of_ballot_item, we_vote_id, ballot_item_display_name } = this.props.bookmark;
    const { supportProps, transitioning } = this.state;
    let support_count = 0;
    if (supportProps && supportProps.support_count) {
      // Only show ItemSupportOpposeCounts if your network has something to say
      support_count = supportProps.support_count;
    }
    let oppose_count = 0;
    if (supportProps && supportProps.oppose_count) {
      // Only show ItemSupportOpposeCounts if your network has something to say
      oppose_count = supportProps.oppose_count;
    }
    // Where should the link on the bookmark item take the voter?
    let bookmark_link;
    if (kind_of_ballot_item === "CANDIDATE"){
      bookmark_link = "/candidate/" + we_vote_id;
    } else if (kind_of_ballot_item === "OFFICE"){
      bookmark_link = "/office/" + we_vote_id;
    } else {
      bookmark_link = "/measure/" + we_vote_id;
    }
    let goToLink = function () { browserHistory.push(bookmark_link); };
    let what_your_network_thinks;
    if (kind_of_ballot_item === "CANDIDATE" || kind_of_ballot_item === "MEASURE") {
      if (support_count || oppose_count) {
        what_your_network_thinks = <span className={"u-cursor--pointer"}
                                         onClick={goToLink} >
              <ItemSupportOpposeCounts we_vote_id={we_vote_id} supportProps={supportProps} transitioning={transitioning}
                                       type={kind_of_ballot_item}/>
            </span>;
      }
    }

    return <div className="bookmark-item card">
      <div className="card-main">
        <div className="card-main__content">
          <BookmarkAction we_vote_id={we_vote_id} type={kind_of_ballot_item}/>
          <div className="card-main__display-name">
            <Link to={bookmark_link} onlyActiveOnIndex={false}>
              {ballot_item_display_name}
            </Link>
          </div>
          {what_your_network_thinks}
        </div>
      </div>
    </div>;
  }
}
