// pricingFunctions

// eslint-disable-next-line import/prefer-default-export
export function voterFeaturePackageExceedsOrEqualsRequired (chosenFeaturePackage, requiredFeaturePackage) {
  if (chosenFeaturePackage === requiredFeaturePackage) {
    return true;
  } else if (chosenFeaturePackage === 'PROFESSIONAL' && requiredFeaturePackage === 'FREE') {
    return true;
  } else if (chosenFeaturePackage === 'ENTERPRISE') {
    return true;
  }
  return false;
}

