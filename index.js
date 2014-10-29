'use strict';

module.exports = {
  name: 'ember-cli-jq-tree',
  included: function included(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/jqtree/jqtree.css');
    app.import(app.bowerDirectory + '/jqtree/tree.jquery.js');
  }
};
