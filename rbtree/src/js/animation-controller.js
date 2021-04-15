import DrawableBRTree from "./drawable-brtree.js";
import MyAnimation from "./animation.js";
import ColorChange from "./effect/color-change.js";
import EffectLayer from "./effect/effect-layer.js";
import FrontShadow from "./effect/front-shadow.js";
import Rotate from "./effect/rotate.js";
import ColorSchema from "./color-schema.js";
// 对不起，真不想这样：
import Message from "../message.js";

export default class AnimationController {

    constructor(ctx, frontCtx, radius = 20, xpadding = 10, ypadding = 20,
        treePadding = { left: 0, top: 0, bottom: 0, right: 0 }) {
        this.ctx = ctx;
        this.fctx = frontCtx;
        this.brTree = new DrawableBRTree({
            nodeRadius: radius, nodeXPadding: xpadding,
            nodeYPadding: ypadding, padding: treePadding
        });
        this.effectLayer = new EffectLayer(this.brTree, this.fctx);
        this._eventHandler = {};
        this.nodeIds = [];
    }

    on(eventName, handler) {
        if ('blanceStepOver' == eventName) {
            this._blanceOverHandler = handler;
            return;
        }
        if ('blanceStepStart' == eventName) {
            this._blanceStartHandler = handler;
            return;
        }
        let handlers = this._eventHandler[eventName];
        if (handlers == null) {
            this._eventHandler[eventName] = [];
            handlers = this._eventHandler[eventName];
        }
        handlers.push(handler);
    }

    _fireBlanceStepStart(event) {
        if (this._blanceStartHandler) {
            return this._blanceStartHandler(event);
        }
    }

    _fireBlanceStepOver() {
        if (this._blanceOverHandler) {
            return this._blanceOverHandler();
        }
    }

    _fireOperationStart() {
        let handlers = this._eventHandler['operationStart'];
        if (handlers != null) {
            handlers.forEach((handler) => {
                handler();
            });
        }
    }

    _fireOperationOver(event) {
        let handlers = this._eventHandler['operationOver'];
        if (handlers != null) {
            handlers.forEach((handler) => {
                handler(event);
            });
        }
    }

    generate(n = 10) {
        this.brTree.root = null;
        this.nodeIds.length = 0;
        this.brTree.draw(this.ctx);
        this._fireOperationStart();
        for (let i = 0; i < n;) {
            let id = Math.floor(Math.random() * 1000);
            if (this.brTree.root == null) {
                this.brTree.insertNode(id);
                this.recordId(id);
            } else {
                let newNode = this.brTree.insertNode(id);
                if (newNode == null) {
                    continue;
                } else {
                    this.recordId(id);
                    let blance = newNode.blanceSubTreeAfterInsert();
                    while (blance != null && blance.next != null) {
                        blance = blance.next.blanceSubTreeAfterInsert();
                    }
                }
            }
            i++;
        }
        let x = this.brTree.width / 2;
        let y = this.brTree.height / 2;
        function initNodeStartPosition(node, animation) {
            if (node != null) {
                node.oldX = x;
                node.oldY = y;
                animation.add(node, 'innerPercent', node.innerPercent, node.isLeftLeaf ? 1 : 0);
            } else {
                return;
            }
            initNodeStartPosition(node.left, animation);
            initNodeStartPosition(node.right, animation);
        }

        let result = this.brTree.layout();
        let animation = new MyAnimation(500, { x1: 0.37, y1: -0.47, x2: 0.61, y2: 1.45 });

        if (result == null) {
            this.brTree.updateSize({ width: 0, height: 0 });
        } else {
            let dirty = result.dirty;
            let region = result.region;
            initNodeStartPosition(this.brTree.root, animation);
            this.brTree.updateSize(region);

            dirty.forEach((node) => {
                this.registPositionChange(animation, node);
            });
        }
        this._registerTreeDimensionChange(animation);
        animation.forward(() => {
            this.brTree.draw(this.ctx);
        }).then(() => {
            this._fireOperationOver({ op: 'generate', num: n, type: 'success' });
        });
    }

    randomDelete() {
        if (this.nodeIds.length > 0) {
            let index = Math.floor(Math.random() * this.nodeIds.length);
            let id = this.nodeIds[index];
            this.deleteNode(id);
        }
    }

    deleteNode(id) {
        if (isNaN(id)) return;
        this._fireOperationStart();
        let node = this.brTree.findNode(id);
        if (node != null) {
            let result = node.findReplaceNode();
            let replace = result.replace;
            let blance = result.blance;
            console.log(`删除节点${node}:替换节点${replace}`);
            let focus = [];
            focus.push({ node: replace, color: ColorSchema.getFocusColor() });
            if (replace.id != node.id) {
                focus.push({ node: node, color: ColorSchema.getSecondColor() });
            }

            // 特殊情况，让某些颜色变换点闪烁：
            if (result.change) {
                result.change.forEach((changeNode) => focus.push({ node: changeNode }));
            }

            result['focus'] = focus;
            result.replaceNode = replace;
            result.deleteNode = node;
            let op = Message.generateDeleteBlanceAdditionalMsg(1, [replace.id, node.id])
            if (replace.id == node.id) {
                op = Message.generateDeleteBlanceAdditionalMsg(2, [replace.id]);
            }
            if (blance) {
                this.blanceAfterDelete(replace, node, replace).then(() => {
                    op = Message.generateDeleteBlanceAdditionalMsg(3) + op;
                    this._deleteReplaceNode(replace, node, {
                        focus: focus,
                        deleteNode: node,
                        replaceNode: replace,
                        change: result.change, operation: op
                    }).then(() => {
                        this._fireOperationOver({ op: 'delete', id: id, type: 'success' });
                    })
                })
            } else {
                if (result.operation != null) {
                    result.operation += op;
                }
                this._deleteReplaceNode(replace, node, result).then(() => {
                    this._fireOperationOver({ op: 'delete', id: id, type: 'success' });
                })
            }

            this.removeId(id);
            return id;
        } else {
            this._fireOperationOver({ op: 'delete', id: id, type: 'error' })
            return null;
        }
    }

    _deleteReplaceNode(replace, target, blance) {
        return new Promise((resolve, reject) => {
            this._excuteProcessAnimated(target, () => {
                return blance;
            }, () => {
                let animation = new MyAnimation(500, { x1: 0.37, y1: -0.47, x2: 0.61, y2: 1.45 });
                animation.add(replace, 'scale', 1, 0);
                animation.add(target, 'id', target.id, replace.id, function (v) {
                    return Math.floor(v);
                });
                animation.forward((value) => {
                    this.brTree.draw(this.ctx);
                    if (value == 1) {
                        let singleChild = replace.left == null ? replace.right : replace.left;
                        target.id = replace.id;
                        target.value = replace.value;
                        let p = replace.parent;
                        let related = [];
                        if (singleChild) { related.push(singleChild); singleChild.disConnectParent(); }
                        let isleft = replace.disConnectParent();
                        if (p != null) {
                            if (isleft) p.left = singleChild;
                            else p.right = singleChild;
                            if (singleChild) singleChild.parent = p;
                        } else {
                            this.brTree.root = singleChild;
                        }

                        this._refreshTreeAnimated(null, related, null).then(() => {
                            resolve();
                        });
                    }
                });
            }, false);
        })
    }

    recordId(id) {
        if (this.nodeIds.indexOf(id) == -1) {
            this.nodeIds.push(id);
        }
    }

    removeId(id) {
        let index = this.nodeIds.indexOf(id);
        if (index != -1) {
            this.nodeIds.splice(index, 1);
        }
    }

    addNode(id) {
        if (isNaN(id)) return null;
        this._fireOperationStart();
        let node = this.brTree.insertNode(id);
        if (node == null) { this._fireOperationOver({ op: 'update', id: id, type: 'warning' }); return null; }
        this.recordId(id);
        this._refreshTreeAnimated(node).then(() => {
            return this.blanceAfterInsert(node, node);
        }).then(() => {
            this._fireOperationOver({ op: 'insert', id: id, type: 'success' });
        });

        return id;
    }

    registPositionChange(animation, node) {
        animation.add(node, 'x', node.oldX, node.x);
        animation.add(node, 'y', node.oldY, node.y);
    }

    registColorChange(animation, node) {
        animation.add(node, 'red', node.oldRed, node.red);
        animation.add(node, 'green', node.oldGreen, node.green);
        animation.add(node, 'blue', node.oldBlue, node.blue);
    }

    refreshEffectLayerWithAnimation(animation, reverse = false, refresh = true, keep = false) {
        var refreshEffectlayer = (value) => {
            if (refresh) this.effectLayer.draw();
            if (value == 1) {
                if (!keep) this.effectLayer.clean();
            }
        }
        if (reverse) {
            return animation.reverse(refreshEffectlayer);
        } else {
            return animation.forward(refreshEffectlayer);
        }
    }

    fadeInEffectLayer(duration = 300) {
        let animation = new MyAnimation(duration);
        animation.add(this.effectLayer, 'opacity', 0, 0.5);
        return animation.forward((v) => {
            this.effectLayer.draw();
        });
    }

    fadeOutEffectLayer(duration = 300) {
        let animation = new MyAnimation(duration);
        animation.add(this.effectLayer, 'opacity', this.effectLayer.opacity, 0);
        return animation.forward(() => {
            this.effectLayer.draw();
        })
    }

    blanceAfterDelete(node, deleteNode, replaceNode) {
        return this._excuteProcessAnimated(node, function (node) {
            let blance = node.blanceSubTreeAfterDelete();
            blance.deleteNode = deleteNode;
            blance.replaceNode = replaceNode;
            if (blance.focus) {
                let contains = false;
                let contains2 = false;
                let contains3 = false;
                for (let index = 0; index < blance.focus.length; index++) {
                    const element = blance.focus[index];
                    if (element.id == deleteNode.id) {
                        element['color'] = ColorSchema.getFocusColor();
                        contains = true;
                        break;
                    }
                    if (element.id == replaceNode.id) {
                        contains2 = true;
                        element['color'] = ColorSchema.getSecondColor();
                        break;
                    }
                    if (element.id == node.id) {
                        contains3 = true;
                        element['color'] = ColorSchema.getLightSecondColor();
                        break;
                    }
                }
                if (!contains) {
                    blance.focus.push({ node: deleteNode, color: ColorSchema.getFocusColor() });
                }
                if (!contains2 && deleteNode.id != replaceNode.id) {
                    blance.focus.push({ node: replaceNode, color: ColorSchema.getSecondColor() });
                }

                if (!contains3 && deleteNode.id != node.id && replaceNode.id != node.id) {
                    blance.focus.push({ node: node, color: ColorSchema.getLightSecondColor() });
                }
            }
            return blance;
        });
    }

    _nextStep() {
        if (this._blanceEffectAnimation) {
            this._blanceEffectAnimation.loop = false; // 不强制停止
            // 停止动画后会主动resolve一个promise进入下一步
        }
    }

    _excuteProcessAnimated(node, blanceFunction, completeHandler, refreshTree = true) {
        return new Promise((resolve, reject) => {
            if (node == null || blanceFunction == null) {
                if (completeHandler) completeHandler();
                return resolve();
            }
            let blance = blanceFunction(node);
            if (blance == null) {
                if (completeHandler) completeHandler();
                return resolve();
            }
            this.fadeInEffectLayer().then(() => {
                let animation = this._createBlanceStepEffectAnimation(blance.focus, blance);
                animation.loop = true;
                animation.loopWithReverse = true;
                this._blanceEffectAnimation = animation;
                this._fireBlanceStepStart({
                    current: node,
                    blance: blance
                });
                return new Promise((r, rej) => {
                    animation.forward(() => this.effectLayer.draw()).then(() => {
                        r();
                    });
                });
            }).then(() => {
                this._blanceEffectAnimation = null;
                this._fireBlanceStepOver();
                this.effectLayer.clean();
                return this.fadeOutEffectLayer();
            }).then(() => {
                if (refreshTree) {
                    return this._refreshTreeAnimated(null, blance.effected, blance.change);
                }
            }).then(() => {
                var next = blance.next;
                if (next == null) {
                    this.effectLayer.clean();
                    if (completeHandler) completeHandler();
                    return resolve();
                }
                setTimeout(() => {
                    this._excuteProcessAnimated(next, blanceFunction, completeHandler, refreshTree).then(() => {
                        resolve();
                    });
                }, 500);
            });
        });
    }

    _createBlanceStepEffectAnimation(focusNodes, blanceResult) {
        let animation = new MyAnimation(600);
        if (focusNodes != null) {
            focusNodes.forEach((focusNode) => {
                let fs = new FrontShadow(focusNode.node, this.effectLayer, focusNode.color);
                animation.add(fs, 'radiusPercent', 0, 1);
                this.effectLayer.add(fs);
            });
        }

        if (blanceResult.change) {
            blanceResult.change.forEach((n) => {
                let cc = new ColorChange(n);
                this.effectLayer.add(cc);
                animation.add(cc, 'opacity', 0, 1);
            });
        }
        if (blanceResult.rotated) {
            blanceResult.rotated.forEach((rotate) => {
                let left = rotate.left;
                let n = rotate.node;
                let r = new Rotate(n, left);
                animation.add(r, 'progress', 0, 1);
                this.effectLayer.add(r);
            })
        }
        return animation;
    }

    blanceAfterInsert(node, insertNode) {
        return this._excuteProcessAnimated(node, function (node) {
            let blance = node.blanceSubTreeAfterInsert();
            blance.insertNode = insertNode;
            if (blance.focus) {
                let contains = false;
                let contains2 = false;
                for (let index = 0; index < blance.focus.length; index++) {
                    const element = blance.focus[index];
                    if (element.id == insertNode.id) {
                        element['color'] = ColorSchema.getFocusColor();
                        contains = true;
                        break;
                    }
                    if (element.id == node.id) {
                        element['color'] = ColorSchema.getSecondColor();
                        contains2 = true;
                        break;
                    }
                }
                if (!contains) {
                    blance.focus.push({ node: insertNode, color: ColorSchema.getFocusColor() });
                }
                if (!contains2 && insertNode.id != node.id) {
                    blance.focus.push({ node: node, color: ColorSchema.getSecondColor() });
                }
            }
            return blance;
        });
    }

    _registerTreeDimensionChange(animation) {
        animation.add(this.brTree, 'width', this.brTree.oldWidth, this.brTree.width);
        animation.add(this.brTree, 'height', this.brTree.oldHeight, this.brTree.height);
    }

    _refreshTreeAnimated(focursNode, relationChangedNodes, colorChangedNodes) {
        let result = this.brTree.layout();
        let animation = new MyAnimation(500, { x1: 0.37, y1: -0.47, x2: 0.61, y2: 1.45 });

        if (result == null) {
            this.brTree.updateSize({ width: 0, height: 0 });
        } else {
            let dirty = result.dirty;
            let region = result.region;

            this.brTree.updateSize(region);

            dirty.forEach((node) => {
                if (focursNode != null && focursNode.id == node.id) return;// 新增节点不进行位置动画，不好看
                this.registPositionChange(animation, node);
            });
            if (focursNode) {
                animation.add(focursNode, 'scale', 0, 1);
                animation.add(focursNode, 'innerPercent', focursNode.innerPercent, focursNode.isLeftLeaf ? 1 : 0);
            }
            if (colorChangedNodes) {
                colorChangedNodes.forEach((n) => {
                    this.registColorChange(animation, n);
                });
            }
            if (relationChangedNodes) {
                relationChangedNodes.forEach((effectNode) => {
                    if (focursNode != null && focursNode.id == effectNode.id) return;//不要叠加动画，否则会出错
                    animation.add(effectNode, 'innerPercent', effectNode.innerPercent, effectNode.isLeftLeaf ? 1 : 0);
                });
            }
        }
        this._registerTreeDimensionChange(animation);
        return animation.forward(() => {
            this.brTree.draw(this.ctx);
        });
    }

}