<template>
    <v-container>
      <h1>매물 목록</h1>
  
      <!-- 매물 등록 버튼: 중개사나 관리자만 표시 -->
      <v-btn
        v-if="canEdit()"
        color="primary"
        class="mb-4"
        @click="goToRegisterProperty"
      >
        매물 등록
      </v-btn>
  
      <v-row>
        <!-- 매물 목록 -->
        <v-col v-for="property in properties" :key="property.id" cols="12" md="6">
          <!-- v-card에 클릭 이벤트 추가 -->
          <v-card @click="viewProperty(property.id)" class="hover-card" hover>
            <v-img :src="property.thumbnailUrl || defaultThumbnail" height="200px"></v-img>
            <v-card-title>{{ property.title }}</v-card-title>
            <v-card-subtitle>{{ property.price }} / {{ property.roomType }} / {{ property.floor }} / {{ property.area }}㎡</v-card-subtitle>
            <v-card-text>
              관리비: {{ property.maintenanceFee }}
            </v-card-text>
  
            <v-card-actions>
              <!-- 수정, 삭제 버튼은 클릭 이벤트와 별도로 둠 -->
              <v-btn v-if="canEdit()" color="primary" @click.stop="editProperty(property.id)">수정</v-btn>
              <v-btn v-if="canEdit()" color="error" @click.stop="deleteProperty(property.id)">삭제</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 페이징 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="fetchProperties"
      ></v-pagination>
    </v-container>
</template>
  
<script>
import api from '/src/axios-interceptor';

export default {
  data() {
    return {
      properties: [],         // 매물 목록
      currentPage: 1,         // 현재 페이지
      perPage: 10,            // 페이지당 아이템 수
      totalPages: 1,          // 전체 페이지 수
      userRole: localStorage.getItem('role'),  // 로그인 후 저장된 역할
      defaultThumbnail: 'https://saferealtor-app-data.s3.ap-northeast-2.amazonaws.com/default_thumbnail.png'  // 기본 이미지 URL
    };
  },
  methods: {
    // 매물 목록 가져오기 (페이징 처리)
    async fetchProperties() {
      try {
        const response = await api.get('/api/properties/list', {
          params: {
            page: this.currentPage,
            perPage: this.perPage,
          }
        });
        this.properties = response.data.items;  // 실제 매물 목록 데이터
        this.totalPages = response.data.totalPages;  // 전체 페이지 수
      } catch (error) {
        console.error('Failed to fetch properties', error);
      }
    },
    // 수정 권한 체크
    canEdit() {
      return this.userRole === 'ROLE_AGENT';
    },
    // 매물 수정 페이지로 이동
    editProperty(id) {
      this.$router.push(`/properties/edit/${id}`);
    },
    // 매물 삭제
    async deleteProperty(id) {
      if (confirm('정말로 이 매물을 삭제하시겠습니까?')) {
        try {
          await api.delete(`/api/properties/${id}`);
          this.fetchProperties();  // 삭제 후 목록을 다시 불러옴
        } catch (error) {
          console.error('Failed to delete property', error);
        }
      }
    },
    // 매물 상세 정보 보기 페이지로 이동
    viewProperty(id) {
      this.$router.push(`/properties/${id}`);
    },
    // 매물 등록 페이지로 이동
    goToRegisterProperty() {
      this.$router.push('/properties/register');
    }
  },
  mounted() {
    this.fetchProperties();  // 컴포넌트가 로드될 때 매물 목록 가져오기
  }
};
</script>
