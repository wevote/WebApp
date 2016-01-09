import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import StarAction from 'components/StarAction';

export default class CandidateList extends Component {
  static propTypes = {
    candidate_list: PropTypes.array
  };

  mapListToHTML () {
    return this.props.candidate_list.map( candidate => (
      <li className="list-group-item" key={candidate.we_vote_id}>
        <StarAction we_vote_id={candidate.we_vote_id}/>
        <div className="row">
          <div className="pull-left col-xs-4 col-md-4">

            {/* adding inline style to img until Rob can style... */}
            {
              candidate.candidate_photo_url ?

                <img
                  style={{display:'block', width:'100px'}}
                  src={candidate.candidate_photo_url}
                  alt="candidate-photo"/> :

              <i className="iconXlarge icon-icon-person-placeholder-6-1 icon-light"/>

            }
          </div>
          <div className="pull-right col-xs-8 col-md-8">
            <h4 className="bufferNone">
              <Link
                  className="linkLight"
                  to={"/candidate/" + candidate.we_vote_id.split('cand').pop() }
                  onlyActiveOnIndex={false}>
                  { candidate.ballot_item_display_name }
              </Link>
            </h4>
            <p className="typeXLarge">
              {candidate.supportCount} support
              <span className="small"> (more) </span>
            </p>
            <p className="bufferNone">
              {candidate.opposeCount} oppose
            </p>
          </div>
        </div>
        <div className="row">
          <div className="container-fluid">
            <div className="left-inner-addon">
              <Link
                to="ballot"
                onlyActiveOnIndex={false}>
                <span className="glyphicon glyphicon-small glyphicon-arrow-up">
                </span>
                Support
              </Link>
              <Link
                to="ballot"
                onlyActiveOnIndex={false}>
                <span className="glyphicon glyphicon-small glyphicon-arrow-down">
                </span>
                Oppose
              </Link>
              <Link
                to="ballot"
                onlyActiveOnIndex={false} >
                <span className="glyphicon glyphicon-small glyphicon-comment">
                </span>
                Comment
              </Link>
              <Link
                to="ballot"
                onlyActiveOnIndex={false}>
                <span className="glyphicon glyphicon-small glyphicon-share-alt">
                </span>
                Ask or Share
              </Link>
            </div>
          </div>
        </div>
      </li>
    ));
  }

    render () {
      return (
          <ul className="list-group">
            { this.mapListToHTML() }
          </ul>
      );
    }
}
