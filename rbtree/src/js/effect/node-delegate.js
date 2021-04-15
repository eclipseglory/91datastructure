export default class NodeDelegate {
    constructor(refNode) {
        this.refNode = refNode;
    }

    get nodeBounds() {
        return this._nodeBounds;
    }

    set refNode(r) {
        if (this._r != r) {
            this._r = r;

            let left = this.refNode.x - this.refNode.radius;
            let top = this.refNode.y - this.refNode.radius;
            let right = left + this.refNode.radius * 2;
            let bottom = top + this.refNode.radius * 2;
            this._nodeBounds = {
                left: left,
                top: top,
                right: right,
                bottom: bottom
            };
            this.whenRefNodeChange();
        }
    }

    get refNode() {
        return this._r;
    }

    whenRefNodeChange() {

    }

    dispose() { }
}