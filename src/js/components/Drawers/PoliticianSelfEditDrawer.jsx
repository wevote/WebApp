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

function PoliticianSelfEditDrawer () {
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
    const handleWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowWidth);
    return () => {
      window.removeEventListener('resize', handleWindowWidth);
    };
  }, []);

  const profileNavOptions = [
    {
      icon: <AccountCircle $isActive={String(displayProfileOption) === 'nameAndPhoto'} />,
      linkName: 'nameAndPhoto',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'nameAndPhoto'}>Name & Photo</LinkSpan>,
    },
    {
      icon: <OfficialStatementSvg $isActive={String(displayProfileOption) === 'officialStatement'} />,
      linkName: 'officialStatement',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'officialStatement'}>Official&nbsp;Statement</LinkSpan>,
    },
    {
      icon: <WebsiteStyled $isActive={String(displayProfileOption) === 'links'} />,
      linkName: 'links',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'links'}>Your Website</LinkSpan>,
    },
    {
      icon: <TeamAccessSvg $isActive={String(displayProfileOption) === 'teamAccess'} />,
      linkName: 'teamAccess',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'teamAccess'}>Team Access</LinkSpan>,
    },
    {
      icon: <PoliticalPartySvg $isActive={String(displayProfileOption) === 'party'} />,
      linkName: 'party',
      linkTextJsx: (
        <LinkSpan $isActive={String(displayProfileOption) === 'party'}>
          Political Party
        </LinkSpan>
      ),
    },

  ];

  // useEffect to handle which component to display from nav
  useEffect(() => {
    let component = <></>;
    switch (displayProfileOption) {
      case 'links':
        component = (
          <>
            {/* <ProfileComponentTitle>Links</ProfileComponentTitle> */}
            <SettingsLinks externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />
          </>
        );
        break;
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
      case 'officialStatement':
        component = (
          <>
            {/* <ProfileComponentTitle>Availability</ProfileComponentTitle> */}
            <SettingsOfficialStatement externalUniqueId="politicianSelfEditDrawer" politicianWeVoteId={politicianWeVoteId} />
          </>
        );
        break;
      case 'party':
        component = (
          <SettingsPoliticalParty
            externalUniqueId="politicianSelfEditDrawer"
            politicianWeVoteId={politicianWeVoteId}
          />
        );
        break;

      default:
        // console.log('In PoliticianSelfEditDrawer useEffect default case');
        if (!displayProfileOption) {
          setDisplayProfileOption('nameAndPhoto');
        }
    }
    // console.log('About to setDisplayProfileComponent: ', displayProfileOption);
    if (displayProfileOption && component) {
      setDisplayProfileComponent(component);
    }
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
    // const destinationPath = '/managecandidates/ted-lieu-politician-from-california/';
    const destinationPath = '/managecandidates/';
    sendGTMDataLayer({
      buttonId,
      destinationPath,
    });
    historyPush(destinationPath);
    onCloseDrawer();
  };

  const jumpToPublicPage = (buttonId) => {
    const destinationPath = `/${politician.seo_friendly_path}/-/`;
    sendGTMDataLayer({
      buttonId,
      destinationPath,
    });
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
    if (politicianWeVoteId) {
      onPoliticianStoreChange();
    }
  }, [onPoliticianStoreChange, politicianWeVoteId]);

  useEffect(() => {
    // console.log('PoliticianSelfEditDrawer OnLoad: ', displayProfileOption);
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, []);

  useEffect(() => {
    const { location: { pathname } } = window;
    if (pathname.startsWith('/more/')) {
      setIsOnManagePage(true);
    } else {
      setIsOnManagePage(false);
    }
  }, [setIsOnManagePage]);

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
        Manage&nbsp;Candidates
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
          {politician ? `${politician.politician_name}` : 'Edit Profile'}
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
              {nextReleaseFeaturesEnabled && (
                <>
                  {isOnManagePage ? (
                    <>
                      {JumpToPublicPageJsx}
                    </>
                  ) : (
                    <>
                      {JumpToManagePageJsx}
                    </>
                  )}
                </>
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
              <>
                {isOnManagePage ? (
                  <>
                    {JumpToPublicPageJsx}
                  </>
                ) : (
                  <>
                    {JumpToManagePageJsx}
                  </>
                )}
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
}

const AccountCircleStyled = styled(AccountCircle)`
  margin-right: 8px;
`;

const WebsiteStyled = styled(Language)`
  color: ${DesignTokenColors.neutralUI600};
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

// Please do not copy styles -- centralize them somewhere, so that same-named styles don't diverge,
// and so that we don't have to maintain them twice
// const NavLinksContainer = styled('div')`
//   display: flex;
//   flex-direction: column;
//   margin-left: -16px;
//   position: fixed;
// `;

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
