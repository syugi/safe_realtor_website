import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

// 날짜 포맷팅 함수
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
}

const app = createApp(App);
app.config.globalProperties.$formatDate = formatDate;

app
  .use(router)
  .use(vuetify)
  .mount('#app')
