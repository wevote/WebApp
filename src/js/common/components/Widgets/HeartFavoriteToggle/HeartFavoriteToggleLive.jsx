import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CampaignSupporterActions from '../../../actions/CampaignSupporterActions';
import OrganizationActions from '../../../../actions/OrganizationActions';
import CampaignStore from '../../../stores/CampaignStore';
import OrganizationStore from '../../../../stores/OrganizationStore';
import VoterStore from '../../../../stores/VoterStore';
import AppObservableStore from '../../../stores/AppObservableStore';
import CampaignSupporterStore from '../../../stores/CampaignSupporterStore';
import initializejQuery from '../../../utils/initializejQuery';
import { renderLog } from '../../../utils/logging';

const HeartFavoriteToggleBase = React.lazy(() => import(/* webpackChunkName: 'HeartFavoriteToggleBase' */ './HeartFavoriteToggleBase'));

class HeartFavoriteToggleLive extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      opposersCount: 0,
      politicianWeVoteId: '',
      supportersCount: 0,
      voterOpposes: false,
      voterSupports: false,
      voterFirstName: '',
      voterLastName: '',
      voterIsSignedIn: false,
    };
    this.functionToUseWhenProfileComplete = this.functionToUseWhenProfileComplete.bind(this);
    this.submitOpposeClick = this.submitOpposeClick.bind(this);
    this.submitStopOpposingClick = this.submitStopOpposingClick.bind(this);
    this.submitStopSupportingClick = this.submitStopSupportingClick.bind(this);
    this.submitSupportClick = this.submitSupportClick.bind(this);
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
      organizationWeVoteId: organizationWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
      organizationWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
    if (organizationWeVoteId) {
      if (organizationWeVoteId !== organizationWeVoteIdPrevious) {
        this.onOrganizationStoreChange();
      }
    }
  }

  componentWillUnmount () {
    // console.log('SupportButton componentWillUnmount');
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      // console.log('HeartFavoriteToggleLive onCampaignStoreChange campaignX:', campaignX);
      const {
        campaignx_we_vote_id: campaignXWeVoteIdFromDict,
        final_election_date_in_past: finalElectionDateInPast,
        linked_politician_we_vote_id: politicianWeVoteId,
        opposers_count: opposersCount,
        supporters_count: supportersCount,
        supporters_count_next_goal: supportersCountNextGoal,
        voter_campaignx_supporter: voterCampaignXSupporter,
      } = campaignX;
      const supportersCountNextGoalWithFloor = supportersCountNextGoal || CampaignStore.getCampaignXSupportersCountNextGoalDefault();
      if (campaignXWeVoteIdFromDict && politicianWeVoteId) {
        //
        const {
          politicianWeVoteId: politicianWeVoteIdPrevious,
          opposersCount: opposersCountPrevious,
          supportersCount: supportersCountPrevious,
        } = this.state;
        if (politicianWeVoteId !== politicianWeVoteIdPrevious) {
          this.setState({
            opposersCount,
            politicianWeVoteId,
            supportersCount,
            supportersCountNextGoal: supportersCountNextGoalWithFloor,
          }, () => this.onOrganizationStoreChange());
        } else if (opposersCount !== opposersCountPrevious || supportersCount !== supportersCountPrevious) {
          // WV-2664: Same politician, but the counts changed (e.g. the optimistic
          // campaignLocalAttributesUpdate fired by a heart/Choose action). Sync them so the
          // tally updates live instead of waiting for a page refresh.
          this.setState({
            opposersCount,
            supportersCount,
            supportersCountNextGoal: supportersCountNextGoalWithFloor,
          });
        }
      } else if (campaignXWeVoteIdFromDict && !politicianWeVoteId) {
        // console.log('HeartFavoriteToggleLive onCampaignStoreChange voterCampaignXSupporter:', voterCampaignXSupporter);
        if (voterCampaignXSupporter && 'campaign_supported' in voterCampaignXSupporter) {
          const {
            campaign_opposed: voterOpposes,
            campaign_supported: voterSupports,
            // organization_we_vote_id: organizationWeVoteId,
          } = voterCampaignXSupporter;
          this.setState({
            // organizationWeVoteId,
            voterOpposes,
            voterSupports,
          });
        }
        // console.log('HeartFavoriteToggleLive onCampaignStoreChange campaignXWeVoteIdFromDict:', campaignXWeVoteIdFromDict);
        this.setState({
          finalElectionDateInPast,
          opposersCount,
          politicianWeVoteId,
          supportersCount,
          supportersCountNextGoal: supportersCountNextGoalWithFloor,
        });
      }
      // if (politicianWeVoteId) {
      //   if (apiCalming(`politicianRetrieve-${politicianWeVoteId}`, 300000)) {
      //     PoliticianActions.politicianRetrieve(politicianWeVoteId);
      //   }
      // }
    }
  }

  onCampaignSupporterStoreChange () {
    // When campaignSupporterSave happens which is related to this campaignX, refresh data
    const { campaignXWeVoteId } = this.props;
    const { politicianWeVoteId } = this.state;
    const pigsCanFly = false;
    if (pigsCanFly && !politicianWeVoteId) {
      const {
        voterOpposes: voterOpposesPrevious,
        voterSupports: voterSupportsPrevious,
      } = this.state;
      if (campaignXWeVoteId) {
        const voterCampaignXSupporter = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
        // console.log('HeartFavoriteToggleLive onCampaignSupporterStoreChange voterCampaignXSupporter:', voterCampaignXSupporter)
        if (voterCampaignXSupporter && 'campaign_supported' in voterCampaignXSupporter) {
          const {
            campaign_opposed: voterOpposes,
            campaign_supported: voterSupports,
            // organization_we_vote_id: organizationWeVoteId,
          } = voterCampaignXSupporter;
          if ((voterOpposes !== voterOpposesPrevious) || (voterSupports !== voterSupportsPrevious)) {
            // If this voter's support/oppose status has changed, refresh data
            this.setState({
              // organizationWeVoteId,
              voterOpposes,
              voterSupports,
            }, () => {
              // TODO: Needs to be figured out in bulk -- not in this component
              // if (apiCalming(`campaignRetrieveAsOwner-${campaignXWeVoteId}`, 500)) {
              //   CampaignActions.campaignRetrieveAsOwner(campaignXWeVoteId);
              // }
            });
          }
        }
      }
    }
  }

  onOrganizationStoreChange () {
    // Lookup Organization data by politicianWeVoteId, so we can get the number of followers
    const { organizationWeVoteId } = this.props;
    const { politicianWeVoteId } = this.state;
    // console.log('HeartFavoriteToggleLive onOrganizationStoreChange organizationWeVoteId:', organizationWeVoteId, ', politicianWeVoteId:', politicianWeVoteId);
    if (politicianWeVoteId) {
      const { voterSupports, voterOpposes } = this.calculateVoterPositionForPolitician(politicianWeVoteId);
      const { voterSupports: voterSupportsPrev, voterOpposes: voterOpposesPrev } = this.state;
      if (voterSupports !== voterSupportsPrev || voterOpposes !== voterOpposesPrev) {
        this.setState({
          voterOpposes,
          voterSupports,
        });
      }
    } else if (organizationWeVoteId) {
      // console.log('voterOpposes: ', OrganizationStore.isVoterDislikingThisOrganization(organizationWeVoteId));
      // console.log('voterSupports: ', OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId));
      this.setState({
        opposersCount: OrganizationStore.getOrganizationDislikeCount(organizationWeVoteId),
        supportersCount: OrganizationStore.getOrganizationFollowersCount(organizationWeVoteId),  // A variation on isVoterFollowingThisOrganization
        voterOpposes: OrganizationStore.isVoterDislikingThisOrganization(organizationWeVoteId),
        voterSupports: OrganizationStore.isVoterFollowingThisOrganization(organizationWeVoteId),  // A variation on isVoterFollowingThisOrganization
      });
    }
  }

  onVoterStoreChange () {
    // const { campaignXWeVoteId } = this.props;
    const { voterIsSignedIn: voterIsSignedInPrevious } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterFirstName,
      voterLastName,
      voterIsSignedIn,
    }, () => {
      if (voterIsSignedIn !== voterIsSignedInPrevious) {
        // TODO: Needs to be figured out in bulk -- not in this component
        // if (apiCalming(`campaignRetrieveAsOwner-${campaignXWeVoteId}`, 500)) {
        //   CampaignActions.campaignRetrieveAsOwner(campaignXWeVoteId);
        // }
      }
    });
  }

  calculateVoterPositionForPolitician (politicianWeVoteId) {
    // WV-2664: OrgStore is the source of truth, hydrated from the server's
    // organizationsFollowedRetrieve. The WeVoteServer (WV-2664HeartFollowDecouple) stores the
    // heart (FollowOrganization FOLLOWING / FOLLOW_DISLIKE) independently of the voter's
    // support/oppose stance, so this no longer snaps back on refresh — no client-side cache needed.
    return {
      voterSupports: OrganizationStore.isVoterFollowingThisPolitician(politicianWeVoteId),
      voterOpposes: OrganizationStore.isVoterDislikingThisPolitician(politicianWeVoteId),
    };
  }

  functionToUseWhenProfileComplete (support = true, oppose = false, stopSupporting = false, stopOpposing = false) {
    // console.log('HeartFavoriteToggleLive functionToUseWhenProfileComplete');
    const { campaignXWeVoteId, organizationWeVoteId, supportPolitician } = this.props;
    const { politicianWeVoteId } = this.state;
    let campaignSupported = false;
    let campaignSupportedChanged = false;
    const saveVisibleToPublic = true;
    let visibleToPublic = true;
    if (campaignXWeVoteId) {
      campaignSupported = true;
      campaignSupportedChanged = true;
      // From this page we always send value for 'visibleToPublic'
      visibleToPublic = CampaignSupporterStore.getVisibleToPublic(campaignXWeVoteId);
      const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
      if (visibleToPublicChanged) {
        // If it has changed, use new value
        visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
      }
      // console.log('HeartFavoriteToggleLive functionToUseWhenProfileComplete, politicianWeVoteId:', politicianWeVoteId);
    }
    initializejQuery(() => {
      if (support) {
        if (politicianWeVoteId) {
          OrganizationActions.organizationFollow('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          OrganizationActions.organizationFollow(organizationWeVoteId);
        } else if (campaignXWeVoteId) {
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      } else if (stopSupporting) {
        if (politicianWeVoteId) {
          OrganizationActions.organizationStopFollowing('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          OrganizationActions.organizationStopFollowing(organizationWeVoteId);
        } else if (campaignXWeVoteId) {
          campaignSupported = false;
          // TODO: Needs "stop campaign save" method
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      } else if (oppose) {
        if (politicianWeVoteId) {
          // Create organizationDislike
          OrganizationActions.organizationDislike('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          // Create organizationDislike
          OrganizationActions.organizationDislike(organizationWeVoteId);
        } else if (campaignXWeVoteId) {
          // TODO: Needs "oppose" method
          campaignSupported = false;
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      } else if (stopOpposing) {
        if (politicianWeVoteId) {
          // Create organizationStopDisliking
          OrganizationActions.organizationStopDisliking('', politicianWeVoteId);
        } else if (organizationWeVoteId) {
          // Create organizationStopDisliking
          OrganizationActions.organizationStopDisliking(organizationWeVoteId);
        } else if (campaignXWeVoteId) {
          // TODO: Needs "stop opposing" method
          campaignSupported = false;
          CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic); // campaignSupporterSave
        }
      }
      const modalDictionary = {
        becomeMember: false,
        campaignXWeVoteId,
        challengeWeVoteId: '',
        clickSource: 'HEART_FAVORITE_TOGGLE_LIVE_PROFILE_COMPLETE_FUNCTION ',
        isOppose: oppose,
        isStopOpposing: stopOpposing,
        isStopSupporting: stopSupporting,
        isSupport: support,
        politicianWeVoteId,
        showModal: false,
        startCampaign: false,
        supportCampaign: false,
        supportPolitician,
      };
      AppObservableStore.setShowCompleteYourProfileModalDict(modalDictionary);
      AppObservableStore.setShowSignInModal(false);
    });
  }

  submitOpposeClick () {
    const { voterFirstName, voterIsSignedIn, voterLastName, voterOpposes } = this.state;
    // WV-2664: No-op if voter is already opposing — prevents accidental double-increment
    // if a downstream caller fires the action while local state was already in this state.
    if (voterOpposes) return;
    if (!voterIsSignedIn || !voterFirstName || !voterLastName) {
      this.submitActionClick(false, true, false, false);
      return;
    }
    let { supportersCount } = this.state;
    const { opposersCount, voterSupports } = this.state;
    if (voterSupports) {
      supportersCount -= 1;
    }
    this.setState({
      opposersCount: opposersCount + 1,
      supportersCount,
      voterOpposes: true,
      voterSupports: false,
    }, () => this.submitActionClick(false, true, false, false));
  }

  submitStopOpposingClick () {
    const { opposersCount, voterOpposes } = this.state;
    // WV-2664: No-op if voter wasn't opposing to begin with — nothing to roll back.
    if (!voterOpposes) return;
    const oppose = false;
    const support = false;
    const stopOpposing = true;
    const stopSupporting = false;
    this.setState({
      opposersCount: Math.max(0, opposersCount - 1),
      voterOpposes: false,
      voterSupports: false,
    }, () => this.submitActionClick(support, oppose, stopSupporting, stopOpposing));
  }

  submitStopSupportingClick () {
    const { supportersCount, voterSupports } = this.state;
    // WV-2664: No-op if voter wasn't supporting to begin with — nothing to roll back.
    if (!voterSupports) return;
    const oppose = false;
    const support = false;
    const stopOpposing = false;
    const stopSupporting = true;
    // console.log('submitStopSupportingClick');
    this.setState({
      supportersCount: Math.max(0, supportersCount - 1),
      voterOpposes: false,
      voterSupports: false,
    }, () => this.submitActionClick(support, oppose, stopSupporting, stopOpposing));
  }

  submitSupportClick () {
    const { voterFirstName, voterIsSignedIn, voterLastName, voterSupports } = this.state;
    // WV-2664: No-op if voter is already supporting — prevents accidental double-increment.
    if (voterSupports) return;
    if (!voterIsSignedIn || !voterFirstName || !voterLastName) {
      this.submitActionClick(true, false, false, false);
      return;
    }
    let { opposersCount } = this.state;
    const { supportersCount, voterOpposes } = this.state;
    if (voterOpposes) {
      opposersCount -= 1;
    }
    this.setState({
      opposersCount,
      supportersCount: supportersCount + 1,
      voterOpposes: false,
      voterSupports: true,
    }, () => this.submitActionClick(true, false, false, false));
  }

  submitActionClick (support = true, oppose = false, stopSupporting = false, stopOpposing = false) {
    const { campaignXWeVoteId, organizationWeVoteId, supportPolitician } = this.props;
    const { voterFirstName, voterLastName, voterIsSignedIn } = this.state;
    // console.log('HeartFavoriteToggleLive submitActionClick');
    if (!campaignXWeVoteId && !organizationWeVoteId) {
      console.log('HeartFavoriteToggleLive submitActionClick: missing campaignXWeVoteId:', campaignXWeVoteId, ', or organizationWeVoteId:', organizationWeVoteId);
    } else if (!voterIsSignedIn) {
      // Open complete your profile modal
      console.log('HeartFavoriteToggleLive submitActionClick: voter not signed in');
      // DALE 2026-07-12 I don't think this should be here
      // const modalDictionary = {
      //   becomeMember: '',
      //   campaignXWeVoteId: '',
      //   challengeWeVoteId: '',
      //   clickSource: 'HEART_FAVORITE_TOGGLE_LIVE_SUBMIT_ACTION_CLICK ',
      //   isOppose: false,
      //   isStopOpposing: false,
      //   isStopSupporting: false,
      //   isSupport: false,
      //   politicianWeVoteId: '',
      //   showModal: false,
      //   startCampaign: false,
      //   supportCampaign: false,
      //   supportPolitician: false,
      // };
      // AppObservableStore.setShowCompleteYourProfileModalDict(modalDictionary);
    } else if (!voterFirstName || !voterLastName) {
      // Open profile modal and store the heart action to fire after profile completion
      AppObservableStore.setFunctionToCallAfterProfileComplete(
        () => {
          let { supportersCount, opposersCount, voterSupports, voterOpposes } = this.state;

          // WV-2664: Skip only the count mutation if the voter is already in the target state — this
          // prevents a double-increment when the callback fires for a state we already hold. We must
          // NOT early-return: the setState callback below both fires the backend save and closes the
          // Complete-Your-Profile modal, so bailing here would leave the modal stuck open.
          const alreadyInTargetState =
            (support && voterSupports) ||
            (oppose && voterOpposes) ||
            (stopSupporting && !voterSupports) ||
            (stopOpposing && !voterOpposes);

          // modify count of supporters here
          if (!alreadyInTargetState) {
            if (support) {
              if (voterOpposes) opposersCount -= 1;
              supportersCount += 1;
              voterSupports = true;
              voterOpposes = false;
            } else if (oppose) {
              if (voterSupports) supportersCount -= 1;
              opposersCount += 1;
              voterSupports = false;
              voterOpposes = true;
            } else if (stopSupporting) {
              supportersCount = Math.max(0, supportersCount - 1);
              voterSupports = false;
            } else if (stopOpposing) {
              opposersCount = Math.max(0, opposersCount - 1);
              voterOpposes = false;
            }
          }
          // set new support and oppose count states here
          this.setState({
            supportersCount,
            opposersCount,
            voterSupports,
            voterOpposes,
          }, () => {
            // Fire off the backend actions and close modal
            this.functionToUseWhenProfileComplete(support, oppose, stopSupporting, stopOpposing);
          });
        },
      );
      // console.log('HeartFavoriteToggleLive support:', support, ', oppose:', oppose, ', stopSupporting:', stopSupporting, ', stopOpposing:', stopOpposing);
      if (support || oppose) {
        const modalDictionary = {
          becomeMember: false,
          campaignXWeVoteId,
          challengeWeVoteId: '',
          clickSource: 'HEART_FAVORITE_TOGGLE_LIVE_SUBMIT_ACTION_CLICK ',
          isOppose: oppose,
          isStopOpposing: stopOpposing,
          isStopSupporting: stopSupporting,
          isSupport: support,
          politicianWeVoteId: '',
          showModal: true,
          startCampaign: false,
          supportCampaign: false,
          supportPolitician,
        };
        // console.log('HeartFavoriteToggleLive calling AppObservableStore setShowCompleteYourProfileModalDict modalDictionary:', modalDictionary, ', supportPolitician:', supportPolitician);
        AppObservableStore.setShowCompleteYourProfileModalDict(modalDictionary);
      }
    } else {
      if (campaignXWeVoteId) {
        // Mark that voter supports this campaign after they sign in
        AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
      } else if (organizationWeVoteId) {
        // Add equivalent to the above?
      }
      this.functionToUseWhenProfileComplete(support, oppose, stopSupporting, stopOpposing);
    }
  }

  render () {
    renderLog('HeartFavoriteToggleLive');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXWeVoteId, organizationWeVoteId } = this.props;
    const { opposersCount, supportersCount, voterFirstName, voterIsSignedIn, voterLastName, voterOpposes, voterSupports } = this.state;
    const voterProfileComplete = voterIsSignedIn && !!voterFirstName && !!voterLastName;
    // console.log('HeartFavoriteToggleLive render supportPolitician:', supportPolitician);
    // console.log('HeartFavoriteToggleLive campaignXWeVoteId: ', campaignXWeVoteId);
    // console.log('HeartFavoriteToggleLive voterSupports: ', voterSupports, ' voterOpposes: ', voterOpposes);
    // console.log('HeartFavoriteToggleLive supportersCount: ', supportersCount, ', opposersCount: ', opposersCount);
    return (
      <HeartFavoriteToggleLiveContainer>
        <Suspense fallback={<HeartFavoriteToggleBase />}>
          <HeartFavoriteToggleBase
            opposersCount={opposersCount}
            supportersCount={supportersCount}
            campaignXWeVoteId={campaignXWeVoteId}
            organizationWeVoteId={organizationWeVoteId}
            submitOppose={this.submitOpposeClick}
            submitStopOpposing={this.submitStopOpposingClick}
            submitStopSupporting={this.submitStopSupportingClick}
            submitSupport={this.submitSupportClick}
            voterOpposes={voterOpposes}
            voterIsSignedIn={voterIsSignedIn}
            voterProfileComplete={voterProfileComplete}
            voterSupports={voterSupports}
          />
        </Suspense>
      </HeartFavoriteToggleLiveContainer>
    );
  }
}

HeartFavoriteToggleLive.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  organizationWeVoteId: PropTypes.string,
  supportPolitician: PropTypes.bool,
};

const HeartFavoriteToggleLiveContainer = styled.div`
`;

export default HeartFavoriteToggleLive;
