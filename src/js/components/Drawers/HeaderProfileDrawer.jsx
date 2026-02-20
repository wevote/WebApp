import {
  AccountCircle, CampaignRounded,
  ContentCopy, ExitToAppRounded, ImportContactsOutlined, Lock,
  LocationOn, Menu, SecurityRounded,
} from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import VoterSessionActions from '../../actions/VoterSessionActions';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import historyPush from '../../common/utils/historyPush';
import webAppConfig from '../../config';
import SettingsAddress from '../Settings/SettingsAddress';
import SettingsProfile from '../Settings/SettingsProfile';
import SettingsYourData from '../Settings/SettingsYourData';
import VoterStore from '../../stores/VoterStore';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import SettingsSectionFooter from '../Navigation/SettingsSectionFooter';
import SettingsNotifications from '../Settings/SettingsNotifications';
import { NavLinksContainer } from '../Style/drawerLayoutStyles';
import DrawerTemplateHeaderProfile from './DrawerTemplateHeaderProfile';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

// const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../common/components/SignIn/SignInOptionsPanel'));

function HeaderProfileDrawer () {
  const [headerFixedJsx] = useState(<></>);
  const [displayProfileOption, setDisplayProfileOption] = useState('nameAndPhoto');
  const [displayProfileComponent, setDisplayProfileComponent] = useState();
  const [headerProfileSectionSetFromAppContext, setHeaderProfileSectionSetFromAppContext] = useState(false);
  const [officialEmailCopied, setOfficialEmailCopied] = useState('');
  const [personalEmailCopied, setPersonalEmailCopied] = useState('');
  const [showLinksToProfilePages, setShowLinksToProfilePages] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const personViewedInDrawer = {}; // This is the person who is being viewed in the drawer
  // const personViewedInDrawerFullName = '';
  // const authenticatedPerson = {};

  const copyOfficialEmail = () => {
    setOfficialEmailCopied(true);
    setTimeout(() => {
      setOfficialEmailCopied(false);
    }, 1500);
  };

  const copyPersonalEmail = () => {
    setPersonalEmailCopied(true);
    setTimeout(() => {
      setPersonalEmailCopied(false);
    }, 1500);
  };

  // checks window width for responsiveness
  useEffect(() => {
    const handleWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowWidth);
    return () => window.removeEventListener('resize', handleWindowWidth);
  }, []);

  // useEffect(() => {
  //   setViewerIsThisAuthenticatedPerson(authenticatedPerson && getAppContextValue('profileDrawerPersonId') === authenticatedPerson.personId);
  // }, [getAppContextValue, authenticatedPerson]);

  let profileNavOptions = [
    { icon: <AccountCircle $isActive={String(displayProfileOption) === 'nameAndPhoto'} />, linkName: 'nameAndPhoto', linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'nameAndPhoto'}>Name & Photo</LinkSpan> },
  ];
  if (nextReleaseFeaturesEnabled) {
    profileNavOptions.push({ icon: <AddressIcon $isActive={String(displayProfileOption) === 'address'} />, linkName: 'address', linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'address'}>Ballot Address</LinkSpan> });
  }
  const profileNavOptions2 = [
    { icon: <SecurityIcon $isActive={String(displayProfileOption) === 'securityAndSignIn'} />, linkName: 'securityAndSignIn', linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'securityAndSignIn'}>Security &amp; Sign In</LinkSpan> },
    { icon: <PrivacyIcon $isActive={String(displayProfileOption) === 'yourData'} />, linkName: 'yourData', linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'yourData'}>Privacy &amp; Data</LinkSpan> },
    { icon: <NotificationsIcon $isActive={String(displayProfileOption) === 'notifications'} />, linkName: 'notifications', linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'notifications'}>Notifications</LinkSpan> },
  ];
  profileNavOptions = profileNavOptions.concat(profileNavOptions2);

  // useEffect to handle which component to display from nav
  useEffect(() => {
    let component = <></>;
    switch (displayProfileOption) {
      case 'nameAndPhoto':
        component = (
          <>
            {/* <ProfileComponentTitle>Name &amp; Photo</ProfileComponentTitle> */}
            <SettingsProfile externalUniqueId="headerProfileDrawer" />
          </>
        );
        break;
      case 'address':
        component = (
          <SettingsAddress externalUniqueId="headerProfileDrawer" />
        );
        break;
      case 'notifications':
        component = (
          <>
            {/* <ProfileComponentTitle>Availability</ProfileComponentTitle> */}
            <SettingsNotifications externalUniqueId="headerProfileDrawer" />
          </>
        );
        break;
      case 'securityAndSignIn':
        component = (
          <>
            {/* <ProfileComponentTitle>Security & Sign In</ProfileComponentTitle> */}
            <SignInOptionsPanel externalUniqueId="headerProfileDrawer" />
          </>
        );
        break;
      case 'yourData':
        component = (
          <SettingsYourData externalUniqueId="headerProfileDrawer" />
        );
        break;
      default:
        // console.log('In HeaderProfileDrawer useEffect default case');
        if (displayProfileOption !== 'nameAndPhoto') {
          setDisplayProfileOption('nameAndPhoto');
        }
    }
    setDisplayProfileComponent(component);
  }, [displayProfileOption]);

  const onCloseDrawer = () => {
    // console.log('HeaderProfileDrawer onCloseDrawer');
    AppObservableStore.setHeaderProfileSection('nameAndPhoto');
    setHeaderProfileSectionSetFromAppContext('unset');
    const drawerOpenGlobalVariableName = 'headerProfileDrawerOpen';
    AppObservableStore.setDrawerOpen(drawerOpenGlobalVariableName, false);
  };

  const sendGTMDataLayer = ({ buttonId, destinationPath = '', actionType = 'navigate' }) => {
    const destinationPage = lookupPageNameAndPageTypeDict(destinationPath);
    const dataLayerObject = {
      event: 'action',
      actionDetails: {
        actionType,
        buttonId,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
      pageDetails: getPageDetails(),
      destinationDetails: {
        destinationPageName: destinationPage.pageName || '',
        destinationPageType: destinationPage.pageType || '',
        destinationPathname: destinationPath,
      },
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  };

  const onImportContactsClick = (buttonId) => {
    sendGTMDataLayer({
      buttonId,
      destinationPath: '/findfriends/importcontacts',
    });
    historyPush('/findfriends/importcontacts');
    onCloseDrawer();
  };

  const linkNameToPathMap = {
    nameAndPhoto: '/settings/profile',
    address: '/settings/address',
    securityAndSignIn: '/settings/securityAndSignIn',
    yourData: '/settings/yourdata',
    notifications: '/settings/notifications',
  };

  const onNavLinkClick = (linkName) => {
    sendGTMDataLayer({
      buttonId: linkName,
      destinationPath: linkNameToPathMap[linkName] || `/settings/${linkName}`,
    });
    setDisplayProfileOption(linkName);
    setShowLinksToProfilePages(false);
  };

  const signOutApi = (buttonId) => {
    sendGTMDataLayer({
      buttonId,
      actionType: 'signOut',
    });
    const drawerOpenGlobalVariableName = 'headerProfileDrawerOpen';
    AppObservableStore.setDrawerOpen(drawerOpenGlobalVariableName, false);
    VoterSessionActions.voterSignOut();
  };

  const onAppObservableStoreChange = useCallback(() => {
    if (displayProfileOption && displayProfileOption !== headerProfileSectionSetFromAppContext) {
      setHeaderProfileSectionSetFromAppContext(AppObservableStore.getHeaderProfileSection());
      setDisplayProfileOption(AppObservableStore.getHeaderProfileSection());
    }
  }, [setDisplayProfileOption, setHeaderProfileSectionSetFromAppContext]);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  const linksToProfilePages = profileNavOptions.map((option) => (
    <NavLinkContainer
      selected={displayProfileOption === option.linkName}
      onClick={() => onNavLinkClick(option.linkName)}
      key={option.linkName}
    >
      {option.icon}
      <NavLink>
        {option.linkTextJsx}
      </NavLink>
    </NavLinkContainer>
  ));

  const ImportContactsJsx = (
    <NavLinkContainer
      id="importContactsButton"
      onClick={() => onImportContactsClick('importContactsButton')}
    >
      <ImportContactsIcon />
      <NavLink>
        Import&nbsp;Contacts
      </NavLink>
    </NavLinkContainer>
  );

  const SignOutJsx = (
    <NavLinkContainer
      id="signOutProfileDrawer"
      onClick={() => signOutApi('signOutProfileDrawer')}
    >
      <SignOutIcon />
      <NavLink>
        Sign Out
      </NavLink>
    </NavLinkContainer>
  );

  const headerTitleJSX = (
    <>
      {!showLinksToProfilePages && (
        <MenuIconWrapper onClick={() => setShowLinksToProfilePages(true)}>
          <Menu />
        </MenuIconWrapper>
      )}
      <YourAccountWrapper>
        <AccountCircleStyled />
        <div>Your Settings</div>
      </YourAccountWrapper>
      {windowWidth >= 768 && (
        <>
          {personViewedInDrawer.emailOfficial && (
            <HeaderProfileLink>
              <CopyToClipboard text={personViewedInDrawer.emailOfficial} onCopy={() => copyOfficialEmail()}>
                <CopyToClipboardContainer>
                  <ContentCopyStyled />
                  <ContentCopyText>{officialEmailCopied ? 'Copied!' : `${webAppConfig.ORGANIZATION_NAME || 'Official'} email`}</ContentCopyText>
                </CopyToClipboardContainer>
              </CopyToClipboard>
            </HeaderProfileLink>
          )}
          {windowWidth >= 900 && personViewedInDrawer.emailPersonal && (
            <HeaderProfileLink>
              <CopyToClipboard text={personViewedInDrawer.emailPersonal} onCopy={() => copyPersonalEmail()}>
                <CopyToClipboardContainer>
                  <ContentCopyStyled />
                  <ContentCopyText>{personalEmailCopied ? 'Copied!' : 'Personal email'}</ContentCopyText>
                </CopyToClipboardContainer>
              </CopyToClipboard>
            </HeaderProfileLink>
          )}
        </>
      )}
    </>
  );

  // main content logic for mobile or desktop
  const mainContentJsx = (
    <EditProfileDrawerWrapper>
      {windowWidth < 768 ? (
        <>
          {showLinksToProfilePages ? (
            <NavLinksContainer>
              {ImportContactsJsx}
              {linksToProfilePages}
              {SignOutJsx}
              <SettingsSectionFooterWrapper>
                <SettingsSectionFooter drawerOpenGlobalVariableName="headerProfileDrawerOpen" />
              </SettingsSectionFooterWrapper>
            </NavLinksContainer>
          ) : (
            <LinkComponentContainer>{displayProfileComponent}</LinkComponentContainer>
          )}
        </>
      ) : (
        <>
          <NavLinksContainer>
            {ImportContactsJsx}
            {linksToProfilePages}
            {SignOutJsx}
            <SettingsSectionFooterWrapper>
              <SettingsSectionFooter drawerOpenGlobalVariableName="headerProfileDrawerOpen" />
            </SettingsSectionFooterWrapper>
          </NavLinksContainer>
          <div>
            <LinkComponentContainer>{displayProfileComponent}</LinkComponentContainer>
          </div>
        </>
      )}
    </EditProfileDrawerWrapper>
  );

  return (
    <DrawerTemplateHeaderProfile
      drawerId="headerProfileDrawer"
      drawerOpenGlobalVariableName="headerProfileDrawerOpen"
      headerTitleJsx={headerTitleJSX}
      headerFixedJsx={headerFixedJsx}
      mainContentJsx={mainContentJsx}
      onDrawerClose={onCloseDrawer}
    />
  );
}

const AccountCircleStyled = styled(AccountCircle)`
  margin-right: 8px;
`;

const ContentCopyStyled = styled(ContentCopy)`
  height: 16px;
  margin: 0 4px;
  width: 16px;
`;

const ContentCopyText = styled('p')`
`;

const CopyToClipboardContainer = styled('div')`
  align-items: center;
  display: flex;
  height: 18px;
  justify-content: flex-start;
`;

const HeaderProfileLink = styled('div')`
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  font-size: 14px;
  font-weight: 300;
  margin-left: 24px;
  white-space: nowrap;
`;

const MenuIconWrapper = styled.button`
  display: none;

  @media (max-width: 768px) {
    align-items: center;
    border: none;
    color: ${DesignTokenColors.whiteUI};
    background: transparent;
    display: flex;
    border-right: 1px solid ${DesignTokenColors.whiteUI};
    justify-content: center;
    margin-right: 16px;
    padding: 4px 16px 4px 4px;
  }
`;

const EditProfileDrawerWrapper = styled('div')`
  display: flex;
  gap: 32px;
  margin-top: 80px;
  position: relative;
`;

const LinkComponentContainer = styled('div')`
  width: 100%;

  @media (min-width: 768px) {
    margin-left: 220px;
    width: 70%;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    width: calc(100% - 220px);
  }
`;

const LinkSpan = styled('span')`
  color: ${(props) => (props.$isActive ? `${DesignTokenColors.primary600}` : `${DesignTokenColors.neutral600}`)};
  font-size: '1rem';
  text-decoration: 'none';
`;

const NavLink = styled('div')`
  margin-left: 16px;
`;

const NavLinkContainer = styled('div')`
  align-items: center;
  background: ${(props) => (props.selected ? `${DesignTokenColors.primary50}` : 'transparent')};
  border-left: ${(props) => (props.selected ? `4px solid ${DesignTokenColors.primary600}` : '4px solid transparent')};
  border-radius: 0 20px 20px 0;
  color: ${(props) => (props.selected ? `${DesignTokenColors.primary600}` : `${DesignTokenColors.neutralUI600}`)};
  cursor: pointer;
  display: flex;
  height: 40px;
  padding-left: 16px;
  width: 210px;

  @media (max-width: 768px) {
    background: transparent;
    border-left: none;
    color: ${DesignTokenColors.neutralUI600};
  }
`;

// Please do not copy styles -- centralize them somewhere, so that same-named styles don't diverge,
// and so that we don't have to maintain them twice
// const NavLinksContainer = styled('div')`
//   display: flex;
//   flex-direction: column;
//   margin-left: -16px;
//   position: fixed;
// `;

// const ProfileComponentTitle = styled('div')`
//   font-size: 20px;
//   font-weight: 600;
//   margin-bottom: 16px;
// `;

const ImportContactsIcon = styled(ImportContactsOutlined)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
`;

const AddressIcon = styled(LocationOn)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
`;

const SecurityIcon = styled(Lock)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
`;

const PrivacyIcon = styled(SecurityRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
`;

const NotificationsIcon = styled(CampaignRounded)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
`;

const SignOutIcon = styled(ExitToAppRounded)`
  color: ${DesignTokenColors.neutralUI600};
`;

const SettingsSectionFooterWrapper = styled('div')`
  margin-top: 35px;
  padding-left: 15px;
`;

const YourAccountWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin-right: 16px;
  width: 100%;
`;

export default HeaderProfileDrawer;
