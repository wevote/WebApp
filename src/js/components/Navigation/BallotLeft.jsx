import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import MenuLink from "./MenuLink";


export default class BallotLeft extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    linked_organization_we_vote_id: PropTypes.string,
    signed_in_facebook: PropTypes.bool,
    is_signed_in: PropTypes.bool,
    signed_in_twitter: PropTypes.bool,
    twitter_screen_name: PropTypes.string,
    voter_photo_url_medium: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this._onBallotStoreChange();
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
  }

  _onBallotStoreChange () {
    let unsorted = BallotStore.ballot;
    if ( unsorted && unsorted.length > 0) {
      this.setState({ballot: this._sortBallots(unsorted)});
    }
  }

  _sortBallots (unsorted) {
    // temporary array holds objects with position and sort-value
    let mapped = unsorted.map(function (item, i) {
      return { index: i, value: item };
    });

    // sorting the mapped array based on local_ballot_order which came from the server
    mapped.sort(function (a, b) {
      return +(parseInt(a.value.local_ballot_order) > parseInt(b.value.local_ballot_order)) ||
        +(parseInt(a.value.local_ballot_order) === parseInt(b.value.local_ballot_order)) - 1;
    });

    let orderedArray = [];
    for (let element of mapped) {
      orderedArray.push(element.value);
    }

    return orderedArray;
  }

  render () {
    if (this.state.ballot && this.state.ballot.length > 0) {
      return <div className="u-inset__v--md">
        {/* Temporary "spacing" to be replaced by actual styles */}
        <h4 className="text-left" >&nbsp;</h4>
        <h4 className="text-left" >&nbsp;</h4>
        <h4 className="text-left" >Summary of Ballot Items</h4>
        <ul className="list-group">
             {this.state.ballot.map(function (item, key) {
               if (item.kind_of_ballot_item === "OFFICE" || item.kind_of_ballot_item === "MEASURE") {
                 return <div key={key}>
                   <MenuLink url={"/measure/" + item.we_vote_id} label={item.ballot_item_display_name}
                                  subtitle={item.measure_subtitle}/>
                 </div>;
               } else {
                 return <span />;
               }
             }
          )}
        </ul>
        <h4 className="text-left" />
        <span className="terms-and-privacy">
          <br />
          <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy Policy</Link>
        </span>
      </div>;
    } else {
      return <span />;
    }
  }
}
