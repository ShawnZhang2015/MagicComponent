

let DataSource = cc.Class({
    array: null,
    ctor() {
        let array = [];
        for(let i = 0; i < 100; i++) {
            array.push(`测试文本 ${i}`);
        }
        this.array = array;
    },

    onItemData(item, index) {
        item.getComponent(cc.Label).string = this.array[index];
    },

});

let uikiller = require('uikiller');
cc.Class({
    extends: cc.Component,

    properties: {    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        uikiller.bindComponent(this);
        this._magicListView.$MagicListView.dataSource = new DataSource();
    },

    start () {

    },

    // update (dt) {},
});
