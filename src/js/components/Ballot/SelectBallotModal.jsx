import { Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Select } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterStore from '../../stores/VoterStore';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import { calculateBallotBaseUrl } from '../../utils/textFormat';
import EditAddressInPlace from '../Widgets/EditAddressInPlace';

const MapChart = React.lazy(() => import(/* webpackChunkName: 'MapChart' */ '../Widgets/MapChart/MapChart'));
const BallotElectionListWithFilters = React.lazy(() => import(/* webpackChunkName: 'BallotElectionListWithFilters' */ './BallotElectionListWithFilters'));


class SelectBallotModal extends Component {
  // This modal will show a users ballot guides from previous and current elections.
  constructor (props) {
    super(props);
    this.state = {
      editingAddress: false,
      selectedState: 'all',
      upcoming: true,
      prior: false,
    };

    this.handleChooseStateChange = this.handleChooseStateChange.bind(this);
  }

  componentDidMount () {
    AnalyticsActions.saveActionSelectBallotModal(VoterStore.electionId());
  }

  //
  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   const { location: { pathname } } = window;
  //   if (pathname !== nextProps.pathname) {
  //     // console.log('pathname:', pathname, ', nextProps.pathname:', nextProps.pathname);
  //     return true;
  //   }
  //   if (this.state.selectedState !== nextState.selectedState) return true;
  //   if (this.state.prior !== nextState.prior) return true;
  //   if (this.state.upcoming !== nextState.upcoming) return true;
  //   if (this.props.ballotBaseUrl !== nextProps.ballotBaseUrl) {
  //     // console.log('this.props.ballotBaseUrl:', this.props.ballotBaseUrl, ', nextProps.ballotBaseUrl:', nextProps.ballotBaseUrl);
  //     return true;
  //   }
  //   if (this.props.hideAddressEdit !== nextProps.hideAddressEdit) {
  //     // console.log('this.props.hideAddressEdit:', this.props.hideAddressEdit, ', nextProps.hideAddressEdit:', nextProps.hideAddressEdit);
  //     return true;
  //   }
  //   if (this.props.hideElections !== nextProps.hideElections) {
  //     // console.log('this.props.hideElections:', this.props.hideElections, ', nextProps.hideElections:', nextProps.hideElections);
  //     return true;
  //   }
  //   if (this.props.organization_we_vote_id !== nextProps.organization_we_vote_id) {
  //     // console.log('this.props.organization_we_vote_id:', this.props.organization_we_vote_id, ', nextProps.organization_we_vote_id:', nextProps.organization_we_vote_id);
  //     return true;
  //   }
  //   // console.log('shouldComponentUpdate no change');
  //   return false;
  // }

  handleChooseStateChange (e) {
    this.setState({ selectedState: e.target.value });
    // console.log(e.target.value);
  }

  mapHandler = (stateAbbrFromMap) => {
    // console.log('stateAbbrFromMap: ', stateAbbrFromMap);
    this.setState({ selectedState: stateAbbrFromMap });
  };

  toggleEditingAddress = () => {
    const { editingAddress } = this.state;
    this.setState({
      editingAddress: !editingAddress,
    });
  }

  render () {
    renderLog('SelectBallotModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, hideAddressEdit, hideElections, show } = this.props;
    const { location: { pathname } } = window;
    const { editingAddress } = this.state;
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, pathname);

    const voterAddressObject = VoterStore.getAddressObject();
    let dialogTitleText = 'Address & Elections';
    if (hideAddressEdit || hideElections) {
      dialogTitleText = '';
    }

    // console.log('SelectBallotModal render, voter_address_object: ', voter_address_object);
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={show}
        onClose={() => { this.props.toggleFunction(pathname); }}
        id="SelectBallotModalId"
      >
        <DialogTitle>
          <Title id="SelectBallotModalTitleId">
            {dialogTitleText}
          </Title>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.props.toggleFunction(); }}
            id="profileCloseSelectBallotModal"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Row>
            <div className="u-show-mobile-tablet">
              {!hideAddressEdit && (
                <EditAddressInPlaceWrapperMobile>
                  <EditAddressInPlace
                    address={voterAddressObject}
                    ballotBaseUrl={ballotBaseUrl}
                    defaultIsEditingAddress={editingAddress}
                    // toggleFunction={this.props.toggleFunction}
                    toggleEditingAddress={this.toggleEditingAddress}
                  />
                </EditAddressInPlaceWrapperMobile>
              )}
              {!editingAddress && (
                <MapChartWrapper>
                  <Suspense fallback={<></>}>
                    <MapChart onClickFunction={this.mapHandler} />
                  </Suspense>
                </MapChartWrapper>
              )}
            </div>
            {!editingAddress && (
              <MapChartWrapperDesktop className="u-show-desktop">
                <Suspense fallback={<></>}>
                  <MapChart onClickFunction={this.mapHandler} />
                </Suspense>
              </MapChartWrapperDesktop>
            )}
            <SidebarWrapper>
              <div className="u-show-desktop">
                {!hideAddressEdit && (
                  <EditAddressInPlace
                    address={voterAddressObject}
                    ballotBaseUrl={ballotBaseUrl}
                    defaultIsEditingAddress={editingAddress}
                    // toggleFunction={this.props.toggleFunction}
                    toggleEditingAddress={this.toggleEditingAddress}
                  />
                )}
              </div>
              {!editingAddress && (
                <ElectionChoiceWrapper>
                  <ToggleGroup>
                    <PriorButton onClick={() => this.setState({ prior: true, upcoming: false })} variant={this.state.prior ? 'contained' : 'outlined'} color="primary">Prior</PriorButton>
                    <UpcomingButton onClick={() => this.setState({ prior: false, upcoming: true })} variant={this.state.upcoming ? 'contained' : 'outlined'} color="primary">Upcoming</UpcomingButton>
                  </ToggleGroup>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple" />
                    <Select
                      classes={{ select: classes.select }}
                      native
                      value={this.state.selectedState}
                      onChange={this.handleChooseStateChange}
                      label=""
                      inputProps={{
                        name: 'age',
                        id: 'outlined-age-native-simple',
                      }}
                    >
                      <option aria-label="-- show all states --" value="all">-- show all states --</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </Select>
                  </FormControl>
                  <BallotElectionListWrapper addTopMargin={!hideAddressEdit}>
                    <Suspense fallback={<></>}>
                      <BallotElectionListWithFilters
                          ballotBaseUrl={ballotBaseUrl}
                          organizationWeVoteId={this.props.organization_we_vote_id}
                          showPriorElectionsList={this.state.prior}
                          hideUpcomingElectionsList={this.state.prior}
                          stateToShow={this.state.selectedState}
                          toggleFunction={this.props.toggleFunction}
                          mode={this.state.upcoming ? 'upcoming' : 'prior'}
                      />
                    </Suspense>
                  </BallotElectionListWrapper>
                </ElectionChoiceWrapper>
              )}
            </SidebarWrapper>
          </Row>
          {/* )} */}
        </DialogContent>
      </Dialog>
    );
  }
}
SelectBallotModal.propTypes = {
  ballotBaseUrl: PropTypes.string,
  classes: PropTypes.object,
  hideAddressEdit: PropTypes.bool,
  hideElections: PropTypes.bool,
  organization_we_vote_id: PropTypes.string, // If looking at voter guide, we pass in the parent organization_we_vote_id
  show: PropTypes.bool,
  toggleFunction: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    minHeight: '80%',
    maxHeight: '90%',
    height: '80%',
    width: '90%',
    maxWidth: '1200px',
    [theme.breakpoints.down('xs')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
      top: '20px',
    },
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
  formControl: {
    width: '100%',
    marginTop: 16,
  },
  select: {
    padding: '12px 12px',
    margin: '0px 1px',
  },
});

const EditAddressInPlaceWrapperMobile = styled.div`
  margin-top: 18px;
  width: 100%;
`;

const ElectionChoiceWrapper = styled.div`
  margin-top: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  margin-top: 6px;
  text-align: left;
`;

const Row = styled.div`
  margin-top: -8px;
  margin-bottom: -8px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  @media(min-width: 860px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const MapChartWrapper = styled.div`
  display: block;
  width: 100%;
  padding: 12px;
  top: 0;
  svg {
    margin-top: -22px;
  }
  @media(min-width: 576px) {
    width: auto;
    flex: 1 1 0;
  }
  // @media (min-width: 860px) {
  //   display: block;
  //   width: 50%;
  //   padding: 16px;
  //   position: sticky;
  //   top: 0;
  //   svg {
  //     margin-top: -36px;
  //   }
  // }
`;

const MapChartWrapperDesktop = styled.div`
  display: block;
  width: 50%;
  padding: 12px;
  top: 0;
  svg {
    margin-top: -22px;
  }
  @media (min-width: 860px) {
    display: block;
    padding: 16px;
    position: sticky;
    top: 0;
    svg {
      margin-top: -36px;
    }
  }
`;

const SidebarWrapper = styled.div`
  padding: 16px;
  @media (max-width: 575px) {
    padding-top: 0;
  }
  @media(min-width: 576px) {
    max-width: 50%;
    width: auto;
    flex: 1 1 0;
  }
`;

const BallotElectionListWrapper = styled.div`
  margin-top: ${(props) => (props.addTopMargin ? '24px' : '0')};
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% + 4px);
  position: relative;
  left: -2px;
`;

const PriorButton = styled(Button)`
  position: relative;
  right: -2px;
  width: calc(50% + 2px);
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
`;

const UpcomingButton = styled(Button)`
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  position: relative;
  left: -2px;
  width: calc(50% + 2px);
  z-index: 0;
`;

export default withTheme(withStyles(styles)(SelectBallotModal));
