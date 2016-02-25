import React, { Component, PropTypes } from "react";
import { $ajax } from "../utils/service";

const floatRight = { float: "right" };

const VALID_TYPES = [ "OFFICE", "CANDIDATE", "MEASURE" ];

export default class Star extends Component {
  static propTypes = {
    key: PropTypes.string,
    type: PropTypes.string
  };

  constructor (props) {
    super(props);

    var { type } = this.props;

    if ( VALID_TYPES.indexOf(type) < 0)
      throw new Error("invalid type passed to Star component");

    this.state = {
      loading: true,
      error: false,
      active: null
    };

  }

  componentDidMount () {
    var { key: we_vote_id, type: kind_of_ballot_item } = this.props;

    $ajax({
      endpoint: "voterStarStatusRetrieve",

      data: { we_vote_id, kind_of_ballot_item },

      success: (res) =>
        this.setState({
          loading: false,
          error: false,
          active: res.is_starred
        }),

      error: (err) => {
        console.error(err);

        this.setState({
          loading: false,
          error: true,
          active: null
        });
      }

    });
  }

  render () {
    var { loading, active } = this.state;
    var activeIcon = "glyphicon glyphicon-small glyphicon-star";
    var inactiveIcon = "glyphicon glyphicon-small glyphicon-star-empty";
    var className = "star-action " + (active ? activeIcon : inactiveIcon);

    const star = !loading ?
      <span className={className} style={floatRight} /> :
      <span className="star-loading"></span>;

    return star;
  }
}
