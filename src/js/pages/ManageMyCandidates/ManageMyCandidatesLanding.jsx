import { Edit as EditIcon, KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import PoliticianStore from '../../common/stores/PoliticianStore';
import { ImportInviteIcon } from '../../components/More/ImportInviteIcon';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

const PoliticiansManagedController = React.lazy(() => import('../../components/PoliticiansManaged/PoliticiansManagedController'));
const ImportAndInvitePage = React.lazy(() => import('../More/ManageMyCandidates'));
const TrackingPage = React.lazy(() => import('./SupporterTracking'));
const AnalyticsPage = React.lazy(() => import('./SupporterAnalytics'));

function pushDataLayer (buttonId = '', politicianWeVoteId = null) {
  const dataLayerObject = {
    actionDetails: {
      actionType: 'navigate',
      buttonId,
    },
    event: 'action',
    pageDetails: getPageDetails(),
    userDetails: VoterStore.getAnalyticsUserDetails(),
  };
  if (politicianWeVoteId) {
    dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
  }
  TagManager.dataLayer({ dataLayer: dataLayerObject });
}

export default function ManageMyCandidatesLanding () {
  // Left nav active tab
  const { subtab } = useParams();
  const history = useHistory();
  const validTabs = useMemo(() => ['tracking', 'analytics'], []);
  // All invalid subtabs redirect to /managecandidates just to be safe
  useEffect(() => {
    if (!subtab) return;
    if (!validTabs.includes(subtab)) {
      history.replace('/managecandidates');
    }
  }, [subtab, history, validTabs]);
  const active = validTabs.includes(subtab) ? subtab : 'import';

  const demoPoliticians = useMemo(() => ([
    { we_vote_id: 'cand_1', politician_name: 'John Dough' },
    { we_vote_id: 'cand_2', politician_name: 'Jane Dough' },
    { we_vote_id: 'cand_3', politician_name: 'Kateryna Dough' },
  ]), []);

  // eslint-disable-next-line no-unused-vars
  const [politiciansToManage, setPoliticiansToManage] = useState(demoPoliticians); // Place demoPoliticians in useState to use dummy data, otherwise place: []
  const [selectedPoliticianWeVoteId, setSelectedPoliticianWeVoteId] = useState('');

  // Scroll gradient state for mobile navbar
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const navScrollRef = useRef(null);

  const selectedPolitician = politiciansToManage.find((politician) => politician.we_vote_id === selectedPoliticianWeVoteId) || null;

  useEffect(() => {
    if (!selectedPoliticianWeVoteId && politiciansToManage.length > 0) {
      setSelectedPoliticianWeVoteId(politiciansToManage[0].we_vote_id);
    }
  }, [politiciansToManage, selectedPoliticianWeVoteId]);

  const updatePoliticiansToManage = () => {
    const test = true;
    if (test) {
      // setPoliticiansToManage(PoliticianStore.getPoliticianListVoterCanEdit());
    }
  };

  const onPoliticianStoreChange = useCallback(() => {
    updatePoliticiansToManage();
  }, []);

  const onVoterStoreChange = useCallback(() => {
    updatePoliticiansToManage();
  }, []);

  useEffect(() => {
    updatePoliticiansToManage();
  }, []);

  useEffect(() => {
    const politicianStoreListener = PoliticianStore.addListener(onPoliticianStoreChange);
    onPoliticianStoreChange();
    return () => {
      politicianStoreListener.remove();
    };
  }, [onPoliticianStoreChange]);

  useEffect(() => {
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();
    return () => {
      voterStoreListener.remove();
    };
  }, [onVoterStoreChange]);

  const handleNavScroll = () => {
    const el = navScrollRef.current;
    if (!el) return;

    const isAtStart = el.scrollLeft === 0;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setShowLeftGradient(!isAtStart);
    setShowRightGradient(!isAtEnd);
  };

  useEffect(() => {
    handleNavScroll();
  }, []);

  // Main render
  const handleClaimEdit = () => history.push(`/candidate/${selectedPoliticianWeVoteId}/edit`);
  const handleClaimImport = () => history.push('/managecandidates');
  const handleClaimTracking = () => history.push('/managecandidates/tracking');
  const handleClaimAnalytics = () => history.push('/managecandidates/analytics');

  return (
    <PageContentContainer>
      <Helmet><title>Manage My Candidates - WeVote</title></Helmet>

      <HeaderRow>
        <div>
          <PageKicker>Manage my candidates</PageKicker>
          <TitleRow>
            <Title>{selectedPolitician?.politician_name || 'Select candidate'}</Title>
            <CandidatePicker
              type="button"
              aria-haspopup="listbox"
              aria-expanded="false"
              title="Select candidate"
            >
              <ArrowDownIcon fontSize="small" />
              <PickerMenu role="listbox">
                {politiciansToManage.map((politician) => (
                  <PickerItem
                    key={`choosePolitician-${politician.we_vote_id}`}
                    role="option"
                    aria-selected={politician.we_vote_id === selectedPoliticianWeVoteId}
                    onClick={() => setSelectedPoliticianWeVoteId(politician.we_vote_id)}
                  >
                    {politician.politician_name}
                  </PickerItem>
                ))}
              </PickerMenu>
            </CandidatePicker>
          </TitleRow>
        </div>
      </HeaderRow>

      <Layout>
        {/* Mobile navigation bar */}
        <NavBarMobile
          className="u-show-mobile-tablet"
          aria-label="Manage navigation"
          ref={navScrollRef}
          onScroll={handleNavScroll}
          showLeftGradient={showLeftGradient}
          showRightGradient={showRightGradient}
        >
          <NavPill id="importInviteNavButton-mobile" $mobile $active={active === 'import'} onClick={() => { pushDataLayer('importInviteNavButton-mobile', selectedPoliticianWeVoteId); handleClaimImport(); }}>
            <PillIcon><ImportInviteIcon fontSize="small" /></PillIcon>
            Import &amp; invite
          </NavPill>

          <NavPill id="trackingNavButton-mobile" $mobile $active={active === 'tracking'} onClick={() => { pushDataLayer('trackingNavButton-mobile', selectedPoliticianWeVoteId); handleClaimTracking(); }}>
            <PillIcon><TrackingIcon fontSize="small" /></PillIcon>
            Tracking
          </NavPill>

          <NavPill id="analyticsNavButton-mobile" $mobile $active={active === 'analytics'} onClick={() => { pushDataLayer('analyticsNavButton-mobile', selectedPoliticianWeVoteId); handleClaimAnalytics(); }}>
            <PillIcon><AnalyticsIcon fontSize="small" /></PillIcon>
            Analytics
          </NavPill>

          <NavPill id="editCandidateProfileNavButton-mobile" $mobile as="button" $active={false} onClick={() => { pushDataLayer('editCandidateProfileNavButton-mobile', selectedPoliticianWeVoteId); handleClaimEdit(); }}>
            <PillIcon><EditIcon fontSize="small" /></PillIcon>
            Edit
          </NavPill>
        </NavBarMobile>

        {/* Desktop and tablet navigation bar */}
        <NavBar className="u-show-desktop" aria-label="Manage navigation">
          <NavPill id="importInviteNavButton-desktop" $active={active === 'import'} onClick={() => { pushDataLayer('importInviteNavButton-desktop', selectedPoliticianWeVoteId); handleClaimImport(); }}>
            <PillIcon><ImportInviteIcon fontSize="small" /></PillIcon>
            Import &amp; invite voters
          </NavPill>

          <NavPill id="trackingNavButton-desktop" $active={active === 'tracking'} onClick={() => { pushDataLayer('trackingNavButton-desktop', selectedPoliticianWeVoteId); handleClaimTracking(); }}>
            <PillIcon><TrackingIcon fontSize="small" /></PillIcon>
            Tracking
          </NavPill>

          <NavPill id="analyticsNavButton-desktop" $active={active === 'analytics'} onClick={() => { pushDataLayer('analyticsNavButton-desktop', selectedPoliticianWeVoteId); handleClaimAnalytics(); }}>
            <PillIcon><AnalyticsIcon fontSize="small" /></PillIcon>
            Analytics
          </NavPill>

          <SideDivider />

          <NavPill id="editCandidateProfileNavButton-desktop" as="button" $active={false} onClick={() => { pushDataLayer('editCandidateProfileNavButton-desktop', selectedPoliticianWeVoteId); handleClaimEdit(); }}>
            <PillIcon><EditIcon fontSize="small" /></PillIcon>
            Edit candidate profile
          </NavPill>
        </NavBar>

        {/* Right content */}
        <RightPanel>
          <Suspense fallback={<div />}>
            {active === 'import' && (
              <ImportAndInvitePage
                selectedPolitician={selectedPolitician}
                selectedPoliticianWeVoteId={selectedPoliticianWeVoteId}
              />
            )}
            {active === 'tracking' && <TrackingPage selectedPoliticianWeVoteId={selectedPoliticianWeVoteId} />}
            {active === 'analytics' && <AnalyticsPage />}
          </Suspense>
        </RightPanel>
      </Layout>
      <Suspense fallback={<></>}>
        <PoliticiansManagedController />
      </Suspense>
    </PageContentContainer>
  );
}

// Analytics icon
function AnalyticsIcon ({ size = 22, title = 'Analytics' }) {
  return (
    <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
      d="M6 16H8V11H6V16ZM14 16H16V6H14V16ZM10 16H12V13H10V16ZM10 11H12V9H10V11ZM4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V4C2 3.45 2.196 2.97933 2.588 2.588C2.98 2.19667 3.45067 2.00067 4 2H18C18.55 2 19.021 2.196 19.413 2.588C19.805 2.98 20.0007 3.45067 20 4V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H4ZM4 18H18V4H4V18Z"
      fill="currentColor"
      />
    </svg>
  );
}
AnalyticsIcon.propTypes = {
  size: PropTypes.number,
  title: PropTypes.string,
};

//  Tracking icon
function TrackingIcon ({ size = 22, title = 'Tracking', ...props }) {
  return (
    <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden={title ? undefined : true}
    {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2727 2.02341C16.3823 2.05363 16.482 2.1124 16.5615 2.19371C16.641 2.27503 16.6975 2.37598 16.7252 2.48626L17.2742 4.68483L19.4728 5.23383C19.5831 5.26159 19.6841 5.31813 19.7655 5.39768C19.8468 5.47722 19.9056 5.57693 19.9358 5.68662C19.966 5.7963 19.9665 5.91203 19.9374 6.022C19.9082 6.13197 19.8504 6.23223 19.7698 6.31255L17.1984 8.88398C17.1199 8.96218 17.0226 9.01878 16.9158 9.04829C16.809 9.0778 16.6964 9.07922 16.589 9.05241L14.5524 8.54455L11.5271 11.5685C11.3764 11.7193 11.172 11.8039 10.9588 11.8039C10.7457 11.8039 10.5412 11.7193 10.3905 11.5685C10.2398 11.4178 10.1551 11.2134 10.1551 11.0003C10.1551 10.7871 10.2398 10.5827 10.3905 10.432L13.4145 7.40669L12.9054 5.37012C12.8783 5.26244 12.8796 5.1496 12.9091 5.04257C12.9387 4.93555 12.9954 4.83799 13.0738 4.75941L15.6452 2.18798C15.7257 2.10761 15.8261 2.05003 15.9361 2.02112C16.0461 1.9922 16.1618 1.99299 16.2714 2.02341M10.4471 3.64341C10.6599 3.62908 10.8583 3.53082 10.9986 3.37024C11.1389 3.20965 11.2097 2.9999 11.1954 2.78712C11.1811 2.57434 11.0828 2.37597 10.9222 2.23563C10.7616 2.0953 10.5519 2.02451 10.3391 2.03883C8.62767 2.15797 6.98641 2.76586 5.61028 3.79027C4.23415 4.81469 3.18099 6.21259 2.57591 7.8179C1.97082 9.42322 1.83924 11.1685 2.1968 12.8464C2.55436 14.5243 3.38603 16.0643 4.59301 17.2834C5.79999 18.5026 7.33156 19.3497 9.00578 19.7241C10.68 20.0984 12.4265 19.9844 14.0378 19.3955C15.6491 18.8065 17.0575 17.7675 18.0957 16.4017C19.1339 15.0359 19.7582 13.4008 19.8945 11.6907C19.9116 11.4783 19.8435 11.2677 19.7054 11.1055C19.5672 10.9432 19.3702 10.8425 19.1578 10.8254C18.9454 10.8084 18.7349 10.8764 18.5726 11.0146C18.4103 11.1527 18.3096 11.3497 18.2925 11.5621C18.1811 12.966 17.669 14.3083 16.817 15.4297C15.9651 16.551 14.8092 17.4042 13.4866 17.888C12.1641 18.3717 10.7304 18.4656 9.35607 18.1585C7.9817 17.8514 6.72437 17.1563 5.73346 16.1556C4.74256 15.155 4.05973 13.8909 3.76611 12.5136C3.47249 11.1363 3.58042 9.70363 4.07708 8.38585C4.57373 7.06808 5.43823 5.92057 6.56787 5.07967C7.69751 4.23878 9.0448 3.73983 10.4497 3.64212M10.3275 7.20355C10.366 7.30181 10.3848 7.4067 10.3828 7.51222C10.3807 7.61774 10.3579 7.72183 10.3157 7.81854C10.2734 7.91525 10.2125 8.00268 10.1364 8.07585C10.0604 8.14902 9.97066 8.20649 9.87238 8.24498C9.41381 8.42437 9.00719 8.71524 8.6893 9.09129C8.37141 9.46734 8.15228 9.9167 8.05172 10.3987C7.95116 10.8808 7.97235 11.3803 8.11337 11.852C8.25439 12.3238 8.51079 12.753 8.85938 13.1008C9.20798 13.4486 9.63777 13.704 10.1099 13.8439C10.582 13.9838 11.0815 14.0038 11.5633 13.9021C12.0451 13.8004 12.494 13.5802 12.8693 13.2615C13.2446 12.9427 13.5345 12.5354 13.7128 12.0764C13.7935 11.8829 13.9466 11.7286 14.1395 11.6464C14.3323 11.5642 14.5497 11.5607 14.7452 11.6365C14.9406 11.7123 15.0987 11.8615 15.1857 12.0523C15.2726 12.2431 15.2816 12.4603 15.2107 12.6575C14.936 13.3662 14.489 13.9953 13.91 14.4877C13.3311 14.9801 12.6385 15.3204 11.8949 15.4777C11.1513 15.635 10.3802 15.6044 9.65142 15.3887C8.92263 15.173 8.25914 14.7789 7.72101 14.2422C7.18287 13.7054 6.78708 13.043 6.56944 12.3148C6.35181 11.5865 6.31921 10.8155 6.4746 10.0715C6.62998 9.32754 6.96845 8.63404 7.45935 8.0538C7.95026 7.47355 8.57812 7.02489 9.2861 6.74841C9.38436 6.7099 9.48925 6.69112 9.59477 6.69316C9.70029 6.69519 9.80438 6.71799 9.90109 6.76026C9.9978 6.80252 10.0852 6.86342 10.1584 6.93948C10.2316 7.01555 10.289 7.10527 10.3275 7.20355Z"
      fill="currentColor"
      />
    </svg>
  );
}

const HeaderRow = styled.div`
  margin: 6px 0 12px;
`;

const PageKicker = styled.h2`
  color: ${DesignTokenColors.neutralUI600};
  font-size: 12px;
  letter-spacing: 0.06em;
  margin: 0 0 4px;
  text-transform: uppercase;
`;

const TitleRow = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 6px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
`;

const CandidatePicker = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${DesignTokenColors.neutralUI700};
  cursor: pointer;
  display: inline-flex;
  gap: 2px;
  padding: 2px 4px;
  position: relative;

  &:focus-visible { outline: 2px solid ${DesignTokenColors.primary500}; outline-offset: 2px; }
  &:hover > ul, &:focus-within > ul { display: block; }
`;

const PickerMenu = styled.ul`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI200};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(16,24,40,0.08);
  display: none;
  left: 0;
  list-style: none;
  margin: 8px 0 0;
  max-height: 260px;
  overflow: auto;
  padding: 6px;
  position: absolute;
  top: 100%;
  width: 260px;
  z-index: 2;
`;

const PickerItem = styled.li`
  border-radius: 8px;
  cursor: pointer;
  padding: 10px 12px;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }
  &[aria-selected="true"] { font-weight: 600; }
`;

const Layout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;

  @media (min-width: 992px) {
    grid-template-columns: 260px 1fr;
  }
`;

const NavBar = styled.nav`
  display: none;

  @media (min-width: 576px) {
    display: block;
    border-right: 1px solid ${DesignTokenColors.neutralUI200};
    padding-right: 18px;
  }
`;

const NavBarMobile = styled('nav', {
  shouldForwardProp: (prop) => !['showLeftGradient', 'showRightGradient'].includes(prop),
})(({ showLeftGradient, showRightGradient }) => (`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  grid-column: 1 / -1;

  /* Fade out, right side */
  ${showRightGradient ? '-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}
  ${showRightGradient ? 'mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}

  /* Fade out, left side */
  ${showLeftGradient ? '-webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}
  ${showLeftGradient ? 'mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}

  /* Fade out, both sides */
  ${showLeftGradient && showRightGradient ? '-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, 1) 94%, rgba(0, 0, 0, 0));' : ''}
  ${showLeftGradient && showRightGradient ? 'mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, 1) 94%, rgba(0, 0, 0, 0));' : ''}

  /* Make the scrollbar not be visible */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
  }
`));

const NavPill = styled.button`
  align-items: center;
  background: ${({ $active }) => ($active ? DesignTokenColors.primary50 : 'transparent')};
  border: none;
  border-radius: 25px;
  color: ${({ $active }) => ($active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI900)};
  cursor: pointer;
  display: flex;
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  gap: 10px;
  margin: 6px 0;
  padding: 10px 16px;
  text-align: left;
  width: 100%;

  &:hover { background: ${DesignTokenColors.neutralUI50}; }

  // Button uses mobile styles when $mobile prop is true
  ${({ $mobile, $active }) => $mobile && `
    background: ${$active ? DesignTokenColors.primary50 : DesignTokenColors.whiteUI};
    border: 1px solid ${$active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI300};
    border-radius: 12px;
    color: ${$active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI700};
    font-size: 14px;
    font-weight: ${$active ? 600 : 400};
    gap: 6px;
    margin: 0;
    padding: 2px 12px;
    white-space: nowrap;
    width: auto;
    flex-shrink: 0;

    &:hover {
      background: ${$active ? DesignTokenColors.primary100 : DesignTokenColors.neutralUI50};
      border-color: ${$active ? DesignTokenColors.primary700 : DesignTokenColors.neutralUI400};
    }
  `}
`;

const PillIcon = styled.span`
  align-items: center;
  color: inherit;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

const SideDivider = styled.div`
  border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  margin: 16px 0;
`;

const RightPanel = styled.section`
  padding-top: 0;
  overflow: auto;
  @media (min-width: 576px) {
    padding-top: 6px;
  }
`;
