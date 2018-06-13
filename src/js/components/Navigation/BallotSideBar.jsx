import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BallotSideBarLink from "./BallotSideBarLink";
import { renderLog } from "../../utils/logging";
import { arrayContains } from "../../utils/textFormat";

export default class BallotSideBar extends Component {
  static propTypes = {
    ballotWithAllItemsByFilterType: PropTypes.array,
    ballotItemLinkHasBeenClicked: PropTypes.func,
    displayTitle: PropTypes.bool,
    displaySubtitles: PropTypes.bool,
    onClick: PropTypes.func,
    rawUrlVariablesString: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(
      this.onBallotStoreChange.bind(this)
    );
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    let unsorted = BallotStore.ballot;
    this.setState({ ballot: this._sortBallots(unsorted) });
  }

  _sortBallots (unsorted) {
    // temporary array holds objects with position and sort-value
    let mapped = unsorted.map((item, i) => {
      return { index: i, value: item };
    });

    // sorting the mapped array based on local_ballot_order which came from the server
    mapped.sort((a, b) => {
      return (
        +(
          parseInt(a.value.local_ballot_order, 10) >
          parseInt(b.value.local_ballot_order, 10)
        ) ||
        +(
          parseInt(a.value.local_ballot_order, 10) ===
          parseInt(b.value.local_ballot_order, 10)
        ) - 1
      );
    });

    let orderedArray = [];
    for (let element of mapped) {
      orderedArray.push(element.value);
    }

    return orderedArray;
  }

  handleClick () {
    // Fullscreen mode won't pass an onClick function, since the BallotSideBar does not go away after a click
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  renderUrl (ballotItemWeVoteId, ballotWithAllItemIdsByFilterType) {
    let { rawUrlVariablesString } = this.props;
    if (rawUrlVariablesString && ballotWithAllItemIdsByFilterType && ballotWithAllItemIdsByFilterType.length > 0) {
      if (arrayContains(ballotItemWeVoteId, ballotWithAllItemIdsByFilterType)) {
         return `/ballot${rawUrlVariablesString}#${ballotItemWeVoteId}`;
       }
    }
    return `/ballot#${ballotItemWeVoteId}`;
  }
  render () {
    renderLog(__filename);
    let click = this.handleClick;
    let ballot = this.state.ballot;
    let { ballotWithAllItemsByFilterType, displaySubtitles } = this.props;
    if (ballot && ballot.length) {
      let ballotWithAllItemIdsByFilterType = [];
      ballotWithAllItemsByFilterType.forEach((itemByFilterType)=>{
          ballotWithAllItemIdsByFilterType.push(itemByFilterType.we_vote_id);
      });
      return (
        <div className="container-fluid card">
          {this.props.displayTitle ?
            <div className="BallotItem__summary__title">
              Summary of Ballot Items
            </div> : null}
          {ballot.map((item, key) => {
            if (
              item.kind_of_ballot_item === "OFFICE" ||
              item.kind_of_ballot_item === "MEASURE"
            ) {
              return (
                <div key={key}>
                  <BallotSideBarLink url={this.renderUrl(item.we_vote_id, ballotWithAllItemIdsByFilterType)}
                                     ballotItemLinkHasBeenClicked={this.props.ballotItemLinkHasBeenClicked}
                                     label={item.ballot_item_display_name}
                                     subtitle={item.measure_subtitle}
                                     displaySubtitles={displaySubtitles}
                                     onClick={click}
                  />
                </div>
              );
            } else {
              return <span />;
            }
          })}
          <h4 className="text-left" />
          <span className="terms-and-privacy">
            <br />
            <Link to="/more/terms">
              Terms of Service
            </Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">
              Privacy Policy
            </Link>
          </span>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
