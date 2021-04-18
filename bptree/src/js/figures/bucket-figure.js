import Bucket from '../bucket.js';
export default class BucketFigure extends Bucket {
    constructor(k, size = { w: 20, h: 20 }) {
        super(k);
        this.x = 0;
        this.y = 0;
        this.nw = size.w == null ? 20 : size.w;
        this.nh = size.h == null ? 20 : size.h;
    }

    set width(w) {
        if (this._w != w) {
            this._w = w;
            this.path = null;
        }
    }

    get width() {
        return this._w;
    }

    set height(h) {
        if (this._h != h) {
            this._h = h;
            this.path = null;
        }
    }

    get height() {
        return this._h;
    }

    insertStepByStep(node) {
        return this.insertStepByStep(node);
    }

    layout(offset, dirty) {
        this.width = this.internelNodes.length * this.nw;

        this.height = this.nh;
        let oldx = this.x;
        this.oldx = oldx;
        this.x = offset.x;

        let oldy = this.y;
        this.oldy = oldy;
        this.y = offset.y;

        if (oldy - this.y != 0 || oldx - this.x != 0) {
            if (dirty) dirty.push(this);
        }

        return { w: this.width, h: this.height };
    }

    draw(ctx) {
        if (this.internelNodes.length == 0) return;
        ctx.save();

        ctx.restore();
    }

    getPath() {
        if (!this.path) {
            this.path = new Path2D();
            let ctx = this.path;
            ctx.rect(0, 0)
        }
    }
}