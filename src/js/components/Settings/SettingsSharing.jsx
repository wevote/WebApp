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
      faviconImageSource: null,
      headerLogoImageSource: null,
      hideLogo: false,
      organization: {},
      organizationWeVoteId: '',
      shareImageSource: null,
      siteDescription: '',
      uploadImageType: 'headerLogo',
      voter: {},
      voterFeaturePackageExceedsOrEqualsEnterprise: false,
    };
  }

  componentDidMount () {
    console.log('SettingsSharing componentDidMount');
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
    if (this.state.headerLogoImageSource !== nextState.headerLogoImageSource) {
      return true;
    }
    if (this.state.shareImageSource !== nextState.shareImageSource) {
      return true;
    }
    if (this.state.faviconImageSource !== nextState.faviconImageSource) {
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
      hideLogo: organization.chosen_hide_we_vote_logo || false,
      organization,
      voterFeaturePackageExceedsOrEqualsEnterprise,
    });
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    const voterFeaturePackageExceedsOrEqualsEnterprise = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, 'ENTERPRISE');
    this.setState({
      chosenFeaturePackage,
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
      organizationWeVoteId,
      voter,
      voterFeaturePackageExceedsOrEqualsEnterprise,
      voterIsSignedIn,
    });
  }

  handleToggleHideLogo = (event) => {
    const { hideLogo, organizationWeVoteId } = this.state;
    console.log('hidelogo', !hideLogo);
    OrganizationActions.organizationChosenHideWeVoteLogoSave(organizationWeVoteId, !hideLogo);
    this.setState({
      hideLogo: !hideLogo,
      // organizationChosenHideWeVoteLogoChangedLocally: false,
    });
    event.preventDefault();
  }

  handleChangeDescription = ({ target }) => this.setState({ siteDescription: target.value });

  handleAddImage = () => {
    const { uploadImageType } = this.state;
    const file = this.fileSelector.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      if (uploadImageType === 'headerLogo') {
        this.setState({ headerLogoImageSource: fileReader.result });
      }
      if (uploadImageType === 'favicon') {
        this.setState({ faviconImageSource: fileReader.result });
      }
      if (uploadImageType === 'shareImage') {
        this.setState({ shareImageSource: fileReader.result });
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

  openPaidAccountUpgradeModal (paidAccountUpgradeMode) {
    // console.log('SettingsDomain openPaidAccountUpgradeModal');
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  render () {
    console.log('SettingsSharing render');
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
      headerLogoImageSource,
      faviconImageSource,
      shareImageSource,
    } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

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
                  <PreviewImage alt="We Vote logo" width="125px" src={headerLogoImageSource || cordovaDot('/img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg')}  />
                  <DescriptionText>Place your logo in the header bar. Image must be 125x30.</DescriptionText>
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
                  headerLogoImageSource !== null && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
                      variant="outlined"
                      onClick={() => this.setState({ headerLogoImageSource: null })}
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
                  <PreviewImage alt="We Vote logo" width="48px" src={faviconImageSource || cordovaDot('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}  />
                  <DescriptionText>The icon for your site in the browser&apos;s tab. PNG files only. Optimal size is 16x16.</DescriptionText>
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
                  faviconImageSource !== null && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
                      variant="outlined"
                      onClick={() => this.setState({ faviconImageSource: null })}
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
                  <PreviewImage alt="We Vote logo" width="96px" src={shareImageSource || cordovaDot('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}  />
                  <DescriptionText>The icon used when your page is shared on social media. Size must be at least 200x200.</DescriptionText>
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
                  shareImageSource !== null && (
                    <Button
                      classes={{ root: classes.uploadButton }}
                      color="primary"
                      variant="outlined"
                      onClick={() => this.setState({ shareImageSource: null })}
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

