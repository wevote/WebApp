import {
  AccountCircle, CampaignRounded,
  ContentCopy, ImportContactsOutlined, Launch, Lock,
  Menu, SecurityRounded,
} from '@mui/icons-material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import DrawerTemplateHeaderProfile from './DrawerTemplateHeaderProfile';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import SettingsNameAndPhoto from '../PoliticianSelfEdit/SettingsNameAndPhoto';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import PoliticianStore from '../../common/stores/PoliticianStore';
import VoterStore from '../../stores/VoterStore';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import SettingsNotifications from '../Settings/SettingsNotifications';
import SettingsSectionFooter from '../Navigation/SettingsSectionFooter';
import historyPush from '../../common/utils/historyPush';
import manageCandidates from '../../../img/global/svg-icons/manage-candidates.svg';
import viewCandidate from '../../../img/global/svg-icons/view-candidate.svg';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

// const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const PoliticianSelfEditDrawer = () => {
  const [headerFixedJsx] = useState(<></>);
  const [displayProfileOption, setDisplayProfileOption] = useState('nameAndPhoto');
  const [displayProfileComponent, setDisplayProfileComponent] = useState();
  const [headerProfileSectionSetFromAppContext, setHeaderProfileSectionSetFromAppContext] = useState(false);
  const [isOnManagePage, setIsOnManagePage] = useState(true);
  const [politician, setPolitician] = useState({});
  const [politicianWeVoteId, setPoliticianWeVoteId] = useState('');
  const [showLinksToProfilePages, setShowLinksToProfilePages] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const politicianWeVoteIdRef = useRef(politicianWeVoteId);

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

  const profileNavOptions = [
    {
      icon: <AccountCircle $isActive={String(displayProfileOption) === 'nameAndPhoto'} />,
      linkName: 'nameAndPhoto',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'nameAndPhoto'}>Name & Photo</LinkSpan>,
    },
    {
      icon: <SecurityIcon $isActive={String(displayProfileOption) === 'securityAndSignIn'} />,
      linkName: 'securityAndSignIn',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'securityAndSignIn'}>Official&nbsp;Statement</LinkSpan>,
    },
  ];

  // useEffect to handle which component to display from nav
  useEffect(() => {
    let component = <></>;
    switch (displayProfileOption) {
      case 'nameAndPhoto':
        component = (
          <>
            {/* <ProfileComponentTitle>Name &amp; Photo</ProfileComponentTitle> */}
            <SettingsNameAndPhoto externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />
          </>
        );
        break;
      case 'notifications':
        component = (
          <>
            {/* <ProfileComponentTitle>Availability</ProfileComponentTitle> */}
            <SettingsNotifications externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />
          </>
        );
        break;
      default:
        // console.log('In PoliticianSelfEditDrawer useEffect default case');
        if (displayProfileOption !== 'nameAndPhoto') {
          setDisplayProfileOption('nameAndPhoto');
        }
    }
    setDisplayProfileComponent(component);
  }, [displayProfileOption, politicianWeVoteId]);

  const onCloseDrawer = () => {
    // console.log('PoliticianSelfEditDrawer onCloseDrawer');
    AppObservableStore.setHeaderProfileSection('nameAndPhoto');
    setHeaderProfileSectionSetFromAppContext('unset');
    const drawerOpenGlobalVariableName = 'politicianSelfEditDrawerOpen';
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

  const jumpToManagePage = (buttonId) => {
    const destinationPath = '/ted-lieu-politician-from-california/-/';
    sendGTMDataLayer({
      buttonId,
      destinationPath,
    });
    historyPush(destinationPath);
    onCloseDrawer();
  };

  const jumpToPublicPage = (buttonId) => {
    const destinationPath = '/ted-lieu-politician-from-california/-/';
    sendGTMDataLayer({
      buttonId,
      destinationPath,
    });
    historyPush(destinationPath);
    onCloseDrawer();
  };

  const linkNameToPathMap = {
    nameAndPhoto: '/settings/profile',
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

  const onAppObservableStoreChange = useCallback(() => {
    if (displayProfileOption && displayProfileOption !== headerProfileSectionSetFromAppContext) {
      setHeaderProfileSectionSetFromAppContext(AppObservableStore.getHeaderProfileSection());
      setDisplayProfileOption(AppObservableStore.getHeaderProfileSection());
    }
    if (AppObservableStore.getPoliticianWeVoteIdBeingViewed()) {
      setPoliticianWeVoteId(AppObservableStore.getPoliticianWeVoteIdBeingViewed());
      // console.log('PoliticianSelfEditDrawer onAppObservableStoreChange politicianWeVoteId:', AppObservableStore.getPoliticianWeVoteIdBeingViewed());
    }
  }, [setDisplayProfileOption, setHeaderProfileSectionSetFromAppContext]);

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    if (politicianWeVoteId) {
      setPolitician(PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId));
      console.log('PoliticianSelfEditDrawer onAppObservableStoreChange politician:', PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId));
    }
  }, [setPolitician]);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      setPoliticianWeVoteId('');
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

  const JumpToManagePageJsx = (
    <NavLinkContainer
      id="jumpToManagePage"
      onClick={() => jumpToManagePage('jumpToManagePage')}
    >
      <ManageCandidatesSvgImageWrapper>
        <ReactSVG
          src={normalizedImagePath(manageCandidates)}
          alt="Manage Candidates"
          // beforeInjection={(svg) => svg.setAttribute('style', { padding: '1px 1px 1px 0px' })}
        />
      </ManageCandidatesSvgImageWrapper>
      <NavLink>
        Manage&nbsp;Candidate
      </NavLink>
    </NavLinkContainer>
  );

  const JumpToPublicPageJsx = (
    <NavLinkContainer
      id="jumpToPublicPage"
      onClick={() => jumpToPublicPage('jumpToPublicPage')}
    >
      <ManageCandidatesSvgImageWrapper>
        <ReactSVG
          src={normalizedImagePath(viewCandidate)}
          alt="Manage Candidates"
          // beforeInjection={(svg) => svg.setAttribute('style', { padding: '1px 1px 1px 0px' })}
        />
      </ManageCandidatesSvgImageWrapper>
      <NavLink>
        View&nbsp;Profile
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
        <div>
          Edit Profile
        </div>
      </YourAccountWrapper>
    </>
  );

  // main content logic for mobile or desktop
  const mainContentJsx = (
    <EditProfileDrawerWrapper>
      {windowWidth < 768 ? (
        <>
          {showLinksToProfilePages ? (
            <NavLinksContainer>
              {linksToProfilePages}
              {isOnManagePage ? (
                <>
                  {JumpToPublicPageJsx}
                </>
              ) : (
                <>
                  {JumpToManagePageJsx}
                </>
              )}
              <SettingsSectionFooterWrapper>
                <SettingsSectionFooter drawerOpenGlobalVariableName="politicianSelfEditDrawerOpen" />
              </SettingsSectionFooterWrapper>
            </NavLinksContainer>
          ) : (
            <>
              <LinkComponentContainer>{displayProfileComponent}</LinkComponentContainer>
            </>
          )}
        </>
      ) : (
        <>
          <NavLinksContainer>
            {linksToProfilePages}
            {isOnManagePage ? (
              <>
                {JumpToPublicPageJsx}
              </>
            ) : (
              <>
                {JumpToManagePageJsx}
              </>
            )}
            <SettingsSectionFooterWrapper>
              <SettingsSectionFooter drawerOpenGlobalVariableName="politicianSelfEditDrawerOpen" />
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
      drawerId="politicianSelfEditDrawer"
      drawerOpenGlobalVariableName="politicianSelfEditDrawerOpen"
      headerTitleJsx={headerTitleJSX}
      headerFixedJsx={headerFixedJsx}
      mainContentJsx={mainContentJsx}
      onDrawerClose={onCloseDrawer}
    />
  );
};

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

export const ManageCandidatesSvgImageWrapper = styled('div')`
  max-width: 48px;
  min-width: 48px;
  width: 48px;
  margin-right: -18px;
  margin-top: 6px;
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

const NavLinksContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: -16px;
  position: fixed;
`;

const ProfileComponentTitle = styled('div')`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ImportContactsIcon = styled(ImportContactsOutlined)`
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

const LaunchStyled = styled(Launch)`
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

export default PoliticianSelfEditDrawer;
