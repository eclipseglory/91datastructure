<template>
  <div class="bg-dark d-flex">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center">
        <div class="header-left">
          <div id="title-text">
            <div
              class="text-white title-text-container title-font-size"
              style="font-weight: bolder"
            >
              {{ $t("default.title.front") }}
            </div>
            <div
              id="title-next"
              class="text-dark title-text-container title-font-size"
            >
              {{ $t("default.title.next") }}
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="dropdown">
            <button
              class="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ currentLangText }}
            </button>
            <ul
              class="dropdown-menu small-text"
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <button
                  class="dropdown-item"
                  :class="{ active: isChinese }"
                  @click="changeLang('zh')"
                  type="button"
                >
                  中文
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  :class="{ active: !isChinese }"
                  @click="changeLang('en')"
                  type="button"
                >
                  Excellent English
                </button>
              </li>
            </ul>
          </div>
          <div class="title-link-container">
            <a
              href="https://github.com/eclipseglory/91datastructure/tree/main/rbtree"
              target="_blank"
              :title="$t('default.title.githubdes')"
              ><i
                id="github"
                class="fab fa-github title-font-size title-right-icon"
              ></i
            ></a>
          </div>
        </div>
        <!-- <i class="bi bi-github text-white"></i> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    currentLang: {
      type: String,
      default: "zh",
    },
  },
  methods: {
    changeLang(lang) {
      if (this.$i18n) {
        if (this.$i18n.locale != lang) {
          this.$i18n.locale = lang;
        }
      }
    },
  },
  computed: {
    currentLangText() {
      if (this.isChinese) return "中文";
      return "Excellent English";
    },
    isChinese() {
      if (this.$i18n) {
        return this.$i18n.locale == "zh";
      }
      return false;
    },
  },
};
</script>

<style>
#title-text {
  display: flex;
  align-items: baseline;
  padding: 20px 20px 20px 20px;
  box-sizing: border-box;
}

#title-next {
  border-radius: 5px;
  font-weight: bold;
  background-color: #fd7e14;
}

.title-font-size {
  font-size: 2em;
}

.title-text-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.header-right {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.header-left {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.title-link-container {
  padding: 10px;
  box-sizing: border-box;
}
.title-right-icon {
  color: whitesmoke;
}
.title-right-icon:hover {
  color: #fd7e14;
}

.small-text {
  font-size: 0.5em;
}
</style>