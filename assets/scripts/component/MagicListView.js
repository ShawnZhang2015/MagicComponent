
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
    },

    properties: {
       ITEM_PREFAB: cc.Prefab,
       
       dataSource: {
           visible: false,
           default: null,
           notify(oldValue) {
                if (oldValue === this.dataSource) {
                    return;
                }
                this._updateItem();
           }
       },

       _listItems: null,
       _scrollView: null,
    },

    onLoad () {
        let scrollView = this.node.getChildByName('scrollView');
        this._scrollView = scrollView.getComponent(cc.ScrollView);
        this._listItems = [];
    },

    reload() {
        this._updateItem();
    },

    _updateItem() {
        for(let i = 0; i < 5; i++) {
            let item = cc.instantiate(this.ITEM_PREFAB);
            this._scrollView.content.addChild(item);
            this.dataSource.onItemData(item, i);
            this._listItems.push(item);
        }
    },

    start () {

    },

    // update (dt) {},
});
