<template>
    <v-container>
      <h1>회원 목록</h1>
  
      <!-- 탭 메뉴 -->
      <v-tabs v-model="activeTab">
        <v-tab>관리자 목록</v-tab>
        <v-tab>중개사 목록</v-tab>
        <v-tab>회원 목록</v-tab>
      </v-tabs>
  
      <!-- 탭 내용 -->
      <v-tabs-items v-model="activeTab">
        <!-- 관리자 목록 -->
        <v-tab-item v-if="activeTab === 0">
          <v-row>
            <v-col v-for="admin in admins" :key="admin.id" cols="12" md="6">
              <v-card>
                <v-card-title>{{ admin.name }} (ID: {{ admin.userId }})</v-card-title>
                <v-card-text>
                  <strong>이메일:</strong> {{ admin.email }} <br>
                  <strong>역할:</strong> 관리자
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
  
        <!-- 중개사 목록 -->
        <v-tab-item v-if="activeTab === 1">
          <v-row>
            <v-col v-for="agent in agents" :key="agent.id" cols="12" md="6">
              <v-card>
                <v-card-title>{{ agent.name }} (ID: {{ agent.userId }})</v-card-title>
                <v-card-text>
                  <strong>이메일:</strong> {{ agent.email }} <br>
                  <strong>역할:</strong> 중개사
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
  
        <!-- 일반 회원 목록 -->
        <v-tab-item v-if="activeTab === 2">
          <v-row>
            <v-col v-for="user in users" :key="user.id" cols="12" md="6">
              <v-card>
                <v-card-title>{{ user.name }} (ID: {{ user.userId }})</v-card-title>
                <v-card-text>
                  <strong>이메일:</strong> {{ user.email }} <br>
                  <strong>역할:</strong> 회원
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import api from '/src/axios-interceptor';
  
  export default {
    setup() {
      const activeTab = ref(0);
      const admins = ref([]);
      const agents = ref([]);
      const users = ref([]);
  
      // 데이터 가져오기 (관리자, 중개사, 일반 회원 목록)
      const fetchUserLists = async () => {
        try {
          // 관리자 목록 조회
          const adminResponse = await api.get('/api/users/admins');
          admins.value = adminResponse.data;
  
          // 중개사 목록 조회
          const agentResponse = await api.get('/api/users/agents');
          agents.value = agentResponse.data;
  
          // 일반 회원 목록 조회
          const userResponse = await api.get('/api/users/members');
          users.value = userResponse.data;
        } catch (error) {
          console.error('Failed to fetch user lists', error);
        }
      };
  
      onMounted(() => {
        fetchUserLists(); // 컴포넌트 로드 시 데이터 가져오기
      });
  
      return {
        activeTab,
        admins,
        agents,
        users,
      };
    },
  };
  </script>
  
  <style scoped>
  </style>
  