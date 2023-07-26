import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';


class CampaignChipInLink extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  getCampaignXBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  render () {
    renderLog('CampaignChipInLink');  // Set LOG_RENDER_EVENTS to log all renders
    const { externalUniqueId } = this.props;
    return (
      <CampaignChipInLinkWrapper>
        <div>
          <Link
            className="u-cursor--pointer u-link-color u-link-underline-on-hover"
            id={`campaignChipInLink-${externalUniqueId}`}
            to={`${this.getCampaignXBasePath()}/pay-to-promote`}
          >
            Chip In to spread the word
          </Link>
        </div>
      </CampaignChipInLinkWrapper>
    );
  }
}
CampaignChipInLink.propTypes = {
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  externalUniqueId: PropTypes.string,
};

const CampaignChipInLinkWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

export default CampaignChipInLink;
