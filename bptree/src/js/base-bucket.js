export default class BaseBucket {
    constructor(k) {
        console.assert(k != null, 'K should not be null');
        this.k = k;
        this.internelNodes = [];
        this.parent;
    }

    get minNodeId() {
        if (this.internelNodes.length == 0) return null;
        return this.getKey(0);
    }

    get maxNodeId() {
        if (this.internelNodes.length == 0) return null;
        return this.getKey(this.internelNodes.length - 1);
    }

    get nodesCount() {
        if (this.internelNodes.length == 0) return 0;
        return this.internelNodes.length;
    }

    internelSearch(id) {
        let left = 0;
        let right = this.internelNodes.length - 1;
        let mid = Math.floor((left + right) / 2);
        while (left != right) {
            let key = this.getKey(mid);
            if (key == id) break;
            if (key < id) {
                left = mid + 1;
            } else {
                right = mid;
            }
            mid = Math.floor((left + right) / 2);
        }
        return mid;
    }

    getKey(index) {
        let n = this.internelNodes[index];
        if (n) return n.id;
    }

    getNodeKey(node) {
        return node.id;
    }

    split() {
        let count = Math.floor(this.k / 2);
        let newBucket = this.createNewParent(this.k);
        let nextBucket = this.createNextBucket(this.k);
        if (!newBucket || !nextBucket) return;
        while (count != 0) {
            nextBucket.internelNodes.unshift(this.internelNodes.pop());
            count--;
        }
        this._afterSplit(nextBucket, newBucket);
        return newBucket;
    }

    _afterSplit(next, parent) { }

    sort() { }

    createNextBucket(k) { }

    createNewParent(k) { }

    push(node) {
        this.internelNodes.push(node);
    }

    unshift(node) {
        this.internelNodes.unshift(node);
    }

    update(index, node) {
        this.internelNodes[index] = node;
    }

    afterInsert(index, node) {

    }

    insert(node) {
        if (this.internelNodes.length == 0) {
            this.push(node);
            this.afterInsert(0, node);
            return { code: 0 };
        }
        let id = node.id;
        let flag, index;
        if (id < this.minNodeId) {
            this.unshift(node);
            index = 0;
            flag = true;
        }
        if (id > this.maxNodeId) {
            this.push(node);
            index = this.internelNodes.length - 1;
            flag = true;
        }
        if (!flag) {
            index = this.internelSearch(id);
            let m = this.internelNodes[index];
            if (this.getNodeKey(m) == id) {
                this.update(index, node);
                return { code: 1 };
            }
            this.push(node);
            for (let i = this.internelNodes.length - 1; i > index; i--) {
                this.internelNodes[i] = this.internelNodes[i - 1];
            }
            this.update(index, node);
        }
        this.afterInsert(index, node);

        if (this.internelNodes.length > this.k - 1) {
            let temp = this.parent;
            let newOne = this.split();
            if (temp) {
                return { code: 2, next: temp, new: newOne };
            } else {
                return { code: 0 };
            }
        }
        return { code: 0 };
    }
}