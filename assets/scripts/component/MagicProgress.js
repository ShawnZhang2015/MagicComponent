/**
 * MagicProgress
 * 使用cc.Sprite的fillType实现的进度条控件
 */

let MagicProgress = cc.Class({
    extends: cc.Sprite,

    editor: {
        executeInEditMode: true,
    },

    resetInEditor: CC_EDITOR && function () {
        let self = this;
        cc.loader.load({ uuid: 'a23235d1-15db-4b95-8439-a2e005bfff91' }, function (error, spriteFrame) {
            let size = self.node.getContentSize();
            self.spriteFrame = spriteFrame;
            self.node.setContentSize(size);
        });
    },

    properties: {

        progress: {
            default: 0.3,
            type: 'Float',
            range: [0, 1, 0.1],
            slide: true,
            notify() {
                this._updateRange(this.progress);
            },
            serializable: true,
        },

        style: {
            type: cc.Sprite.FillType,
            default: cc.Sprite.FillType.RADIAL,
            notify() {
                this._updateBarStatus();
            }
        },

        reverse: {
            default: false,
            notify() {
                this._updateBarStatus();
            },
        },

        _cb: null,
    },

    // use this for initialization
    onLoad() {
        this.type = cc.Sprite.Type.FILLED;
        this._updateBarStatus();
    },

    _init() {
        switch (this.style) {
            case cc.Sprite.FillType.HORIZONTAL:
                this.fillType = cc.Sprite.FillType.HORIZONTAL;
                this.fillRange = this.reverse ? 0 : 1;
                this.fillStart = this.reverse ? 1 : 0;
                break;
            case cc.Sprite.FillType.VERTICAL:
                this.fillType = cc.Sprite.FillType.VERTICAL;
                this.fillRange = this.reverse ? 0 : 1;
                this.fillStart = this.reverse ? 1 : 0;
                break;
            case cc.Sprite.FillType.RADIAL:
                this.fillType = cc.Sprite.FillType.RADIAL;
                this.fillCenter = cc.p(0.5, 0.5);
                this.fillStart = 0.25;
                this.fillRange = 1;
                break;
            default:
        }
    },

    _updateBarStatus(range) {
        this._init();
    },

    _updateRange(range) {
        if (this.style === cc.Sprite.FillType.RADIAL) {
            this.fillRange = this.reverse ? range : -range;
        } else {
            this.fillRange = this.reverse ? -range : range;
        }
    },

    _scheduleUpdate(dt) {
        this._elapsed += dt;
        let percent = Math.min(this._elapsed / this._duration, 1);
        this._updateRange(percent);
        if (percent === 1) {
            this.stop(false);
        }
    },

    play(duration, callback) {
        this._cb = callback;
        this._duration = duration;
        this._elapsed = 0;
        this.schedule(this._scheduleUpdate, 0);
    },

    stop(isBreak = true) {
        let callback = this._cb;
        this._cb = null;
        this.unschedule(this._scheduleUpdate);
        if (callback) {
            callback(isBreak);
        }
    }
});

cc.Class.Attr.setClassAttr(MagicProgress, 'type', 'visible', false);
cc.Class.Attr.setClassAttr(MagicProgress, 'fillType', 'visible', false);
cc.Class.Attr.setClassAttr(MagicProgress, 'fillCenter', 'visible', false);
cc.Class.Attr.setClassAttr(MagicProgress, 'fillStart', 'visible', false);
cc.Class.Attr.setClassAttr(MagicProgress, 'fillRange', 'visible', false);
cc.Class.Attr.setClassAttr(MagicProgress, 'srcBlendFactor', 'visible', false);
cc.Class.Attr.setClassAttr(MagicProgress, 'dstBlendFactor', 'visible', false);

module.exports = MagicProgress;