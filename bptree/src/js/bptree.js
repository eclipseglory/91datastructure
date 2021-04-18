import Bucket from './bucket.js';
import Node from './node.js';

export default class BPlusTree {

    constructor(k = 4) {
        console.assert(k != null, 'K should not be null');
        this._k = k;
        this._root;
    }

    get root() {
        return this._root;
    }

    get k() {
        return this._k;
    }

    insertStepByStep(id, data) {
        if (!this._root) {
            this._root = new Bucket(this.k);
            return this._root.insert(new Node(id, data));
        }
        let result = this._root.insert(new Node(id, data));
        this._refreshRoot();
        return result;
    }

    insert(id, data) {
        if (!this._root) {
            this._root = new Bucket(this.k);
            return this._root.insert(new Node(id, data));
        }
        let result = this._root.insert(new Node(id, data));
        while (result.code == 2) {
            result = result.next.insert(result.new);
        }
        this._refreshRoot();
        return result;
    }

    _refreshRoot() {
        if (this._root) {
            while (this._root.parent) {
                this._root = this._root.parent;
            }
        }
    }
}