import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import { capitalizeString } from "../utils/textFormat";
import Helmet from "react-helmet";
import OrganizationActions from "../actions/OrganizationActions";
import OrganizationStore from "../stores/OrganizationStore";
import OrganizationPositionItem from "../components/VoterGuide/OrganizationPositionItem";
import LoadingWheel from "../components/LoadingWheel";

/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */

export default class VoterGuidesPositions extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization_we_vote_id: this.props.organization_we_vote_id,
    };
  }

  componentDidMount (){
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));

    var { organization_we_vote_id } = this.state;
    // Positions for this organization, for this voter / election
    OrganizationActions.retrievePositions(organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.retrievePositions(organization_we_vote_id, false, true);
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    this.setState({
      organization: OrganizationStore.get(this.state.organization_we_vote_id),
    });
  }

  render () {
    if (!this.state.organization){
      return <div>{LoadingWheel}</div>;
    }

    const { organization_id, position_list_for_one_election, position_list_for_all_except_one_election } = this.state.organization;
    if (!organization_id) {
      var floatRight = {
        float: "right"
      };
      return <div className="card">
          <div className="card-main">
            <h4 className="h4">Organization not Found</h4>
          </div>
          <div style={{margin: 10}}>
            <span style={floatRight}>
              <Link to="/opinions"><Button bsStyle="primary">Next &#x21AC;</Button></Link>
            </span>
            <p>Find voter guides you can follow. These voter guides have been created by nonprofits, public figures, your friends, and more.</p>
          </div>
        </div>;
    }

    let organization_name = capitalizeString(this.state.organization.organization_name);
    let title_text = organization_name + " - We Vote";
    let description_text = "See endorsements and opinions from " + organization_name + " for the November election";

    return <div className="opinions-followed__container">
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
      <div className="card">
        <ul className="card-child__list-group">
          { position_list_for_one_election ?
            <span>
              { position_list_for_one_election.length ?
                <span>
                  <h4 className="card__additional-heading">Position for Election</h4>
                </span> :
                null
              }
              { position_list_for_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                               position={item}
                                               organization={this.state.organization}
                                                />;
              }) }
            </span> :
            <div>{LoadingWheel}</div>
          }
          { position_list_for_all_except_one_election ?
            <span>
              { position_list_for_all_except_one_election.length ?
                <span>
                  <h4 className="card__additional-heading">Positions for Other Elections</h4>
                </span> :
                null
              }
              { position_list_for_all_except_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization}
                                                  />;
              }) }
            </span> :
            <div>{LoadingWheel}</div>
          }
          { position_list_for_one_election && position_list_for_all_except_one_election &&
            position_list_for_one_election.length === 0 && position_list_for_all_except_one_election.length === 0 ?
            <div style={{margin: 10}}>
              <span style={floatRight}>
                <p>  Find voter guides you can follow.
                  These voter guides have been created by nonprofits, public figures, your friends, and more.</p>
                <Link to="/opinions"><Button bsStyle="primary">Next &#x21AC;</Button></Link>
              </span>
            </div> :
            null
          }
          </ul>
      </div>
    </div>;
  }
}
