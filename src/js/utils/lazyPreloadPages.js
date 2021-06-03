import React from 'react';

const webAppConfig = require('../config');

const loaded = {
  ballot: false,
  news: false,
  values: false,
  ready: false,
};

function lazyWithPreload (factory) {
  if (webAppConfig.LOG_RENDER_EVENTS || webAppConfig.LOG_ONLY_FIRST_RENDER_EVENTS) {
    console.log(`preload ==== ${factory} ====`);
  }

  const Component = React.lazy(factory);
  Component.preload = factory;
  return Component;
}

export default function lazyPreloadPages () {
  const { location: { pathname } } = window;
  let loadedOne = false;

  if (!pathname.startsWith('/ready') && !loaded.ready) {
    loaded.ready = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'Ready' */ '../routes/Ready'));
  }

  if (!pathname.startsWith('/ballot') && !loaded.ballot) {
    loaded.ballot = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'Ballot' */ '../routes/Ballot/Ballot'));
  }

  if (!pathname.startsWith('/values') && !loaded.values) {
    loaded.values = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'Values' */ '../routes/Values'));
  }

  if (!pathname.startsWith('/news') && !loaded.news) {
    loaded.news = true;
    loadedOne = true;
    lazyWithPreload(() => import(/* webpackChunkName: 'News' */ '../routes/Activity/News'));
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
