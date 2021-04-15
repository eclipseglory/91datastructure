<template>
  <div id="toast-container" class="toast-container">
    <div
      id="toast"
      class="toast hide"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <strong class="me-auto"
          ><i class="fas fa-info-circle" style="margin-right: 0.2em"></i
          >{{ tipName }}</strong
        >
        <small :class="tipTitle.color">{{ tipTitle.msg }}</small>
      </div>
      <div class="toast-body">
        <div id="message-container">
          <div v-if="hasInsertNode" id="blance-node" class="border-bottom">
            <strong class="text-dark">{{
              $t(`${msgKey}insertNode`) + ":"
            }}</strong>
            <small style="margin-left: 5px">{{ insertNodeText }}</small>
          </div>
          <div
            v-if="hasDeleteNode && hasReplaceNode"
            class="node-text-container"
          >
            <div id="blance-node" class="border-bottom">
              <strong class="text-dark">{{
                $t(`${msgKey}deleteNode`) + ":"
              }}</strong>
              <small style="margin-left: 5px">{{ deleteNodeText }}</small>
            </div>
            <div id="blance-node" style="justify-content: flex-end">
              <strong class="text-dark">{{
                $t(`${msgKey}replaceNode`) + ":"
              }}</strong>
              <small style="margin-left: 5px">{{ replaceNodeText }}</small>
            </div>
          </div>
          <div class="node-text-container">
            <div id="blance-node" class="border-bottom">
              <strong class="text-dark"
                >{{ $t(`${msgKey}currentBlance`) + ":" }}
              </strong>
              <small style="margin-left: 5px">{{ currentBlanceText }}</small>
            </div>
            <div id="blance-node" style="justify-content: flex-end">
              <strong class="text-dark"
                >{{ $t(`${msgKey}nextBlance`) + ":" }}
              </strong>
              <small style="margin-left: 5px">{{ nextBlanceText }}</small>
            </div>
          </div>
          <div v-if="!nullCase" id="blance-operation" class="border-bottom">
            <div class="text-primary">
              <i class="fas fa-tasks" style="margin-right: 0.2em"></i
              ><strong>{{ $t(`${msgKey}case`) + ":" }}</strong>
            </div>
            <small><div v-html="ca" /></small>
          </div>
          <div v-if="!nullOp" id="blance-reason" class="border-bottom">
            <div class="text-primary">
              <i class="far fa-bell" style="margin-right: 0.2em"></i>
              <strong>{{ $t(`${msgKey}process`) + ":" }}</strong>
            </div>
            <small><div v-html="operation" /></small>
          </div>
          <div v-if="!nullReason" id="blance-operation">
            <div class="text-primary">
              <i class="far fa-question-circle" style="margin-right: 0.2em"></i>
              <strong>{{ $t(`${msgKey}reason`) + ":" }}</strong>
            </div>
            <small><div v-html="reason" /></small>
          </div>
        </div>
        <div id="toast-footer" class="mt-2 pt-2 border-top">
          <button
            type="button"
            :disabled="pause"
            v-on:click="pauseHere"
            class="btn btn-secondary btn-sm"
          >
            <i class="fas fa-pause-circle"></i>
            {{ $t(`${msgKey}pause`) }}
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            v-on:click="nextStep"
          >
            <i class="fas fa-arrow-circle-right"></i>
            {{ nextString }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tip",
  mounted() {
    let te = this.$el.querySelector("#toast");
    this.toast = new bootstrap.Toast(te, { autohide: false });
    // this.$root.$on("blanceStepStart", this.showTip);
  },
  emits: ["next-step"],
  methods: {
    _startCount() {
      if (this.currentCount <= 0) {
        if (this.intervalId != null) {
          clearTimeout(this.intervalId);
        }
        this.nextStep();
        return;
      }
      this.currentCount--;
      this.intervalId = setTimeout(() => {
        this._startCount();
      }, 1000);
    },

    nextStep() {
      this.hideTip();
      this.$emit("next-step");
    },

    showTip(event) {
      this.currentCount = this.waitTime;
      this.currentBlance = event.current;
      this.blance = event.blance;
      this.toast.show();
      this.pause = false;
      this._startCount();
    },

    hideTip() {
      if (this.intervalId != null) {
        clearTimeout(this.intervalId);
      }
      this.currentBlance = null;
      this.blance = null;
      this.toast.hide();
    },

    pauseHere() {
      if (this.intervalId != null) {
        clearTimeout(this.intervalId);
      }
      this.pause = true;
    },
  },
  computed: {
    nextString: function () {
      let str = this.$t(`${this.msgKey}forward`);
      if (!this.pause) {
        str = `${this.$t(`${this.msgKey}forward`)} (${this.currentCount})`;
      }
      return str;
    },

    hasDeleteNode() {
      return this.blance != null && this.blance.deleteNode != null;
    },

    hasReplaceNode() {
      return this.blance != null && this.blance.replaceNode != null;
    },

    hasInsertNode() {
      return this.blance != null && this.blance.insertNode != null;
    },

    deleteNodeText() {
      if (this.hasDeleteNode) {
        return this.blance.deleteNode.id;
      }
    },

    replaceNodeText() {
      if (this.hasReplaceNode) {
        return this.blance.replaceNode.id;
      }
    },

    insertNodeText() {
      if (this.hasInsertNode) {
        return this.blance.insertNode.id;
      }
    },

    currentBlanceText() {
      if (this.currentBlance == null) return "";
      return this.currentBlance.id;
    },

    nextBlanceText() {
      if (this.blance == null) return "";
      if (this.blance.next == null) return this.$t(`${this.msgKey}none`);
      return this.blance.next.id;
    },

    tipTitle() {
      if (this.blance == null) return "";
      if (this.blance.next == null)
        return { msg: this.$t(`${this.msgKey}blanced`), color: "text-success" };
      return { msg: this.$t(`${this.msgKey}notblanced`), color: "text-danger" };
    },

    tipName() {
      if (this.blance == null) return "";
      if (this.blance.op == "insert")
        return this.$t(`${this.msgKey}insertBlanceOp`);
      return this.$t(`${this.msgKey}deleteBlanceOp`);
    },

    nullReason() {
      if (this.blance == null) return true;
      let reason = this.blance.reason;
      if (reason == null || reason.length == 0) return true;
      return false;
    },

    nullOp() {
      if (this.blance == null) return true;
      let operation = this.blance.operation;
      if (operation == null || operation.length == 0) return true;
      return false;
    },

    nullCase() {
      if (this.blance == null) return true;
      let ca = this.blance.ca;
      if (ca == null || ca.length == 0) return true;
      return false;
    },

    reason() {
      if (this.nullReason) return "";
      let re = this.blance.reason;
      //text-muted
      re = re.replaceAll(
        this.$t(`${this.msgKey}redKey`),
        `<span class="text-danger" style="font-weight:bold">${this.$t(
          `${this.msgKey}redKey`
        )}</span>`
      );
      re = re.replaceAll(
        this.$t(`${this.msgKey}blackKey`),
        `<span class="text-black" style="font-weight:bold">${this.$t(
          `${this.msgKey}blackKey`
        )}</span>`
      );
      return re;
    },
    ca() {
      if (this.nullCase) return "";
      let ca = this.blance.ca;
      ca = ca.replaceAll(
        this.$t(`${this.msgKey}redKey`),
        `<span class="text-danger" style="font-weight:bold">${this.$t(
          `${this.msgKey}redKey`
        )}</span>`
      );
      ca = ca.replaceAll(
        this.$t(`${this.msgKey}blackKey`),
        `<span class="text-black" style="font-weight:bold">${this.$t(
          `${this.msgKey}blackKey`
        )}</span>`
      );
      return ca;
    },

    operation() {
      if (this.nullOp) return "";
      let op = this.blance.operation;
      op = op.replaceAll(
        this.$t(`${this.msgKey}lRotateKey`),
        `<span class="text-primary" style="font-weight:bold">${this.$t(
          `${this.msgKey}lRotateKey`
        )}</span>`
      );
      op = op.replaceAll(
        this.$t(`${this.msgKey}rRotateKey`),
        `<span class="text-success" style="font-weight:bold">${this.$t(
          `${this.msgKey}rRotateKey`
        )}</span>`
      );

      op = op.replaceAll(
        this.$t(`${this.msgKey}redKey`),
        `<span class="text-danger" style="font-weight:bold">${this.$t(
          `${this.msgKey}redKey`
        )}</span>`
      );
      op = op.replaceAll(
        this.$t(`${this.msgKey}blackKey`),
        `<span class="text-black" style="font-weight:bold">${this.$t(
          `${this.msgKey}blackKey`
        )}</span>`
      );
      return op;
    },
  },
  data() {
    return {
      pause: false,
      currentCount: 0,
      blance: null,
      currentBlance: null,
      msgKey: "default.tip.",
    };
  },
  props: {
    waitTime: {
      type: Number,
      default: 6,
    },
  },
};
</script>

<style>
#toast-container {
  position: absolute;
  left: 0px;
  top: 0px;
  padding: 20px;
  box-sizing: border-box;
}

#toast-footer {
  display: flex;
  justify-content: space-between;
}

#blance-node {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: baseline;
}

.node-text-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#message-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#blance-reason {
  margin-top: 10px;
}

#blance-operation {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>