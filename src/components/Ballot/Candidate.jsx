import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CandidateStore from 'stores/CandidateStore';
import CandidateActions from 'actions/CandidateActions';

import StarAction from 'components/StarAction';
import ItemActionbar from 'components/ItemActionbar'

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    candidate_photo_url: PropTypes.string,
    id: PropTypes.number,
    opposeCount: PropTypes.number,
    order_on_ballot: PropTypes.string,
    supportCount: PropTypes.number,
    we_vote_id: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      supportCount: this.props.supportCount,
      opposeCount: this.props.opposeCount
    };
  }

  componentDidMount() {
    CandidateStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    CandidateStore.removeChangeListener(this._onChange.bind(this));
  }

  _updateCandidate (candidate) {
    this.setState({
      opposeCount: candidate.opposeCount,
      supportCount: candidate.supportCount
    });
  }

  _onChange () {
    CandidateStore.getCandidateById(
      this.props.we_vote_id, this._updateCandidate.bind(this)
    );
  }

  render() {
    let {
      we_vote_id,
      ballot_item_display_name,
      candidate_photo_url
    } = this.props;

    let {
      supportCount,
      opposeCount
    } = this.state;

    return (
      <section className="list-group-item">
        <StarAction we_vote_id={we_vote_id}/>
        <div className="row">
          <div className="pull-left col-xs-4 col-md-4">

            {/* adding inline style to img until Rob can style... */}
            {
              candidate_photo_url ?

                <img
                  style={{display:'block', width:'100px'}}
                  src={candidate_photo_url}
                  alt="candidate-photo"/> :

              <i className="icon-xl icon-main icon-icon-person-placeholder-6-1 icon-light"/>

            }
          </div>
          <div className="pull-right col-xs-8 col-md-8">
            <h4 className="bufferNone">
              <Link
                  className="linkLight"
                  to={"/candidate/" + we_vote_id.split('cand').pop() }
                  onlyActiveOnIndex={false}>
                  { ballot_item_display_name }
              </Link>
            </h4>
            <p className="typeXLarge">
              {supportCount} support
              <span className="small"> (more) </span>
            </p>
            <p className="bufferNone">
              { opposeCount } oppose
            </p>
          </div>
        </div>
        <ItemActionbar action={CandidateActions} we_vote_id={we_vote_id} />
      </section>
    );
  }
}
