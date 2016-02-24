import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar, DropdownButton, Input, MenuItem, Navbar } from "react-bootstrap";
import { Link } from "react-router";

import BallotStore from "../../stores/BallotStore";
import CandidateDetail from "../../components/Ballot/CandidateDetail";
import PositionList from "../../components/Ballot/PositionList";
import ItemActionbar from "../../components/ItemActionbar";
import ItemActionBar2 from "../../components/ItemActionBar2";
import StarAction from "../../components/StarAction";

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { candidate: {} };
  }

  componentWillUnmount() {
    BallotStore.removeChangeListener(this.changeListener);
  }

  componentDidMount(){
    this.changeListener = this._onChange.bind(this);
    BallotStore.initialize(function(){console.log("Initialized ballot in background")});
    BallotStore.addChangeListener(this.changeListener);
    var candidate = BallotStore.getOrFetchCandidateByWeVoteId(this.props.params.we_vote_id);
    if (candidate) {
      this.setState({ candidate: candidate });
    }
  }

  _onChange(){
    this.setState({ candidate: BallotStore.getCandidateByWeVoteId(this.props.params.we_vote_id) });
  }

  render() {
    var candidate = this.state.candidate;
    var we_vote_id = this.props.params.we_vote_id;
    if (!candidate || !candidate.we_vote_id){
      return ( <div></div> );
    };

    return (
    <section className="candidate well well-90 gutter-top--small">
      <div className="candidate-detail-route list-group-item">
        {/*
        <header className="row">
          <div className="col-xs-6 col-md-6 text-center">
            <Link to="/ballot">
              &lt; Back to My Ballot
            </Link>
          </div>
          <div className="col-xs-6 col-md-6 text-center">
            <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
            </i>
            <Link
              to="/ballot/opinions"
              className="font-darkest fluff-left-narrow">
                More Opinions
            </Link>
          </div>
        </header>
        */}
        {candidate.hasOwnProperty("is_starred") ?
          <StarAction
          we_vote_id={candidate.we_vote_id}
          is_starred={candidate.is_starred} />
        :
        <div></div>}

        <div className="row" style={{ paddingBottom: "10px" }}>
          <div
            className="col-xs-6"
            style={candidate.candidate_photo_url ? {} : {height:"95px"}}>

            {
              candidate.candidate_photo_url ?
                <img
                  className="img-circle"
                  style={{display:"block", paddingTop: "10px", width:"100px"}}
                  src={candidate.candidate_photo_url}
                  alt="candidate-photo"/> :
              <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
            }
          </div>
          <div className="col-xs-6">
            <h4 className="bufferNone">
                { candidate.ballot_item_display_name }
            </h4>
            <p>Running for <span className="running-for-office-emphasis">{ candidate.office_display_name }</span></p>
          </div>
        </div>
        <ItemActionBar2 we_vote_id={candidate.we_vote_id}
                       is_support={candidate.is_support} is_oppose={candidate.is_oppose}
                        supportCount={candidate.supportCount} opposeCount={candidate.opposeCount} />
        <div className="container-fluid well-90">
          {/* Post privately box */}
          {/*
          <ul className="list-group">
              <li className="list-group-item">
                  <div>
                      <input type="text" name="address" className="form-control" defaultValue="What do you think?" />
                      <Link to="ballot_candidate" params={{id: 2}}><Button bsSize="small">Post Privately</Button></Link>
                  </div>
              </li>
          </ul>
          */}
          {
            <PositionList we_vote_id={we_vote_id} candidate_display_name={candidate.ballot_item_display_name}/>
          }
        </div>

      </div>
    </section>
    );

  }
}
