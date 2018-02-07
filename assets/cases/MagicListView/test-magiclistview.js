
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

    getCount() {
        return this.array.length;
    }

});

cc.Class({
    extends: cc.Component,

    onLoad () {
        let magicListView = this.node.getChildByName('_magicListView').getComponent('MagicListView');
        magicListView.dataSource = new DataSource();
    },
});
