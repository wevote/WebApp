import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";

export default class ThisIsMeAction extends Component {
  static propTypes = {
    params: PropTypes.object,
    name_being_viewed: PropTypes.string,
    twitter_handle_being_viewed: PropTypes.string,
    kind_of_owner: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    const twitter_handle_being_viewed = this.props.twitter_handle_being_viewed;
    if (!twitter_handle_being_viewed) {
      // We do not want to show the "This is me" link if there isn't a twitter_handle associated with this organization
      return <span />;
    }
    const kind_of_owner = this.props.kind_of_owner;
    const name_being_viewed = this.props.name_being_viewed || "";
    // Manage the control over this organization voter guide
    const { voter } = this.state;
    const signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    let signed_in_with_this_twitter_account = false;
    if (signed_in_twitter && voter.twitter_screen_name && twitter_handle_being_viewed) {
      signed_in_with_this_twitter_account = voter.twitter_screen_name.toLowerCase() === twitter_handle_being_viewed.toLowerCase();
    }
    let this_is_me_action_text;
    if (kind_of_owner === "ORGANIZATION") {
      if (name_being_viewed) {
        this_is_me_action_text = `I represent ${name_being_viewed}`;
      } else {
        this_is_me_action_text = "I represent this organization";
      }
    } else if (kind_of_owner === "POLITICIAN") {
      if (name_being_viewed) {
        this_is_me_action_text = `I represent ${name_being_viewed}`;
      } else {
        this_is_me_action_text = "I represent this politician";
      }
    } else {
      this_is_me_action_text = "This is me";
    }

    return (
      <span>
        {signed_in_with_this_twitter_account ?
          <span /> : (
            <Link to={`/verifythisisme/${twitter_handle_being_viewed}`}>
              <span className="u-wrap-links">
                {this_is_me_action_text}
              </span>
            </Link>
          )}
      </span>
    );
  }
}
