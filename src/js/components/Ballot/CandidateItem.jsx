import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import StarAction from "../../components/StarAction";
import ItemActionbar from "../../components/ItemActionbar";

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    candidate_photo_url: PropTypes.string,
    id: PropTypes.number,
    opposeCount: PropTypes.number,
    order_on_ballot: PropTypes.string,
    supportCount: PropTypes.number,
    we_vote_id: PropTypes.string,
    is_starred: PropTypes.bool,
    is_support: PropTypes.bool,
    is_oppose: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.state = {
      opposeCount: this.props.opposeCount,
      supportCount: this.props.supportCount
    };
  }

  componentDidMount () {
    this.changeListener = this._onChange.bind(this);
    BallotStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount () {
    BallotStore.removeChangeListener(this.changeListener);
  }

  _onChange () {
    this.setState({
      opposeCount: BallotStore.getOpposeCount(this.props.we_vote_id),
      supportCount: BallotStore.getSupportCount(this.props.we_vote_id)
    });
  }

  render () {
    let {
      we_vote_id,
      ballot_item_display_name,
      candidate_photo_url,
      is_support,
      is_oppose
    } = this.props;

    var oppose_emphasis = "oppose-emphasis-small";
    if (this.state.opposeCount >= 2) {
      oppose_emphasis = "oppose-emphasis-medium";
    }

    var support_emphasis = "support-emphasis-small";
    if (this.state.supportCount === 1) {
      support_emphasis = "support-emphasis-medium";
    } else if (this.state.supportCount > 1) {
      if (this.state.supportCount - this.state.opposeCount > 0) {
        support_emphasis = "support-emphasis-large";
      } else {
        // if there isn"t more support than opposition, then tone down the emphasis to medium
        support_emphasis = "support-emphasis-medium";
      }
    }

    return <section className="candidate list-group-item">
        <StarAction
          we_vote_id={we_vote_id}
          is_starred={this.props.is_starred || false } />

        <Link className="linkLight"
              to={"/candidate/" + we_vote_id }
              onlyActiveOnIndex={false}>
          {/* Note: We want a click anywhere in this div to take you to the candidate page */}
          <div className="row" style={{ paddingBottom: "10px" }}>
            <div
              className="col-xs-6"
              style={candidate_photo_url ? {} : {height: "95px"}}>

              {/* adding inline style to img until Rob can style... */}
              {
                candidate_photo_url ?

                  <img
                    className="img-circle"
                    style={{display: "block", paddingTop: "10px", width: "100px"}}
                    src={candidate_photo_url}
                    alt="candidate-photo"/> :

                <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>

              }

            </div>
            <div className="col-xs-6">
              <h4 className="bufferNone">
                { ballot_item_display_name } <span className="link-text-to-more-info">(more)</span>
              </h4>
              <span className="link-text-to-opinions">Summary of opinions you follow: </span>
              <ul className="list-style--none">
                <li className="list-inline support">
                  <span className={ support_emphasis }>
                    <span>{ this.state.supportCount }</span>&nbsp;
                    <span>positive</span>
                  </span>,
                </li>
                <li className="list-inline oppose">
                  <span className={ oppose_emphasis }>
                    <span>{ this.state.opposeCount }</span>&nbsp;
                    <span>negative</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          </Link>
        <ItemActionbar we_vote_id={we_vote_id} action={BallotActions} is_support={is_support} is_oppose={is_oppose} />
      </section>;
  }
}
