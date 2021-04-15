
// 我真不想让这个玩意儿耦合到纯的数据模型中,但又想国际化，剥离出去好麻烦，就这样吧。我操
import message from '../message.js';

export default class TreeNode {
    constructor(id, value, black = false) {
        this._id = id;
        if (this._id == null) throw 'ID can not be null';
        this._black = black;
        this.value = value;
        this.left;
        this.right;
        this.parent;
    }

    static createConnection(parent, child, isLeft = true) {
        if (isLeft) parent.left = child; else parent.right = child;
        child.parent = parent;
    }

    get isBlack() { return this._black; }

    get isRed() { return !this.isBlack }

    get id() {
        return this._id;
    }

    set id(v) {
        this._id = v;
    }

    update(node) {
        this.value = node.value;
    }


    changeToRed() {
        this._black = false;
    }

    changeToBlack() {
        this._black = true;
    }

    /**
     * 
     * @returns 如果断开连接的时候是parent的左子树，返回true，右子树返回false。没有父节点返回null
     */
    disConnectParent() {
        if (this.parent == null) return null;
        if (this.parent.left == this) {
            this.parent.left = null;
            this.parent = null;
            return true;
        }
        if (this.parent.right == this) {
            this.parent.right = null;
            this.parent = null;
            return false;
        }
        return null;
    }

    leftRotate() {
        if (this.right == null) throw 'Cant left rotate without right child node';
        let effected = [];
        var oldParent = this.parent;
        var isLeft = false;
        if (this.parent != null) {
            isLeft = this.disConnectParent();
        }
        effected.push(this);

        var tempRight = this.right;
        effected.push(this.right);

        this.right.disConnectParent();

        if (tempRight.left != null) {
            var tempL = tempRight.left;
            effected.push(tempRight.left);
            tempRight.left.disConnectParent();
            TreeNode.createConnection(this, tempL, false);
        }
        TreeNode.createConnection(tempRight, this);

        if (oldParent != null) {
            TreeNode.createConnection(oldParent, tempRight, isLeft);
        }
        return effected;
    }

    rightRotate() {
        if (this.left == null) throw 'Cant right rotate without left child node';
        let effected = [];
        var oldParent = this.parent;
        var isLeft = false;
        if (this.parent != null) {
            isLeft = this.disConnectParent();
        }
        effected.push(this);

        var tempLeft = this.left;
        effected.push(this.left);
        this.left.disConnectParent();

        if (tempLeft.right != null) {
            var tempR = tempLeft.right;
            effected.push(tempLeft.right);
            tempLeft.right.disConnectParent();
            TreeNode.createConnection(this, tempR);
        }
        TreeNode.createConnection(tempLeft, this, false);

        if (oldParent != null) {
            TreeNode.createConnection(oldParent, tempLeft, isLeft);
        }
        return effected;
    }

    rotate(l) { if (l) return this.leftRotate(); else return this.rightRotate(); }

    findReplaceNode() {
        if (this.left != null && this.right != null) {
            let node = this.findNextNode();
            return node.findReplaceNode();
        } else {
            let focus = [{ node: this }];
            let singleChild = this.left != null ? this.left : this.right;
            if (this.isRed) {
                let reason = message.generateDeleteBlanceMsgSimple(1, 're', [this.id]);
                let operation = message.generateDeleteBlanceMsgSimple(1, 'op');
                let ca = message.generateDeleteBlanceMsgSimple(1, 'ca');
                this._debug(reason);
                return {
                    'blance': false, 'replace': this, ca: ca,
                    reason: reason, operation: operation, op: 'delete'
                };
            }
            if (singleChild != null && singleChild.isRed) {
                let reason = message.generateDeleteBlanceMsgSimple(2, 're', [this.id, singleChild.id]);
                let operation = message.generateDeleteBlanceMsgSimple(2, 'op', [singleChild.id]);
                let ca = message.generateDeleteBlanceMsgSimple(2, 'ca');

                this._debug(reason);
                singleChild.changeToBlack();
                return {
                    'change': [singleChild], 'blance': false, 'replace': this, reason: reason, ca: ca,
                    operation: operation, op: 'delete'
                };
            }
            // if (this.parent == null) {
            //     let reason = `替换点(${this.id})为根节点，且有一个空的子节点，可以直接删除`;
            //     let operation = `五`;
            //     return { 'blance': false, 'replace': this, reason: reason, operation: operation, focus: focus, op: 'delete' };
            // }
            let reason = message.generateDeleteBlanceMsgSimple(3, 're', [this.id]);
            let operation = message.generateDeleteBlanceMsgSimple(3, 'op', [this.id]);
            let ca = message.generateDeleteBlanceMsgSimple(3, 'ca');
            return {
                'blance': true, 'replace': this, reason: reason,
                ca: ca, operation: operation, focus: focus, op: 'delete'
            };
        }
    }

    blanceSubTreeAfterDelete() {
        let parent = this.parent;
        if (parent == null) {
            this._debug(`平衡点为根节点，平衡完成`);
            let reason = message.generateDeleteBlanceMsgComplex(1, 're');
            // let operation = message.generateDeleteBlanceMsgComplex(1, 'op', [this.id]);
            let ca = message.generateDeleteBlanceMsgComplex(1, 'ca');
            return { reason: reason, ca: ca, focus: [{ node: this }], op: 'delete' };;
        }
        let bro = parent.left == this ? parent.right : parent.left;
        let isleft = parent.left == this;
        if (bro == null) throw 'Red-Black tree struct error';
        if (bro.isRed) {
            let rotated = [];
            rotated.push({ 'node': parent, 'left': isleft });

            let reason = message.generateDeleteBlanceMsgComplex(2, 're');
            let operation = message.generateDeleteBlanceMsgComplex(2, 'op',
                [parent.id, bro.id, this.id, `${isleft ? '左' : '右'}`]);
            let ca = message.generateDeleteBlanceMsgComplex(2, 'ca');

            let result = {
                ca: ca,
                'next': this, 'change': [bro, parent], 'rotated': rotated, focus: [{
                    node: bro
                }, { node: parent }], op: 'delete'
            };
            bro.changeToBlack();
            parent.changeToRed();

            let effected = parent.rotate(isleft);
            this._debug(operation);
            result['effected'] = effected;
            result['operation'] = operation;
            result['reason'] = reason;
            return result;
        } else {
            if (parent.isBlack) {
                if ((bro.left == null || bro.left.isBlack) && (bro.right == null || bro.right.isBlack)) {
                    bro.changeToRed();

                    let reason = message.generateDeleteBlanceMsgComplex(3, 're');
                    let operation = message.generateDeleteBlanceMsgComplex(3, 'op', [bro.id, parent.id]);
                    let ca = message.generateDeleteBlanceMsgComplex(3, 'ca');

                    this._debug(operation);
                    return {
                        'next': parent, 'change': [bro], ca: ca, reason: reason,
                        operation: operation, focus: [{ node: bro }], op: 'delete'
                    };
                }
            } else {
                if ((bro.left == null || bro.left.isBlack) && (bro.right == null || bro.right.isBlack)) {
                    parent.changeToBlack();
                    bro.changeToRed();

                    // let reason = message.generateDeleteBlanceMsgComplex(4, 're');
                    let operation = message.generateDeleteBlanceMsgComplex(4, 'op', [bro.id, parent.id]);
                    let ca = message.generateDeleteBlanceMsgComplex(4, 'ca');

                    this._debug(operation);
                    return {
                        ca: ca,
                        'change': [bro, parent], operation: operation, focus: [{
                            node: bro
                        }, { node: parent }], op: 'delete'
                    };
                }
            }
            let sameForwardBC = isleft ? bro.left : bro.right;
            if (sameForwardBC != null && sameForwardBC.isRed) {
                bro.changeToRed();
                sameForwardBC.changeToBlack();

                let reason = message.generateDeleteBlanceMsgComplex(5, 're');
                let operation = message.generateDeleteBlanceMsgComplex(5, 'op',
                    [bro.id, sameForwardBC.id, this.id, `${!isleft ? '左' : '右'}`]);
                let ca = message.generateDeleteBlanceMsgComplex(5, 'ca');

                let rotated = [];
                rotated.push({ 'node': bro, 'left': !isleft });
                let effected = bro.rotate(!isleft);
                this._debug(operation);
                return {
                    ca: ca,
                    'next': this, 'change': [bro, sameForwardBC], 'rotated': rotated, 'effected': effected, operation: operation, reason: reason, focus: [{
                        node: bro
                    }, { node: sameForwardBC }], op: 'delete'
                };
            }
            let diffForwardBC = isleft ? bro.right : bro.left;
            if (diffForwardBC != null && diffForwardBC.isRed) {
                let change = [];
                let focus = [];
                diffForwardBC.changeToBlack();
                focus.push({ node: diffForwardBC });
                change.push(diffForwardBC);
                let pb = parent.isBlack;
                let bb = bro.isBlack;
                bro.isRed ? parent.changeToRed() : parent.changeToBlack();
                pb ? bro.changeToBlack() : bro.changeToRed();
                if (!(pb && parent.isBlack)) { change.push(parent); focus.push({ node: parent }); }
                if (!(bb && bro.isBlack)) { change.push(bro); focus.push({ node: bro }); }
                let rotated = [];

                // let reason = message.generateDeleteBlanceMsgComplex(6, 're');
                let operation = message.generateDeleteBlanceMsgComplex(6, 'op',
                    [bro.id, parent.id, diffForwardBC.id, `${isleft ? '左' : '右'}`]);
                let ca = message.generateDeleteBlanceMsgComplex(6, 'ca');

                rotated.push({ 'node': parent, 'left': isleft });
                let effected = parent.rotate(isleft);
                this._debug(operation);
                return {
                    'change': change, 'rotated': rotated, 'effected': effected, ca: ca,
                    operation: operation, focus: focus, op: 'delete'
                };
            }
        }
    }

    findNode(id) {
        if (id == this.id) {
            return this;
        } else {
            if (this.id > id) {
                if (this.left != null) {
                    return this.left.findNode(id);
                } else {
                    return null;
                }
            } else {
                if (this.right != null) {
                    return this.right.findNode(id);
                } else {
                    return null;
                }
            }
        }
    }

    findNextNode() {
        if (this.right) {
            let node = this.right;
            while (true) {
                if (node.left == null) {
                    return node;
                }
                node = node.left;

            }
        }
    }

    findPreNode() {
        if (this.left) {
            let node = this.left;
            while (true) {
                if (node.right == null) {
                    return node;
                }
                node = node.right;

            }
        }
    }

    childIsSameColor() {
        if (this.left == null && this.right == null) return true;
        if (this.left != null && this.right != null) {
            return (this.left.isRed && this.right.isRed) || (this.left.isBlack && this.right.isBlack);
        } else {
            let notNull = this.left != null ? this.left : this.right;
            return notNull.isBlack;
        }
    }

    deleteMe() {
        if (this.left == null && this.right == null) {
            return this.disConnectParent();
        }
    }

    insertNode(node) {
        if (node.id == this.id) {
            this._debug(`找到更新点，使用${node.toString()}更新信息`);
            this.update(node);
            return null;
        } else {
            if (this.id > node.id) {
                if (this.left != null) {
                    return this.left.insertNode(node);
                } else {
                    this._debug(`找到插入位置，插入节点${node.toString()}作为左节点`);
                    TreeNode.createConnection(this, node);
                    return node;
                    // return node.blanceSubTree();
                }
            } else {
                if (this.right != null) {
                    return this.right.insertNode(node);
                } else {
                    this._debug(`找到插入位置，插入节点${node.toString()}作为右节点`);
                    TreeNode.createConnection(this, node, false);
                    return node;
                    // return node.blanceSubTree();
                }
            }
        }
    }


    blanceSubTreeAfterInsert(changedNodes = []) {
        if (this.parent == null) {
            // 根节点必须是黑色
            if (this.isBlack) {
                let reason = message.generateInsertBlanceMsg(1, 're');
                return { reason: reason, op: 'insert' };
            }
            this._debug('平衡子树 : ');
            this._debug('该节点为根节点，修改颜色');
            this.changeToBlack();
            changedNodes.push(this);

            let reason = message.generateInsertBlanceMsg(2, 're');
            let operation = message.generateInsertBlanceMsg(2, 'op', [this.id]);

            return { 'change': changedNodes, reason: reason, operation: operation, op: 'insert', focus: [{ node: this }] };
        }
        if (this.isBlack) return null;
        this._debug('平衡子树 : ');
        if (this.parent.isBlack) {
            // let reason = message.generateInsertBlanceMsg(3, 're');
            // let operation = message.generateInsertBlanceMsg(3, 'op', [this.id]);
            let ca = message.generateInsertBlanceMsg(3, 'ca');
            this._debug(ca);
            return { ca: ca, op: 'insert', focus: [{ node: this }] };
        }
        var grande = this.parent.parent;
        if (grande == null) {
            throw 'Blance sub-tree error, grande node can not be null';
        }
        var _pbro = grande.left == this.parent ? grande.right : grande.left;
        var leftParent = grande.left == this.parent;
        var isleft = this.parent.left == this;
        if (_pbro != null && _pbro.isRed) {

            // let reason = message.generateInsertBlanceMsg(4, 're');
            let operation = message.generateInsertBlanceMsg(4, 'op', [grande.id, this.parent.id, _pbro.id]);
            let ca = message.generateInsertBlanceMsg(4, 'ca');

            this._debug(operation);

            _pbro.changeToBlack();
            this.parent.changeToBlack();
            changedNodes.push(_pbro);
            changedNodes.push(this.parent);
            grande.changeToRed();
            changedNodes.push(grande);
            return {
                'next': grande, 'change': changedNodes, ca: ca, operation: operation, op: 'insert',
                focus: [{ node: this }, { node: _pbro }, { node: this.parent }, { node: grande }]
            };
        } else {
            var tempParent = this.parent;
            let effected;
            let rotated = [];
            let focus = [{ node: this }];
            let ca;
            let operation, reason;
            if (leftParent != isleft) {

                reason = message.generateInsertBlanceMsg(5, 're');
                operation = message.generateInsertBlanceMsg(5, 'op', [this.parent.id, `${isleft ? '右' : '左'}`]);
                ca = message.generateInsertBlanceMsg(5, 'ca');

                this._debug(operation);
                rotated.push({ 'node': this.parent, 'left': !isleft });
                effected = this.parent.rotate(!isleft);
            } else {

                // reason = message.generateInsertBlanceMsg(5, 're');
                operation = message.generateInsertBlanceMsg(6, 'op', [grande.id, this.parent.id, `${leftParent ? '右' : '左'}`]);
                ca = message.generateInsertBlanceMsg(6, 'ca');

                this._debug(operation);
                this.parent.changeToBlack();
                grande.changeToRed();

                changedNodes.push(grande);
                changedNodes.push(this.parent);
                focus.push({ node: grande });
                focus.push({ node: this.parent });
                rotated.push({ 'node': grande, 'left': !leftParent });
                effected = grande.rotate(!leftParent);
            }
            if (tempParent.isBlack) {
                return {
                    'change': changedNodes, 'effected': effected, 'rotated': rotated,
                    operation: operation, reason: reason, ca: ca, op: 'insert', focus: focus
                };
            } else {
                return {
                    'next': tempParent, 'change': changedNodes, 'effected': effected,
                    'rotated': rotated, operation: operation, ca: ca, reason: reason, op: 'insert', focus: focus
                };
            }
        }
    }


    _debug(msg) {
        console.log(`${this.toString()} - ${msg}`);
    }

    toString() {
        if (this.value != null) return `Node(${this.id})[${this.value}]`;
        return `Node(${this.id})`;
    }
}