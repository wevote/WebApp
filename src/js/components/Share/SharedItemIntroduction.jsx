import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { cordovaDot } from '../../utils/cordovaUtils';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';
import { renderLog } from '../../utils/logging';
import ImageHandler from '../ImageHandler';
import ReadMore from '../Widgets/ReadMore';

class SharedItemIntroduction extends Component {
  static propTypes = {
    friendFirstName: PropTypes.string,
    friendLastName: PropTypes.string,
    friendImageUrlHttpsTiny: PropTypes.string,
    invitationMessage: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('SharedItemIntroduction');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendFirstName, friendLastName, invitationMessage, friendImageUrlHttpsTiny } = this.props;
    return (
      <Wrapper>
        <WeVoteLogoWrapper>
          <img
            className="header-logo-img"
            alt="We Vote logo"
            src={cordovaDot(logoDark)}
          />
        </WeVoteLogoWrapper>
        <FriendInvitationTopHeader>
          {friendFirstName ? (
            <>
              <div>
                Invitation from friend
                {friendFirstName && (
                  <>
                    {' '}
                    from
                    {' '}
                    {friendFirstName}
                    {friendLastName && (
                      <>
                        {' '}
                        {friendLastName}
                      </>
                    )}
                  </>
                )}
                {' '}
                accepted!
              </div>
              {invitationMessage && (
                <InvitationMessageWrapper>
                  <InvitationMessageDescription>
                    {friendImageUrlHttpsTiny && (
                      <OrganizationImageWrapper>
                        <ImageHandler
                          sizeClassName="image-24x24 "
                          imageUrl={friendImageUrlHttpsTiny}
                          alt="organization-photo"
                          kind_of_ballot_item="ORGANIZATION"
                        />
                      </OrganizationImageWrapper>
                    )}
                    <ReadMore
                      textToDisplay={invitationMessage}
                      numberOfLines={3}
                    />
                  </InvitationMessageDescription>
                </InvitationMessageWrapper>
              )}
            </>
          ) : (
            <>
              Welcome!
            </>
          )}
        </FriendInvitationTopHeader>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <div>
            <FriendInvitationIntroHeader>
              <>
                We Vote makes being a voter easier:
              </>
            </FriendInvitationIntroHeader>
            <FriendInvitationListOuterWrapper>
              <div>
                <FriendInvitationList>
                  <FriendInvitationListRow>
                    <Dot>&bull;</Dot>
                    <ListText>See what&apos;s on your ballot</ListText>
                  </FriendInvitationListRow>
                  <FriendInvitationListRow>
                    <Dot>&bull;</Dot>
                    <ListText>Learn about the candidates and issues from friends you trust</ListText>
                  </FriendInvitationListRow>
                  <FriendInvitationListRow>
                    <Dot>&bull;</Dot>
                    <ListText>Help your other friends be empowered voters</ListText>
                  </FriendInvitationListRow>
                </FriendInvitationList>
              </div>
            </FriendInvitationListOuterWrapper>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
});

const Wrapper = styled.div`
  padding-left: 12px;
  padding-right: 12px;
`;

const InvitationMessageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const InvitationMessageDescription = styled.div`
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #808080;
  flex: 1 1 0;
  font-size: 16px;
  font-weight: 400;
  list-style: none;
  margin-top: 8px;
  max-width: 400px;
  padding: 12px 6px;
`;

const FriendInvitationTopHeader = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  padding-top: 6px;
  padding-bottom: 0;
  @include breakpoints (max mid-small) {
    font-size: 20px;
  }
`;

// Styled divs are not working in react-slick environment, so I put these styles in _intro-story.scss
const FriendInvitationIntroHeader = styled.div`
`;

const FriendInvitationListOuterWrapper = styled.div`
  display: flex !important;
  justify-content: center !important;
`;

const FriendInvitationList = styled.div`
  max-width: 350px;
`;

const FriendInvitationListRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  text-align: left;
`;

const Dot = styled.div`
  padding: 6px 8px;
  vertical-align: top;
`;

const ListText = styled.div`
  font-weight: 600;
  padding: 6px 8px;
  vertical-align: top;
`;

const OrganizationImageWrapper = styled.span`
  padding-right: 4px;
`;

const WeVoteLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(SharedItemIntroduction));
