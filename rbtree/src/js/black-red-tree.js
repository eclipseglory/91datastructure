export default class BlackRedTree {

    constructor() {
        this.root;
    }

    insertNode(node) {
        if (this.root == null) {
            this.root = node;
            this.root.changeToBlack();
            return this.root;
        }
        this.root = this._findRoot();
        return this.root.insertNode(node);
    }

    _findRoot(node = this.root) {
        if (node == null) return null;
        if (node.parent != null) {
            return this._findRoot(node.parent);
        } else {
            this.root = node;
            return node;
        }
    }

    findNode(id) {
        if (this.root == null) return;
        this.root = this._findRoot(this.root);
        return this.root.findNode(id);
    }
}
