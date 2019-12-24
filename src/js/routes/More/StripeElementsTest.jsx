import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/esm/styles';
import StripeElementsTestForm from './StripeElementsTestForm';
import { renderLog } from '../../utils/logging';
import WelcomeAppbar from '../../components/Navigation/WelcomeAppbar';

/**
 * August 16, 2019:  This code can be deleted once its functionality is duplicated in the newly created production UI
 */

class StripeElementsTest extends Component {
  render () {
    renderLog('StripeElementsTest');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <Wrapper>
        <Helmet title="Stripe Elements Test" />
        <WelcomeAppbar pathname="/more/pricing" />
        <StripeProvider apiKey="pk_test_bWuWGC3jrMIFH3wvRvHR6Z5H">
          <div className="example">
            <h1>Test of Stripe Elements</h1>
            <Elements>
              <StripeElementsTestForm />
            </Elements>
          </div>
        </StripeProvider>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  buttonContained: {
    borderRadius: 32,
    height: 50,
    [theme.breakpoints.down('md')]: {
      height: 36,
    },
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
`;


export default withStyles(styles)(StripeElementsTest);


