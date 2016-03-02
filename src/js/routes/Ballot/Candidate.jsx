import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar, DropdownButton, Input, MenuItem, Navbar } from "react-bootstrap";
import { Link } from "react-router";

import CandidateStore from "../../stores/CandidateStore";
import PositionStore from "../../stores/PositionStore";
import OfficeStore from "../../stores/OfficeStore";

import CandidateActions from "../../actions/CandidateActions";
import PositionActions from "../../actions/PositionActions";
import OfficeActions from "../../actions/OfficeActions";

import PositionList from "../../components/Ballot/PositionList";
import ItemActionBar2 from "../../components/ItemActionBar2";
import StarAction from "../../components/StarAction";

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state ={candidate: {}, office: {} };
  }

  componentWillUnmount() {
    this.candidateToken.remove();
    this.officeToken.remove();
  }

  componentDidMount(){
    this.candidateToken = CandidateStore.addListener(this._onChange.bind(this));
    this.officeToken = OfficeStore.addListener(this._onChange.bind(this));

    CandidateActions.retrieve(this.props.params.we_vote_id);
  }

  _onChange(){
    var we_vote_id = this.props.params.we_vote_id;
    var candidate = CandidateStore.get(we_vote_id) || {};

    this.setState({ candidate: candidate });

    if (candidate.contest_office_we_vote_id){
      this.setState({ office: OfficeStore.get(candidate.contest_office_we_vote_id) || {} });
    }
  }

  render() {
    var candidate = this.state.candidate;
    var office = this.state.office;
    var we_vote_id = this.props.params.we_vote_id;

    if (!candidate.ballot_item_display_name){
      return ( <div></div> );
    };

    return (
    <section className="candidate well well-90 gutter-top--small">
      <div className="candidate-detail-route list-group-item">
        {
          <StarAction
          we_vote_id={candidate.we_vote_id} />
        }

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
            {
              (office.ballot_item_display_name) ?
                (<p>Running for <span className="running-for-office-emphasis">{ office.ballot_item_display_name }</span></p>) :
                (<p></p>)
            }
          </div>
        </div>
        {<ItemActionBar2 we_vote_id={candidate.we_vote_id}
                       is_support={candidate.is_support} is_oppose={candidate.is_oppose}
                        supportCount={candidate.supportCount} opposeCount={candidate.opposeCount} />}
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
          { (candidate.position_list) ?
            (<PositionList position_list={candidate.position_list} candidate_display_name={candidate.ballot_item_display_name}/>):
            (<div></div>)
          }
        </div>

      </div>
    </section>
    );

  }
}
