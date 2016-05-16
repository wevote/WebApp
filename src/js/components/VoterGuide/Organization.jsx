import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Image from "../../components/Image";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";

export default class Organization extends Component {
  static propTypes = {
    id: PropTypes.string,
    key: PropTypes.string,
    imageUrl: PropTypes.string,
    displayName: PropTypes.string,
    twitterDescription: PropTypes.string,
    followers: PropTypes.number,
    children: PropTypes.array
  };

  render () {

    const {
      followers,
      id,
      imageUrl,
    } = this.props;

    let displayName = this.props.displayName ? this.props.displayName : "";
    let twitterDescription = this.props.twitterDescription ? this.props.twitterDescription : "";
    // If the displayName is in the twitterDescription, remove it from twitterDescription
    let twitterDescriptionMinusName = removeTwitterNameFromDescription(displayName, twitterDescription);

    var voter_guide_we_vote_id_link = "/voterguide/" + id;

    const org =
      <div className="organization-item">
        <div className="organization-item__avatar">
          <Link to={voter_guide_we_vote_id_link}>
            <Image imageUrl={imageUrl} />
          </Link>
        </div>
        <div className="organization-item__content">
          <Link to={voter_guide_we_vote_id_link}>
            <h4 className="organization-item__display-name">{displayName}</h4>
          </Link>
          { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> :
            null}
          <div className="organization-item__additional">
            <div className="organization-item__follow-buttons">
              {this.props.children}
            </div>
            {followers ?
              <span className="twitter-followers__badge">
                <span className="hidden-xs fa fa-twitter twitter-followers__icon"></span>
                {numberWithCommas(followers)}
              </span> :
              null}
          </div>
        </div>
      </div>;
    return org;
  }
}
