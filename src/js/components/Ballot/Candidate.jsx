import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import StarAction from '../../components/StarAction';
import ItemActionbar from '../../components/ItemActionbar';

export default class Candidate extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    candidate_photo_url: PropTypes.string,
    id: PropTypes.number,
    opposeCount: PropTypes.number,
    order_on_ballot: PropTypes.string,
    supportCount: PropTypes.number,
    we_vote_id: PropTypes.string,
    is_starred: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {
      we_vote_id,
      ballot_item_display_name,
      candidate_photo_url,
      opposeCount,
      supportCount
    } = this.props;

    return (
      <section className="candidate list-group-item">
        <StarAction
          we_vote_id={we_vote_id}
          is_starred={this.props.is_starred || false } />

        <div className="row" style={{ paddingBottom: '10px' }}>
          <div
            className="col-xs-4"
            style={candidate_photo_url ? {} : {height:'95px'}}>

            {/* adding inline style to img until Rob can style... */}
            {
              candidate_photo_url ?

                <img
                  className="img-circle"
                  style={{display:'block', paddingTop: '10px', width:'100px'}}
                  src={candidate_photo_url}
                  alt="candidate-photo"/> :

              <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>

            }
          </div>
          <div className="col-xs-8">
            <h4 className="bufferNone">
              <Link className="linkLight"
                    to={"/candidate/" + we_vote_id }
                    onlyActiveOnIndex={false}>
                      { ballot_item_display_name }
              </Link>
            </h4>
            <ul className="list-style--none">
              <li className="list-inline support">
                <span>{ supportCount }</span>&nbsp;
                <span>support</span>
              </li>
              <li className="list-inline oppose">
                <span>{ opposeCount }</span>&nbsp;
                <span>oppose</span>
              </li>
            </ul>
          </div>
        </div>
        <ItemActionbar we_vote_id={we_vote_id} />
      </section>
    );
  }
}
