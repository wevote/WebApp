import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router";
import CandidateStore from "../../stores/CandidateStore";
import OfficeStore from "../../stores/OfficeStore";
import CandidateActions from "../../actions/CandidateActions";
import PositionList from "../../components/Ballot/PositionList";
import ItemActionBar2 from "../../components/ItemActionBar2";
import StarAction from "../../components/StarAction";

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {candidate: {}, office: {} };
  }

  componentWillUnmount () {
    this.candidateToken.remove();
    this.officeToken.remove();
  }

  componentDidMount (){
    this.candidateToken = CandidateStore.addListener(this._onChange.bind(this));
    this.officeToken = OfficeStore.addListener(this._onChange.bind(this));

    CandidateActions.retrieve(this.props.params.we_vote_id);
  }

  _onChange (){
    var we_vote_id = this.props.params.we_vote_id;
    var candidate = CandidateStore.get(we_vote_id) || {};

    this.setState({ candidate: candidate });

    if (candidate.contest_office_we_vote_id){
      this.setState({ office: OfficeStore.get(candidate.contest_office_we_vote_id) || {} });
    }
  }

  render () {
    var { candidate, office } = this.state;
    var we_vote_id = this.props.params.we_vote_id;
    var position_list_length = 0;
    var moreOpinionsLink = "";
    if (candidate) {
      if (candidate.position_list) {
        position_list_length = candidate.position_list.length;
        moreOpinionsLink = "/opinions/" + candidate.we_vote_id;
      }
    }
    // If there aren't any positions, use this language:
    var find_more_positions_button_text = "Find Opinions About " + candidate.ballot_item_display_name;
    if (position_list_length > 0) {
      find_more_positions_button_text = "Find More Opinions";
    }

    if (!candidate.ballot_item_display_name){
      return <div></div>;
    }

    return <section className="candidate well well-90 gutter-top--small">
      <div className="candidate-detail-route list-group-item">
        {
          <StarAction
          we_vote_id={candidate.we_vote_id} type="CANDIDATE"/>
        }

        <div className="row" style={{ paddingBottom: "2rem" }}>
          <div
            className="col-xs-4"
            style={candidate.candidate_photo_url ? {} : {height: "95px"}}>

            {
              candidate.candidate_photo_url ?
                <img
                  className="img-circle"
                  style={{ display: "block", paddingTop: "10px", width: "100px"}}
                  src={candidate.candidate_photo_url}
                  alt="candidate-photo"/> :
              <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
            }
          </div>
          <div className="col-xs-8">
            <h4 className="bufferNone">
              { candidate.ballot_item_display_name }
              {
                candidate.party ?
                    <span className="link-text-candidate-party"><br />{ candidate.party }</span> :
                    <span></span>
              }
            </h4>
            {
              office.ballot_item_display_name ?
                <p>Running for <span className="running-for-office-emphasis">{ office.ballot_item_display_name }</span></p> :
                <p></p>
            }
          </div>
        </div>
        {<ItemActionBar2 we_vote_id={we_vote_id} type="CANDIDATE"
                       />}
        <div className="container-fluid well-90">
          {/* TODO Post privately box functionality to be implemented */}
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
          { candidate.position_list ?
            <div>
              <PositionList
              position_list={candidate.position_list}
              candidate_display_name={candidate.ballot_item_display_name} />
                <div className="gutter-top--small">
                  <ButtonToolbar>
                    <Link to={moreOpinionsLink}>
                      <Button bsStyle="primary">
                        { find_more_positions_button_text }</Button>
                      </Link>
                  </ButtonToolbar>
                </div>
            </div> :
            <div></div> }
        </div>
      </div>
    </section>;

  }
}
