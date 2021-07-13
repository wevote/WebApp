import { ElementsConsumer } from '@stripe/react-stripe-js';
import React from 'react';
import { renderLog } from '../../utils/logging';
import CheckoutForm from './CheckoutForm';

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/

const InjectedCheckoutForm = (params) => {
  renderLog('InjectedCheckoutForm');
  const {
    value,
    classes,
    showWaiting,
    isChipIn,
    isMonthly,
    campaignXWeVoteId,
  } = params;
  console.log('InjectedCheckoutForm --------- showWaiting', showWaiting);
  if (value && classes) {
    return (
      <ElementsConsumer>
        {({
          stripe,
          elements,
        }) => (
          // <CheckoutFormExample stripe={stripe} elements={elements} />
          <CheckoutForm
            stripe={stripe}
            elements={elements}
            value={value}
            classes={classes}
            showWaiting={showWaiting}
            isMonthly={isMonthly}
            isChipIn={isChipIn}
            campaignXWeVoteId={campaignXWeVoteId}
          />
        )}
      </ElementsConsumer>
    );
  } else {
    return null;
  }
};

export default InjectedCheckoutForm;
