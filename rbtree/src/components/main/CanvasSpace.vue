<template>
  <div id="canvas-group">
    <canvas id="canvas"></canvas>
    <Tip ref="balanceTip" @next-step="balanceNextStep" :waitTime="6" />
    <div
      id="result-tip"
      class="toast align-items-center text-white border-0 position-absolute"
      :class="tipColor"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex justify-content-baseline" :class="tipTextColor">
        <div class="toast-body">
          <i :class="tipIcon" style="margin-right: 0.5em"></i>
          <small>{{ tipMsg }}</small>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import AnimationController from "../../js/animation-controller.js";
import Tip from "./Tip.vue";
import message from "../../message.js";

export default {
  props: {
    radius: {
      type: Number,
      default: 22,
    },
    xpadding: {
      type: Number,
      default: 14,
    },
    ypadding: {
      type: Number,
      default: 30,
    },
  },
  components: {
    Tip,
  },
  data() {
    return {
      tipMsg: "",
      op: "",
      tipColor: "bg-success",
      tipTextColor: "text-white",
      tipIcon: "fas fa-check-circle",
    };
  },
  emits: ["operation:start", "operation:over", "balance:start", "balance:over"],

  methods: {
    generate(n) {
      if (this.animationController) {
        this.animationController.generate(n);
      }
    },
    randomDelete() {
      if (this.animationController) {
        this.animationController.randomDelete();
      }
    },
    add(id) {
      if (this.animationController) {
        this.animationController.addNode(id);
      }
    },
    delete(id) {
      if (this.animationController) {
        this.animationController.deleteNode(id);
      }
    },

    showError(msg) {
      this.tipMsg = msg;
      this.tipColor = "bg-danger";
      this.tipTextColor = "text-white";
      this.tip.show();
    },

    balanceNextStep() {
      if (this.animationController) {
        this.animationController._nextStep();
      }
    },

    fireOperationStart() {
      this.$emit("operation:start");
    },

    fireOperationOver(event) {
      this.op = event.op;
      let id = event.id;
      let num = event.num;
      this.tipMsg = message.generateOperationOverMsg(
        event.op,
        id,
        num,
        event.type
      );
      if (event.type == "success") {
        this.tipColor = "bg-success";
        this.tipTextColor = "text-white";
        this.tipIcon = "fas fa-check-circle";
      }
      if (event.op == "update") {
        this.tipColor = "bg-warning";
        this.tipTextColor = "text-dark";
        this.tipIcon = "fas fa-edit";
      }
      if (event.type == "error") {
        this.tipColor = "bg-danger";
        this.tipTextColor = "text-white";
        this.tipIcon = "fas fa-exclamation-circle";
      }
      this.tip.show();
      this.$emit("operation:over", event);
    },

    fireBalanceStart(event) {
      this.$refs.balanceTip.showTip(event);
      this.$emit("balance:start", event);
    },

    fireBalanceOver(event) {
      this.$emit("balance:over", event);
    },
  },
  mounted() {
    let group = this.$el;
    let te = group.querySelector("#result-tip");
    this.tip = new bootstrap.Toast(te, { delay: 3000 });
    let canvas = this.$el.querySelector("#canvas");
    let frontCanvas = document.createElement("canvas");
    frontCanvas.id = "__front-canvas";
    frontCanvas.className = "front-canvas";

    let ratio = window.devicePixelRatio;

    if (ratio == null) ratio = 1;

    let w = group.clientWidth;
    let h = group.clientHeight;

    canvas.width = w * ratio;
    canvas.height = h * ratio;

    frontCanvas.width = canvas.width;
    frontCanvas.height = canvas.height;

    frontCanvas.style.width = `${w}px`;
    frontCanvas.style.height = `${h}px`;

    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    group.insertBefore(frontCanvas, canvas.nextSibling);

    let ctx = canvas.getContext("2d");
    let fctx = frontCanvas.getContext("2d");

    this.animationController = new AnimationController(
      ctx,
      fctx,
      this.radius,
      this.xpadding,
      this.ypadding
    );
    this.animationController.on("operationStart", this.fireOperationStart);
    this.animationController.on("operationOver", this.fireOperationOver);
    this.animationController.on("balanceStepOver", this.fireBalanceOver);
    this.animationController.on("balanceStepStart", this.fireBalanceStart);
  },
};
</script>

<style>
#canvas-group {
  background-color: #f8f9fa;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
}
.front-canvas {
  position: absolute;
  left: 0px;
  top: 0px;
}

#result-tip {
  bottom: 10px;
  right: 10px;
}
</style>