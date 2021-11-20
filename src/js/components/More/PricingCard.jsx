import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Check, Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));


class PricingCard extends Component {
  constructor (props) {
    super(props);

    this.state = {};
    this.buttonOnClickFunction = this.buttonOnClickFunction.bind(this);
  }

  buttonOnClickFunction () {
    if (this.props.buttonOnClickFunction) {
      this.props.buttonOnClickFunction(this.props.pricingPlanStringIdentifier);
    }
  }

  render () {
    renderLog('PricingCard');  // Set LOG_RENDER_EVENTS to log all renders
    const { bullets, buttonOnClickId, buttonText, classes, description, featurePackage, fullWidth, planName, price, priceDescribe, pricingCardFeatures } = this.props;
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    const isPremiumFeaturePlan = (String(featurePackage) === 'ENTERPRISE' || String(featurePackage) === 'PROFESSIONAL');
    const voterFeaturePackageExceedsOrEquals = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, featurePackage);

    const items = pricingCardFeatures.map((item) => (
      <CollectionItem key={`pricingItem-${item.featureDescription}`}>
        {item.iconType === 'checkMark' ? (
          <Check
            style={{
              color: '#2E3C5D',
            }}
          />
        ) : (
          <>
            {item.iconType === 'paidCheckMark' ? (
              <Check
                style={{
                  color: 'rgb(219,179,86)',
                }}
              />
            ) : (
              <Close
                style={{
                  color: 'red',
                }}
              />
            )}
          </>
        )}
        <ItemText>{item.featureDescription}</ItemText>
        {item.iconType === 'notAvailable' && (
          <CollectionItemLight />
        )}
      </CollectionItem>
    ));

    return (
      <div className={fullWidth ? 'col col-12' : 'col col-4'}>
        <Card mobile={!!fullWidth}>
          <CardWrapper>
            <PricingCardHeader mobile={!!fullWidth}>
              {isPremiumFeaturePlan ? (
                <PremiumName>{planName}</PremiumName>
              ) : (
                <DefaultName>{planName}</DefaultName>
              )}
              {price === 0 || price ? (
                <>
                  <DollarSign>$</DollarSign>
                  <Price>{price}</Price>
                  <PriceDescribe>
                    {priceDescribe}
                    {planName === 'Professional' && (
                      <PriceDescribeLight>or $150 month to month</PriceDescribeLight>
                    )}
                  </PriceDescribe>
                </>
              ) : (
                <>
                  <h6 className="mb-0"
                  style={{
                    fontSize: '20px',
                  }}
                  >
                    <Suspense fallback={<></>}>
                      <OpenExternalWebSite
                        linkIdAttribute="weVoteSupportPricingCard"
                        url="https://help.wevote.us/hc/en-us/requests/new"
                        target="_blank"
                        body={<span>Contact</span>}
                      />
                    </Suspense>
                  </h6>
                  <p style={{
                    fontSize: '10px',
                    color: '#333',
                  }}
                  >
                    <strong>
                      our sales team for a quote.
                    </strong>
                  </p>
                </>
              )}
            </PricingCardHeader>
            <hr />
            <Description>
              {description}
            </Description>
            <Bullets>
              <BulletItem>{bullets[0]}</BulletItem>
              <BulletItem>{bullets[1]}</BulletItem>
              <BulletItem>{bullets[2]}</BulletItem>
            </Bullets>
            {voterFeaturePackageExceedsOrEquals ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={isPremiumFeaturePlan ? (
                  classes.goldButton
                ) : null}
                classes={{ containedPrimary: classes.buttonContained }}
                id={buttonOnClickId}
                disabled
              >
                <ButtonText>{String(chosenFeaturePackage) === String(featurePackage) ? 'Your Plan' : 'Your Plan Includes'}</ButtonText>
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={isPremiumFeaturePlan ? (
                  classes.goldButton
                ) : null}
                classes={{ containedPrimary: classes.buttonContained }}
                id={buttonOnClickId}
                onClick={() => this.buttonOnClickFunction()}
              >
                <ButtonText>{buttonText}</ButtonText>
              </Button>
            )}
            <br />
            <Collection>
              {items}
            </Collection>
          </CardWrapper>
        </Card>
      </div>
    );
  }
}
PricingCard.propTypes = {
  bullets: PropTypes.array,
  buttonOnClickFunction: PropTypes.func,
  buttonOnClickId: PropTypes.string,
  buttonText: PropTypes.string,
  classes: PropTypes.object,
  description: PropTypes.string,
  featurePackage: PropTypes.string,
  fullWidth: PropTypes.bool,
  planName: PropTypes.string,
  price: PropTypes.number,
  priceDescribe: PropTypes.string,
  pricingPlanStringIdentifier: PropTypes.string,
  pricingCardFeatures: PropTypes.array,
};

const styles = () => ({
  goldButton: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
  },
  buttonContained: {
    width: '100%',
    fontSize: '13px',
  },
});

const Card = styled.div`
  border-radius: 2px;
  box-shadow: ${(props) => (props.mobile ? '1px 1px 10px 4px #e1e1e1' : '1px 1px 8px 2px #e3e3e3')};
`;

const CardWrapper = styled.div`
  padding: 8px;
`;

const PricingCardHeader = styled.div`
  min-height: ${(props) => (props.mobile ? '75px' : '105px')}
  @media (min-width: 960px) and (max-width: 991px) {
    min-height: 100px;
  }
`;

const PremiumName = styled.h4`
  font-size: 18px;
  color: rgb(219,179,86);
  font-weight: bold;
`;

const DefaultName = styled.h4`
  color: #2E3C5D;
  font-size: 18px;
  font-weight: bold;
`;

const DollarSign = styled.span`
  font-size: 18px;
  font-weight: 500;
  position: relative;
  bottom: 8px;
`;

const Price = styled.h2`
  font-size: 34px;
  margin: 0;
  display: inline-block;
  font-weight: 500;
`;

const PriceDescribe = styled.div`
  display: inline-block;
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  font-weight: 600;
`;

const PriceDescribeLight = styled.div`
  margin: 3px 0 0 0;
  padding: 0;
  color: #888;
  font-weight: normal;
  margin-top: -5px;
`;

const Description = styled.p`
  font-weight: 600;
  color: black;
  font-size: 14px;
  min-height: 75px;
`;

const Bullets = styled.ul`
  margin-left: 0;
  font-size: 12px;
  padding-left: 16px;
  color: #888;
`;

const BulletItem = styled.li`
  font-weight: 500;
  margin-bottom: 3px;
`;

const ButtonText = styled.span`
  text-transform: uppercase;
`;

const Collection = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 8px;
  width: 100%;
`;

const CollectionItem = styled.li`
  border-bottom: 1px solid #ddd;
  padding: 6px 0;
  display: flex;
  font-size: 12px;
  align-items: center;
  font-weight: 500;
  justify-content: flex-start;
  position: relative;
`;

const CollectionItemLight = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100% !important;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.6)

`;

const ItemText = styled.span`
  margin-left: 6px;
`;

export default withStyles(styles)(PricingCard);
