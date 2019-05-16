import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

class PricingCard extends Component {
  static propTypes = {
    premium: PropTypes.bool,
    bullets: PropTypes.array,
    price: PropTypes.number,
    planName: PropTypes.string,
    priceDescribe: PropTypes.string,
    description: PropTypes.string,
    classes: PropTypes.object,
    buttonOnClickFunction: PropTypes.func,
    buttonOnClickId: PropTypes.string,
    buttonText: PropTypes.string,
    fullWidth: PropTypes.bool,
  };

  constructor (props) {
    super(props);

    this.state = {};
    this.buttonOnClickFunction = this.buttonOnClickFunction.bind(this);
  }

  buttonOnClickFunction () {
    if (this.props.buttonOnClickFunction) {
      this.props.buttonOnClickFunction();
    }
  }

  render () {
    const { premium, bullets, price, planName, priceDescribe, description, classes, buttonOnClickId, buttonText, fullWidth } = this.props;

    return (
      <React.Fragment>
        {fullWidth ? (
          <div className="col col-12">
            <Card>
              <CardWrapper>
                {premium ? (
                  <PremiumName>{planName}</PremiumName>
                ) : (
                  <DefaultName>{planName}</DefaultName>
                )}
                {price === 0 || price ? (
                  <React.Fragment>
                    <DollarSign>$</DollarSign>
                    <Price>{price}</Price>
                    <PriceDescribe>
                      {priceDescribe}
                      {planName === 'Professional' ? (
                        <PriceDescribeLight>or $150 month to month</PriceDescribeLight>
                      ) : (
                        null
                      )}
                    </PriceDescribe>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <h6 className="mb-0"
                    style={{
                      fontSize: '20px',
                    }}
                    >
                    Contact
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
                  </React.Fragment>
                )}
                <hr />
                <Description>
                  {description}
                </Description>
                <Bullets>
                  <BulletItem>{bullets[0]}</BulletItem>
                  <BulletItem>{bullets[1]}</BulletItem>
                  <BulletItem>{bullets[2]}</BulletItem>
                </Bullets>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={premium ? (
                    classes.goldButton
                  ) : (
                    null
                  )}
                  classes={{ containedPrimary: classes.buttonContained }}
                  id={buttonOnClickId}
                  onClick={() => this.buttonOnClickFunction()}
                >
                  <ButtonText>{buttonText}</ButtonText>
                </Button>
                <br />
                <Collection>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Enter Your Own Positions
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Voter Guide Creation Tools
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Add Ballot to Your Website
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Visitor Metrics
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    WeVote.US Subdomain
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Upload Your Logo
                  </CollectionItem>
                  {premium ? (
                    <CollectionItem>
                      {planName === 'Professional' || planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Edit Social Media Sharing Links
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Professional' || planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Edit Social Media Sharing Links
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {premium ? (
                    <CollectionItem>
                      {planName === 'Professional' || planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Create Multi-Organization Voter Guides
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Professional' || planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Create Multi-Organization Voter Guides
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Additional Administrators
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Additional Administrators
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Analytics Integration
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Analytics Integration
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                </Collection>
              </CardWrapper>
            </Card>
          </div>
        ) : (
          <div className="col col-4">
            <Card>
              <CardWrapper>
                {premium ? (
                  <PremiumName>{planName}</PremiumName>
                ) : (
                  <DefaultName>{planName}</DefaultName>
                )}
                {price === 0 || price ? (
                  <React.Fragment>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '500',
                      position: 'relative',
                      bottom: '8px',
                    }}
                    >
                    $
                    </span>
                    <Price>{price}</Price>
                    <PriceDescribe>
                      {priceDescribe}
                      {planName === 'Professional' ? (
                        <PriceDescribeLight>or $150 month to month</PriceDescribeLight>
                      ) : (
                        null
                      )}
                    </PriceDescribe>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <h6 className="mb-0"
                    style={{
                      fontSize: '20px',
                    }}
                    >
                    Contact
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
                  </React.Fragment>
                )}
                <hr />
                <Description>
                  {description}
                </Description>
                <Bullets>
                  <BulletItem>{bullets[0]}</BulletItem>
                  <BulletItem>{bullets[1]}</BulletItem>
                  <BulletItem>{bullets[2]}</BulletItem>
                </Bullets>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={premium ? (
                    classes.goldButton
                  ) : (
                    null
                  )}
                  classes={{ containedPrimary: classes.buttonContained }}
                  id={buttonOnClickId}
                  onClick={() => this.buttonOnClickFunction()}
                >
                  <ButtonText>{buttonText}</ButtonText>
                </Button>
                <br />
                <Collection>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Enter Your Own Positions
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Voter Guide Creation Tools
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Add Ballot to Your Website
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Visitor Metrics
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    WeVote.US Subdomain
                  </CollectionItem>
                  <CollectionItem>
                    <Check
                      style={{
                        color: '#2E3C5D',
                      }}
                    />
                    Upload Your Logo
                  </CollectionItem>
                  {premium ? (
                    <CollectionItem>
                      {planName === 'Professional' || planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Edit Social Media Sharing Links
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Professional' || planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Edit Social Media Sharing Links
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {premium ? (
                    <CollectionItem>
                      {planName === 'Professional' || planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Create Multi-Organization Voter Guides
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Professional' || planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Create Multi-Organization Voter Guides
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Additional Administrators
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Additional Administrators
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {planName === 'Enterprise' ? (
                        <Check
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      ) : (
                        <Close
                          style={{
                            color: 'rgb(219,179,86)',
                          }}
                        />
                      )}
                      Analytics Integration
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {planName === 'Enterprise' ? (
                          <Check
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        ) : (
                          <Close
                            style={{
                              color: 'rgb(219,179,86)',
                            }}
                          />
                        )}
                        Analytics Integration
                        <CollectionItemLight />
                      </CollectionItem>
                    </React.Fragment>
                  )}
                </Collection>
              </CardWrapper>
            </Card>
          </div>
        )}
      </React.Fragment>
    );
  }
}

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
  box-shadow: 1px 1px 8px 2px #e3e3e3;
`;

const CardWrapper = styled.div`
  padding: 16px;
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
  background: rgba(255, 255, 255, 0.8)

`;

export default withStyles(styles)(PricingCard);
