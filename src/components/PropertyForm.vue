<template>
  <v-container>
    <h1 v-if="editMode">부동산 매물 수정</h1>
    <h1 v-else>부동산 매물 등록</h1>

    <!-- 이미지 미리보기 슬라이드 -->
    <v-carousel hide-delimiters v-if="(imageUrls && imageUrls.length) || (newImages && newImages.length)">
      <!-- 기존 이미지들 -->
      <v-carousel-item v-for="(image, index) in imageUrls" :key="`existing-${index}`">
        <v-img :src="image" class="mb-2" height="300"></v-img>
        <v-card-actions>
          <v-btn color="error" @click="removeExistingImage(index)">이미지 삭제</v-btn>
        </v-card-actions>
      </v-carousel-item>

      <!-- 새로 추가된 이미지들 -->
      <v-carousel-item v-for="(image, index) in newImages" :key="`new-${index}`">
        <v-img :src="image.url" class="mb-2" height="300"></v-img>
        <v-card-actions>
          <v-btn color="error" @click="removeNewImage(index)">이미지 삭제</v-btn>
        </v-card-actions>
      </v-carousel-item>
    </v-carousel>

     <!-- 이미지 선택 -->
     <v-file-input multiple label="이미지 선택 (여러 장)" outlined @change="onFileChange"></v-file-input>

    <!-- 매물 정보 입력 -->
    <v-text-field v-model="form.title" label="제목" outlined required></v-text-field>
    <v-text-field v-model="form.price" label="가격 (보증금/월세)" outlined required></v-text-field>
    <v-textarea v-model="form.description" label="매물 설명" outlined required></v-textarea>

    <!-- 종류 선택 -->
    <v-select
      v-model="form.type"
      :items="['전세', '월세', '매매']"
      label="종류 선택 (전세/월세/매매)"
      outlined
      required
    ></v-select>

    <!-- 관리비 -->
    <v-text-field
      v-model="form.maintenanceFee"
      label="관리비"
      outlined
    ></v-text-field>

    <!-- 주차 가능 여부 -->
    <v-switch
      v-model="form.parkingAvailable"
      label="주차 가능 여부"
    ></v-switch>

    <!-- 방 종류 -->
    <v-text-field v-model="form.roomType" label="방 종류" outlined></v-text-field>

    <!-- 해당층/건물층 -->
    <v-text-field v-model="form.floor" label="해당층/건물층" outlined></v-text-field>

    <!-- 전용면적 -->
    <v-text-field v-model="form.area" label="전용면적 (㎡)" outlined type="number"></v-text-field>

    <!-- 방수 -->
    <v-text-field v-model="form.rooms" label="방수"></v-text-field>

    <!-- 욕실수 -->
    <v-text-field v-model="form.bathrooms" label="욕실수" ></v-text-field>

    <!-- 방향 -->
    <v-text-field v-model="form.direction" label="방향" outlined></v-text-field>

    <!-- 난방 종류 -->
    <v-text-field v-model="form.heatingType" label="난방 종류" outlined></v-text-field>

    <!-- 엘리베이터 여부 -->
    <v-switch v-model="form.elevatorAvailable" label="엘리베이터 여부"></v-switch>

    <!-- 총 주차대수 -->
    <v-text-field v-model="form.totalParkingSlots" label="총 주차대수"></v-text-field>

    <!-- 현관 유형 -->
    <v-text-field v-model="form.entranceType" label="현관 유형" outlined></v-text-field>

    <!-- 입주 가능일 -->
    <v-text-field v-model="form.availableMoveInDate" label="입주 가능일"></v-text-field>

    <!-- 건축물 용도 -->
    <v-text-field v-model="form.buildingUse" label="건축물 용도" outlined></v-text-field>

    <!-- 사용 승인일 -->
    <v-text-field v-model="form.approvalDate" label="사용 승인일" outlined type="date"></v-text-field>

    <!-- 최초 등록일 -->
    <v-text-field v-model="form.firstRegistrationDate" label="최초 등록일" outlined type="date"></v-text-field>

    <!-- 옵션 -->
    <v-textarea v-model="form.options" label="옵션" outlined></v-textarea>

    <!-- 보안/안전 시설 -->
    <v-text-field v-model="form.securityFacilities" label="보안/안전 시설" outlined></v-text-field>

    <!-- 등록/수정 버튼 -->
    <v-btn color="primary" @click="saveProperty">
      {{ editMode ? '매물 수정' : '매물 등록' }}
    </v-btn>

    <!-- 삭제 버튼은 수정 모드에서만 표시 -->
    <v-btn v-if="editMode" color="error" @click="deleteProperty">매물 삭제</v-btn>
  </v-container>
</template>

<script>
import api from '/src/axios-interceptor';

export default {
  data() {
    return {
      form: {
        propertyNumber: "",
        price: "",
        description: "",
        type: null,
        maintenanceFee: "",
        parkingAvailable: false,
        roomType: "",
        floor: "",
        area: "",
        rooms: "",
        bathrooms: "",
        direction: "",
        heatingType: "",
        elevatorAvailable: false,
        totalParkingSlots: "",
        entranceType: "",
        availableMoveInDate: "",
        buildingUse: "",
        approvalDate: "",
        firstRegistrationDate: "",
        options: "",
        securityFacilities: "",
      },
      existingImages: [], // 서버에서 불러온 기존 이미지 경로
      newImages: [], // 새로 추가된 이미지 파일
      imagesToDelete: [], // 삭제된 이미지 경로
      imageUrls: [],  // 기존 이미지 경로들을 저장할 배열
      editMode: false,
      propertyId: null, // 수정 모드일 때 매물 ID
    };
  },
  methods: {
    // 페이지 로드 시 매물 정보 로드 (수정 모드일 때만)
    async loadProperty() {
      if (this.editMode && this.propertyId) {
        try {
          const response = await api.get(`/api/properties/${this.propertyId}`);
          const property = response.data;
          console.log(property);

          // 폼에 기존 매물 정보를 채움
          this.form = {
            ...property,
            availableMoveInDate: this.formatDate(property.availableMoveInDate),
            approvalDate: this.formatDate(property.approvalDate),
            firstRegistrationDate: this.formatDate(property.firstRegistrationDate),
          };

          // 기존 이미지 목록 로드
          this.imageUrls = property.imageUrls || [];
        } catch (error) {
          console.error("매물 정보를 가져오는데 실패했습니다", error);
        }
      }
    },

    // 이미지 선택
    onFileChange(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newImages.push({
            file: files[i],  // 실제 파일
            url: e.target.result  // 미리보기 이미지 URL
          });
        };
        reader.readAsDataURL(files[i]);
      }
    },

    // 기존 이미지 삭제
    removeExistingImage(index) {
      const deletedImage = this.imageUrls.splice(index, 1)[0]; // 이미지 목록에서 삭제
      this.imagesToDelete.push(deletedImage); // 삭제된 이미지 목록에 추가
    },

    // 새로 추가된 이미지 삭제
    removeNewImage(index) {
      this.newImages.splice(index, 1); // 새로 추가된 이미지 배열에서 삭제
    },

    // 매물 등록/수정
    async saveProperty() {
      const formData = new FormData();
      const userId = localStorage.getItem('userId');
   
      // PropertyDTO에 해당하는 데이터 추가
      formData.append(
        "property",
        new Blob(
          [
            JSON.stringify({
              title: this.form.title,
              price: this.form.price,
              description: this.form.description,
              type: this.form.type,
              maintenanceFee: this.form.maintenanceFee,
              parkingAvailable: this.form.parkingAvailable,
              roomType: this.form.roomType,
              floor: this.form.floor,
              area: this.form.area,
              rooms: this.form.rooms,
              bathrooms: this.form.bathrooms,
              direction: this.form.direction,
              heatingType: this.form.heatingType,
              elevatorAvailable: this.form.elevatorAvailable,
              totalParkingSlots: this.form.totalParkingSlots,
              entranceType: this.form.entranceType,
              availableMoveInDate: this.form.availableMoveInDate,
              buildingUse: this.form.buildingUse,
              approvalDate: this.formatDate(this.form.approvalDate),
              firstRegistrationDate: this.formatDate(this.form.firstRegistrationDate),
              options: this.form.options,
              securityFacilities: this.form.securityFacilities,
              registeredUserId: userId,  
            }),
          ],
          { type: "application/json" }
        )
      );

      // 새로 추가된 이미지 파일 추가
      for (let i = 0; i < this.newImages.length; i++) {
        formData.append("images", this.newImages[i].file); // 실제 파일만 추가
      }

      // 삭제된 이미지 정보 추가
      if (this.imagesToDelete.length > 0) {
        formData.append(
          "imagesToDelete", 
          new Blob([JSON.stringify(this.imagesToDelete)], { type: "application/json" })
        );
      }

      try {
        if (this.editMode) {
          // 매물 수정 API 호출
          await api.put(`/api/properties/${this.propertyId}`, formData);
          alert("매물 수정 성공!");
        } else {
          // 매물 등록 API 호출
          const response = await api.post('/api/properties/register', formData);
          if (response.status === 201) {
            alert("매물 등록 성공!");
          }
        }
        this.$router.push("/properties");
      } catch (error) {
        console.error("매물 저장 실패", error);

        // 에러 응답이 있는 경우 메시지를 alert로 표시
        if (error.response && error.response.data && error.response.data.message) {
            alert(`매물 저장 실패: ${error.response.data.message}`);
        } else {
            // 서버에서 에러 메시지를 보내지 않은 경우 기본 메시지 표시
            alert("매물 저장 중 오류가 발생했습니다.");
        }
      }
    },

    // 매물 삭제
    async deleteProperty() {
      if (confirm("정말로 이 매물을 삭제하시겠습니까?")) {
        try {
          await api.delete(`/api/properties/${this.propertyId}`);
          alert("매물 삭제 성공!");
          this.$router.push("/properties");
        } catch (error) {
          console.error("매물 삭제 실패", error);
        }
      }
    },

    // 날짜 형식 변환
    formatDate(date) {
      if (!date || isNaN(new Date(date).getTime())) {
        return ''; // 날짜가 없거나 잘못된 형식이면 빈 문자열 반환
      }
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // yyyy-MM-dd 형식으로 반환
    },
  },
  mounted() {
    // URL에서 propertyId를 추출하여 수정 모드인지 확인
    if (this.$route.params.id) {
      this.editMode = true;
      this.propertyId = this.$route.params.id;
      this.loadProperty(); // 수정 시 기존 매물 정보 로드
    }
  }
};
</script>
