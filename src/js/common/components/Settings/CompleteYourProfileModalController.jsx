import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CompleteYourProfileModal from './CompleteYourProfileModal';
import { renderLog } from '../../utils/logging';

class CompleteYourProfileModalController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CompleteYourProfileModalController, componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    const showCompleteYourProfileModal = AppObservableStore.showCompleteYourProfileModal();
    this.setState({
      showCompleteYourProfileModal,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const showCompleteYourProfileModal = AppObservableStore.showCompleteYourProfileModal();
    this.setState({
      showCompleteYourProfileModal,
    });
  }

  closeModal () {
    // console.log('CompleteYourProfileModalController closeModal');
    AppObservableStore.setShowCompleteYourProfileModal(false);
  }

  render () {
    renderLog('CompleteYourProfileModalController');  // Set LOG_RENDER_EVENTS to log all renders

    const { becomeMember, campaignXWeVoteId, startCampaign, supportCampaign } = this.props;
    const { showCompleteYourProfileModal } = this.state;
    return (
      <div>
        {showCompleteYourProfileModal && (
          <CompleteYourProfileModal
            becomeMember={becomeMember}
            campaignXWeVoteId={campaignXWeVoteId}
            closeFunction={this.closeModal}
            functionToUseWhenProfileComplete={this.props.functionToUseWhenProfileComplete}
            show={showCompleteYourProfileModal}
            startCampaign={startCampaign}
            supportCampaign={supportCampaign}
          />
        )}
      </div>
    );
  }
}
CompleteYourProfileModalController.propTypes = {
  becomeMember: PropTypes.bool,
  campaignXWeVoteId: PropTypes.string,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  startCampaign: PropTypes.bool,
  supportCampaign: PropTypes.bool,
};

export default CompleteYourProfileModalController;
