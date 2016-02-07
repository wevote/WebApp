'use strict';

import babel from 'babel-core';

module.exports = {
  process: function(src, filename) {
    if (!babel.canCompile(filename)) {
      return '';
    }

    if (filename.indexOf('node_modules') === -1) {
      return babel.transform(src, {filename: filename}).code;
    }

    return src;
  }
};
