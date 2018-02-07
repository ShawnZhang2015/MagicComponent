
let MagicBadge = cc.Class({
    extends: cc.Component,
    properties: {
        listens: [cc.String],

        active: {
            get() {
                return this.node.active;
            },

            set(value) {
                if (CC_EDITOR) {
                    return;
                }
                this.node.active = value;
            }
        },
    },

    statics: {
        sendNotify(id, active, value) {
            cc.director.emit(id, { active, value });
        },

        find(id) {
            let detail = { badge: null };
            cc.director.emit(`$${id}`, detail);
            return detail.badge;
        }
    },

    onLoad () {
        this._image = this.node.getChildByName('_image').getComponent(cc.Sprite);
        this._label = this.node.getChildByName('_label').getComponent(cc.Label);
        if (this.listens) {
            this.listens.forEach(id => {
                cc.director.on(id, this._onBadageEvent, this);
                cc.director.on(`$${id}`, this._onBadgeFind, this);    
            });
        }
    },

    _onBadgeFind(event) {
        event.detail.badge = this;
    },

    _onBadageEvent(event) {
        let detail = event.detail;
        if (!detail) {
            cc.log('参数不存在');
        }

        this.node.active = detail.active;
        if (detail.active && detail.value) {
            this._label.node.active = true;
            this._label.string = detail.value;
        } else {
            this._label.node.active = false;
        }
    },

    onDestroy() {
        cc.director.targetOff(this);    
    }
});


module.extends = MagicBadge;