import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { renderLog } from '../../common/utils/logging';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

// OrganizationDisplayForListCompressed is used by OpinionsFollowedListCompressed for viewing organizations
export default class OrganizationDisplayForListCompressed extends Component {
  render () {
    renderLog('OrganizationDisplayForListCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      organization_photo_url_medium: organizationPhotoUrlMedium,
      organization_twitter_handle: organizationTwitterHandle,
      organization_we_vote_id: organizationWeVoteId,
    } = this.props;

    if (organizationWeVoteId === undefined) {
      // console.log("OrganizationDisplayForList organizationWeVoteId === undefined");
      return null;
    }

    const organizationName = this.props.organization_name ? this.props.organization_name : '';

    // TwitterHandle-based link
    const voterGuideLink = organizationTwitterHandle ? `/${organizationTwitterHandle}` : `/voterguide/${organizationWeVoteId}`;

    return (
      <div id="organizationDisplayForListCompressed" className="card-child card-child--not-followed">
        <div className="card-child__media-object-anchor">
          <Link to={voterGuideLink} className="u-no-underline">
            <Suspense fallback={<></>}>
              <ImageHandler className="card-child__avatar" sizeClassName="image-lg " imageUrl={organizationPhotoUrlMedium} />
            </Suspense>
          </Link>
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            <Link to={voterGuideLink}>
              <h4 className="card-child__display-name">{organizationName}</h4>
            </Link>
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
OrganizationDisplayForListCompressed.propTypes = {
  organization_we_vote_id: PropTypes.string,
  organization_photo_url_medium: PropTypes.string,
  organization_name: PropTypes.string,
  children: PropTypes.array, // A list of the tags in OrganizationDisplayForList when called (from GuideList for example)
  organization_twitter_handle: PropTypes.string,
};
