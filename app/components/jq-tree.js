import Ember from 'ember';

export default Ember.Component.extend({
  children: null,
  label: null,
  data: null,
  treeSelector: '.jq-tree',
  namespacedId: false,
  setupTree: function() {
    var $tree = this.$(this.get('treeSelector'));
    $tree.tree({
      data: this.buildData(),
      autoOpen: false
    });
    $tree.on('tree.click', Ember.run.bind(this, this.onTreeClick));
    this.selectNode();
  }.on('didInsertElement'),
  tearDown: function() {
    var $tree = this.$(this.get('treeSelector'));

    $tree.off('tree.click');
  }.on('willDestroyElement'),
  onTreeClick: function(event) {
    Ember.run.next(this, function() {
      this.set('nodeContent', event.node.content);
      this.sendAction('treeClick', event.node.content);
    });

    return true;
  },
  buildData: function() {
    var childrenAttr = this.get('children');
    var labelAttr    = this.get('label');
    var _this = this;

    function buildTreeObject(object) {
      var children = object.get(childrenAttr).map(buildTreeObject);
      var node = {
        content: object,
        label: object.get(labelAttr),
        children: children,
        id: _this.getId(object)
      };

      return node;
    }

    return this.get('data').map(buildTreeObject);
  },
  selectNode: function() {
    var nodeContent = this.get('nodeContent');

    if (!Ember.isEmpty(nodeContent)) {
      var $tree = this.$(this.get('treeSelector'));

      if (Ember.isEmpty($tree)) {
        return;
      }

      var node = $tree.tree('getNodeById', this.getId(nodeContent));
      var selectNode = $tree.tree('getSelectedNode');


      if (selectNode !== node) {
        $tree.tree('selectNode', node);
      }
    }
  }.observes('nodeContent'),
  getId: function(object) {
    var id = object.get('id');

    if (this.get('namespacedId')) {
      id = object.constructor.typeKey + '-' +  object.get('id');
    }

    return id;
  }
});
