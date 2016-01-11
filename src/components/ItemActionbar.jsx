import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ItemActionbar extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    action: PropTypes.object.isRequired
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
        <div className="container-fluid">
          <div className="left-inner-addon">
            <span onClick={ this.supportById.bind(this) }>
              <span className="glyphicon glyphicon-small glyphicon-arrow-up">
              </span>
              Support
            </span>
            <span onClick={ this.unsupportById.bind(this) }>
              <span className="glyphicon glyphicon-small glyphicon-arrow-down">
              </span>
              Oppose
            </span>
            <span >
              <span className="glyphicon glyphicon-small glyphicon-comment">
              </span>
              Comment
            </span>
            <span>
              <span className="glyphicon glyphicon-small glyphicon-share-alt">
              </span>
              Ask or Share
            </span>
          </div>
        </div>
      </div>
    );
  }
}
