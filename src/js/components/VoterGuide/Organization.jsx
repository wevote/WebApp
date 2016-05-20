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
    twitter_handle: PropTypes.string,
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

    var voter_guide_link = "/voterguide/" + id;
    // TODO TwitterHandle
    // var voter_guide_link = this.props.twitter_handle ? "/" + this.props.twitter_handle : "/voterguide/" + id;

    const org =
      <div className="row">
        <div className="organization well well-skinny well-bg--light split-top-skinny clearfix">
          <div className="col-xs-2">
            <Link to={voter_guide_link}>
              <Image imageUrl={imageUrl} />
            </Link>
          </div>
          <div className="col-xs-8 col-sm-6 display-name">
            <Link to={voter_guide_link}>
              <strong>{displayName}</strong>
              { twitterDescriptionMinusName ? <span>{twitterDescriptionMinusName}</span> :
                  <span></span>}
            </Link>
          </div>
          <div className="col-xs-2 col-sm-4 utils-paddingright0"
                style={ {textAlign: "right"} }>
              {this.props.children}
          </div>
          {followers ?
            <div className="hidden-xs social-box fa fa-twitter">
              {numberWithCommas(followers)}
            </div> :
            <span></span>}
        </div>
      </div>;

    return org;
  }

}
