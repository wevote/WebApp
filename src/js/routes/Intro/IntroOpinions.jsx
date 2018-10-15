import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import GuideList from "../../components/VoterGuide/GuideList";
import { renderLog } from "../../utils/logging";
import SearchGuidesToFollowBox from "../../components/Search/SearchGuidesToFollowBox";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";

export default class IntroOpinionsPage extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      voter_guides_to_follow_all: [],
      ballot_has_guides: null
    };
  }

  componentDidMount () {
    this._onChange();
    this.voterGuideStoreListener = VoterGuideStore.addListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({
      voter_guides_to_follow_all: VoterGuideStore.getVoterGuidesToFollowAll(),
      ballot_has_guides: VoterGuideStore.ballotHasGuides(),
      text_for_map_search: VoterStore.getTextForMapSearch()
    });
  }

  componentWillUnmount (){
    this.voterGuideStoreListener.remove();
  }

  render () {
    renderLog(__filename);
    let { voter_guides_to_follow_all, ballot_has_guides } = this.state;
    // console.log(ballot_has_guides);
    var float = {
      right: {
        float: "right"
      },
      left: {
        float: "left"
      }
    };

  return <div className="container-fluid">
    <h1 className="h1">Here's the idea - Learn from Community</h1>

    <div className="well well-100">
            <p>You have organizations and friends you trust when it comes time to
              vote. Follow them so you can see what they endorse on your ballot.</p>
            <p className="clearfix">Or skip this.
                <span style={float.right}>
                    <Link to="/ballot">
                        <Button variant="primary" size="small">
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
                <SearchGuidesToFollowBox />
                <br/>
                {ballot_has_guides ?
                  null :
                  <p>There are no organizations with opinions on your ballot. Here are some popular organizations.</p>
                }
                {voter_guides_to_follow_all ?
                  <div className="card"><GuideList organizationsToFollow={voter_guides_to_follow_all} /></div> :
                  null
                }
            </div>
        </div>
    <Link style={float.left} to="/intro">
            <Button variant="primary" size="small">Back</Button>
        </Link>
    <Link style={float.right} to="/ballot">
            <Button variant="primary" size="small">Next</Button>
        </Link>
    </div>;
  }
}
