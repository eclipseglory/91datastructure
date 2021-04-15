import BezierEasing from "./math/bezier-easing.js";

export default class MyAnimation {
    constructor(duration = 500, bezier = { x1: 0, y1: 0, x2: 0, y2: 0 }) {
        this.duration = duration;
        this.timingFunction = new BezierEasing(bezier.x1, bezier.y1, bezier.x2, bezier.y2)
        this.figures = [];
        this.loop = false;
        this.loopWithReverse = false;
    }

    add(figure, propName, start = 0, end = 1, valueProcessor) {
        let d = end - start;
        if (d == 0) return;
        this.figures.push({
            'figure': figure,
            'prop': propName,
            'start': start,
            'end': end,
            'delta': d,
            'processor': valueProcessor
        });
    }

    forward(trigger) {
        if (this.running) return Promise.resolve();
        return new Promise((resolve, reject) => {
            let refNum = Math.floor(this.duration / 16.6);
            this._run(trigger, refNum, 0, false, resolve);
        });
    }

    stop() {
        this._stop = true;
    }

    reverse(trigger) {
        if (this.running) return Promise.resolve();
        return new Promise((resolve, reject) => {
            let refNum = Math.floor(this.duration / 16.6);
            this._run(trigger, refNum, 0, true, resolve);
        });
    }

    _run(trigger, totalRef, current = 0, reverse = false, resolve) {
        if (this._stop) {
            resolve();
            return;
        }
        this._stop = false;
        let progress = current / totalRef;
        let value = this.timingFunction.easing(progress);
        this.figures.forEach((obj) => {
            if (obj.delta == 0) return;
            let f = obj.figure;
            let pro = obj.prop;
            if (!reverse) {
                let a = obj.delta * value + obj.start;
                if (obj.processor) {
                    a = obj.processor(a);
                }
                f[pro] = a;//obj.delta * value + obj.start;
            } else {
                let a = obj.end - obj.delta * value;
                if (obj.processor) {
                    a = obj.processor(a);
                }
                f[pro] = a;//obj.end - obj.delta * value;
            }
        });
        current++;
        if (trigger) trigger(value);
        if (current > totalRef) {
            this.running = false;
            if (this.loop) {
                if (this.loopWithReverse) reverse = !reverse;
                this._run(trigger, totalRef, 0, reverse, resolve);
                return;
            } else {
                resolve();
                return;
            }
        }
        requestAnimationFrame(() => {
            this._run(trigger, totalRef, current, reverse, resolve);
        });
    }
}