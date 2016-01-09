import { dispatcher } from 'AppDispatcher';
import { OfficeConstants } from 'constants/Constants';

import { offices } from 'mock-data/offices.json';


var OfficeActions = {
    load: () => {
        // This will eventually need to be made a service call
        dispatcher.dispatch({
            actionType: OfficeConstants.OFFICES_DONE_LOADING,
            offices
        });
    }
};

export default OfficeActions;
