import ColorSchema from "../color-schema.js";
import NodeDelegate from "./node-delegate.js";

export default class ColorChange extends NodeDelegate {
    constructor(refNode) {
        super(refNode);
        this.opacity = 1;
    }


    _getPaths() {
        if (this._paths == null) {
            this._paths = [new Path2D(), new Path2D(), new Path2D()];
            let swidth = this.refNode.radius * 0.8;
            let width = this.refNode.radius * 2 - swidth;

            let p1 = this._paths[0];
            p1.rect(-width / 2, -width / 2, width, width);
            let p2 = this._paths[1];
            p2.rect((-width - swidth) / 2, (-width - swidth) / 2, swidth, swidth);
            let p3 = this._paths[2];
            p3.rect((width - swidth) / 2, (width - swidth) / 2, swidth, swidth);
        }
        return this._paths;
    }

    whenRefNodeChange() {
        if (this._paths) {
            this._paths.length = 0;
        }
        this._paths = null;
    }

    draw(ctx) {
        if (this.opacity == 0) return;
        ctx.save();

        ctx.translate(this.refNode.x, this.refNode.y);
        ctx.scale(0.8, 0.8);
        ctx.globalAlpha = this.opacity;
        let paths = this._getPaths();
        ctx.strokeStyle = ColorSchema.getLineColorHex();
        let linew = ctx.lineWidth;
        ctx.lineWidth = 3;
        ctx.stroke(paths[0]);

        ctx.lineWidth = linew;
        ctx.fillStyle = ColorSchema.getBlackColorHex();
        ctx.fill(paths[1]);
        ctx.stroke(paths[1]);
        ctx.fillStyle = ColorSchema.getRedColorHex();
        ctx.fill(paths[2]);
        ctx.stroke(paths[2]);
        ctx.restore();
    }

    dispose() {
        this._paths.length = 0;
        this._paths = null;
    }
}