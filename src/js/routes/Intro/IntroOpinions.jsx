import { Button } from "react-bootstrap";
import SearchBox from "../../components/SearchBox";
import GuideStore from "../../stores/GuideStore";
import VoterStore from "../../stores/VoterStore";
import GuideList from "../../components/VoterGuide/GuideList";
import { Link } from "react-router";
import React, {Component, PropTypes } from "react";

export default class IntroOpinionsPage extends Component {
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
    let { guideList, ballot_has_guides } = this.state;
    console.log(ballot_has_guides);
    var float = {
      right: {
        float: "right"
      },
      left: {
        float: "left"
      }
    };

  return <div className="bs-container-fluid">
    <h1>Here's the idea - Learn from Community</h1>

    <div className="bs-well well-100">
            <p>You have organizations and friends you trust when it comes time to
              vote. Follow them so you can see what they endorse on your ballot.</p>
            <p className="clearfix">Or skip this.
                <span style={float.right}>
                    <Link to="/ballot">
                        <Button bsClass="bs-btn" bsStyle="primary" bsSize="small">
                            Start on My Own >
                        </Button>
                    </Link>
                </span>
            </p>
            <div>
                <label htmlFor="search_opinions">
                    Follow Like-Minded Organizations
                </label>
                <br/>
                Follow those you trust, and Ignore those you don't. Unfollow at any time.
                Following won't add you to mailing lists.
                We will never sell your email address.
                <br />
                <SearchBox />
                <br/>
                {ballot_has_guides ? <span></span> :
                  <p>There are no organizations with opinions on your ballot. Here are some popular organizations.</p>}
                {guideList ? <GuideList organizations={guideList} /> : <div></div> }
            </div>
        </div>
    <Link style={float.left} to="/intro">
            <Button bsClass="bs-btn" bsStyle="primary" bsSize="small">Back</Button>
        </Link>
    <Link style={float.right} to="/ballot">
            <Button bsClass="bs-btn" bsStyle="primary" bsSize="small">Next</Button>
        </Link>
    </div>;
  }
}
