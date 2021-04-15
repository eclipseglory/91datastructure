export default class EffectLayer {
    constructor(brTree, ctx) {
        this.brTree = brTree;
        this.width = 0;
        this.opacity = 0;
        this.ctx = ctx;
        this.effects = [];
        this.scale = 1;
    }

    add(effect) {
        this.effects.push(effect);
    }

    draw() {
        let ctx = this.ctx;
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (this.opacity > 0) {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        let scale = 1;
        this.scale = 1;
        if (this.brTree.width > ctx.canvas.width) {
            scale = Math.min(ctx.canvas.width / this.brTree.width, scale);
        }
        if (this.brTree.height > ctx.canvas.height) {
            scale = Math.min(ctx.canvas.height / this.brTree.height, scale);
        }
        if (scale != 1) {
            this.scale = scale;
            ctx.scale(scale, scale);
        }
        ctx.translate(-this.brTree.width / 2, -this.brTree.height / 2);
        ctx.globalAlpha = 1;

        this.effects.forEach((e) => {
            e.draw(ctx);
        })

        ctx.restore();
    }

    clean() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.effects.forEach((e) => {
            e.dispose();
        });
        this.effects.length = 0;
    }
}