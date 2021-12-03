import React from 'react';
import { normalizedHref } from './applicationUtils';
import { isCordova } from './cordovaUtils';

const webAppConfig = require('../config');

const loaded = {
  ballot: false,
  news: false,
  values: false,
  ready: false,
};

function lazyWithPreload (factory) {
  if (webAppConfig.LOG_RENDER_EVENTS || webAppConfig.LOG_ONLY_FIRST_RENDER_EVENTS) {
    const result = factory.toString().match(/.*?\| (.*?) \*\//);
    console.log(`preload ==== ${result.length > 1 ? result[1] : factory} ====`);
  }

  const Component = React.lazy(factory);
  Component.preload = factory;
  return Component;
}

export default function lazyPreloadPages () {
  if (isCordova()) {
    return;
  }

  const pathname = normalizedHref();
  let loadedOne = false;

  if (!pathname.startsWith('/ready') && !loaded.ready) {
    loaded.ready = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'Ready' */ '../pages/Ready'));
  }

  if (!pathname.startsWith('/ballot') && !loaded.ballot) {
    loaded.ballot = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'Ballot' */ '../pages/Ballot/Ballot'));
  }

  if (!pathname.startsWith('/values') && !loaded.values) {
    loaded.values = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'Values' */ '../pages/Values'));
  }

  if (!pathname.startsWith('/news') && !loaded.news) {
    loaded.news = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'News' */ '../pages/Activity/News'));
  }

  if (pathname.startsWith('/ready') || pathname === '/') {
    loaded.ready = true;
  } else if (pathname.startsWith('/ballot')) {
    loaded.ballot = true;
  } else if (pathname.startsWith('/values')) {
    loaded.values = true;
  } else if (pathname.startsWith('/news')) {
    loaded.news = true;
  }

  if ((webAppConfig.LOG_RENDER_EVENTS || webAppConfig.LOG_ONLY_FIRST_RENDER_EVENTS) && loadedOne) {
    console.log(`preload xxxx ${pathname} already preloaded xxxx`);
  }
}
