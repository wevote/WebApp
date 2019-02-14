import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';

export default class FacebookFriendCard extends Component {
  static propTypes = {
    picture: PropTypes.object,
    name: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    return (
      <div className="facebook-friend card-child card-child--not-followed">
        <div className="card-child__avatar">
          <ImageHandler sizeClassName="icon-lg " imageUrl={this.props.picture.data.url} />
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            { this.props.name ? (
              <span>
                &nbsp;
                {this.props.name}
              </span>
            ) :
              null
            }
          </div>
        </div>
      </div>
    );
  }
}
