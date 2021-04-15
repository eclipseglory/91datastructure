import ColorSchema from "../color-schema.js";
import NodeDelegate from "./node-delegate.js";

export default class FrontShadow extends NodeDelegate {
    constructor(refNode, parent, shadowColor = ColorSchema.getLightColor()) {
        super(refNode);
        this.parent = parent;
        this.radiusPercent = 1;
        this.shadowColor = shadowColor;
    }

    _getPath() {
        if (this._path == null) {
            this._path = new Path2D();
            let ctx = this._path;
            let radius = this.refNode.radius;
            ctx.arc(0, 0, Math.floor(radius * 2), 0, Math.PI * 2);
            ctx.closePath();
        }
        return this._path;
    }

    whenRefNodeChange() {
        this._path = null;
    }

    draw(ctx) {
        if (this.radiusPercent <= 0) return;
        ctx.save();
        ctx.globalAlpha = 0.5;
        let node = this.refNode;
        ctx.translate(node.x + ctx.canvas.width, node.y + ctx.canvas.height);
        // ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.globalAlpha = this.radiusPercent;
        ctx.shadowBlur = node.radius * 2 * this.parent.scale;
        ctx.shadowOffsetX = -ctx.canvas.width * this.parent.scale;
        ctx.shadowOffsetY = -ctx.canvas.height * this.parent.scale;
        ctx.shadowColor = this.shadowColor;
        ctx.fill(this._getPath());
        ctx.restore();
    }

    dispose() {
        this.parent = null;
    }
}