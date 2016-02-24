import React, { Component, PropTypes } from "react";
<<<<<<< HEAD
import { $ajax } from "../../utils/service";
import BallotRoot from "../../components/Ballot/BallotRoot";
=======
import LoadingWheel from "../../components/LoadingWheel";

import BallotStore from "../../stores/BallotStore";
import BallotItem from "../../components/Ballot/BallotItem";

>>>>>>> a57c0e02277221b22bef629b609a06f6df1bfa69

export default class Ballot extends Component {
  static propTypes = {
    history: PropTypes.object,
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

    return ballot;
  }
}
