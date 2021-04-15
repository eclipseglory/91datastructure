<template>
  <div id="app" class="bg-light">
    <Header @langChange="switchLang" :currentLang="currentLang" />
    <MainSpace />
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import MainSpace from "./components/MainSpace.vue";
import message from "./message.js";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    MainSpace,
  },
  data() {
    return {
      currentLang: "zh",
    };
  },
  created() {
    message.$t = this.$t;
  },
  methods: {
    switchLang(lang) {
      this.currentLang = lang;
    },
  },
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, Avenir, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
