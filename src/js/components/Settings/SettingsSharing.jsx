import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import AppActions from '../../actions/AppActions';
import { cordovaDot } from '../../utils/cordovaUtils';
import LoadingWheel from '../LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import PremiumableButton from '../Widgets/PremiumableButton';
import { renderLog } from '../../utils/logging';
import SettingsAccountLevelChip from './SettingsAccountLevelChip';
import { ImageDescription, PreviewImage, DescriptionText, SharingRow, SharingColumn, GiantTextInput, HiddenInput, Actions } from './SettingsStyled';
import VoterStore from '../../stores/VoterStore';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';

class SettingsSharing extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      chosenFeaturePackage: 'FREE',
      chosenFaviconFromFileReader: null,
      chosenFaviconUrlHttps: null,
      chosenLogoFromFileReader: null,
      chosenLogoUrlHttps: null,
      chosenSocialShareMasterImageFromFileReader: null,
      chosenSocialShareMasterImageUrlHttps: null,
      hideLogo: false,
      organization: {},
      organizationWeVoteId: '',
      siteDescription: '',
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

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.chosenFeaturePackage !== nextState.chosenFeaturePackage) {
      // console.log('this.state.chosenFeaturePackage', this.state.chosenFeaturePackage, ', nextState.chosenFeaturePackage', nextState.chosenFeaturePackage);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('this.state.voterIsSignedIn', this.state.voterIsSignedIn, ', nextState.voterIsSignedIn', nextState.voterIsSignedIn);
      return true;
    }
    if (this.state.hideLogo !== nextState.hideLogo) {
      return true;
    }
    if (this.state.siteDescription !== nextState.siteDescription) {
      return true;
    }
    if (this.state.chosenFaviconFromFileReader !== nextState.chosenFaviconFromFileReader) {
      return true;
    }
    if (this.state.chosenFaviconUrlHttps !== nextState.chosenFaviconUrlHttps) {
      // console.log('this.state.chosenFaviconUrlHttps', this.state.chosenFaviconUrlHttps, ', nextState.chosenFaviconUrlHttps', nextState.chosenFaviconUrlHttps);
      return true;
    }
    if (this.state.chosenLogoFromFileReader !== nextState.chosenLogoFromFileReader) {
      // console.log('this.state.chosenLogoFromFileReader', this.state.chosenLogoFromFileReader, ', nextState.chosenLogoFromFileReader', nextState.chosenLogoFromFileReader);
      return true;
    }
    if (this.state.chosenLogoUrlHttps !== nextState.chosenLogoUrlHttps) {
      // console.log('this.state.chosenLogoUrlHttps', this.state.chosenLogoUrlHttps, ', nextState.chosenLogoUrlHttps', nextState.chosenLogoUrlHttps);
      return true;
    }
    if (this.state.chosenSocialShareMasterImageFromFileReader !== nextState.chosenSocialShareMasterImageFromFileReader) {
      return true;
    }
    if (this.state.chosenSocialShareMasterImageUrlHttps !== nextState.chosenSocialShareMasterImageUrlHttps) {
      // console.log('this.state.chosenSocialShareMasterImageUrlHttps', this.state.chosenSocialShareMasterImageUrlHttps, ', nextState.chosenSocialShareMasterImageUrlHttps', nextState.chosenSocialShareMasterImageUrlHttps);
      return true;
    }
    if (this.state.voterFeaturePackageExceedsOrEqualsEnterprise !== nextState.voterFeaturePackageExceedsOrEqualsEnterprise) {
      return true;
    }
    const priorOrganization = this.state.organization;
    const nextOrganization = nextState.organization;

    const priorWeVoteCustomDomain = priorOrganization.we_vote_custom_domain || '';
    const nextWeVoteCustomDomain = nextOrganization.we_vote_custom_domain || '';

    if (priorWeVoteCustomDomain !== nextWeVoteCustomDomain) {
      // console.log('priorWeVoteCustomDomain', priorWeVoteCustomDomain, ', nextWeVoteCustomDomain', nextWeVoteCustomDomain);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange = () => {
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
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
    this.setState({
      chosenFeaturePackage,
      chosenFaviconUrlHttps: organization.chosen_favicon_url_https,
      chosenLogoUrlHttps: organization.chosen_logo_url_https,
      chosenSocialShareMasterImageUrlHttps: organization.chosen_social_share_master_image_url_https,
      hideLogo: organization.chosen_hide_we_vote_logo || false,
      organization,
      voterFeaturePackageExceedsOrEqualsEnterprise,
    });
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
    this.setState({
      chosenFeaturePackage,
      chosenFaviconUrlHttps: organization.chosen_favicon_url_https,
      chosenLogoUrlHttps: organization.chosen_logo_url_https,
      chosenSocialShareMasterImageUrlHttps: organization.chosen_social_share_master_image_url_https,
      organization,
      organizationWeVoteId,
      voter,
      voterFeaturePackageExceedsOrEqualsEnterprise,
      voterIsSignedIn,
    });
  }

  handleToggleHideLogo = (event) => {
    const { hideLogo, organizationWeVoteId } = this.state;
    // console.log('hidelogo', !hideLogo);
    OrganizationActions.organizationChosenHideWeVoteLogoSave(organizationWeVoteId, !hideLogo);
    this.setState({
      hideLogo: !hideLogo,
      // organizationChosenHideWeVoteLogoChangedLocally: false,
    });
    event.preventDefault();
  }

  handleChangeDescription = ({ target }) => this.setState({ siteDescription: target.value });

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
  }

  handleUploadHeaderLogo = () => {
    this.fileSelector.value = null;
    this.fileSelector.click();
    this.setState({ uploadImageType: 'headerLogo' });
  }

  handleUploadFavicon = () => {
    this.fileSelector.value = null;
    this.fileSelector.click();
    this.setState({ uploadImageType: 'favicon' });
  }

  handleUploadShareImage = () => {
    this.fileSelector.value = null;
    this.fileSelector.click();
    this.setState({ uploadImageType: 'shareImage' });
  }

  organizationChosenFaviconDelete = () => {
    const { organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenFaviconDelete(organizationWeVoteId);
    this.setState({
      chosenFaviconFromFileReader: null,
    });
  }

  organizationChosenLogoDelete = () => {
    const { organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenLogoDelete(organizationWeVoteId);
    this.setState({
      chosenLogoFromFileReader: null,
    });
  }

  organizationChosenSocialShareMasterImageDelete = () => {
    const { organizationWeVoteId } = this.state;
    OrganizationActions.organizationChosenSocialShareMasterImageDelete(organizationWeVoteId);
    this.setState({
      chosenSocialShareMasterImageFromFileReader: null,
    });
  }

  openPaidAccountUpgradeModal (paidAccountUpgradeMode) {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  render () {
    // console.log('SettingsSharing render');
    renderLog(__filename);
    const { classes } = this.props;
    const {
      chosenFeaturePackage,
      organization,
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
      hideLogo,
      voterFeaturePackageExceedsOrEqualsEnterprise,
      chosenLogoFromFileReader,
      chosenFaviconFromFileReader,
      chosenSocialShareMasterImageFromFileReader,
    } = this.state;
    const {
      chosen_favicon_url_https: chosenFaviconUrlHttps,
      chosen_logo_url_https: chosenLogoUrlHttps,
      chosen_social_share_master_image_url_https: chosenSocialShareMasterImageUrlHttps,
    } = organization;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }
    // console.log('organization: ', organization);
    // console.log('chosenLogoUrlHttps: ', chosenLogoUrlHttps);

    if (voterIsSignedIn) {
      // console.log('SettingsSharing, Signed In.');
    }
    if (organization && organization.we_vote_custom_domain) {
      // console.log('SettingsSharing, Custom Domain: ', organization.we_vote_custom_domain);
    }
    return (
      <Wrapper>
        <Helmet title="Domain Settings" />
        <Card className="card">
          <CardMain className="card-main">
            <h1 className="h2">Sharing Information</h1>
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>Hide We Vote Logo</InputBoxLabel>
                <DescriptionText>Remove the We Vote logo from the header bar.</DescriptionText>
              </SharingColumn>
              <SharingColumn alignRight>
                <Switch
                  color="primary"
                  checked={hideLogo}
                  onChange={this.handleToggleHideLogo}
                  value="hideLogo"
                  inputProps={{ 'aria-label': 'Hide logo switch' }}
                />
              </SharingColumn>
            </SharingRow>
            <SharingRow>
              <SharingColumn>
                <InputBoxLabel>Upload Your Own Logo</InputBoxLabel>
                <ImageDescription>
                  <PreviewImage
                    alt="Uploaded logo"
                    width="128px"
                    src={chosenLogoFromFileReader || chosenLogoUrlHttps || cordovaDot('/img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg')}
                  />
                  <DescriptionText>Place your logo in the header bar. Image will be resized to be no more than 128px wide, and 32px tall.</DescriptionText>
                </ImageDescription>
              </SharingColumn>
              <SharingColumn alignRight>
                <Button
                  color="primary"
                  classes={{ root: classes.uploadButton }}
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
                  <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                </InputBoxLabel>
                <ImageDescription>
                  <PreviewImage
                    alt="Favicon"
                    width="32px"
                    src={chosenFaviconFromFileReader || chosenFaviconUrlHttps || cordovaDot('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}
                  />
                  <DescriptionText>The icon for your site in the browser&apos;s tab. Optimal size is 32x32.</DescriptionText>
                </ImageDescription>
              </SharingColumn>
              <SharingColumn alignRight>
                <PremiumableButton
                  classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                  premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                  onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.handleUploadFavicon : () => this.openPaidAccountUpgradeModal('enterprise')}
                >
                  {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                    'Upload'
                  ) : (
                    <React.Fragment>
                      <DesktopView>
                        Upgrade to Enterprise
                      </DesktopView>
                      <MobileTabletView>
                        Upgrade
                      </MobileTabletView>
                    </React.Fragment>
                  )}
                </PremiumableButton>
                {
                  (chosenFaviconFromFileReader !== null || chosenFaviconUrlHttps !== null) && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
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
                  <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                </InputBoxLabel>
                <ImageDescription>
                  <PreviewImage
                    alt="Social share image"
                    width="96px"
                    src={chosenSocialShareMasterImageFromFileReader || chosenSocialShareMasterImageUrlHttps || cordovaDot('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}
                  />
                  <DescriptionText>The icon used when your page is shared on social media. Ideal size is 1600x900. Size must be at least 200x200.</DescriptionText>
                </ImageDescription>
              </SharingColumn>
              <SharingColumn alignRight>
                <PremiumableButton
                  classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                  premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                  onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.handleUploadShareImage : () => this.openPaidAccountUpgradeModal('enterprise')}
                >
                  {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                    'Upload'
                  ) : (
                    <React.Fragment>
                      <DesktopView>
                        Upgrade to Enterprise
                      </DesktopView>
                      <MobileTabletView>
                        Upgrade
                      </MobileTabletView>
                    </React.Fragment>
                  )}
                </PremiumableButton>
                {
                  (chosenSocialShareMasterImageFromFileReader || chosenSocialShareMasterImageUrlHttps) && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
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
                  <SettingsAccountLevelChip chosenFeaturePackage={chosenFeaturePackage} requiredFeaturePackage="ENTERPRISE" />
                </InputBoxLabel>
                <DescriptionText>A few sentences describing your site. The text used on search engines, or when your page is shared on social media.</DescriptionText>
                <GiantTextInput placeholder="Type Description..." onChange={this.handleChangeDescription} />
                <Actions>
                  <Button
                    color="primary"
                    classes={{ root: classes.button }}
                  >
                    Cancel
                  </Button>
                  <PremiumableButton
                    classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                    premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                    onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.handleSaveDescription : () => this.openPaidAccountUpgradeModal('enterprise')}
                  >
                    {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                      'Save'
                    ) : (
                      <React.Fragment>
                        <DesktopView>
                        Upgrade to Enterprise
                        </DesktopView>
                        <MobileTabletView>
                        Upgrade
                        </MobileTabletView>
                      </React.Fragment>
                    )}
                  </PremiumableButton>
                </Actions>
              </SharingColumn>
            </SharingRow>
          </CardMain>
        </Card>
        <HiddenInput type="file" accept="image/x-png,image/jpeg" onChange={this.handleAddImage} ref={(input) => { this.fileSelector = input; }} />
      </Wrapper>
    );
  }
}

const styles = theme => ({
  button: {
    marginRight: 8,
  },
  uogradeButton: {
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
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileTabletView = styled.div`
  display: inherit;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export default withStyles(styles)(SettingsSharing);

