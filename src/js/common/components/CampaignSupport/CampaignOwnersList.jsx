import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import CampaignStore from '../../stores/CampaignStore';


class CampaignOwnersList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXOwnerList: [],
    };
  }

  componentDidMount () {
    const { campaignXWeVoteId, compressedMode } = this.props;
    // console.log('CampaignOwnersList, componentDidMount campaignXWeVoteId:', campaignXWeVoteId);
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const campaignXLeadOwnerProfilePhoto = CampaignStore.getCampaignXLeadOwnerProfilePhoto(campaignXWeVoteId, compressedMode);
    const campaignXOwnerList = CampaignStore.getCampaignXOwnerList(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    this.setState({
      campaignXLeadOwnerProfilePhoto,
      campaignXOwnerList,
      campaignXPoliticianList,
    });
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId, compressedMode } = this.props;
    // console.log('CampaignOwnersList, componentDidMount campaignXWeVoteId:', campaignXWeVoteId);
    const campaignXLeadOwnerProfilePhoto = CampaignStore.getCampaignXLeadOwnerProfilePhoto(campaignXWeVoteId, compressedMode);
    const campaignXOwnerList = CampaignStore.getCampaignXOwnerList(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    // console.log('onCampaignStoreChange campaignXOwnerList: ', campaignXOwnerList);
    this.setState({
      campaignXLeadOwnerProfilePhoto,
      campaignXOwnerList,
      campaignXPoliticianList,
    });
  }

  render () {
    renderLog('CampaignOwnersList');  // Set LOG_RENDER_EVENTS to log all renders

    const { compressedMode } = this.props;
    const { campaignXOwnerList, campaignXLeadOwnerProfilePhoto, campaignXPoliticianList } = this.state;
    // console.log('render CampaignOwnersList campaignXOwnerList ', campaignXOwnerList);
    if (!campaignXOwnerList || campaignXOwnerList.length === 0) {
      return null;
    }
    let campaignXOwnerNumber = 0;
    let campaignXPoliticianNumber = 0;
    let commaOrNot;
    return (
      <Wrapper>
        <ColumnFullWidth>
          <CampaignXOwnerListWrapper>
            {campaignXLeadOwnerProfilePhoto && (
              <CampaignXOwnerLeadPhoto src={campaignXLeadOwnerProfilePhoto} width="32px" height="32px" />
            )}
            <CampaignXOwnerWrapper compressedMode={compressedMode}>
              {campaignXOwnerList.length === 1 ? (
                <>
                  {!stringContains('Voter-', campaignXOwnerList[0].organization_name) && campaignXOwnerList[0].organization_name}
                </>
              ) : (
                <>
                  { campaignXOwnerList.map((campaignXOwner) => {
                    campaignXOwnerNumber += 1;
                    if (campaignXOwnerNumber >= campaignXOwnerList.length) {
                      return (
                        <span key={campaignXOwnerNumber}>
                          {!stringContains('Voter-', campaignXOwner.organization_name) && (
                            <>
                              {' '}
                              and
                              {' '}
                              {campaignXOwner.organization_name}
                            </>
                          )}
                        </span>
                      );
                    } else {
                      commaOrNot = (campaignXOwnerNumber === campaignXOwnerList.length - 1) ? '' : ',';
                      return (
                        <span key={campaignXOwnerNumber}>
                          {!stringContains('Voter-', campaignXOwner.organization_name) && (
                            <>
                              {' '}
                              {campaignXOwner.organization_name}
                              {commaOrNot}
                            </>
                          )}
                        </span>
                      );
                    }
                  })}
                </>
              )}
              {' '}
              started this campaign to support
              {' '}
              {campaignXPoliticianList.length === 1 ? (
                <>
                  {campaignXPoliticianList[0].politician_name}
                </>
              ) : (
                <>
                  { campaignXPoliticianList.map((campaignXPolitician) => {
                    campaignXPoliticianNumber += 1;
                    if (campaignXPoliticianNumber >= campaignXPoliticianList.length) {
                      return (
                        <span key={campaignXPoliticianNumber}>
                          {' '}
                          and
                          {' '}
                          {campaignXPolitician.politician_name}
                        </span>
                      );
                    } else {
                      commaOrNot = (campaignXPoliticianNumber === campaignXPoliticianList.length - 1) ? '' : ',';
                      return (
                        <span key={campaignXPoliticianNumber}>
                          {' '}
                          {campaignXPolitician.politician_name}
                          {commaOrNot}
                        </span>
                      );
                    }
                  })}
                </>
              )}
            </CampaignXOwnerWrapper>
          </CampaignXOwnerListWrapper>
        </ColumnFullWidth>
      </Wrapper>
    );
  }
}
CampaignOwnersList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  compressedMode: PropTypes.bool,
};

const styles = () => ({
});

const CampaignXOwnerListWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: start;
`;

const CampaignXOwnerLeadPhoto = styled('img')`
  border-radius: 3px;
  margin-right: 8px;
`;

const CampaignXOwnerWrapper = styled('span', {
  shouldForwardProp: (prop) => !['compressedMode'].includes(prop),
})(({ compressedMode }) => (`
  ${compressedMode ? 'font-size: 12px;' : ''};
`));

const ColumnFullWidth = styled('div')`
  padding: 8px 8px 0 0;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: 0;
`;

export default withStyles(styles)(CampaignOwnersList);
