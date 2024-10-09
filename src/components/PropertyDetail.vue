<template>
    <v-container>
      <h1>매물 {{ property.propertyNumber }}</h1>
  
      <!-- 이미지 캐러셀 -->
      <v-carousel v-if="property.imageUrls && property.imageUrls.length > 0" hide-delimiter-background height="300">
        <v-carousel-item v-for="(image, index) in property.imageUrls" :key="index">
          <v-img :src="image"></v-img>
        </v-carousel-item>
      </v-carousel>
      <v-img v-else src="https://saferealtor-app-data.s3.ap-northeast-2.amazonaws.com/default_thumbnail.png" height="300"></v-img>
  
      <!-- 매물 기본 정보 -->
      <v-card class="mt-4">
        <v-card-title>
          {{ property.title }} - {{ property.price }}원
        </v-card-title>
        <v-card-text>
          <p>방 종류: {{ property.roomType }}</p>
          <p>층: {{ property.floor }}</p>
          <p>면적: {{ property.area }}㎡</p>
          <p>관리비: {{ property.maintenanceFee }}</p>
          <p>방수: {{ property.rooms }} / 욕실수: {{ property.bathrooms }}</p>
          <p>주차 가능 여부: {{ property.parkingAvailable ? '있음' : '없음' }}</p>
          <p>엘리베이터: {{ property.elevatorAvailable ? '있음' : '없음' }}</p>
          <p>입주 가능일: {{ property.availableMoveInDate }}</p>
          <p>사용 승인일: {{ property.approvalDate }}</p>
          <p>주소: {{ property.address }}</p>
        </v-card-text>
  
        <!-- 수정/삭제 버튼: 중개사 또는 관리자만 표시 -->
        <v-card-actions v-if="canEdit()">
          <v-btn color="primary" @click="editProperty">수정</v-btn>
          <v-btn color="error" @click="deleteProperty">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import api from '/src/axios-interceptor';
  
  export default {
    data() {
      return {
        property: {},  // 매물 정보
        userRole: localStorage.getItem('role')  // 사용자 권한 (ROLE_AGENT 또는 ROLE_ADMIN)
      };
    },
    methods: {
      async fetchProperty() {
        try {
          const response = await api.get(`/api/properties/${this.$route.params.id}`);
          this.property = response.data;
        } catch (error) {
          console.error('매물 정보를 가져오는데 실패했습니다', error);
        }
      },
      canEdit() {
        return this.userRole === 'ROLE_AGENT';
      },
      // 매물 수정 페이지로 이동
      editProperty() {
        this.$router.push(`/properties/edit/${this.property.id}`);
      },
      // 매물 삭제
      async deleteProperty() {
        if (confirm('정말로 이 매물을 삭제하시겠습니까?')) {
          try {
            await api.delete(`/api/properties/${this.property.id}`);
            this.$router.push('/properties');
          } catch (error) {
            console.error('매물을 삭제하는데 실패했습니다', error);
          }
        }
      },
      // 문의하기 페이지로 이동
      inquireProperty() {
        this.$router.push(`/inquiry/${this.property.propertyNumber}`);
      }
    },
    mounted() {
      this.fetchProperty();  // 컴포넌트가 로드될 때 매물 정보 가져오기
    }
  };
  </script>
  