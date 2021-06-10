import { ElementsConsumer } from '@stripe/react-stripe-js';
import React from 'react';
import { renderLog } from '../../utils/logging';
import CheckoutForm from './CheckoutForm';

const InjectedCheckoutForm = (params) => {
  renderLog('InjectedCheckoutForm');
  const {
    value,
    classes,
    onDonation,
    showWaiting,
    stopShowWaiting,
    isOneTime,
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
            onDonation={onDonation}
            showWaiting={showWaiting}
            stopShowWaiting={stopShowWaiting}
            isOneTime={isOneTime}
          />
        )}
      </ElementsConsumer>
    );
  } else {
    return null;
  }
};

export default InjectedCheckoutForm;
