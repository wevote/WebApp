import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import ImageHandler from "../../components/ImageHandler";
import LoadingWheel from "../../components/LoadingWheel";

export default class PositionsNotShownList extends Component {
  static propTypes = {
    positions_not_shown_list: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    if (!this.props.positions_not_shown_list) {
      return <div>{LoadingWheel}</div>;
    }

    var show_position = true;
    var nothing_to_display = null;

    const positions_not_shown_display = this.props.positions_not_shown_list.map( (one_position) => {
      let speaker_we_vote_id = one_position.speaker_we_vote_id;
      let speaker_display_name = one_position.speaker_display_name;
      let speaker_image_url_https_tiny = one_position.speaker_image_url_https_tiny;
      let speaker_twitter_handle = one_position.speaker_twitter_handle;

      // TwitterHandle-based link
      var speakerLink = speaker_twitter_handle ? "/" + speaker_twitter_handle : "/voterguide/" + speaker_we_vote_id;

      return <div key={speaker_we_vote_id} className="card-main__media-object">
        {/* One Position on this Candidate */}
          <div className="card-child__media-object-anchor">
            <Link to={speakerLink} className="u-no-underline">
              <ImageHandler className=""
                            sizeClassName="organization-image-tiny"
                            imageUrl={speaker_image_url_https_tiny}/>
            </Link>
            <br />
            <br />
          </div>
          &nbsp;&nbsp;
          <div className="card-child__media-object-content">
            <Link to={speakerLink}>
              <h3 className="card-child__display-name">{speaker_display_name}</h3>
            </Link>
          </div>
        </div>;
    });
    if (show_position) {
      return <span className="guidelist card-child__list-group">
        {positions_not_shown_display}
      </span>;
    } else {
      return <span className="guidelist card-child__list-group">
        {nothing_to_display}
      </span>;
    }
  }
}
