import React, { PropTypes, Component } from "react";
import { Button } from "react-bootstrap";
import { shortenText } from "../../utils/textFormat";

export default class PledgeToSupportOrganizationButton extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    //pledgeToVoteAction: PropTypes.func.isRequired
    pledgeToVoteAction: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  render () {
    let i_stand_with_text = "I Stand With " + this.props.organization.organization_name;
    let i_stand_with_text_mobile = shortenText(i_stand_with_text, 32);

    return <span>
      <Button block
              bsSize={"large"}
              bsStyle={"danger"}
              onClick={() => { this.props.pledgeToVoteAction(); }} >
        <span className="voter-guide__pledge-to-support__i-stand-with-button hidden-xs">{i_stand_with_text}</span>
        <span className="voter-guide__pledge-to-support__i-stand-with-button visible-xs">{i_stand_with_text_mobile}</span>
      </Button>
    </span>;
  }
}
