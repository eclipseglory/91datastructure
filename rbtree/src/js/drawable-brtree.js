import BlackRedTree from "./black-red-tree.js";
import DrawableNode from "./drawable-node.js";

export default class DrawableBRTree {

    constructor(props = {
        nodeRadius: 20, nodeXPadding: 10, nodeYPadding: 20,
        padding: { left: 0, right: 0, top: 0, bottom: 0 }
    }) {
        this.nodeRadius = props.nodeRadius == null ? 20 : props.nodeRadius;
        this.nodeXPadding = props.nodeXPadding == null ? 10 : props.nodeXPadding;
        this.nodeYPadding = props.nodeYPadding == null ? 20 : props.nodeYPadding;
        this.padding = props.padding == null ? { left: 0, right: 0, top: 0, bottom: 0 } : props.padding;
        this._tree = new BlackRedTree();
        this.width = 0;
        this.height = 0;
    }

    get root() {
        return this._tree.root;
    }

    set root(r) {
        this._tree.root = r;
    }

    updateSize(region) {
        this.oldWidth = this.width;
        this.oldHeight = this.height;
        this.width = region.width;
        this.height = region.height;
    }

    insertNode(id, props = {}) {
        let node = new DrawableNode(id, this.nodeRadius, props.value,
            false, this.nodeXPadding, this.nodeYPadding);
        node.changeToRed();
        let newNode = this._tree.insertNode(node);
        return newNode;
    }

    findNode(id) {
        return this._tree.findNode(id);
    }

    draw(ctx) {
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        let scale = 1;
        if (this.width > canvas.width) {
            scale = Math.min(canvas.width / this.width, scale);
        }
        if (this.height > canvas.height) {
            scale = Math.min(canvas.height / this.height, scale);
        }
        if (scale != 1) {
            ctx.scale(scale, scale);
        }
        ctx.translate(-this.width / 2 + this.padding.left, -this.height / 2 + this.padding.top);
        this._tree._findRoot();
        if (this.root != null) {
            this.root.draw(ctx);
        }

        // {
        //     // TODO : debug:
        //     ctx.strokeStyle = 'black';
        //     ctx.strokeRect(-this.padding.left, -this.padding.top, this.width, this.height);
        // }

        ctx.restore();
    }

    // TODO :
    // 这个计算方法多进行了一次遍历，直接从子节点就能确定自己的位置，最后返回大小在进行tanslate，多计算了一遍
    // 可老子就是懒得改
    layout() {
        let root = this._tree._findRoot();
        if (root == null) return null;
        let dimension = root.calculateWidth();
        let dirtyNodes = [];
        root.layout({ x: 0, y: 0 }, dirtyNodes);
        return {
            'dirty': dirtyNodes, 'region': {
                'width': dimension.width + this.padding.left + this.padding.right,
                'height': dimension.height - this.nodeYPadding + this.padding.top + this.padding.bottom
            }
        };
    }

    _constriantNodePosition(
        node, position, width, dirtyNodes = []) {
        if (node == null) return;
        node.oldX = node.x;
        node.x = position.x;
        node.oldY = node.y;
        node.y = position.y;

        if (node.oldX != node.x || node.oldY != node.y) dirtyNodes.push(node);
        var half = width / 2;
        this._constriantNodePosition(
            node.left,
            { 'x': position.x - half, 'y': position.y + node.radius * 2 + this.nodeYPadding },
            half,
            dirtyNodes);
        this._constriantNodePosition(
            node.right,
            { 'x': position.x + half, 'y': position.y + node.radius * 2 + this.nodeYPadding },
            half,
            dirtyNodes);
    }

}