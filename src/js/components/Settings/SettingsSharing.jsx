import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/esm/styles';
import Switch from '@material-ui/core/esm/Switch';
import Button from '@material-ui/core/esm/Button';
import AppActions from '../../actions/AppActions';
import { cordovaDot } from '../../utils/cordovaUtils';
import LoadingWheel from '../LoadingWheel';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import PremiumableButton from '../Widgets/PremiumableButton';
import { renderLog } from '../../utils/logging';
import SettingsAccountLevelChip from './SettingsAccountLevelChip';
import { ImageDescription, LinkToDomainRow, PreviewImage, DescriptionText, SharingRow, SharingColumn, GiantTextInput, HiddenInput, Actions } from './SettingsStyled';
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
      chosenSocialShareDescription: '',
      chosenSocialShareDescriptionChangedLocally: false,
      chosenSocialShareDescriptionSavedValue: '',
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
    if (this.state.chosenSocialShareDescription !== nextState.chosenSocialShareDescription) {
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
      const organizationChosenSubdomain = organization.chosen_subdomain_string || '';
      const organizationChosenDomainName = organization.chosen_domain_string || '';
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const chosenSocialShareDescriptionSavedValue = organization.chosen_social_share_description || '';
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        chosenFaviconUrlHttps: organization.chosen_favicon_url_https,
        chosenLogoUrlHttps: organization.chosen_logo_url_https,
        chosenSocialShareDescriptionSavedValue,
        chosenSocialShareMasterImageUrlHttps: organization.chosen_social_share_master_image_url_https,
        hideLogo: organization.chosen_hide_we_vote_logo || false,
        organization,
        organizationChosenSubdomain,
        organizationChosenDomainName,
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
      const organizationChosenSubdomain = organization.chosen_subdomain_string || '';
      const organizationChosenDomainName = organization.chosen_domain_string || '';
      const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
      const chosenSocialShareDescriptionSavedValue = organization.chosen_social_share_description || '';
      const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
      this.setState({
        chosenFeaturePackage,
        chosenFaviconUrlHttps: organization.chosen_favicon_url_https,
        chosenLogoUrlHttps: organization.chosen_logo_url_https,
        chosenSocialShareDescriptionSavedValue,
        chosenSocialShareMasterImageUrlHttps: organization.chosen_social_share_master_image_url_https,
        organization,
        organizationChosenDomainName,
        organizationChosenSubdomain,
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
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  render () {
    renderLog('SettingsSharing');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      chosenFaviconFromFileReader,
      chosenFeaturePackage,
      chosenLogoFromFileReader,
      chosenSocialShareDescription,
      chosenSocialShareDescriptionChangedLocally,
      chosenSocialShareMasterImageFromFileReader,
      hideLogo,
      organization,
      organizationChosenDomainName,
      organizationChosenSubdomain,
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
            <Introduction>
              {chosenFeaturePackage === 'FREE' && (
                <>
                  Want to create a configured version of We Vote you can send out to your followers?
                  {' '}
                  <OpenExternalWebSite
                    url="https://help.wevote.us/hc/en-us/articles/360037725754-Customizing-Your-Voter-Guide"
                    target="_blank"
                    body={(<span>Learn more here.</span>)}
                  />
                </>
              )}
            </Introduction>
            {organizationChosenSubdomain || organizationChosenDomainName ? (
              <LinkToDomainRow>
                To see the changes you make on this page, please visit:
                {' '}
                {organizationChosenSubdomain && (
                  <OpenExternalWebSite
                    url={`https://${organizationChosenSubdomain}.WeVote.US`}
                    target="_blank"
                    body={(<span>{`https://${organizationChosenSubdomain}.WeVote.US`}</span>)}
                  />
                )}
                {organizationChosenDomainName && (
                  <OpenExternalWebSite
                    url={`https://${organizationChosenDomainName}`}
                    target="_blank"
                    body={(<span>{`https://${organizationChosenDomainName}`}</span>)}
                  />
                )}
              </LinkToDomainRow>
            ) : (
              <LinkToDomainRow>
                To see these settings in action, enter a subdomain or domain name on the
                {' '}
                <Link to="/settings/domain">
                  <strong>
                    Your Settings &gt; Domain
                  </strong>
                </Link>
                {' '}
                page.
              </LinkToDomainRow>
            )}
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
                      src={chosenLogoFromFileReader || chosenLogoUrlHttps || cordovaDot('/img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg')}
                    />
                  </div>
                  <DescriptionText>Place your logo in the header bar. Image will be resized to be no more than 132px wide, and 42px tall.</DescriptionText>
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
                      <DesktopView className="u-show-desktop">
                        Upgrade to Enterprise
                      </DesktopView>
                      <MobileTabletView className="u-show-mobile-tablet">
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
                      <DesktopView className="u-show-desktop">
                        Upgrade to Enterprise
                      </DesktopView>
                      <MobileTabletView className="u-show-mobile-tablet">
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
                <GiantTextInput
                  onChange={this.handleChosenSocialShareDescriptionChange}
                  value={chosenSocialShareDescription}
                  placeholder="Type Description..."
                />
                <Actions>
                  <Button
                    color="primary"
                    classes={{ root: classes.button }}
                    disabled={!chosenSocialShareDescriptionChangedLocally}
                    onClick={this.onCancelChosenSocialShareDescriptionButton}
                  >
                    Cancel
                  </Button>
                  <PremiumableButton
                    classes={{ root: voterFeaturePackageExceedsOrEqualsEnterprise ? classes.uploadButton : '' }}
                    disabled={voterFeaturePackageExceedsOrEqualsEnterprise ? !chosenSocialShareDescriptionChangedLocally : false}
                    premium={voterFeaturePackageExceedsOrEqualsEnterprise ? 1 : 0}
                    onClick={voterFeaturePackageExceedsOrEqualsEnterprise ? this.onSaveChosenSocialShareDescriptionButton : () => this.openPaidAccountUpgradeModal('enterprise')}
                  >
                    {voterFeaturePackageExceedsOrEqualsEnterprise ? (
                      'Save'
                    ) : (
                      <React.Fragment>
                        <DesktopView className="u-show-desktop">
                          Upgrade to Enterprise
                        </DesktopView>
                        <MobileTabletView className="u-show-mobile-tablet">
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

const Introduction = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
`;

export default withStyles(styles)(SettingsSharing);

