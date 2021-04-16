import ColorSchema from "../color-schema.js";
import NodeDelegate from "./node-delegate.js";

const PI_4 = Math.PI / 4;
export default class Rotate extends NodeDelegate {
    constructor(refNode, left = true) {
        super(refNode);
        this.left = left;
        this.progress = 1;
    }

    whenRefNodeChange() {
        this._arrow = null;
    }

    _getArrowPath(lineWidth = this.refNode.radius / 5) {
        if (this._arrow == null) {
            this._arrow = new Path2D();
            let ctx = this._arrow;
            let arrowSize = lineWidth * 1.6;
            ctx.moveTo(0, arrowSize);
            let c = arrowSize / Math.sin(30 / 180 * Math.PI);
            let x1 = c * Math.cos(30 / 180 * Math.PI);
            let y1 = 0;
            ctx.lineTo(x1, y1);
            ctx.lineTo(0, -arrowSize);
            ctx.closePath();
        }
        return this._arrow;
    }

    draw(ctx) {
        if (this.progress <= 0) return;
        ctx.save();
        ctx.translate(this.refNode.x, this.refNode.y);
        let radius = this.refNode.radius * 1.8;
        ctx.beginPath();
        let lineWidth = this.refNode.radius / 5;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = ColorSchema.getFrontLineColorHex();
        ctx.lineCap = "round";
        if (this.left) {
            let delta = -(Math.PI + Math.PI / 2);
            let current = this.progress * delta + PI_4;
            ctx.arc(0, 0, radius, PI_4, current, true);
            ctx.stroke();
            let x = Math.cos(current) * radius;
            let y = Math.sin(current) * radius;
            ctx.translate(x, y);
            ctx.rotate(current - Math.PI / 2);
            ctx.fillStyle = ColorSchema.getFrontLineColorHex();
            ctx.fill(this._getArrowPath(lineWidth));

        } else {
            let delta = Math.PI / 2 + Math.PI;
            let current = this.progress * delta + (Math.PI - PI_4);
            ctx.arc(0, 0, radius, Math.PI - PI_4, current, false);
            ctx.stroke();
            let x = Math.cos(current) * radius;
            let y = Math.sin(current) * radius;
            ctx.translate(x, y);
            ctx.rotate(current + Math.PI / 2);
            ctx.fillStyle = ColorSchema.getFrontLineColorHex();
            ctx.fill(this._getArrowPath(lineWidth));
        }
        ctx.restore();
    }
}