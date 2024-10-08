<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="headline">로그인</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field
                  label="아이디"
                  v-model="userId"
                  required
                ></v-text-field>
                <v-text-field
                  label="비밀번호"
                  v-model="password"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary">로그인</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        userId: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            userId: this.userId,
            password: this.password,
          });
          console.log(response);
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('roleDisplayName', response.data.roleDisplayName)
          this.$router.push('/properties');
        } catch (error) {
          console.error('Login failed', error);
        }
      },
    },
  };
  </script>
  