import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import NPSInput from "react-nps-input";
import Textarea from "react-textarea-autosize";
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
    pathname: PropTypes.string,
    rawUrlVariablesString: PropTypes.string,
  };

  static defaultProps = {
    pathname: "/ballot",
  };

  constructor (props) {
    super(props);
    this.state = {
      feedbackScore: undefined,
      feedbackText: "",
      formSubmitted: false,
      showNPSInput: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.onNPSDismissed = this.onNPSDismissed.bind(this);
    this.onNPSSubmit = this.onNPSSubmit.bind(this);
    this.showNPSInput = this.showNPSInput.bind(this);
  }

  componentDidMount () {
    this.onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  onBallotStoreChange () {
    let unsorted = BallotStore.ballot;
    this.setState({
      ballot: this._sortBallots(unsorted),
    });
  }

  _sortBallots (unsorted) {
    if (unsorted) {
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
    let { rawUrlVariablesString } = this.props;
    if (rawUrlVariablesString && ballotWithAllItemIdsByFilterType && ballotWithAllItemIdsByFilterType.length > 0) {
      if (arrayContains(ballotItemWeVoteId, ballotWithAllItemIdsByFilterType)) {
         return `${this.props.pathname}${rawUrlVariablesString}#${ballotItemWeVoteId}`;
       }
    }
    return `${this.props.pathname}#${ballotItemWeVoteId}`;
  }

  showNPSInput () {
    this.setState({
      showNPSInput: true,
    });
  }

  onNPSDismissed () {
    clearTimeout(this.formCloseTimer);
    this.setState({
      showNPSInput: false,
      formSubmitted: false,
    });
  }

  updateFeedbackText (e) {
    this.setState({
      feedbackText: e.target.value,
    });
  }

  onNPSSubmit ({ score }) {
    this.setState({
      feedbackScore: score,
    });
    this.feedbackTextArea.focus();
  }

  onFormSubmit () {
    // TODO send feedback entered to database
    this.setState({
      formSubmitted: true,
    });
    this.formCloseTimer = setTimeout(this.onNPSDismissed, 3000);
  }

  render () {
    renderLog(__filename);
    let click = this.handleClick;
    let ballot = this.state.ballot;
    let { ballotWithAllItemsByFilterType, displaySubtitles } = this.props;
    if (ballot && ballot.length) {
      let ballotWithAllItemIdsByFilterType = [];
      ballotWithAllItemsByFilterType.forEach(itemByFilterType => {
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
                                     onClick={click} />
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
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/more/privacy">
              Privacy Policy
            </Link>
            &nbsp;&nbsp;&nbsp;
            <a onClick={this.showNPSInput}>
              Send Feedback
            </a>
          </span>
          { this.state.showNPSInput ?
            <NPSInput onSubmit={this.onNPSSubmit}
                      onDismissed={this.onNPSDismissed}>
              {({ score }) => {
                if (this.state.formSubmitted) {
                  return <p>Thank you! Your feedback has been submitted.</p>;
                } else {
                  return <form onSubmit={this.onFormSubmit.bind(this)}>
                    <p>Thank you for your rating! You just gave us a {score}.</p>
                    <p>Any additional comments you would like to provide? (optional)</p>
                    <Textarea onChange={this.updateFeedbackText.bind(this)}
                      name="feedback_text"
                      className="u-stack--sm form-control"
                      minRows={3}
                      placeholder={"Enter your comments here."}
                      defaultValue={""}
                      inputRef={tag => {this.feedbackTextArea = tag;}} />
                    <button className="position-statement__post-button btn btn-default btn-sm" type="submit">Submit</button>
                  </form>;
                }
              }}
            </NPSInput> :
            null
          }
        </div>
      );
    } else {
      return <div />;
    }
  }
}
