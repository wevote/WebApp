import { dispatcher } from 'AppDispatcher';
import { CandidateConstants } from 'constants/Constants';

import { candidatesRetrieve } from 'utils/APIS';

var CandidateActions = {
    loadByOfficeId: (office_we_vote_id) => {
        candidatesRetrieve(office_we_vote_id)
            .then( data =>
                dispatcher.dispatch({
                    actionType: CandidateConstants.CANDIDATES_RETRIEVED,
                    actionData: data.data
                })
            );
    }
};

export default CandidateActions;
