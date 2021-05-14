import React from 'react';

const webAppConfig = require('../config');

export default function lazyWithPreload (factory) {
  if (webAppConfig.LOG_RENDER_EVENTS || webAppConfig.LOG_ONLY_FIRST_RENDER_EVENTS) {
    console.log(`preload ==== ${factory} ====`);
  }

  const Component = React.lazy(factory);
  Component.preload = factory;
  return Component;
}
