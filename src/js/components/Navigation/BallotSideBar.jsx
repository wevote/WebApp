import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

// NPSInput.js looks like an abandoned project, no updates in two years, and it caused grief with React 16
// also looked like it was disabled in this code.  Commented out October 1, 2018
// import NPSInput from "react-nps-input";
// import Textarea from "react-textarea-autosize";
import BallotStore from "../../stores/BallotStore";
import BallotSideBarLink from "./BallotSideBarLink";
import { renderLog } from "../../utils/logging";
import { arrayContains } from "../../utils/textFormat";

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-restricted-syntax: 1 */

export default class BallotSideBar extends Component {
  static propTypes = {
    ballot: PropTypes.array, // Check to see if any calls to this component pass in "ballot"
    ballotWithAllItemsByFilterType: PropTypes.array,
    ballotItemLinkHasBeenClicked: PropTypes.func,
    displayTitle: PropTypes.bool,
    displaySubtitles: PropTypes.bool,
    onClick: PropTypes.func,
    pathname: PropTypes.string,
    rawUrlVariablesString: PropTypes.string,
  };

  static defaultProps = {
    pathname: "/ballot",
  };

  constructor (props) {
    super(props);
    this.state = {
      componentDidMountFinished: false,
      feedbackScore: undefined,
      feedbackText: "",
      formSubmitted: false,

      // showNPSInput: false,
    };
    this.handleClick = this.handleClick.bind(this);

    // this.onNPSDismissed = this.onNPSDismissed.bind(this);
    // this.onNPSSubmit = this.onNPSSubmit.bind(this);
    // this.showNPSInput = this.showNPSInput.bind(this);
  }

  componentDidMount () {
    const unsorted = BallotStore.ballot;
    this.setState({
      ballot: this._sortBallots(unsorted),
      componentDidMountFinished: true,
    });
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.ballot === undefined && nextState.ballot !== undefined) {
      // console.log("shouldComponentUpdate: new ballot found");
      return true;
    }
    if (this.state.ballot !== undefined && this.state.ballot.length !== nextState.ballot.length) {
      // console.log("shouldComponentUpdate: changed this.props.ballot.length", this.state.ballot.length, ", nextState.ballot.length", nextState.ballot.length);
      return true;
    }
    if (this.props.ballotWithAllItemsByFilterType.length !== nextProps.ballotWithAllItemsByFilterType.length) {
      // console.log("shouldComponentUpdate: changed this.props.ballotWithAllItemsByFilterType.length", this.props.ballotWithAllItemsByFilterType.length, ", nextState.ballotWithAllItemsByFilterType.length", nextProps.ballotWithAllItemsByFilterType.length);
      return true;
    }
    if (this.props.displayTitle !== nextProps.displayTitle) {
      // console.log("shouldComponentUpdate: changed this.props.displayTitle", this.props.displayTitle, ", nextState.displayTitle", nextProps.displayTitle);
      return true;
    }
    if (this.props.pathname !== nextProps.pathname) {
      // console.log("shouldComponentUpdate: changed this.props.pathname", this.props.pathname, ", nextState.pathname", nextProps.pathname);
      return true;
    }
    return false;
  }

  onBallotStoreChange () {
    const unsorted = BallotStore.ballot;
    this.setState({
      ballot: this._sortBallots(unsorted),
    });
  }

  _sortBallots (unsorted) {
    if (unsorted) {
      // temporary array holds objects with position and sort-value
      const mapped = unsorted.map((item, i) => ({ index: i, value: item }));

      // sorting the mapped array based on local_ballot_order which came from the server
      mapped.sort((a, b) => +(
        parseInt(a.value.local_ballot_order, 10) >
            parseInt(b.value.local_ballot_order, 10)
      ) ||
          +(
            parseInt(a.value.local_ballot_order, 10) ===
            parseInt(b.value.local_ballot_order, 10)
          ) - 1);

      const orderedArray = [];
      for (const element of mapped) {
        orderedArray.push(element.value);
      }

      return orderedArray;
    } else {
      return {};
    }
  }

  handleClick () {
    // Fullscreen mode won't pass an onClick function, since the BallotSideBar does not go away after a click
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  renderUrl (ballotItemWeVoteId, ballotWithAllItemIdsByFilterType) {
    const { rawUrlVariablesString } = this.props;
    if (rawUrlVariablesString && ballotWithAllItemIdsByFilterType && ballotWithAllItemIdsByFilterType.length > 0) {
      if (arrayContains(ballotItemWeVoteId, ballotWithAllItemIdsByFilterType)) {
        return `${this.props.pathname}${rawUrlVariablesString}#${ballotItemWeVoteId}`;
      }
    }

    return `${this.props.pathname}#${ballotItemWeVoteId}`;
  }

  // showNPSInput () {
  //   this.setState({
  //     showNPSInput: true,
  //   });
  // }
  //
  // onNPSDismissed () {
  //   clearTimeout(this.formCloseTimer);
  //   this.setState({
  //     showNPSInput: false,
  //     formSubmitted: false,
  //   });
  // }

  updateFeedbackText (e) {
    this.setState({
      feedbackText: e.target.value,
    });
  }

  // onNPSSubmit ({ score }) {
  //   this.setState({
  //     feedbackScore: score,
  //   });
  //   this.feedbackTextArea.focus();
  // }

  onFormSubmit () {
    // TODO send feedback entered to database
    this.setState({
      formSubmitted: true,
    });
    this.formCloseTimer = setTimeout(this.onNPSDismissed, 3000);
  }

  filteredBallotToRender (ballot, ballotWithAllItemIdsByFilterType, type, key) {
    const filteredBallot = ballot.filter((item) => {
      if (item.kind_of_ballot_item === "MEASURE") {
        return type === "Measure";
      } else {
        return type === item.race_office_level;
      }
    });

    if (!filteredBallot.length) {
      return null;
    }

    const filteredBallotListItems = filteredBallot.map((item, itemKey) => {
      if (
        item.kind_of_ballot_item === "OFFICE" ||
        item.kind_of_ballot_item === "MEASURE"
      ) {
        return (
          <li className="BallotItem__summary__list-item" key={itemKey}>
            <BallotSideBarLink
              url={this.renderUrl(item.we_vote_id, ballotWithAllItemIdsByFilterType)}
              ballotItemLinkHasBeenClicked={this.props.ballotItemLinkHasBeenClicked}
              label={item.ballot_item_display_name}
              subtitle={item.measure_subtitle}
              displaySubtitles={this.props.displaySubtitles}
              onClick={this.handleClick}
            />
          </li>
        );
      } else {
        return <span />;
      }
    });

    return (
      <div className="BallotItem__summary__group" key={key}>
        <div className="BallotItem__summary__group-title">
          {type === "Measure" ? "Ballot Measures" : type}
        </div>
        <ul className="BallotItem__summary__list">
          {filteredBallotListItems}
        </ul>
      </div>
    );
  }

  render () {
    // console.log("BallotSideBar render");
    renderLog(__filename);

    // let turnedOnNPSInput = false;
    const BALLOT_ITEM_FILTER_TYPES = ["Federal", "State", "Measure", "Local"];

    const ballot = this.state.ballot;
    const { ballotWithAllItemsByFilterType } = this.props;
    if (ballot && ballot.length) {
      const ballotWithAllItemIdsByFilterType = [];
      ballotWithAllItemsByFilterType.forEach((itemByFilterType) => {
        ballotWithAllItemIdsByFilterType.push(itemByFilterType.we_vote_id);
      });

      return (
        <div className="container-fluid card">
          { this.props.displayTitle ? (
            <div className="BallotItem__summary__title">
              Summary of Ballot Items
            </div>
          ) :
            null
          }
          { BALLOT_ITEM_FILTER_TYPES.map((type, key) => this.filteredBallotToRender(ballot, ballotWithAllItemIdsByFilterType, type, key))}
          <h4 className="text-left" />
          <span className="terms-and-privacy">
            <br />
            <Link to="/more/terms">
              Terms of Service
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/more/privacy">
              Privacy Policy
            </Link>
            {/* { turnedOnNPSInput ? */}
            {/* <span> */}
            {/* &nbsp;&nbsp;&nbsp; */}
            {/* <a onClick={this.showNPSInput}> */}
            {/* Send Feedback */}
            {/* </a> */}
            {/* </span> : */}
            {/* null */}
            {/* } */}
          </span>
          {/* { turnedOnNPSInput && this.state.showNPSInput ? */}
          {/* <NPSInput onSubmit={this.onNPSSubmit} */}
          {/* onDismissed={this.onNPSDismissed}> */}
          {/* {({ score }) => { */}
          {/* if (this.state.formSubmitted) { */}
          {/* return <p>Thank you! Your feedback has been submitted.</p>; */}
          {/* } else { */}
          {/* return <form onSubmit={this.onFormSubmit.bind(this)}> */}
          {/* <p>Thank you for your rating! You just gave us a{score === 8 ? "n" : null} {score}.</p> */}
          {/* <p>Any additional comments you would like to provide? (optional)</p> */}
          {/* <Textarea onChange={this.updateFeedbackText.bind(this)} */}
          {/* name="feedback_text" */}
          {/* className="u-stack--sm form-control" */}
          {/* minRows={3} */}
          {/* placeholder={"Enter your comments here."} */}
          {/* defaultValue={""} */}
          {/* inputRef={tag => {this.feedbackTextArea = tag;}} /> */}
          {/* <button className="position-statement__post-button btn btn-default btn-sm" type="submit">Submit</button> */}
          {/* </form>; */}
          {/* } */}
          {/* }} */}
          {/* </NPSInput> : */}
          {/* null */}
          {/* } */}
        </div>
      );
    } else {
      return <div />;
    }
  }
}
