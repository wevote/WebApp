import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ImageHandler from '../ImageHandler';
import IssuesByOrganizationDisplayList from '../Values/IssuesByOrganizationDisplayList';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import ReadMore from '../Widgets/ReadMore';
import FollowToggle from '../Widgets/FollowToggle';
import StickyPopover from './StickyPopover';

class PositionItem extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    // organization: PropTypes.object, // .isRequired,
    position: PropTypes.object.isRequired,
  };

  shouldComponentUpdate (nextProps) {
    if (this.props.ballotItemDisplayName !== nextProps.ballotItemDisplayName) {
      return true;
    }
    const { position: priorPosition } = this.props;
    const { position: nextPosition } = nextProps;
    if (priorPosition.speaker_we_vote_id !== nextPosition.speaker_we_vote_id) {
      return true;
    }
    if (priorPosition.organization_we_vote_id !== nextPosition.organization_we_vote_id) {
      return true;
    }
    if (priorPosition.statement_text !== nextPosition.statement_text) {
      return true;
    }
    if (priorPosition.speaker_twitter_handle !== nextPosition.speaker_twitter_handle) {
      return true;
    }
    if (priorPosition.is_information_only !== nextPosition.is_information_only) {
      return true;
    }
    if (priorPosition.is_oppose !== nextPosition.is_oppose) {
      return true;
    }
    if (priorPosition.is_support !== nextPosition.is_support) {
      return true;
    }
    if (priorPosition.followed !== nextPosition.followed) {
      return true;
    }
    return false;
  }

  render () {
    renderLog(__filename);
    const { position } = this.props;
    // console.log('PositionItem render, position:', position);
    // TwitterHandle-based link
    const voterGuideWeVoteIdLink = position.organization_we_vote_id ? `/voterguide/${position.organization_we_vote_id}` : `/voterguide/${position.speaker_we_vote_id}`;
    const speakerLink = position.speaker_twitter_handle ? `/${position.speaker_twitter_handle}` : voterGuideWeVoteIdLink;

    let imagePlaceholder = '';
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      imagePlaceholder = <i className="icon-45 icon-icon-org-placeholder-6-2 icon-org-resting-color" />;
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      imagePlaceholder = <i className="icon-45 icon-icon-person-placeholder-6-1 icon-org-resting-color" />;
    }

    // console.log(position);
    let supportOpposeInfo = 'info';

    if (position.is_information_only) {
      supportOpposeInfo = 'info';
    } else if (position.followed && position.is_support) {
      supportOpposeInfo = 'supportFollow';
    } else if (!position.followed && position.is_support) {
      supportOpposeInfo = 'support';
    } else if (!position.support) {
      supportOpposeInfo = 'oppose';
    }

    // console.log('PositionItem supportOpposeInfo: ', supportOpposeInfo);
    const positionDescription = position.statement_text && (
      <ReadMore
        num_of_lines={3}
        text_to_display={position.statement_text}
      />
    );

    const showPosition = true;
    const nothingToDisplay = null;
    const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;

    if (showPosition) {
      const organizationPopoverCard = (<OrganizationPopoverCard organizationWeVoteId={organizationWeVoteId} />);
      let moreInfoUrl = position.more_info_url;
      if (moreInfoUrl) {
        if (!moreInfoUrl.toLowerCase().startsWith('http')) {
          moreInfoUrl = `http://${moreInfoUrl}`;
        }
      }
      return (
        <React.Fragment>
          <div className="u-show-desktop-tablet">
            <DesktopContainer>
              <DesktopItemLeft>
                <DesktopItemImage>
                  <StickyPopover
                    delay={{ show: 700, hide: 100 }}
                    popoverComponent={organizationPopoverCard}
                    placement="bottom"
                    id="positions-popover-trigger-click-root-close"
                  >
                    <Link to={speakerLink} className="u-no-underline">
                      { position.speaker_image_url_https_medium ? (
                        <ImageHandler
                          className="card-child__avatar"
                          sizeClassName="icon-lg"
                          imageUrl={position.speaker_image_url_https_medium}
                        />
                      ) :
                        imagePlaceholder }
                    </Link>
                  </StickyPopover>
                </DesktopItemImage>
                <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing anchorLeft />
              </DesktopItemLeft>
              <PositionItemDesktop className={`position-item--${supportOpposeInfo} position-item`}>
                <DesktopItemHeader>
                  <DesktopItemNameIssueContainer>
                    <DesktopItemName>
                      <StickyPopover
                        delay={{ show: 700, hide: 100 }}
                        popoverComponent={organizationPopoverCard}
                        placement="bottom"
                        id="positions-popover-trigger-click-root-close"
                      >
                        <Link to={speakerLink}>
                          { position.speaker_display_name }
                        </Link>
                      </StickyPopover>
                    </DesktopItemName>
                    <DesktopItemIssues>
                      <IssuesByOrganizationDisplayList
                        organizationWeVoteId={organizationWeVoteId}
                        placement="bottom"
                      />
                    </DesktopItemIssues>
                  </DesktopItemNameIssueContainer>
                  <DesktopItemEndorsementDisplay>
                    {supportOpposeInfo === 'supportFollow' ? (
                      <SupportFollow>
                        +1
                      </SupportFollow>
                    ) : (
                      <React.Fragment>
                        {supportOpposeInfo === 'support' ? (
                          <Support>
                            <ThumbUpIcon />
                          </Support>
                        ) : (
                          <React.Fragment>
                            {supportOpposeInfo === 'oppose' ? (
                              <Oppose>
                                <ThumbDownIcon />
                              </Oppose>
                            ) : (
                              null
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </DesktopItemEndorsementDisplay>
                </DesktopItemHeader>
                <DesktopItemBody>
                  <DesktopItemDescription>
                    {positionDescription}
                  </DesktopItemDescription>
                  <DesktopItemFooter>
                    {/* <strong>Was this Useful?</strong>
                    Yes  No
                    <div className="u-float-right">
                      Flag Links
                    </div> */}
                    {moreInfoUrl ? (
                      <div className="u-float-right">
                        <OpenExternalWebSite
                          url={moreInfoUrl}
                          target="_blank"
                          className="u-gray-mid"
                          body={(
                            <span>
                              view source
                              {' '}
                              <i className="fas fa-external-link-alt" aria-hidden="true" />
                            </span>
                          )}
                        />
                      </div>
                    ) : null
                    }
                  </DesktopItemFooter>
                </DesktopItemBody>
              </PositionItemDesktop>
            </DesktopContainer>
          </div>
          <div className="u-show-mobile">
            <PositionItemMobile className={`position-item--${supportOpposeInfo} position-item`}>
              <MobileItemHeader>
                <MobileItemImage>
                  <Link to={speakerLink} className="u-no-underline">
                    { position.speaker_image_url_https_medium ? (
                      <ImageHandler
                        className="card-child__avatar"
                        sizeClassName="icon-lg"
                        imageUrl={position.speaker_image_url_https_medium}
                      />
                    ) :
                      imagePlaceholder }
                  </Link>
                </MobileItemImage>
                <MobileItemNameIssueContainer>
                  <MobileItemName>
                    <Link to={speakerLink}>
                      { position.speaker_display_name }
                    </Link>
                  </MobileItemName>
                  <MobileItemIssues>
                    <IssuesByOrganizationDisplayList
                      organizationWeVoteId={organizationWeVoteId}
                      placement="bottom"
                    />
                  </MobileItemIssues>
                </MobileItemNameIssueContainer>
                <MobileItemEndorsementContainer>
                  <MobileItemEndorsementDisplay>
                    {supportOpposeInfo === 'supportFollow' ? (
                      <SupportFollow>
                        +1
                      </SupportFollow>
                    ) : (
                      <React.Fragment>
                        {supportOpposeInfo === 'support' ? (
                          <Support>
                            <ThumbUpIcon />
                          </Support>
                        ) : (
                          <React.Fragment>
                            {supportOpposeInfo === 'oppose' ? (
                              <Oppose>
                                <ThumbDownIcon />
                              </Oppose>
                            ) : (
                              null
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </MobileItemEndorsementDisplay>
                </MobileItemEndorsementContainer>
              </MobileItemHeader>
              <MobileItemBody>
                <MobileItemDescriptionFollowTogglContainer>
                  <MobileItemDescription>
                    {positionDescription}
                  </MobileItemDescription>
                  <MobileItemFollowToggleDisplay>
                    <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing />
                  </MobileItemFollowToggleDisplay>
                </MobileItemDescriptionFollowTogglContainer>
                <MobileItemFooter>
                  {/* <strong>Was this Useful?</strong>
                  Yes  No
                  <div className="u-float-right">
                    Flag Links
                  </div> */}
                  {moreInfoUrl ? (
                    <div className="u-float-right">
                      <OpenExternalWebSite
                        url={moreInfoUrl}
                        target="_blank"
                        className="u-gray-mid"
                        body={(
                          <span>
                            source
                            {' '}
                            <i className="fas fa-external-link-alt" aria-hidden="true" />
                          </span>
                        )}
                      />
                    </div>
                  ) : null
                  }
                </MobileItemFooter>
              </MobileItemBody>
            </PositionItemMobile>
          </div>
        </React.Fragment>
      );
    } else {
      return nothingToDisplay;
    }
  }
}

const PositionItemMobile = styled.li`
  border-radius: 5px;
  margin: 16px;
  list-style: none;
  @media (max-width: 476px) {
    margin: 16px 0;
  }
`;

const MobileItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px 0 16px 8px;
`;

const MobileItemImage = styled.div`
  margin-right: 16px;
  width: 50px;
  height: 50px;
  * {
    border-radius: 50px;
    width: 50px !important;
    height: 50px !important;
    max-width: 50px !important;
    display: flex;
    align-items: flex-start;
    &::before {
      font-size: 50px !important;
    }
  }
`;

const MobileItemNameIssueContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const MobileItemName = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const MobileItemIssues = styled.div`
  margin: 0;
  font-size: 14px;
`;

const MobileItemEndorsementContainer = styled.div`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

const MobileItemEndorsementDisplay = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: calc(50px + 16px);
`;

const MobileItemBody = styled.div`
  padding: 16px;
  background: #f7f7f7;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 5px;
`;

const MobileItemDescriptionFollowTogglContainer = styled.div`
  left: 2px;
  display: flex;
  justify-content: space-between;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  color: #333;
  flex: 1 1 0;
`;

const MobileItemFollowToggleDisplay = styled.div`
  width: 75px;
`;

const MobileItemFooter = styled.div`
  padding-top: 4px;
`;

const DesktopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px;
`;

const DesktopItemLeft = styled.div`
  width: 85px;
  padding: 0 16px 0 0;
`;

const DesktopItemImage = styled.div`
  width: 57.76px;
  margin: 0 auto;
  height: 57.76px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 8px;
  * {
    border-radius: 57.76px;
    width: 57.76px !important;
    height: 57.76px !important;
    max-width: 57.76px !important;
    display: flex;
    align-items: flex-start;
  }
`;

const PositionItemDesktop = styled.div`
  border-radius: 5px;
  list-style: none;
  padding: 16px;
  background: #f7f7f7;
  flex: 1 1 0;
`;

const DesktopItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const DesktopItemNameIssueContainer = styled.div`
  padding: 0px;
`;

const DesktopItemName = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const DesktopItemIssues = styled.div`
  margin: 0;
`;

const DesktopItemEndorsementDisplay = styled.div`
  margin-left: auto;
  padding: 0;
`;

const DesktopItemBody = styled.div`
  margin: 0;
`;

const DesktopItemDescription = styled.div`
  font-size: 14px;
  margin-top: 8px;
`;

const DesktopItemFooter = styled.div`
  margin-top: 8px;
  font-size: 14px;
`;

const SupportFollow = styled.div`
  color: white;
  background: #1fc06f;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  float: right;
  font-size: 16px;
  font-weight: bold;
`;

const Support = styled.div`
  color: #1fc06f;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 3px solid #1fc06f;
  float: right;
  font-size: 20px;
  font-weight: bold;
`;

const Oppose = styled.div`
  color: red;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  float: right;
  border: 3px solid red;
  font-size: 20px;
  font-weight: bold;
`;

export default PositionItem;
