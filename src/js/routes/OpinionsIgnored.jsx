import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import GuideStore from "../stores/GuideStore";
import GuideActions from "../actions/GuideActions";
import OpinionsIgnoredList from "../components/VoterGuide/OpinionsIgnoredList";

export default class OpinionsIgnored extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      voter_guide_ignored_list: [],
      editMode: false
    };
  }

  componentDidMount () {
    this.setState({ voter_guide_ignored_list: GuideStore.getVoterGuidesVoterIsIgnoring() });
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.voterGuidesIgnoredRetrieve();
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange (){
    var list = GuideStore.getVoterGuidesVoterIsIgnoring();

    if (list !== undefined && list.length > 0){
      this.setState({ voter_guide_ignored_list: GuideStore.getVoterGuidesVoterIsIgnoring() });
      // console.log(this.state.voter_guide_ignored_list);
    }
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({editMode: !this.state.editMode});
    }
  }

  render () {
    return <div className="opinions-followed__container">
      <Helmet title="Who You're Ignoring - We Vote" />
      <section className="card">
        <div className="card-main">
          <h1 className="h1">Who You're Ignoring</h1>
          <a className="fa-pull-right"
             tabIndex="0"
             onKeyDown={this.onKeyDownEditMode.bind(this)}
             onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit"}</a>
            <p>
              Organizations, public figures and other voters you're ignoring.
            </p>
          <div className="voter-guide-list card">
            <div className="card-child__list-group">
              {
                this.state.voter_guide_ignored_list && this.state.voter_guide_ignored_list.length ?
                <OpinionsIgnoredList organizationsIgnored={this.state.voter_guide_ignored_list}
                                      editMode={this.state.editMode}
                                      instantRefreshOn /> :
                  null
              }
            </div>
          </div>
          <Link className="pull-right" to="/opinions_followed">Go back</Link>
        </div>
      </section>
    </div>;
  }
}
