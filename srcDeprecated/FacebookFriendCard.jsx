import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

export default class FacebookFriendCard extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('FacebookFriendCard.jsx');  // Set LOG_RENDER_EVENTS to log all renders
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
              null}
          </div>
        </div>
      </div>
    );
  }
}
FacebookFriendCard.propTypes = {
  picture: PropTypes.object,
  name: PropTypes.string,
};
