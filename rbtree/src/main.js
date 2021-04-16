import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'


const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'en',
    messages: {
        zh: require('./assets/i18n/zh.js'),
        en: require('./assets/i18n/en.js')
    }
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
