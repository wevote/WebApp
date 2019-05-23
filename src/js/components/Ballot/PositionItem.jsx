import React, { Component } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import moment from 'moment';
import ImageHandler from '../ImageHandler';
// import FriendsOnlyIndicator from '../Widgets/FriendsOnlyIndicator';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeIndividual, isSpeakerTypeOrganization } from '../../utils/organization-functions';
import OrganizationPopoverCard from '../Organization/OrganizationPopoverCard';
import ReadMore from '../Widgets/ReadMore';
// import PositionRatingSnippet from '../Widgets/PositionRatingSnippet';
// import PositionInformationOnlySnippet from '../Widgets/PositionInformationOnlySnippet';
// import PositionSupportOpposeSnippet from '../Widgets/PositionSupportOpposeSnippet';
import FollowToggle from '../Widgets/FollowToggle';


class PositionItem extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    organization: PropTypes.object, // .isRequired,
    position: PropTypes.object.isRequired,
  };

  static closePopover () {
    document.body.click();
  }

  render () {
    renderLog(__filename);
    const { position } = this.props;
    // console.log('PositionItem render, position:', position);
    // const dateStr = position.last_updated;
    // const dateText = moment(dateStr).startOf('day').fromNow();
    // TwitterHandle-based link
    const voterGuideWeVoteIdLink = position.organization_we_vote_id ? `/voterguide/${position.organization_we_vote_id}` : `/voterguide/${position.speaker_we_vote_id}`;
    const speakerLink = position.speaker_twitter_handle ? `/${position.speaker_twitter_handle}` : voterGuideWeVoteIdLink;

    let imagePlaceholder = '';
    if (isSpeakerTypeOrganization(position.speaker_type)) {
      imagePlaceholder = <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color" />;
    } else if (isSpeakerTypeIndividual(position.speaker_type)) {
      imagePlaceholder = <i className="icon-org-lg icon-icon-person-placeholder-6-1 icon-org-resting-color" />;
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

    console.log(supportOpposeInfo);
    const positionDescription = (
      <ReadMore
        num_of_lines={3}
        text_to_display={position.statement_text}
      />
    );

    // const isOnBallotItemPage = true;
    // if (position.vote_smart_rating) {
    //   positionDescription =
    //     <PositionRatingSnippet {...position} />;
    // } else if (position.is_support || position.is_oppose) {
    //   positionDescription = <PositionSupportOpposeSnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
    // } else if (position.is_information_only) {
    //   positionDescription = <PositionInformationOnlySnippet {...position} is_on_ballot_item_page={isOnBallotItemPage} />;
    // } else if (isSpeakerTypeIndividual(position.speaker_type)) {
    //   positionDescription = (
    //     <p className="">
    //       <span>{this.props.ballotItemDisplayName}</span>
    //       <span className="small">
    //         {' '}
    //         { dateText }
    //       </span>
    //     </p>
    //   );
    // }

    const showPosition = true;
    const nothingToDisplay = null;
    const organizationWeVoteId = position.organization_we_vote_id || position.speaker_we_vote_id;

    if (showPosition) {
      const organizationCardPopover = (
        <Popover
          id="positions-popover-trigger-click-root-close"
          onClick={PositionItem.closePopover}
        >
          <OrganizationPopoverCard organizationWeVoteId={organizationWeVoteId} />
        </Popover>
      );

      return (
        <React.Fragment>
          <div className="u-show-desktop-tablet">
            <DesktopContainer>
              <DesktopItemLeft>
                <DesktopItemImage>
                  <OverlayTrigger
                    delay={{ show: 700, hide: 100 }}
                    trigger={['hover', 'focus']}
                    rootClose
                    placement="bottom"
                    overlay={organizationCardPopover}
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
                  </OverlayTrigger>
                </DesktopItemImage>
                <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing />
              </DesktopItemLeft>
              <PositionItemDesktop className={`position-item--${supportOpposeInfo} position-item`}>
                <DesktopItemHeader>
                  <DesktopItemNameIssueContainer>
                    <DesktopItemName>
                      <Link to={speakerLink}>
                        { position.speaker_display_name }
                      </Link>
                    </DesktopItemName>
                    <DesktopItemIssues>Issues go here</DesktopItemIssues>
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
                            <i className="fa fa-thumbs-up" />
                          </Support>
                        ) : (
                          <React.Fragment>
                            {supportOpposeInfo === 'oppose' ? (
                              <Oppose>
                                <i className="fa fa-thumbs-down" />
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
                    <strong>Was this Useful?</strong>
                    Yes  No
                    <div className="u-float-right">
                      Flag Links
                    </div>
                  </DesktopItemFooter>
                </DesktopItemBody>
              </PositionItemDesktop>
            </DesktopContainer>
          </div>
          <div className="u-show-mobile">
            <PositionItemMobile className={`position-item--${supportOpposeInfo} position-item`}>
              <MobileItemHeader>
                <MobileItemImage>
                  <OverlayTrigger
                    delay={{ show: 700, hide: 100 }}
                    trigger={['hover', 'focus']}
                    rootClose
                    placement="bottom"
                    overlay={organizationCardPopover}
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
                  </OverlayTrigger>
                </MobileItemImage>
                <MobileItemNameIssueContainer>
                  <MobileItemName>
                    <Link to={speakerLink}>
                      { position.speaker_display_name }
                    </Link>
                  </MobileItemName>
                  <MobileItemIssues>Issues go here</MobileItemIssues>
                </MobileItemNameIssueContainer>
                <MobileItemFollowToggle>
                  <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing />
                </MobileItemFollowToggle>
              </MobileItemHeader>
              <MobileItemBody>
                <MobileItemDescriptionEndorsementContainer>
                  <MobileItemDescription>
                    {positionDescription}
                  </MobileItemDescription>
                  <MobileItemEndorsementDisplay>
                    {supportOpposeInfo === 'supportFollow' ? (
                      <SupportFollow>
                        +1
                      </SupportFollow>
                    ) : (
                      <React.Fragment>
                        {supportOpposeInfo === 'support' ? (
                          <Support>
                            <i className="fa fa-thumbs-up" />
                          </Support>
                        ) : (
                          <React.Fragment>
                            {supportOpposeInfo === 'oppose' ? (
                              <Oppose>
                                <i className="fa fa-thumbs-down" />
                              </Oppose>
                            ) : (
                              null
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </MobileItemEndorsementDisplay>
                </MobileItemDescriptionEndorsementContainer>
                <MobileItemFooter>
                  <strong>Was this Useful?</strong>
                  Yes  No
                  <div className="u-float-right">
                    Flag Links
                  </div>
                </MobileItemFooter>
              </MobileItemBody>
            </PositionItemMobile>
          </div>
        </React.Fragment>

      // <PositionItemListItem className="card-child position-item">
      //   {/* One Position on this Candidate */}
      //   <div className="card-child__media-object-anchor">
      //     <OverlayTrigger
      //       delay={{ show: 700, hide: 100 }}
      //       trigger={['hover', 'focus']}
      //       rootClose
      //       placement="bottom"
      //       overlay={organizationCardPopover}
      //     >
      //       <Link to={speakerLink} className="u-no-underline">
      //         { position.speaker_image_url_https_medium ? (
      //           <ImageHandler
      //             className="card-child__avatar"
      //             sizeClassName="icon-lg"
      //             imageUrl={position.speaker_image_url_https_medium}
      //           />
      //         ) :
      //           imagePlaceholder }
      //       </Link>
      //     </OverlayTrigger>
      //     <FollowToggle organizationWeVoteId={organizationWeVoteId} lightModeOn hideDropdownButtonUntilFollowing />
      //   </div>
      //   <div className="card-child__media-object-content">
      //     <div className="card-child__content">
      //       <div className="u-flex">
      //         <h4 className="card-child__display-name">
      //           <OverlayTrigger
      //             delay={{ show: 700, hide: 100 }}
      //             trigger={['hover', 'focus']}
      //             rootClose
      //             placement="bottom"
      //             overlay={organizationCardPopover}
      //           >
      //             <Link to={speakerLink}>
      //               { position.speaker_display_name }
      //             </Link>
      //           </OverlayTrigger>
      //         </h4>
      //         <FriendsOnlyIndicator isFriendsOnly={!position.is_public_position} />
      //       </div>
      //       {positionDescription}
      //     </div>
      //   </div>
      // </PositionItemListItem>
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
`;

const MobileItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 0 16px 8px;
`;

const MobileItemImage = styled.div`
  margin-right: 8px;
  width: 50px;
  height: 50px;
  * {
    border-radius: 50px;
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

const MobileItemFollowToggle = styled.div`
  margin-left: auto;
`;

const MobileItemBody = styled.div`
  padding: 16px;
  background: #f7f7f7;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 5px;
`;

const MobileItemDescriptionEndorsementContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  left: 2px;
`;

const MobileItemDescription = styled.div`
  font-size: 16px;
  color: #333;
  flex: 1 1 0;
`;

const MobileItemEndorsementDisplay = styled.div`
  width: 15%;
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
  width: 75px;
  padding: 0 8px 0 0;
`;

const DesktopItemImage = styled.div`
  width: 45px;
  margin: 0 auto;
  height: 45px;
  margin-bottom: 8px;
  * {
    border-radius: 45px;
  }
`;

const PositionItemDesktop = styled.div`
  border-radius: 5px;
  list-style: none;
  padding: 16px;
  background: #f7f7f7;
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

const DesktopItemDescription = styled.p`
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
