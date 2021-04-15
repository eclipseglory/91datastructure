<template>
  <footer class="mt-auto bg-dark footer-container">
    <div class="text-light"></div>
    <div id="center" class="text-light">
      <small
        >Developed by
        <a id="developer" href="#" title="Developer's blog,if he had">老脸</a>
        (v2021.4.15)</small
      >
    </div>
    <div id="left">
      <!-- <a href="#"><i class="fas fa-bug footer-left-icon"></i></a> -->
      <a
        href="https://github.com/eclipseglory/91datastructure/issues"
        target="_blank"
        :title="$t('default.footer.reportbug')"
        ><i class="fas fa-bug footer-left-icon"></i
      ></a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 10px 20px 10px 20px;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

#center {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#left {
  padding-right: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: baseline;
}

#developer {
  text-decoration: none;
  font-weight: bold;
  color: whitesmoke;
}

#developer:hover {
  color: #fd7e14;
}

.footer-left-icon {
  color: whitesmoke;
  padding-left: 1em;
  box-sizing: border-box;
}

.footer-left-icon:hover {
  color: #fd7e14;
}
</style>