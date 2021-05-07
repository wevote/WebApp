// pricingFunctions

// eslint-disable-next-line import/prefer-default-export
export function voterFeaturePackageExceedsOrEqualsRequired (chosenFeaturePackage, requiredFeaturePackage) {
  if (!chosenFeaturePackage || !requiredFeaturePackage) return false;
  const chosenFeaturePackageUpper = chosenFeaturePackage.toUpperCase();
  const requiredFeaturePackageUpper = requiredFeaturePackage.toUpperCase();
  if (chosenFeaturePackageUpper === requiredFeaturePackageUpper) {
    return true;
  } else if (chosenFeaturePackageUpper === 'PROFESSIONAL' && requiredFeaturePackageUpper === 'FREE') {
    return true;
  } else if (chosenFeaturePackageUpper === 'ENTERPRISE') {
    return true;
  }
  return false;
}

