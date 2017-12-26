import React, { PropTypes, Component } from "react";
import { ProgressBar } from "react-bootstrap";

export default class PledgeToSupportOrganizationStatusBar extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    //pledgeToVoteAction: PropTypes.func.isRequired
    pledgeToVoteAction: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  render () {
    let has_pledged = false;

    const number_of_supporters_goal = 150;
    const number_of_supporters = 112;
    const percent_complete = 60;

    const progress_bar = <ProgressBar bsStyle={"danger"}
                                      className="u-stack--xs"
                                      striped
                                      now={percent_complete}
                                      label={`${number_of_supporters} supporters`} />;

    return <span>
      {progress_bar}
      {has_pledged ?
        <div className="voter-guide__pledge-to-support__thank-you-for-supporting u-stack--md">
          Thank you for standing with {this.props.organization.organization_name}!
        </div> :
        <div className="voter-guide__pledge-to-support__current-supporters u-stack--md">
          {number_of_supporters} have pledged. Lets get to {number_of_supporters_goal}!
        </div>
      }
    </span>;
  }
}
