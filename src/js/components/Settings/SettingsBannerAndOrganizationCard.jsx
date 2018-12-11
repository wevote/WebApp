import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import OrganizationCard from "../VoterGuide/OrganizationCard";

export default class SettingsBannerAndOrganizationCard extends Component {
  static propTypes = {
    organization: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: {},
    };
  }

  componentDidMount () {
    // console.log("SettingsBannerAndOrganizationCard componentDidMount");
    this.setState({
      organization: this.props.organization,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("SettingsBannerAndOrganizationCard componentWillReceiveProps");
    this.setState({
      organization: nextProps.organization,
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.organization && !this.state.organization.organization_we_vote_id) {
      return null;
    }

    return (
      <div>
        { this.state.organization && this.state.organization.organization_banner_url && this.state.organization.organization_banner_url !== "" ? (
          <div className="organization-banner-image-div">
            <img className="organization-banner-image-img" src={this.state.organization.organization_banner_url} />
          </div>
        ) : null
        }
        {this.state.organization.organization_name && !this.state.organization.organization_name.startsWith("Voter-") ? (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-main">
                    <OrganizationCard
                      organization={this.state.organization}
                      turnOffTwitterHandle
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
        }
      </div>
    );
  }
}
