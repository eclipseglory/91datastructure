import BaseBucket from "./base-bucket.js";

export default class IndexBucket extends BaseBucket {
    constructor(k) {
        super(k);
        this.isIndex = true;
        this.pointer = [];
    }

    get id() {
        return this.minNodeId;
    }

    get firstPointer() {
        if (this.pointer.length == 0) return null;
        return this.pointer[0];
    }

    get lastPointer() {
        if (this.pointer.length == 0) return null;
        return this.pointer[this.pointer.length - 1];
    }

    internelSearch(id) {
        let left = 0;
        let right = this.internelNodes.length - 1;
        let mid = Math.floor((left + right) / 2);
        while (left != right) {
            let key = this.getKey(mid);
            if (key == id) {
                mid++; // 不小于内部索引节点ID的，指针都在它和下一个索引节点的中间，也就是它自己索引的后一位
                break;
            }
            if (key < id) {
                left = mid + 1;
            } else {
                right = mid;
            }
            mid = Math.floor((left + right) / 2);
        }
        return mid;
    }


    afterInsert(index, indexNode) {
        this.pointer.push(indexNode.lastPointer);
        for (let i = this.pointer.length - 1; i > index; i--) {
            this.pointer[i] = this.pointer[i - 1];
        }
        this.pointer[index + 1] = indexNode.pointer[1];
        indexNode.pointer[0].parent = this;
        indexNode.pointer[1].parent = this;
    }

    insert(node) {
        if (node.isIndex) {
            return super.insert(node);
        } else {
            let id = node.id;
            if (id < this.minNodeId) {
                return this.pointer[0].insert(node);
            }
            if (id >= this.maxNodeId) {
                return this.lastPointer.insert(node);
            }
            let index = this.internelSearch(id);
            return this.pointer[index].insert(node);
        }
    }

    getKey(index) {
        return this.internelNodes[index];
    }

    getNodeKey(node) {
        return node;
    }

    update(index, node) {
        this.internelNodes[index] = node.id;
    }

    push(node) {
        this.internelNodes.push(node.id);
    }

    unshift(node) {
        this.internelNodes.unshift(node.id);
    }

    createNewParent(k) {
        return new IndexBucket(k);
    }

    createNextBucket(k) {
        return new IndexBucket(k);
    }

    _afterSplit(next, parent) {
        let id = next.internelNodes.shift();
        next.parent = parent;
        this.parent = parent;
        parent.pointer.push(this);
        parent.pointer.push(next);
        parent.internelNodes.push(id);

        let count = Math.floor(this.k / 2);
        while (count != 0) {
            let p = this.pointer.pop();
            next.pointer.unshift(p);
            p.parent = next;
            count--;
        }
    }
}