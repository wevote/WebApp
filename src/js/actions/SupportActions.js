import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  voterAllPositionsRetrieve () {
    Dispatcher.loadEndpoint('voterAllPositionsRetrieve');
  },

  voterOpposingSave (weVoteId, type, politicianWeVoteId = '') {
    Dispatcher.loadEndpoint('voterOpposingSave', { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type, politician_we_vote_id: politicianWeVoteId });
  },

  voterStopOpposingSave (weVoteId, type, politicianWeVoteId = '') {
    Dispatcher.loadEndpoint('voterStopOpposingSave', { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type, politician_we_vote_id: politicianWeVoteId });
  },

  voterSupportingSave (weVoteId, type, politicianWeVoteId = '') {
    Dispatcher.loadEndpoint('voterSupportingSave', { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type, politician_we_vote_id: politicianWeVoteId });
  },

  voterStopSupportingSave (weVoteId, type, politicianWeVoteId = '') {
    Dispatcher.loadEndpoint('voterStopSupportingSave', { ballot_item_we_vote_id: weVoteId, kind_of_ballot_item: type, politician_we_vote_id: politicianWeVoteId });
  },

  voterPositionCommentSave (weVoteId, type, politicianWeVoteId = '', statementText, stance = 'false', visibilitySetting = 'false') {
    const dataDictionary = {
      ballot_item_we_vote_id: weVoteId,
      kind_of_ballot_item: type,
      politician_we_vote_id: politicianWeVoteId,
      statement_text: statementText,
    };
    if (stance !== 'false') {
      dataDictionary.stance = stance;
    } else {
      dataDictionary.stance = false;
    }
    // console.log('visibilitySetting: ', visibilitySetting);
    if (['SHOW_PUBLIC', 'FRIENDS_ONLY'].includes(visibilitySetting)) {
      dataDictionary.visibility_setting = visibilitySetting;
    } else {
      dataDictionary.visibility_setting = false;
    }
    Dispatcher.loadEndpoint('voterPositionCommentSave', dataDictionary);
  },

  voterPositionVisibilitySave (weVoteId, type, politicianWeVoteId = '', visibilitySetting) {
    Dispatcher.loadEndpoint('voterPositionVisibilitySave', {
      ballot_item_we_vote_id: weVoteId,
      kind_of_ballot_item: type,
      politician_we_vote_id: politicianWeVoteId,
      visibility_setting: visibilitySetting,
    });
  },
};
