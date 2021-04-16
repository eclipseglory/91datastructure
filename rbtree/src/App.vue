<template>
  <div id="app" class="bg-light">
    <Header />
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
  created() {
    message.$t = this.$t;
    this.$TEST = "TEST";
    this.$VERSION = process.env.VUE_APP_VERSION;
    this.$AUTHOR = {
      name: process.env.VUE_APP_AUTHOR_MANE,
      url: process.env.VUE_APP_AUTHOR_URL,
    };
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
