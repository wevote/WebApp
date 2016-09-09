import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import VoterStore from "../../stores/VoterStore";

export default class ThisIsMeAction extends Component {
  static propTypes = {
    params: PropTypes.object,
    name_being_viewed: PropTypes.string,
    twitter_handle_being_viewed: PropTypes.string,
    kind_of_owner: PropTypes.string
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

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    let twitter_handle_being_viewed = this.props.twitter_handle_being_viewed;
    let kind_of_owner = this.props.kind_of_owner;
    let name_being_viewed = this.props.name_being_viewed || "";
    // Manage the control over this organization voter guide
    var {voter} = this.state;
    var signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    var signed_in_with_this_twitter_account = false;
    if (signed_in_twitter) {
      signed_in_with_this_twitter_account = voter.twitter_screen_name.toLowerCase() === twitter_handle_being_viewed.toLowerCase();
    }

    var this_is_me_action_text;
    if (kind_of_owner === "ORGANIZATION") {
      if (name_being_viewed) {
        this_is_me_action_text = "I Work for " + name_being_viewed;
      } else {
        this_is_me_action_text = "I Work for this Organization";
      }
    } else if (kind_of_owner === "POLITICIAN") {
      if (name_being_viewed) {
        this_is_me_action_text = "I Work for " + name_being_viewed;
      } else {
        this_is_me_action_text = "I Work for this Politician";
      }
    } else {
      this_is_me_action_text = "This is Me";
    }

    return <span>
        {signed_in_with_this_twitter_account ?
          <span></span> :
          <Link to={`/verifythisisme/${twitter_handle_being_viewed}`}>
            <Button bsStyle="link">
              {this_is_me_action_text}
            </Button>
          </Link>
          }
      </span>;
  }
}
