<template>
    <v-container>
      <h1>문의 내역</h1>
      
      <v-row>
        <!-- 문의 목록 -->
        <v-col v-for="inquiry in inquiries" :key="inquiry.id" cols="12" md="6">
          <v-card>
            <v-card-title>
              <div>
                <strong>문의자:</strong> {{ inquiry.userId }}
                <br>
                <strong>문의 날짜:</strong> {{ inquiry.createdAt | formatDate }}
                <br>
                <strong>전화번호:</strong> {{ inquiry.userPhoneNumber ? inquiry.userPhoneNumber : '전화번호 없음' }}
              </div>
            </v-card-title>
  
            <v-card-text>
              <strong>문의 내용:</strong> {{ inquiry.inquiryContent }}
              <v-divider></v-divider>
  
              <!-- 상세 요청사항 확인 버튼 -->
              <v-btn color="secondary" @click="toggleDetailRequest(inquiry.id)">
                {{ inquiry.showDetail ? '상세 요청사항 숨기기' : '상세 요청사항 보기' }}
              </v-btn>
              
              <!-- 상세 요청사항 -->
              <v-expand-transition>
                <div v-if="inquiry.showDetail" class="mt-2">
                  <strong>상세 요청사항:</strong>
                  <div>{{ inquiry.detailRequest }}</div>
                </div>
              </v-expand-transition>
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
        inquiries: [], // 문의 목록
      };
    },
    methods: {
      // 문의 내역 가져오기
      async fetchInquiries() {
        try {
          // 로컬 스토리지에서 토큰 가져오기
          const token = localStorage.getItem('accessToken');
  
          // API 요청 시 Authorization 헤더에 토큰 추가
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/inquiry/list`, {
            headers: {
              Authorization: `Bearer ${token}`, // Bearer 토큰 형식으로 추가
            },
          });
  
          // 각 문의에 showDetail 속성 추가 (상세 요청사항 보기/숨기기 토글용)
          this.inquiries = response.data.map(inquiry => ({
            ...inquiry,
            showDetail: false,  // 기본적으로 상세 요청사항 숨김
          }));
        } catch (error) {
          console.error('Failed to fetch inquiries', error);
        }
      },
      
      // 상세 요청사항 보기/숨기기 토글
      toggleDetailRequest(inquiryId) {
        const inquiry = this.inquiries.find(i => i.id === inquiryId);
        if (inquiry) {
          inquiry.showDetail = !inquiry.showDetail;
        }
      }
    },
    mounted() {
      this.fetchInquiries(); // 컴포넌트 로드 시 문의 내역 가져오기
    },
    filters: {
      // 날짜 포맷 필터
      formatDate(value) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(value).toLocaleDateString(undefined, options);
      },
    },
  };
  </script>
  
  <style scoped>
  .mt-2 {
    margin-top: 8px;
  }
  </style>
  