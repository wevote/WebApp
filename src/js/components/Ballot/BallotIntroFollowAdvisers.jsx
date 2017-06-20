import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import GuideActions from "../../actions/GuideActions";
import OrganizationFollowToggle from "./OrganizationFollowToggle";
import GuideStore from "../../stores/GuideStore";

export default class BallotIntroFollowAdvisers extends Component {
  static propTypes = {
    history: PropTypes.object,
    next: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizations: [],
    };
  }

  componentDidMount () {
    GuideActions.retrieveGuidesToFollowByIssueFilter();
    this._onGuideStoreChange();
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
  }

  _onGuideStoreChange () {
    this.setState({ organizations: GuideStore.retrieveGuidesToFollowByIssueFilter() });
  }

  render () {
    var organization_list = [];
    if (this.state.organizations) {
      organization_list = this.state.organizations;
    }

    const organization_list_for_display = organization_list.map((organization) => {
      return <div key={organization.organization_we_vote_id}>
        <OrganizationFollowToggle
          organization_we_vote_id={organization.organization_we_vote_id}
          organization_name={organization.organization_name}
        />
      </div>;
    });

    return <div className="">
      <div className="intro-modal__h1">Follow Organizations or People</div>
      <div className="intro-story__h2">Great work! Based on your issues, these are organizations or people that might share your values. Follow them to see their recommendations.</div>
      <br/>
      <div>
        { organization_list.length > 0 ?
          organization_list_for_display :
          <h4>No organizations to display</h4>
        }
      </div>
      <div className="intro-modal__padding-btn">
        <Button type="submit" className="btn btn-success" onClick={this.props.next}>
          <span>Next&nbsp;&nbsp;&gt;</span>
        </Button>
        <br/>
      </div>
    </div>;
  }
}
