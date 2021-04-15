<template>
  <div id="operate-space">
    <div class="row bb" style="padding: 20px">
      <div class="mb-3">
        <div class="input-group mb-3">
          <button
            :disabled="!generateEnable"
            v-on:click="generate"
            class="btn btn-primary btn-sm"
            type="button"
            id="generatebutton"
          >
            <i class="fas fa-sitemap"></i>
            {{ $t("default.operation.generate") }}
          </button>
          <input
            :disabled="disabled"
            v-model="generateNumber"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': !validateGenerate }"
            v-on:input="generateChange"
            :placeholder="$t('default.operation.generateholder')"
            id="generatenumber"
            aria-describedby="generatebutton"
          />
        </div>
      </div>
    </div>
    <div class="row bb" style="padding: 20px">
      <div class="input-group mb-3">
        <button
          :disabled="!addButtonEnable"
          v-on:click="add"
          class="btn btn-primary btn-sm"
          type="button"
          id="addbutton"
        >
          <i class="far fa-plus-square"></i>
          {{ $t("default.operation.insert") }}
        </button>
        <input
          :disabled="disabled"
          v-model="addId"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': !validAddId }"
          v-on:input="inputChange"
          :placeholder="$t('default.operation.placeholder')"
          id="idinput"
          aria-describedby="addbutton"
        />
      </div>
      <div class="mb-3">
        <button
          :disabled="disabled"
          v-on:click="randomAdd"
          class="btn btn-primary btn-sm"
          style="width: 100%"
          type="button"
          id="randomadd"
        >
          <i class="fas fa-plus"></i>
          {{ $t("default.operation.randomInsert") }}
        </button>
      </div>
    </div>
    <div class="row" style="padding: 20px">
      <div class="input-group mb-3">
        <button
          :disabled="!deleteButtonEnable"
          class="btn btn-danger btn-sm"
          v-on:click="del"
          type="button"
          id="deletebutton"
        >
          <i class="far fa-minus-square"></i>
          {{ $t("default.operation.delete") }}
        </button>
        <input
          :disabled="disabled"
          v-model="deleteId"
          type="text"
          :class="{ 'is-invalid': !validDeleteId }"
          @input="inputChange2"
          class="form-control"
          :placeholder="$t('default.operation.placeholder')"
          id="delete_idinput"
          aria-describedby="deletebutton"
        />
      </div>
      <div class="mb-3">
        <button
          :disabled="disabled"
          v-on:click="randomDelete"
          class="btn btn-danger btn-sm"
          style="width: 100%"
          type="button"
          id="randomdelete"
        >
          <i class="fas fa-minus"></i>
          {{ $t("default.operation.randomDelete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addId: "",
      validAddId: true,
      deleteId: "",
      validDeleteId: true,
      generateNumber: "",
      validateGenerate: true,
    };
  },
  emits: [
    "add",
    "delete",
    "randomDelete",
    "invalid-id",
    "generate",
    "invalid-num",
  ],

  props: {
    disabled: false,
  },

  computed: {
    addButtonEnable() {
      return !this.disabled && this.validAddId;
    },

    deleteButtonEnable() {
      return !this.disabled && this.validDeleteId;
    },
    generateEnable() {
      return !this.disabled && this.validateGenerate;
    },
  },

  methods: {
    generate() {
      if (!this.validateGenerate) return;
      let n = Number.parseInt(this.generateNumber);
      if (isNaN(n)) return;
      this.$emit("generate", n);
    },
    add() {
      if (!this.validAddId) return;
      let id = Number.parseInt(this.addId);
      this.addNode(id);
      // this.$root.$emit("add", { id: id });
    },
    randomDelete() {
      this.$emit("randomDelete");
    },
    del() {
      if (!this.validDeleteId) return;
      let id = Number.parseInt(this.deleteId);
      this.$emit("delete", id);
    },
    generateChange(event) {
      let v = event.target.value;
      let n = Number.parseInt(v);
      this.validateGenerate = !isNaN(n) && n > 0 && n < 100;
      if (!this.validateGenerate) this.$emit("invalid-num", n);
    },
    inputChange(event) {
      let v = event.target.value;
      let id = Number.parseInt(v);
      this.validAddId = !isNaN(v) && id >= 0 && id < 1000;
      if (!this.validAddId) this.$emit("invalid-id", v);
    },
    inputChange2(event) {
      let v = event.target.value;
      let id = Number.parseInt(v);
      this.validDeleteId = !isNaN(v) && id >= 0 && id < 1000;
      if (!this.validDeleteId) this.$emit("invalid-id", v);
    },
    randomAdd() {
      let id = Math.floor(Math.random() * 1000);
      this.addNode(id);
      // this.$root.$emit("add", { id: id });
    },

    addNode(id) {
      this.$emit("add", id);
    },
  },
};
</script>

<style>
#operate-space {
  height: 100%;
  width: 15%;
  background-color: #323232;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.bb {
  border-bottom: white solid 1px;
}
</style>