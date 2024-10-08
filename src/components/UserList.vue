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
  import axios from 'axios';
  
  export default {
    data() {
      return {
        activeTab: 0,  // 탭 상태 관리
        admins: [],    // 관리자 목록
        agents: [],    // 중개사 목록
        users: [],     // 일반 회원 목록
      };
    },
    methods: {
      // 데이터 가져오기 (관리자, 중개사, 일반 회원 목록)
      async fetchUserLists() {
        const token = localStorage.getItem('accessToken');
        try {
          // 관리자 목록 조회
          const adminResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/admins`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.admins = adminResponse.data;
  
          // 중개사 목록 조회
          const agentResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/agents`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.agents = agentResponse.data;
  
          // 일반 회원 목록 조회
          const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/members`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.users = userResponse.data;
        } catch (error) {
          console.error('Failed to fetch user lists', error);
        }
      },
    },
    mounted() {
      this.fetchUserLists();  // 컴포넌트 로드 시 데이터 가져오기
    },
  };
  </script>
  
  <style scoped>
  </style>
  