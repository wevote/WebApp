import { AccountCircle, Language, Menu } from '@mui/icons-material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import manageCandidates from '../../../img/global/svg-icons/manage-candidates.svg';
import viewCandidate from '../../../img/global/svg-icons/view-candidate.svg';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import PoliticianStore from '../../common/stores/PoliticianStore';
import historyPush from '../../common/utils/historyPush';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import { OfficialStatementSvg, PoliticalPartySvg, TeamAccessSvg } from '../Icons/PoliticianSelfEditIcons';
import SettingsSectionFooter from '../Navigation/SettingsSectionFooter';
import SettingsLinks from '../PoliticianSelfEdit/SettingsLinks';
import SettingsNameAndPhoto from '../PoliticianSelfEdit/SettingsNameAndPhoto';
import SettingsOfficialStatement from '../PoliticianSelfEdit/SettingsOfficialStatement';
import SettingsPoliticalParty from '../PoliticianSelfEdit/SettingsPoliticalParty';
import SettingsNotifications from '../Settings/SettingsNotifications';
import { NavLinksContainer } from '../Style/drawerLayoutStyles';
import DrawerTemplateHeaderProfile from './DrawerTemplateHeaderProfile';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

// Canonical icon size used everywhere: nav icons, header icon, page-level icon
const ICON_SIZE = 24;

function PoliticianSelfEditDrawer() {
  const [headerFixedJsx] = useState(<></>);
  const [displayProfileOption, setDisplayProfileOption] = useState('nameAndPhoto');
  const [displayProfileComponent, setDisplayProfileComponent] = useState();
  const [isOnManagePage, setIsOnManagePage] = useState(true);
  const [politician, setPolitician] = useState({});
  const [politicianWeVoteId, setPoliticianWeVoteId] = useState('');
  const politicianWeVoteIdRef = useRef(politicianWeVoteId);
  const [showLinksToProfilePages, setShowLinksToProfilePages] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // checks window width for responsiveness
  useEffect(() => {
    const handleWindowWidth = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowWidth);
    return () => window.removeEventListener('resize', handleWindowWidth);
  }, []);

  const profileNavOptions = [
    {
      icon: (
        <NavIconWrapper>
          <AccountCircleNavIcon $isActive={displayProfileOption === 'nameAndPhoto'} />
        </NavIconWrapper>
      ),
      linkName: 'nameAndPhoto',
      linkTextJsx: <LinkSpan $isActive={displayProfileOption === 'nameAndPhoto'}>Name & Photo</LinkSpan>,
    },
    {
      icon: (
        <NavIconWrapper>
          <OfficialStatementSvg $isActive={displayProfileOption === 'officialStatement'} />
        </NavIconWrapper>
      ),
      linkName: 'officialStatement',
      linkTextJsx: <LinkSpan $isActive={displayProfileOption === 'officialStatement'}>Official&nbsp;Statement</LinkSpan>,
    },
    {
      icon: (
        <NavIconWrapper>
          {/* $isActive is a transient prop ($ prefix) so it isn't forwarded to the DOM element */}
          <WebsiteNavIcon $isActive={displayProfileOption === 'links'} />
        </NavIconWrapper>
      ),
      linkName: 'links',
      linkTextJsx: <LinkSpan $isActive={displayProfileOption === 'links'}>Your Website</LinkSpan>,
    },
    {
      icon: (
        <NavIconWrapper>
          <TeamAccessSvg $isActive={displayProfileOption === 'teamAccess'} />
        </NavIconWrapper>
      ),
      linkName: 'teamAccess',
      linkTextJsx: <LinkSpan $isActive={displayProfileOption === 'teamAccess'}>Team Access</LinkSpan>,
    },
    {
      icon: (
        <NavIconWrapper>
          <PoliticalPartySvg $isActive={displayProfileOption === 'party'} />
        </NavIconWrapper>
      ),
      linkName: 'party',
      linkTextJsx: <LinkSpan $isActive={displayProfileOption === 'party'}>Political Party</LinkSpan>,
    },
  ];

  useEffect(() => {
    let component = <></>;
    switch (displayProfileOption) {
      case 'links':
        component = <SettingsLinks externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />;
        break;
      case 'nameAndPhoto':
        component = <SettingsNameAndPhoto externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />;
        break;
      case 'notifications':
        component = <SettingsNotifications externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />;
        break;
      case 'officialStatement':
        component = <SettingsOfficialStatement externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />;
        break;
      case 'party':
        component = <SettingsPoliticalParty externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />;
        break;
      default:
        // console.log('In PoliticianSelfEditDrawer useEffect default case');   
        if (!displayProfileOption) setDisplayProfileOption('nameAndPhoto');
    }
    // console.log('About to setDisplayProfileComponent: ', displayProfileOption);
    if (displayProfileOption && component) setDisplayProfileComponent(component);
  }, [displayProfileOption, politicianWeVoteId]);

  const onCloseDrawer = () => {
    // console.log('PoliticianSelfEditDrawer onCloseDrawer');
    AppObservableStore.setHeaderProfileSection('nameAndPhoto');
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
      pageDetails: getPageDetails('PoliticianSelfEditDrawer'),
      destinationDetails: {
        destinationPageName: destinationPage.pageName || '',
        destinationPageType: destinationPage.pageType || '',
        destinationPathname: destinationPath,
      },
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  };
  const jumpToManagePage = (buttonId) => {
    // const destinationPath = '/managecandidates/ted-lieu-politician-from-california/';
    const destinationPath = '/managecandidates/';
    sendGTMDataLayer({ buttonId, destinationPath });
    historyPush(destinationPath);
    onCloseDrawer();
  };

  const jumpToPublicPage = (buttonId) => {
    const destinationPath = `/${politician.seo_friendly_path}/-/`;
    sendGTMDataLayer({ buttonId, destinationPath });
    historyPush(destinationPath);
    onCloseDrawer();
  };

  const linkNameToPathMap = {
    links: '/settings/links',
    nameAndPhoto: '/settings/profile',
    officialStatement: '/settings/officialStatement',
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
    if (AppObservableStore.getPoliticianWeVoteIdBeingViewed()) {
      setPoliticianWeVoteId(AppObservableStore.getPoliticianWeVoteIdBeingViewed());
      // console.log('PoliticianSelfEditDrawer onAppObservableStoreChange politicianWeVoteId:', AppObservableStore.getPoliticianWeVoteIdBeingViewed());
    }
  }, [setDisplayProfileOption, setPoliticianWeVoteId]);

  const onPoliticianStoreChange = useCallback(() => {
    const currentPoliticianWeVoteId = politicianWeVoteIdRef.current;
    // console.log('PoliticianSelfEditDrawer onPoliticianStoreChange currentPoliticianWeVoteId:', currentPoliticianWeVoteId);
    if (currentPoliticianWeVoteId) {
      setPolitician(PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
      // console.log('PoliticianSelfEditDrawer onPoliticianStoreChange politician:', PoliticianStore.getPoliticianByWeVoteId(currentPoliticianWeVoteId));
    }
  }, []);

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      setPoliticianWeVoteId('');
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  useEffect(() => {
    // console.log('VoterPositionEntryAndDisplay useEffect, politicianWeVoteId: ', politicianWeVoteId);
    politicianWeVoteIdRef.current = politicianWeVoteId;
    if (politicianWeVoteId) onPoliticianStoreChange();
  }, [onPoliticianStoreChange, politicianWeVoteId]);

  useEffect(() => {
    // console.log('PoliticianSelfEditDrawer OnLoad: ', displayProfileOption);
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => politicianStoreListener.remove();
  }, []);

  useEffect(() => {
    const { location: { pathname } } = window;
    setIsOnManagePage(pathname.startsWith('/more/'));
  }, [setIsOnManagePage]);

  const linksToProfilePages = profileNavOptions.map((option) => (
    <NavLinkContainer
      selected={displayProfileOption === option.linkName}
      onClick={() => onNavLinkClick(option.linkName)}
      key={option.linkName}
    >
      {option.icon}
      <NavLinkLabel>{option.linkTextJsx}</NavLinkLabel>
    </NavLinkContainer>
  ));

  const JumpToManagePageJsx = (
    <NavLinkContainer id="jumpToManagePage" onClick={() => jumpToManagePage('jumpToManagePage')}>
      <NavIconWrapper>
        <ReactSVG src={normalizedImagePath(manageCandidates)} alt="Manage Candidates" />
      </NavIconWrapper>
      <NavLinkLabel>Manage&nbsp;Candidates</NavLinkLabel>
    </NavLinkContainer>
  );

  const JumpToPublicPageJsx = (
    <NavLinkContainer id="jumpToPublicPage" onClick={() => jumpToPublicPage('jumpToPublicPage')}>
      <NavIconWrapper>
        <ReactSVG src={normalizedImagePath(viewCandidate)} alt="View Profile" />
      </NavIconWrapper>
      <NavLinkLabel>View&nbsp;Profile</NavLinkLabel>
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
        <HeaderAccountCircle />
        <div>{politician ? `${politician.politician_name}` : 'Edit Profile'}</div>
      </YourAccountWrapper>
    </>
  );

  const mainContentJsx = (
    <EditProfileDrawerWrapper>
      {windowWidth < 768 ? (
        <>
          {showLinksToProfilePages ? (
            <NavLinksContainer>
              {linksToProfilePages}
              {nextReleaseFeaturesEnabled && (
                isOnManagePage ? JumpToPublicPageJsx : JumpToManagePageJsx
              )}
              <SettingsSectionFooterWrapper>
                <SettingsSectionFooter drawerOpenGlobalVariableName="politicianSelfEditDrawerOpen" />
              </SettingsSectionFooterWrapper>
            </NavLinksContainer>
          ) : (
            <LinkComponentContainer>{displayProfileComponent}</LinkComponentContainer>
          )}
        </>
      ) : (
        <>
          <NavLinksContainer>
            {linksToProfilePages}
            {nextReleaseFeaturesEnabled && (
              isOnManagePage ? JumpToPublicPageJsx : JumpToManagePageJsx
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
}

// ─── Styled Components ────────────────────────────────────────────────────────

// Header icon — white, 24px, matches nav icons
const HeaderAccountCircle = styled(AccountCircle)`
  color: ${DesignTokenColors.whiteUI};
  flex-shrink: 0;
  font-size: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  margin-right: 8px;
  width: ${ICON_SIZE}px;
`;

// MUI AccountCircle in the nav — switches color when active
const AccountCircleNavIcon = styled(AccountCircle)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  font-size: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
`;

// MUI Language (globe) in the nav — switches color when active
// NOTE: $isActive uses the transient prop prefix so it is NOT forwarded to the DOM
const WebsiteNavIcon = styled(Language)`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
  font-size: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
`;

// Fixed 24×24px container — keeps ALL icon types the same size so labels align
const NavIconWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: ${ICON_SIZE}px;
  justify-content: center;
  width: ${ICON_SIZE}px;

  svg {
    height: ${ICON_SIZE}px !important;
    width: ${ICON_SIZE}px !important;
  }
`;

// Label — fixed left margin after the icon slot, no wrapping
const NavLinkLabel = styled('div')`
  margin-left: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NavLinkContainer = styled('div')`
  align-items: center;
  background: ${(props) => (props.selected ? DesignTokenColors.primary50 : 'transparent')};
  border-left: ${(props) => (props.selected ? `4px solid ${DesignTokenColors.primary600}` : '4px solid transparent')};
  border-radius: 0 20px 20px 0;
  color: ${(props) => (props.selected ? DesignTokenColors.primary600 : DesignTokenColors.neutralUI600)};
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

const LinkSpan = styled('span')`
  color: ${(props) => (props.$isActive ? DesignTokenColors.primary600 : DesignTokenColors.neutral600)};
  font-size: 1rem;
  text-decoration: none;
`;

const MenuIconWrapper = styled.button`
  display: none;

  @media (max-width: 768px) {
    align-items: center;
    background: transparent;
    border: none;
    border-right: 1px solid ${DesignTokenColors.whiteUI};
    color: ${DesignTokenColors.whiteUI};
    display: flex;
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
    margin-right: auto;
    width: 70%;
  }

  @media (min-width: 1024px) {
    width: calc(100% - 220px);
  }
`;

export const ManageCandidatesSvgImageWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: ${ICON_SIZE}px;
  justify-content: center;
  width: ${ICON_SIZE}px;

  svg {
    height: ${ICON_SIZE}px !important;
    width: ${ICON_SIZE}px !important;
  }
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
