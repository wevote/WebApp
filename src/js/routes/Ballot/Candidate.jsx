import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, DropdownButton, Input, MenuItem, Navbar } from "react-bootstrap";
import { Link } from 'react-router';

import BallotStore from '../../stores/BallotStore';
import CandidateDetail from '../../components/Ballot/CandidateDetail';
import PositionList from '../../components/Ballot/PositionList';
import ItemActionbar from '../../components/ItemActionbar';
import ItemActionBar2 from '../../components/ItemActionBar2';
import StarAction from '../../components/StarAction';

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { candidate: {} };
  }

  componentWillMount(){
    // Redirects to root if candidate isn't fetched yet; TODO: just fetch params to enable sending links to candidate page.
    var candidate = BallotStore.getCandidateByWeVoteId(this.props.params.we_vote_id);
    if (Object.keys(candidate).length === 0)
      {
        this.props.history.replace('/ballot');
      }
  }

  componentDidMount(){
    this.setState({ candidate: BallotStore.getCandidateByWeVoteId(this.props.params.we_vote_id) });
  }

  render() {
    // if (Object.keys(this.state.candidate).length === 0){
    //   this.props.history.replace('/ballot');
    // };
    var candidate = this.state.candidate;
    var we_vote_id = this.props.params.we_vote_id;
    if (!candidate.we_vote_id){
      return ( <div></div> );
    };

    // if (Object.keys(candidate).length === 0){
    //   this.props.history.replace('/ballot');}

    var support_item;
    if (this.props.support_on) {
        support_item = <Link to="ballot">7 <span className="glyphicon glyphicon-small glyphicon-arrow-up"></span></Link>;
    } else {
        support_item = <Link to="ballot">7 <span className="glyphicon glyphicon-small glyphicon-arrow-up"></span></Link>;
    }

    var oppose_item;
    if (this.props.oppose_on) {
        oppose_item = <Link to="ballot">3 <span className="glyphicon glyphicon-small glyphicon-arrow-down"></span></Link>;
    } else {
        oppose_item = <Link to="ballot">3 <span className="glyphicon glyphicon-small glyphicon-arrow-down"></span></Link>;
    }

    return (
    <div className='candidate-detail-route'>
      {/*
      <header className="row">
        <div className="col-xs-6 col-md-6 text-center">
          <Link to='/ballot'>
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

      <StarAction
        we_vote_id={candidate.we_vote_id}
        is_starred={candidate.is_starred} />
      <div className="row" style={{ paddingBottom: '10px' }}>
        <div
          className="col-xs-4"
          style={candidate.candidate_photo_url ? {} : {height:'95px'}}>

          {
            candidate.candidate_photo_url ?
              <img
                className="img-circle"
                style={{display:'block', paddingTop: '10px', width:'100px'}}
                src={candidate.candidate_photo_url}
                alt="candidate-photo"/> :
            <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
          }
        </div>
        <div className="col-xs-8">
          <h4 className="bufferNone">
            <Link className="linkLight"
                  to={"/candidate/" + candidate.we_vote_id }
                  onlyActiveOnIndex={false}>
                    { candidate.ballot_item_display_name }
            </Link>
          </h4>
          <div>
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur posuere vulputate massa ut efficitur.
              Duis a eros fringilla, dictum leo vitae, vulputate mi. Nunc vitae neque nec erat fermentum... (more)<br />
              Courtesy of Ballotpedia.org */}
          </div>
        </div>
        <div className="col-xs-8">
          <div>{ candidate.office_display_name }</div>
          <ItemActionBar2 we_vote_id={candidate.we_vote_id}
                         is_support={candidate.is_support} is_oppose={candidate.is_oppose}
                         supportCount={candidate.supportCount} opposeCount={candidate.opposeCount} />
        </div>
      </div>
      <div className="container-fluid well well-90">
        <ul className="list-group">
            <li className="list-group-item">
                <div>
                    <input type="text" name="address" className="form-control" defaultValue="What do you think?" />
                    <Link to="ballot_candidate" params={{id: 2}}><Button bsSize="small">Post Privately</Button></Link>
                </div>
            </li>
        </ul>

        <PositionList we_vote_id={we_vote_id} />
      </div>

    </div>
  );

  }
}
