
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

        _value: '',
        value: {
            get() {
                return this._value;
            },

            set(value) {
                if (this._label) {
                    this._label.string = value || '';
                    this._label.node.active = !!value;
                }
            },
        }
    },

    statics: {
        sendNotify(id, active, value) {
            cc.director.emit(id, { active, value });
        },

        find(id) {
            let detail = { badge: null };
            cc.director.emit(`$${id}`, detail);
            return detail.badge;
        },

        init(id, cb) {
            let eventName = `BADGE_${id}_INIT_EVENT`;
            cc.director.once(eventName, (event) => {
                if (!cb) {
                    return;
                }
                let badge = event.detail.badge;
                let param = cb(badge);
                
                if (typeof param === 'object') {
                    badge.active = param.active;
                    badge.value = param.value;
                } else {
                    badge.active = !!param;    
                }
            });
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

            this.listens.forEach(id => {
                let eventName = `BADGE_${id}_INIT_EVENT`;
                let detail = { badge: this };
                cc.director.emit(eventName, detail);
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

        this.active = detail.active;
        this.value = detail.value;
    },

    onDestroy() {
        cc.director.targetOff(this);    
    }
});


module.extends = MagicBadge;