import React, { Component, PropTypes } from "react";
import { $ajax } from "../../utils/service";
import BallotRoot from "../../components/Ballot/BallotRoot";

export default class Ballot extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      error: false
    };
  }

  componentDidMount () {

    $ajax({
      endpoint: "voterBallotItemsRetrieve",

      success: (res) => {
        this.ballot = <BallotRoot ballot={res.ballot_item_list} />;

        this.setState({
          loading: false,
          error: false
        });
      },

      error: (err) => {
        console.error(err);

        this.setState({
          error: true,
          loading: false
        });
      }
    });
  }

  render () {
    var { loading } = this.state;

    const ballot = !loading ?
      this.ballot :

      <div className="box-loader">
        <i className="fa fa-spinner fa-pulse"></i>
        <p>{"Loading ... One Moment"}</p>
      </div>;

      console.log(ballot);

    return ballot;
  }
}
