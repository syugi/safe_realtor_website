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
        <v-list-item @click="$router.push('/properties')">
          <v-list-item-title>매물 조회</v-list-item-title>
        </v-list-item>

        <!-- 문의 내역 -->
        <v-list-item @click="$router.push('/inquiries')">
          <v-list-item-title>문의 내역</v-list-item-title>
        </v-list-item>

        <!-- 회원 관리 -->
        <v-list-item @click="$router.push('/users')">
          <v-list-item-title>회원 관리</v-list-item-title>
        </v-list-item>

        <!-- 로그아웃 -->
        <v-list-item @click="confirmLogout">
          <v-list-item-title>로그아웃</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: true,  // Navigation drawer가 기본으로 열려 있도록 설정
      userId: '',    // 사용자 ID
      role: '',      // 사용자 역할
      roleDisplayName: '', // 사용자 역할명
    };
  },
  computed: {
    // 현재 경로가 '/login'이면 true를 반환, 그 외에는 false 반환
    isLoginPage() {
      return this.$route.path === '/login';
    },
  },
  methods: {
    // 로그아웃 확인 팝업
    confirmLogout() {
      if (confirm('정말로 로그아웃하시겠습니까?')) {
        this.logout();
      }
    },
    // 로그아웃 함수
    logout() {
      // localStorage에서 저장된 토큰 및 사용자 정보 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('roleDisplayName');
      
      // 로그아웃 후 로그인 페이지로 이동
      this.$router.push('/login');
    },
    // 사용자 정보를 localStorage에서 가져오는 함수
    loadUserInfo() {
      this.userId = localStorage.getItem('userId');
      this.role = localStorage.getItem('role');
      this.roleDisplayName = localStorage.getItem('roleDisplayName');
    },
  },
  mounted() {
    this.loadUserInfo();  // 컴포넌트가 로드될 때 사용자 정보를 가져옴
  },
};
</script>
