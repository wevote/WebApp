import { AccountCircle, Link, Menu } from '@mui/icons-material';
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
      icon: <LinkStyled $isActive={String(displayProfileOption) === 'links'} />,
      linkName: 'links',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'links'}>Your Website</LinkSpan>,
    },
    {
      icon: <TeamAccessSvg $isActive={String(displayProfileOption) === 'teamAccess'} />,
      linkName: 'teamAccess',
      linkTextJsx: <LinkSpan $isActive={String(displayProfileOption) === 'teamAccess'}>Team Access</LinkSpan>,
    },
    {
      icon: <AccountCircle $isActive={String(displayProfileOption) === 'party'} />,
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

const OfficialStatementIcon = styled.svg`
  width: 22px;
  height: 22px;
  color: ${DesignTokenColors.neutralUI600};
`;

function OfficialStatementSvg () {
  return (
    <OfficialStatementIcon
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
    >
      <path
      d="M17.9625 13.675C17.8651 13.602 17.7467 13.5625 17.625 13.5625H17.0625V6.25C17.0625 5.65326 16.8254 5.08097 16.4035 4.65901C15.9815 4.23705 15.4092 4 14.8125 4H5.25C4.65326 4 4.08097 4.23705 3.65901 4.65901C3.23705 5.08097 3 5.65326 3 6.25C3 7.20695 3.70664 7.76453 3.7875 7.825C3.88462 7.89849 4.00321 7.93801 4.125 7.9375C4.24223 7.93718 4.35644 7.90024 4.45165 7.83184C4.54686 7.76344 4.61832 7.667 4.65604 7.556C4.69377 7.445 4.69587 7.32499 4.66205 7.21274C4.62823 7.10049 4.56018 7.00161 4.46742 6.92992C4.46461 6.92641 4.125 6.65359 4.125 6.25C4.125 5.95163 4.24353 5.66548 4.4545 5.4545C4.66548 5.24353 4.95163 5.125 5.25 5.125C5.54837 5.125 5.83452 5.24353 6.0455 5.4545C6.25647 5.66548 6.375 5.95163 6.375 6.25V15.25C6.375 15.8467 6.61205 16.419 7.03401 16.841C7.45597 17.2629 8.02826 17.5 8.625 17.5H16.5C17.0967 17.5 17.669 17.2629 18.091 16.841C18.5129 16.419 18.75 15.8467 18.75 15.25C18.75 14.293 18.0469 13.7355 17.9625 13.675ZM9.75 8.5H14.25C14.3992 8.5 14.5423 8.55926 14.6477 8.66475C14.7532 8.77024 14.8125 8.91332 14.8125 9.0625C14.8125 9.21168 14.7532 9.35476 14.6477 9.46025C14.5423 9.56574 14.3992 9.625 14.25 9.625H9.75C9.60082 9.625 9.45774 9.56574 9.35225 9.46025C9.24676 9.35476 9.1875 9.21168 9.1875 9.0625C9.1875 8.91332 9.24676 8.77024 9.35225 8.66475C9.45774 8.55926 9.60082 8.5 9.75 8.5ZM9.1875 11.3125C9.1875 11.1633 9.24676 11.0202 9.35225 10.9148C9.45774 10.8093 9.60082 10.75 9.75 10.75H14.25C14.3992 10.75 14.5423 10.8093 14.6477 10.9148C14.7532 11.0202 14.8125 11.1633 14.8125 11.3125C14.8125 11.4617 14.7532 11.6048 14.6477 11.7102C14.5423 11.8157 14.3992 11.875 14.25 11.875H9.75C9.60082 11.875 9.45774 11.8157 9.35225 11.7102C9.24676 11.6048 9.1875 11.4617 9.1875 11.3125ZM16.5 16.375H10.0109C10.209 16.0332 10.3131 15.6451 10.3125 15.25C10.3126 15.0593 10.2839 14.8697 10.2274 14.6875H17.3993C17.5389 14.8424 17.6194 15.0416 17.6264 15.25C17.6264 15.3979 17.5973 15.5443 17.5406 15.6808C17.484 15.8174 17.401 15.9415 17.2964 16.046C17.1918 16.1505 17.0676 16.2333 16.931 16.2898C16.7943 16.3462 16.6479 16.3752 16.5 16.375Z"
      fill="currentColor"
      />
    </OfficialStatementIcon>
  );
}

const TeamAccessIcon = styled.svg`
  width: 22px;
  height: 22px;
  color: ${DesignTokenColors.neutralUI600}; // same as OfficialStatementIcon
`;

function TeamAccessSvg () {
  return (
    <TeamAccessIcon
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
    >
      <path
      d="M13.75 8C14.44 8 15 8.56 15 9.25V10.0234C12.1968 10.2761 10 12.631 10 15.5C10 16.3918 10.2131 17.2336 10.5898 17.9785C9.67969 17.8847 8.8247 17.481 8.17188 16.8281C7.42173 16.078 7 15.0609 7 14V9.25C7 8.56 7.56 8 8.25 8H13.75ZM6.37891 8C6.13992 8.35799 6 8.78702 6 9.25V14C5.99945 14.6782 6.13725 15.3493 6.4043 15.9727C5.98008 16.0303 5.54776 15.997 5.1377 15.874C4.72774 15.751 4.34874 15.5413 4.02637 15.2598C3.70401 14.9782 3.44559 14.6309 3.26855 14.2412C3.09149 13.8514 2.99995 13.4281 3 13V9.25C3 8.56 3.56 8 4.25 8H6.37891ZM17.75 8C18.44 8 19 8.56 19 9.25V11.2568C18.1697 10.5711 17.1344 10.1257 16 10.0234V9.25C16 8.78702 15.8611 8.35799 15.6211 8H17.75ZM5.5 3C6.03043 3 6.53899 3.21086 6.91406 3.58594C7.28914 3.96101 7.5 4.46957 7.5 5C7.5 5.53043 7.28914 6.03899 6.91406 6.41406C6.53899 6.78914 6.03043 7 5.5 7C4.96957 7 4.46101 6.78914 4.08594 6.41406C3.71086 6.03899 3.5 5.53043 3.5 5C3.5 4.46957 3.71086 3.96101 4.08594 3.58594C4.46101 3.21086 4.96957 3 5.5 3ZM11 2C11.663 2 12.2987 2.26358 12.7676 2.73242C13.2364 3.20126 13.5 3.83696 13.5 4.5C13.5 5.16304 13.2364 5.79874 12.7676 6.26758C12.2987 6.73642 11.663 7 11 7C10.337 7 9.70126 6.73642 9.23242 6.26758C8.76358 5.79874 8.5 5.16304 8.5 4.5C8.5 3.83696 8.76358 3.20126 9.23242 2.73242C9.70126 2.26358 10.337 2 11 2ZM16.5 3C17.0304 3 17.539 3.21086 17.9141 3.58594C18.2891 3.96101 18.5 4.46957 18.5 5C18.5 5.53043 18.2891 6.03899 17.9141 6.41406C17.539 6.78914 17.0304 7 16.5 7C15.9696 7 15.461 6.78914 15.0859 6.41406C14.7109 6.03899 14.5 5.53043 14.5 5C14.5 4.46957 14.7109 3.96101 15.0859 3.58594C15.461 3.21086 15.9696 3 16.5 3Z"
      fill="currentColor"
      />
      <path
      d="M15.5 11C17.9853 11 20 13.0147 20 15.5C20 17.9853 17.9853 20 15.5 20C13.0147 20 11 17.9853 11 15.5C11 13.0147 13.0147 11 15.5 11ZM15.5 12.4062C15.1111 12.4064 14.7792 12.5433 14.5049 12.8174C14.2306 13.0915 14.0938 13.4234 14.0938 13.8125V14.375H13.8125C13.658 14.3752 13.5253 14.43 13.415 14.54C13.3048 14.6501 13.25 14.7828 13.25 14.9375V17.75C13.2502 17.9048 13.3051 18.0374 13.415 18.1475C13.5251 18.2575 13.6578 18.3125 13.8125 18.3125H17.1875C17.3424 18.3127 17.4749 18.2577 17.585 18.1475C17.695 18.0372 17.75 17.9047 17.75 17.75V14.9375C17.7502 14.783 17.6952 14.6503 17.585 14.54C17.4747 14.4299 17.3421 14.375 17.1875 14.375H16.9062V13.8125C16.9066 13.4238 16.7696 13.0919 16.4951 12.8174C16.2206 12.543 15.8888 12.4061 15.5 12.4062ZM15.5 15.7812C15.655 15.7816 15.7876 15.8365 15.8975 15.9463C16.0073 16.0562 16.0623 16.1889 16.0625 16.3438C16.0627 16.4986 16.0077 16.6311 15.8975 16.7412C15.7872 16.8513 15.6547 16.9062 15.5 16.9062C15.3461 16.907 15.2134 16.852 15.1025 16.7412C14.9918 16.6304 14.9369 16.4978 14.9375 16.3438C14.9381 16.1896 14.9929 16.0569 15.1025 15.9463C15.2122 15.8357 15.3449 15.7809 15.5 15.7812ZM15.5 12.9688C15.7344 12.9688 15.9336 13.0508 16.0977 13.2148C16.2617 13.3789 16.3437 13.5781 16.3438 13.8125V14.375H14.6562V13.8125C14.6563 13.5781 14.7383 13.3789 14.9023 13.2148C15.0664 13.0508 15.2656 12.9688 15.5 12.9688Z"
      fill="currentColor"
      />
    </TeamAccessIcon>
  );
}

const LinkStyled = styled(Link)`
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
