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
    pricingCardFeatures: PropTypes.array,
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
    const { premium, bullets, price, planName, priceDescribe, description, classes, buttonOnClickId, buttonText, fullWidth, pricingCardFeatures } = this.props;

    console.log(pricingCardFeatures);

    return (
      <React.Fragment>
        {fullWidth ? (
          <div className="col col-12">
            <CardMobile>
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
                    {pricingCardFeatures[0].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[0].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>{pricingCardFeatures[0].featureDescription}</ItemText>
                    {pricingCardFeatures[0].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[1].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[1].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Voter Guide Creation Tools</ItemText>
                    {pricingCardFeatures[1].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[2].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[2].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Add Ballot to Your Website</ItemText>
                    {pricingCardFeatures[2].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[3].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[3].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Visitor Metrics</ItemText>
                    {pricingCardFeatures[3].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[4].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[4].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>WeVote.US Subdomain</ItemText>
                    {pricingCardFeatures[4].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[5].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[5].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Upload Your Logo</ItemText>
                    {pricingCardFeatures[5].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  {premium ? (
                    <CollectionItem>
                      {pricingCardFeatures[6].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[6].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Edit Social Media Sharing Links</ItemText>
                      {pricingCardFeatures[6].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[6].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[6].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Edit Social Media Sharing Links</ItemText>
                        {pricingCardFeatures[6].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {premium ? (
                    <CollectionItem>
                      {pricingCardFeatures[7].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[7].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Create Multi-Organization Voter Guides</ItemText>
                      {pricingCardFeatures[7].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[7].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[7].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Create Multi-Organization Voter Guides</ItemText>
                        {pricingCardFeatures[7].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {pricingCardFeatures[8].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[8].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Additional Administrators</ItemText>
                      {pricingCardFeatures[8].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[8].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[8].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Additional Administrators</ItemText>
                        {pricingCardFeatures[8].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {pricingCardFeatures[9].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[9].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Analytics Integration</ItemText>
                      {pricingCardFeatures[9].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[9].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[9].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Analytics Integration</ItemText>
                        {pricingCardFeatures[9].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                </Collection>
              </CardWrapper>
            </CardMobile>
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
                    {pricingCardFeatures[0].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[0].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>{pricingCardFeatures[0].featureDescription}</ItemText>
                    {pricingCardFeatures[0].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[1].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[1].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Voter Guide Creation Tools</ItemText>
                    {pricingCardFeatures[1].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[2].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[2].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Add Ballot to Your Website</ItemText>
                    {pricingCardFeatures[2].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[3].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[3].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Visitor Metrics</ItemText>
                    {pricingCardFeatures[3].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[4].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[4].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>WeVote.US Subdomain</ItemText>
                    {pricingCardFeatures[4].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  <CollectionItem>
                    {pricingCardFeatures[5].iconType === 'checkMark' ? (
                      <Check
                        style={{
                          color: '#2E3C5D',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {pricingCardFeatures[5].iconType === 'paidCheckMark' ? (
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
                      </React.Fragment>
                    )}
                    <ItemText>Upload Your Logo</ItemText>
                    {pricingCardFeatures[5].iconType === 'notAvailable' ? (
                      <CollectionItemLight />
                    ) : (
                      null
                    )}
                  </CollectionItem>
                  {premium ? (
                    <CollectionItem>
                      {pricingCardFeatures[6].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[6].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Edit Social Media Sharing Links</ItemText>
                      {pricingCardFeatures[6].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[6].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[6].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Edit Social Media Sharing Links</ItemText>
                        {pricingCardFeatures[6].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {premium ? (
                    <CollectionItem>
                      {pricingCardFeatures[7].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[7].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Create Multi-Organization Voter Guides</ItemText>
                      {pricingCardFeatures[7].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[7].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[7].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Create Multi-Organization Voter Guides</ItemText>
                        {pricingCardFeatures[7].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {pricingCardFeatures[8].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[8].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Additional Administrators</ItemText>
                      {pricingCardFeatures[8].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[8].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[8].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Additional Administrators</ItemText>
                        {pricingCardFeatures[8].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
                      </CollectionItem>
                    </React.Fragment>
                  )}
                  {planName === 'Enterprise' ? (
                    <CollectionItem>
                      {pricingCardFeatures[9].iconType === 'checkMark' ? (
                        <Check
                          style={{
                            color: '#2E3C5D',
                          }}
                        />
                      ) : (
                        <React.Fragment>
                          {pricingCardFeatures[9].iconType === 'paidCheckMark' ? (
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
                        </React.Fragment>
                      )}
                      <ItemText>Analytics Integration</ItemText>
                      {pricingCardFeatures[9].iconType === 'notAvailable' ? (
                        <CollectionItemLight />
                      ) : (
                        null
                      )}
                    </CollectionItem>
                  ) : (
                    <React.Fragment>
                      <CollectionItem>
                        {pricingCardFeatures[9].iconType === 'checkMark' ? (
                          <Check
                            style={{
                              color: '#2E3C5D',
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {pricingCardFeatures[9].iconType === 'paidCheckMark' ? (
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
                          </React.Fragment>
                        )}
                        <ItemText>Analytics Integration</ItemText>
                        {pricingCardFeatures[9].iconType === 'notAvailable' ? (
                          <CollectionItemLight />
                        ) : (
                          null
                        )}
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

const CardMobile = styled.div`
  border-radius: 2px;
  box-shadow: 1px 1px 10px 4px #e1e1e1;
`;

const CardWrapper = styled.div`
  padding: 8px;
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
