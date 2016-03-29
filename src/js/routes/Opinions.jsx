import { Button } from "react-bootstrap";
import GuideStore from "../stores/GuideStore";
import SearchBox from "../components/SearchBox";
import VoterStore from "../stores/VoterStore";
import GuideList from "../components/VoterGuide/GuideList";
import { Link } from "react-router";
import React, {Component, PropTypes } from "react";

/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */

export default class Opinions extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {guideList: [], ballot_has_guides: null};
  }

  componentDidMount () {
    this._onChange();
    this.listener = GuideStore.addListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({ guideList: GuideStore.toFollowList(),
                  ballot_has_guides: GuideStore.ballotHasGuides(),
                  address: VoterStore.getAddress() });
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  render () {
    const { ballot_has_guides, guideList, address } = this.state;
    let guides;
    var floatRight = {
        float: "right"
    };

    if ( address === "" ){
      guides = <div>
          <span style={floatRight}>
              <Link to="/settings/location"><Button bsStyle="primary">Enter my address &#x21AC;</Button></Link>
          </span>
          <p>Enter your address so we can find voter guides to follow.</p>
        </div>;

    } else {
        guides = <div>
          <p>
            These organizations and public figures have opinions about items on
            your ballot. They are ordered by number of Twitter followers.
          </p>
          <SearchBox />
          { ballot_has_guides ?
            <p></p> :
            <p>There are no organizations with opinions on your ballot. Here are some popular organizations</p>
          }
        <GuideList organizations={guideList}/>
        </div>;
      }

    const content =
      <div className="opinion-view">
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">More Opinions I Can Follow</h3>
          {guides}
        </div>
      </div>;

    return content;
  }
}
