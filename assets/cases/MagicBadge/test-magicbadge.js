let _ = require('lodash');
let MagicBadge = require('MagicBadge');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        //要在start才能使用MagicBadge.find，onLoad时MagicBadge还没有注册
        this.badge1 = MagicBadge.find('badge-1');
        this.badge2 = MagicBadge.find('badge-2');
        this.badge3 = MagicBadge.find('badge-3');
    },

    onButton1(sender) {
        let active = this.badge1.active;
        MagicBadge.sendNotify('badge-1', !active, _.random(0, 5));
    },

    onButton2(sender) {
        let active = this.badge2.active;
        MagicBadge.sendNotify('badge-2', !active, _.random(0, 5));
    },

    onButton3(sender) {
        let active = this.badge3.active;
        MagicBadge.sendNotify('badge-3', !active, _.random(0, 5));
    }
});
