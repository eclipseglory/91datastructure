import BaseBucket from "./base-bucket.js";
import IndexBucket from "./index-bucket.js";

export default class Bucket extends BaseBucket {
    constructor(k) {
        super(k);
        this.next;
    }

    _afterSplit(next, parent) {
        let temp = this.next;
        this.next = next;
        next.next = temp;
        parent.pointer.push(this);
        parent.pointer.push(next);
        next.parent = parent;
        this.parent = parent;
        parent.internelNodes.push(next.minNodeId);
    }

    createNewParent(k) {
        return new IndexBucket(k)
    }

    createNextBucket(k) {
        return new Bucket(k);
    }
}