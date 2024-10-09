<template>
  <v-app>
    <!-- 로그인 페이지가 아닌 경우에만 네비게이션 드로어를 보여줌 -->
    <v-navigation-drawer v-if="!isLoginPage" app v-model="drawer" permanent>
      <v-list>
        <!-- 사용자 정보 표시 -->
        <v-list-item>
          <v-list-item-title>
            {{ userId }} ({{ roleDisplayName }})
          </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <!-- 매물 조회 -->
        <v-list-item v-if="canViewProperties" @click="navigateWithPermission(canViewProperties, '/properties')">
          <v-list-item-title>매물 조회</v-list-item-title>
        </v-list-item>

        <!-- 문의 내역 -->
        <v-list-item v-if="canViewInquiries" @click="navigateWithPermission(canViewInquiries, '/inquiries')">
          <v-list-item-title>문의 내역</v-list-item-title>
        </v-list-item>

        <!-- 회원 관리 -->
        <v-list-item v-if="canManageUsers" @click="navigateWithPermission(canManageUsers, '/users')">
          <v-list-item-title>회원 관리</v-list-item-title>
        </v-list-item>

        <!-- 로그인/로그아웃 -->
        <v-list-item v-if="isLoggedIn" @click="confirmLogout">
          <v-list-item-title>로그아웃</v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click="$router.push('/login')">
          <v-list-item-title>로그인</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { userId, role, roleDisplayName, logout, loadUserInfo } from '/src/auth';

export default {
  setup() {
    const drawer = ref(true);
    const router = useRouter();
    const route = useRoute();

    // 로그인 여부
    const isLoggedIn = computed(() => !!localStorage.getItem('accessToken'));

    // 로그인 페이지인지 확인하는 계산된 속성
    const isLoginPage = computed(() => route.path === '/login');

     // 권한에 따른 메뉴 표시 설정
    const canViewProperties = computed(() => isLoggedIn.value);
    const canViewInquiries = computed(() => role.value === 'ROLE_AGENT' || role.value === 'ROLE_ADMIN');
    const canManageUsers = computed(() => role.value === 'ROLE_ADMIN');

    // 로그아웃 확인 함수
    const confirmLogout = () => {
      if (confirm('정말로 로그아웃하시겠습니까?')) {
        logout();
        router.push('/login');
      }
    };

    // 권한 체크 후 페이지 이동하는 함수
    const navigateWithPermission = (hasPermission, path) => {
      if (hasPermission) {
        router.push(path);
      } else {
        alert('권한이 없습니다.');  // 경고 메시지
      }
    };

    onMounted(() => {
      loadUserInfo();
    });

    return {
      drawer,
      userId,
      role,
      roleDisplayName,
      isLoginPage,
      isLoggedIn,
      canViewProperties,
      canViewInquiries,
      canManageUsers,
      confirmLogout,
      navigateWithPermission,
    };
  },
};
</script>
