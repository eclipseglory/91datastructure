<template>
  <div id="main">
    <OperateSpace
      :disabled="disableOperation"
      @add="add"
      @delete="del"
      @randomDelete="randomDelete"
      @generate="generate"
      @invalid-id="invalidId"
      @invalid-num="invalidNum"
    />
    <CanvasSpace
      ref="canvas"
      @operation:over="operationOver"
      @operation:start="operationStart"
    />
  </div>
</template>

<script>
import OperateSpace from "./main/OperateSpace.vue";
import CanvasSpace from "./main/CanvasSpace.vue";

export default {
  name: "MainSpace",
  components: {
    OperateSpace,
    CanvasSpace,
  },
  data() {
    return {
      disableOperation: false,
    };
  },
  methods: {
    invalidId(id) {
      this.$refs.canvas.showError($t("default.main.error1"));
    },
    invalidNum(id) {
      this.$refs.canvas.showError($t("default.main.error2"));
    },
    add(id) {
      this.$refs.canvas.add(id);
    },
    del(id) {
      this.$refs.canvas.delete(id);
    },
    randomDelete() {
      this.$refs.canvas.randomDelete();
    },
    generate(n) {
      this.$refs.canvas.generate(n);
    },
    operationStart() {
      this.disableOperation = true;
    },
    operationOver() {
      this.disableOperation = false;
    },
  },
};
</script>

<style>
#main {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
}
</style>