import { Button, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaOpenSafariView } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import { renderLog } from '../../common/utils/logging';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import PremiumableButton from '../Widgets/PremiumableButton';
import CreateConfiguredVersion from './CreateConfiguredVersion';
import SeeTheseSettingsInAction from './SeeTheseSettingsInAction';
import { Actions, DescriptionText, GiantTextInput, HiddenInput, ImageDescription, PreviewImage, SharingColumn, SharingRow } from './SettingsStyled';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const SettingsAccount = React.lazy(() => import(/* webpackChunkName: 'SettingsAccount' */ './SettingsAccount'));
const SettingsAccountLevelChip = React.lazy(() => import(/* webpackChunkName: 'SettingsAccountLeveLChip' */ './SettingsAccountLevelChip'));


class SettingsSharing extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenFeaturePackage: 'FREE',
      chosenFaviconFromFileReader: null,
      chosenLogoFromFileReader: null,
      chosenPreventSharingOpinions: false,
      chosenSocialShareDescription: '',
      chosenSocialShareDescriptionChangedLocally: false,
      chosenSocialShareDescriptionSavedValue: '',
      chosenSocialShareMasterImageFromFileReader: null,
      hideLogo: false,
      organization: {},
      organizationWeVoteId: '',
      uploadImageType: 'headerLogo',
      voter: {},
      voterFeaturePackageExceedsOrEqualsEnterprise: false,
    };
  }

  componentDidMount () {
    // console.log('SettingsSharing componentDidMount');
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange = () => {
    const { chosenSocialShareDescriptionChangedLocally } = this.state;
    let { organizationWeVoteId } = this.state;
    if (!organizationWeVoteId) {
      const voter = VoterStore.getVoter();
      organizationWeVoteId = voter.linked_organization_we_vote_id;
      if (organizationWeVoteId) {
        this.setState({
          organizationWeVoteId,
        });
      }
    }
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const chosenSocialShareDescriptionSavedValue = organization.chosen_social_share_description || '';
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        chosenPreventSharingOpinions: organization.chosen_prevent_sharing_opinions || false,
        chosenSocialShareDescriptionSavedValue,
        hideLogo: organization.chosen_hide_we_vote_logo || false,
        organization,
        voterFeaturePackageExceedsOrEqualsEnterprise,
      });
      // If it hasn't been changed locally, then use the one saved in the API server
      if (!chosenSocialShareDescriptionChangedLocally) {
        this.setState({
          chosenSocialShareDescription: chosenSocialShareDescriptionSavedValue || '',
        });
      }
    }
  };

  onVoterStoreChange = () => {
    const { chosenSocialShareDescriptionChangedLocally } = this.state;
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
    });
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const chosenSocialShareDescriptionSavedValue = organization.chosen_social_share_description || '';
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        chosenSocialShareDescriptionSavedValue,
        organization,
        organizationWeVoteId,
        voterFeaturePackageExceedsOrEqualsEnterprise,
      });
      // If it hasn't been changed locally, then use the one saved in the API server
      if (!chosenSocialShareDescriptionChangedLocally) {
        this.setState({
          chosenSocialShareDescription: chosenSocialShareDescriptionSavedValue || '',
        });
      }
    }
  };

  handleToggleHideLogo = (event) => {
    const { hideLogo, organizationWeVoteId } = this.state;
    // console.log('hidelogo', !hideLogo);
    OrganizationActions.organizationChosenHideWeVoteLogoSave(organizationWeVoteId, !hideLogo);
    this.setState({
      hideLogo: !hideLogo,
    });
    event.preventDefault();
  };

  handleTogglePreventSharingOpinions = (event) => {
    const { chosenPreventSharingOpinions, organizationWeVoteId } = this.state;
    // console.log('chosenPreventSharingOpinions', !chosenPreventSharingOpinions);
    OrganizationActions.organizationPreventSharingOpinions(organizationWeVoteId, !chosenPreventSharingOpinions);
    this.setState({
      chosenPreventSharingOpinions: !chosenPreventSharingOpinions,
    });
    event.preventDefault();
  };

  handleChosenSocialShareDescriptionChange = (event) => {
    const { chosenSocialShareDescription } = this.state;
    if (event.target.value !== chosenSocialShareDescription) {
      this.setState({
        chosenSocialShareDescription: event.target.value || '',
        chosenSocialShareDescriptionChangedLocally: true,
      });
    }
  };

  onSaveChosenSocialShareDescriptionButton = (event) => {
    const { chosenSocialShareDescription, organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenSocialShareDescriptionSave(organizationWeVoteId, chosenSocialShareDescription);
    this.setState({
      chosenSocialShareDescriptionChangedLocally: false,
    });
    event.preventDefault();
  };

  onCancelChosenSocialShareDescriptionButton = () => {
    const { chosenSocialShareDescriptionSavedValue } = this.state;
    this.setState({
      chosenSocialShareDescription: chosenSocialShareDescriptionSavedValue || '',
      chosenSocialShareDescriptionChangedLocally: false,
    });
  };

  handleAddImage = () => {
    const { organizationWeVoteId, uploadImageType } = this.state;
    const file = this.fileSelector.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      if (uploadImageType === 'headerLogo') {
        const chosenLogoFromFileReader = fileReader.result;
        this.setState({ chosenLogoFromFileReader });
        // console.log('chosenLogoFromFileReader:', chosenLogoFromFileReader);
        OrganizationActions.organizationChosenLogoSave(organizationWeVoteId, chosenLogoFromFileReader);
      }
      if (uploadImageType === 'favicon') {
        const chosenFaviconFromFileReader = fileReader.result;
        this.setState({ chosenFaviconFromFileReader });
        // console.log('chosenFaviconFromFileReader:', chosenFaviconFromFileReader);
        OrganizationActions.organizationChosenFaviconSave(organizationWeVoteId, chosenFaviconFromFileReader);
      }
      if (uploadImageType === 'shareImage') {
        const chosenSocialShareMasterImageFromFileReader = fileReader.result;
        this.setState({ chosenSocialShareMasterImageFromFileReader });
        // console.log('chosenSocialShareMasterImageFromFileReader:', chosenSocialShareMasterImageFromFileReader);
        OrganizationActions.organizationChosenSocialShareMasterImageSave(organizationWeVoteId, chosenSocialShareMasterImageFromFileReader);
      }
    });
    fileReader.readAsDataURL(file);
  };

  handleUploadHeaderLogo = () => {
    this.fileSelector.value = null;
    this.fileSelector.click();
    this.setState({ uploadImageType: 'headerLogo' });
  };

  handleUploadFavicon = () => {
    this.fileSelector.value = null;
    this.fileSelector.click();
    this.setState({ uploadImageType: 'favicon' });
  };

  handleUploadShareImage = () => {
    this.fileSelector.value = null;
    this.fileSelector.click();
    this.setState({ uploadImageType: 'shareImage' });
  };

  organizationChosenFaviconDelete = () => {
    const { organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenFaviconDelete(organizationWeVoteId);
    this.setState({
      chosenFaviconFromFileReader: null,
    });
  };

  organizationChosenLogoDelete = () => {
    const { organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenLogoDelete(organizationWeVoteId);
    this.setState({
      chosenLogoFromFileReader: null,
    });
  };

  organizationChosenSocialShareMasterImageDelete = () => {
    const { organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenSocialShareMasterImageDelete(organizationWeVoteId);
    this.setState({
      chosenSocialShareMasterImageFromFileReader: null,
    });
  };

  openPaidAccountUpgradeModal (paidAccountUpgradeMode) {
    //
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    if (isWebApp()) {
      AppObservableStore.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
    } else {
      cordovaOpenSafariView('https://wevote.us/more/pricing', null, 50);
    }
  }

  render () {
    renderLog('SettingsSharing');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, externalUniqueId } = this.props;
    const {
      chosenFaviconFromFileReader,
      chosenFeaturePackage,
      chosenLogoFromFileReader,
      chosenPreventSharingOpinions,
      chosenSocialShareDescription,
      chosenSocialShareDescriptionChangedLocally,
      chosenSocialShareMasterImageFromFileReader,
      hideLogo,
      organization,
      organizationWeVoteId,
      voter,
      voterFeaturePackageExceedsOrEqualsEnterprise,
      voterIsSignedIn,
    } = this.state;
    const {
      chosen_favicon_url_https: chosenFaviconUrlHttps,
      chosen_logo_url_https: chosenLogoUrlHttps,
      chosen_social_share_master_image_url_https: chosenSocialShareMasterImageUrlHttps,
    } = organization;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    } else if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return (
        <Suspense fallback={<></>}>
          <DelayedLoad waitBeforeShow={1000}>
            <SettingsAccount />
          </DelayedLoad>
        </Suspense>
      );
    }
    // console.log('organization: ', organization);
    // console.log('chosenLogoUrlHttps: ', chosenLogoUrlHttps);

    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsSharing, Custom Domain: ', organization.we_vote_custom_domain);
    }
    return (
      <Wrapper>
        <Helmet title="Domain Settings" />
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h2">Logo & Sharing</h1>
            {chosenFeaturePackage === 'FREE' && (
              <>
                <CreateConfiguredVersion />
                <Separator />
              </>
            )}
            <SeeTheseSettingsInAction />
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>Hide We Vote Logo</InputBoxLabel>
                <DescriptionText>
                  Remove the We Vote logo from the header bar.
                  {' '}
                  This setting will also hide the We Vote logo from the favicon and social share images for Enterprise Plans, even if you haven&apos;t uploaded your own.
                </DescriptionText>
              </SharingColumn>
              <SharingColumn alignRight>
                <Switch
                  id={`hideWeVoteLogoSwitch-${externalUniqueId}`}
                  color="primary"
                  checked={hideLogo}
                  onChange={this.handleToggleHideLogo}
                  value="hideLogo"
                  inputProps={{ 'aria-label': 'Hide logo switch' }}
                />
              </SharingColumn>
            </SharingRow>
            <SharingRow style={isCordova() ? {  display: 'none' } : {}}>
              <SharingColumn>
                <InputBoxLabel>Upload Your Own Logo</InputBoxLabel>
                <ImageDescription>
                  <div
                    style={{
                      overflow: 'hidden',
                      width: '132px',
                      minWidth: '132px',
                      minHeight: '42px',
                      height: '42px',
                      maxWidth: '132px !important',
                      maxHeight: '42px !important',
                      marginRight: 'auto',
                      textAlign: 'left',
                    }}
                  >
                    <PreviewImage
                      alt="Uploaded logo"
                      style={{
                        width: 'auto',
                        height: '100%',
                      }}
                      src={chosenLogoFromFileReader || chosenLogoUrlHttps || normalizedImagePath('/img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg')}
                    />
                  </div>
                  <DescriptionText>Place your logo in the header bar. Image will be resized to be no more than 132px wide, and 42px tall.</DescriptionText>
                </ImageDescription>
              </SharingColumn>
              <SharingColumn alignRight>
                <Button
                  color="primary"
                  classes={{ root: classes.uploadButton }}
                  id={`uploadHeaderLogo-${externalUniqueId}`}
                  variant="contained"
                  onClick={this.handleUploadHeaderLogo}
                >
                  Upload
                </Button>
                {
                  (chosenLogoFromFileReader !== null || chosenLogoUrlHttps !== null) && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
                      id={`organizationChosenLogoDelete-${externalUniqueId}`}
                      variant="outlined"
                      onClick={() => this.organizationChosenLogoDelete()}
                    >
                      Remove
                    </Button>
                  )
                }
              </SharingColumn>
            </SharingRow>
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>
                  Upload Favicon
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                  </Suspense>
                </InputBoxLabel>
                <ImageDescription>
                  <PreviewImage
                    alt="Favicon"
                    width="32px"
                    src={chosenFaviconFromFileReader || chosenFaviconUrlHttps || normalizedImagePath('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}
                  />
                  <DescriptionText>The icon for your site in the browser&apos;s tab. Optimal size is 32x32.</DescriptionText>
                </ImageDescription>
              </SharingColumn>
              <SharingColumn alignRight>
                <PremiumableButton
                  classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                  id={`handleUploadFavicon-${externalUniqueId}`}
                  onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.handleUploadFavicon : () => this.openPaidAccountUpgradeModal('enterprise')}
                  premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                >
                  {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                    'Upload'
                  ) : (
                    <>
                      <DesktopView className="u-show-desktop">
                        Upgrade to Enterprise
                      </DesktopView>
                      <MobileTabletView className="u-show-mobile-tablet">
                        Upgrade
                      </MobileTabletView>
                    </>
                  )}
                </PremiumableButton>
                {
                  (chosenFaviconFromFileReader !== null || chosenFaviconUrlHttps !== null) && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
                      id={`organizationChosenFaviconDelete-${externalUniqueId}`}
                      variant="outlined"
                      onClick={() => this.organizationChosenFaviconDelete()}
                    >
                      Remove
                    </Button>
                  )
                }
              </SharingColumn>
            </SharingRow>
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>
                  Social Share Image
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                  </Suspense>
                </InputBoxLabel>
                <ImageDescription>
                  <PreviewImage
                    alt="Social share image"
                    width="96px"
                    src={chosenSocialShareMasterImageFromFileReader || chosenSocialShareMasterImageUrlHttps || normalizedImagePath('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}
                  />
                  <DescriptionText>The icon used when your page is shared on social media. Ideal size is 1600x900. Size must be at least 200x200.</DescriptionText>
                </ImageDescription>
              </SharingColumn>
              <SharingColumn alignRight>
                <PremiumableButton
                  classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                  id={`handleUploadShareImage-${externalUniqueId}`}
                  premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                  onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.handleUploadShareImage : () => this.openPaidAccountUpgradeModal('enterprise')}
                >
                  {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                    'Upload'
                  ) : (
                    <>
                      <DesktopView className="u-show-desktop">
                        Upgrade to Enterprise
                      </DesktopView>
                      <MobileTabletView className="u-show-mobile-tablet">
                        Upgrade
                      </MobileTabletView>
                    </>
                  )}
                </PremiumableButton>
                {
                  (chosenSocialShareMasterImageFromFileReader || chosenSocialShareMasterImageUrlHttps) && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
                      id={`organizationChosenSocialShareMasterImageDelete-${externalUniqueId}`}
                      variant="outlined"
                      onClick={() => this.organizationChosenSocialShareMasterImageDelete()}
                    >
                      Remove
                    </Button>
                  )
                }
              </SharingColumn>
            </SharingRow>
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>
                  Social Share Site Description
                  <Suspense fallback={<></>}>
                    <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                  </Suspense>
                </InputBoxLabel>
                <DescriptionText>A few sentences describing your site. The text used on search engines, or when your page is shared on social media.</DescriptionText>
                <GiantTextInput
                  id={`settingsSharingInputBox-${externalUniqueId}`}
                  onChange={this.handleChosenSocialShareDescriptionChange}
                  value={chosenSocialShareDescription}
                  placeholder="Type Description..."
                />
                <Actions>
                  <Button
                    color="primary"
                    classes={{ root: classes.button }}
                    disabled={!chosenSocialShareDescriptionChangedLocally}
                    id={`cancelChosenSocialShareDescriptionButton-${externalUniqueId}`}
                    onClick={this.onCancelChosenSocialShareDescriptionButton}
                  >
                    Cancel
                  </Button>
                  <PremiumableButton
                    classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                    disabled={voterFeaturePackageExceedsOrEqualsEnterprise ? !chosenSocialShareDescriptionChangedLocally : false}
                    id={`onSaveChosenSocialShareDescriptionButton-${externalUniqueId}`}
                    premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                    onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.onSaveChosenSocialShareDescriptionButton : () => this.openPaidAccountUpgradeModal('enterprise')}
                  >
                    {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                      'Save'
                    ) : (
                      <>
                        <DesktopView className="u-show-desktop">
                          Upgrade to Enterprise
                        </DesktopView>
                        <MobileTabletView className="u-show-mobile-tablet">
                          Upgrade
                        </MobileTabletView>
                      </>
                    )}
                  </PremiumableButton>
                </Actions>
              </SharingColumn>
            </SharingRow>
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>Prohibit Sharing With Opinions</InputBoxLabel>
                <DescriptionText>
                  Turn off the ability for voters to share their opinions from the &quot;Share&quot; buttons.
                  {' '}
                  If you are a 501(c)(3) nonprofit organization, this option must be turned on because the IRS does not allow you to provide voters with a way to share their opinions with other voters from a website you manage.
                </DescriptionText>
              </SharingColumn>
              <SharingColumn alignRight>
                <Switch
                  color="primary"
                  checked={chosenPreventSharingOpinions}
                  id={`chosenPreventSharingOpinions-${externalUniqueId}`}
                  onChange={this.handleTogglePreventSharingOpinions}
                  value="chosenPreventSharingOpinions"
                  inputProps={{ 'aria-label': 'Prevent sharing opinions switch' }}
                />
              </SharingColumn>
            </SharingRow>
          </CardMain>
        </Card>
        <HiddenInput type="file" accept="image/x-png,image/jpeg" onChange={this.handleAddImage} ref={(input) => { this.fileSelector = input; }} />
      </Wrapper>
    );
  }
}
SettingsSharing.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = (theme) => ({
  button: {
    marginRight: 8,
  },
  upgradeButton: {
    [theme.breakpoints.down('md')]: {
      width: 97,
    },
  },
  uploadButton: {
    width: 97,
    margin: '4px 0',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
`;

const Card = styled.div`
`;

const CardMain = styled.div`
`;

const InputBoxLabel = styled.h4`
  font-weight: bold;
  font-size: 14px;
  margin-top: .5em;
`;

const DesktopView = styled.div`
  display: inherit;
`;

const MobileTabletView = styled.div`
  display: inherit;
`;

const Separator = styled.div`
  width: 100%;
  height: 2px;
  background: #eee;
  margin: 16px 0;
`;

export default withStyles(styles)(SettingsSharing);

