import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ItemActionbar extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    action: PropTypes.object.isRequired,
    voterSupports: PropTypes.string, // Is "support" selected?
    voterOpposes: PropTypes.string // Is "oppose" selected?
  };

  constructor (props) {
    super(props);
  }

  supportById () {
    this.props.action.support(this.props.we_vote_id);
  }

  unsupportById () {
    this.props.action.oppose(this.props.we_vote_id);
  }

  render () {
    return (
      <div className="item-actionbar row">
          <span className="col-xs-3" onClick={ this.supportById.bind(this) }>
            <span className="glyphicon glyphicon-small glyphicon-arrow-up">
            </span>
            &nbsp;Support {this.props.voterSupports}
          </span>
          <span className="col-xs-3" onClick={ this.unsupportById.bind(this) }>
            <span className="glyphicon glyphicon-small glyphicon-arrow-down">
            </span>
            &nbsp;Oppose {this.props.voterOpposes}
          </span>
          <span className="col-xs-3" >
            <span className="glyphicon glyphicon-small glyphicon-share-alt">
            </span>
            &nbsp;Share
          </span>
      </div>
    );
  }
}
