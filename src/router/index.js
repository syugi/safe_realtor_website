import { createRouter, createWebHistory } from 'vue-router';
import PropertyList from '../components/PropertyList.vue';
import PropertyDetail from '../components/PropertyDetail.vue';
import PropertyRegister from '../components/PropertyRegister.vue';
import Inquiries from '../components/Inquiries.vue'; // 문의 내역 페이지
import UserList from '../components/UserList.vue'; // 회원 관리 페이지
import Login from '../components/UserLogin.vue'; 

const routes = [
  { path: '/', redirect: '/properties' },
  { path: '/properties', component: PropertyList },
  { path: '/properties/:id', component: PropertyDetail },
  { path: '/properties/register', component: PropertyRegister },
  { path: '/inquiries', component: Inquiries },  // 문의 내역 경로 추가
  { path: '/users', component: UserList },  // 회원 관리 경로 추가
  { path: '/login', component: Login}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
