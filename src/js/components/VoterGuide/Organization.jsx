import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Image from "../../components/Image";

function numberWithCommas (num) {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export default class Organization extends Component {
  static propTypes = {
    id: PropTypes.string,
    key: PropTypes.string,
    imageUrl: PropTypes.string,
    displayName: PropTypes.string,
    followers: PropTypes.number,
    children: PropTypes.array
  };

  render () {

    const {
      displayName,
      followers,
      id,
      imageUrl,
    } = this.props;

    var voter_guide_we_vote_id_link = "/voterguide/" + id;

    const org =
      <div className="row">
        <div className="organization well well-skinny well-bg--light split-top-skinny clearfix">
          <div className="col-xs-2">
            <Link to={voter_guide_we_vote_id_link}>
              <Image imageUrl={imageUrl} />
            </Link>
          </div>
          <div className="col-xs-8 col-sm-6 display-name">
            <Link to={voter_guide_we_vote_id_link}>
              {displayName}
            </Link>
          </div>
          <div className="col-xs-2 col-sm-4 utils-paddingright0"
                style={ {textAlign: "right"} }>
              {this.props.children}
          </div>
          <div className="hidden-xs social-box">
              {numberWithCommas(followers)}
          </div>
        </div>
      </div>;

    return org;
  }

}
