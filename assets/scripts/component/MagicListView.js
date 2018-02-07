
cc.Class({
    extends: cc.Component,

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

       _listItems: [],
       _scrollView: null,
    },

    _init() {
        if (!this._scrollView) {
            let scrollView = this.node.getChildByName('scrollView');
            this._scrollView = scrollView.getComponent(cc.ScrollView);
            this.updateTimer = 0;
            this.updateInterval = 0.1;
            this.lastContentPosY = 0;
        }
    },

    onLoad () {
        this._init();
    },

    reload() {
        this._updateItem();
    },

    _updateItem() {
        this._init();
        this._scrollView.content.removeAllChildren();
        this._listItems = [];

        let index = 0;
        let count = this.dataSource.getCount();
        let item = cc.instantiate(this.ITEM_PREFAB);
        this._scrollView.content.height = item.height * count;
        this._itemHeight = item.height;

        let offest = -item.height;
        do {
            this._scrollView.content.addChild(item);
            item.x = 0;
            item.y = offest * index + offest / 2;
            item.index = index;
            this.dataSource.onItemData(item, index);
            this._listItems.push(item);
            if (item.height * index++ > this.node.height) {
                break;
            }
            item = cc.instantiate(this.ITEM_PREFAB);
        } while (index < count)
        
    },

    getPositionInView (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this._scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update (dt) {
        if (!this._listItems.length) {
            return;
        }

        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this._listItems;
        let buffer = this.node.height / 2;
        let isDown = this._scrollView.content.y < this.lastContentPosY; // scrolling direction
        let curItemCount = items.length;
        let offset = this._itemHeight * curItemCount;
        for (let i = 0; i < curItemCount; ++i) {
            let item = items[i];
            let viewPos = this.getPositionInView(item);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && item.y + offset < 0) {
                    let newIdx = item.index - curItemCount;
                    item.y += offset;
                    this.dataSource.onItemData(item, newIdx);
                    item.index = newIdx;
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && item.y - offset > -this._scrollView.content.height) {
                    let newIdx = item.index + curItemCount;
                    item.y -= offset;
                    this.dataSource.onItemData(item, newIdx);
                    item.index = newIdx;
                    //item.updateItem(newIdx, itemNode.y - offset, newInfo.name, newInfo.url);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this._scrollView.content.y;
    },

    start () {

    },

    // update (dt) {},
});
