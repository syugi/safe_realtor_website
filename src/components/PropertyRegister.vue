<template>
  <v-container>
    <h1>부동산 매물 등록</h1>

    <!-- 매물 번호 -->
    <v-text-field
      v-model="form.titme"
      label="제목"
      outlined
      required
    ></v-text-field>

    <!-- 가격 -->
    <v-text-field
      v-model="form.price"
      label="가격"
      outlined
      type="number"
      required
    ></v-text-field>

    <!-- 소개 -->
    <v-textarea
      v-model="form.description"
      label="소개"
      outlined
      required
    ></v-textarea>

    <!-- 이미지 선택 -->
    <v-file-input
      multiple
      label="이미지 선택 (여러 장)"
      outlined
      @change="onFileChange"
    ></v-file-input>

    <!-- 선택한 이미지 미리보기 -->
    <v-row v-if="images.length > 0" class="mt-2">
      <v-col v-for="(image, index) in images" :key="index" cols="12" md="4">
        <v-card>
          <v-img :src="image.url" class="mb-2" height="150"></v-img>
          <v-card-actions>
            <v-btn color="error" @click="removeImage(index)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
      type="number"
    ></v-text-field>

    <!-- 주차 가능 여부 -->
    <v-switch
      v-model="form.parkingAvailable"
      label="주차 가능 여부"
    ></v-switch>

    <!-- 방 종류 -->
    <v-text-field
      v-model="form.roomType"
      label="방 종류"
      outlined
    ></v-text-field>

    <!-- 해당층/건물층 -->
    <v-text-field
      v-model="form.floor"
      label="해당층/건물층"
      outlined
    ></v-text-field>

    <!-- 전용면적 -->
    <v-text-field
      v-model="form.area"
      label="전용면적 (㎡)"
      outlined
      type="number"
    ></v-text-field>

    <!-- 방수 -->
    <v-text-field
      v-model="form.rooms"
      label="방수"
      outlined
      type="number"
    ></v-text-field>

    <!-- 욕실수 -->
    <v-text-field
      v-model="form.bathrooms"
      label="욕실수"
      outlined
      type="number"
    ></v-text-field>

    <!-- 방향 -->
    <v-text-field
      v-model="form.direction"
      label="방향"
      outlined
    ></v-text-field>

    <!-- 난방 종류 -->
    <v-text-field
      v-model="form.heatingType"
      label="난방 종류"
      outlined
    ></v-text-field>

    <!-- 엘리베이터 여부 -->
    <v-switch
      v-model="form.elevatorAvailable"
      label="엘리베이터 여부"
    ></v-switch>

    <!-- 총 주차대수 -->
    <v-text-field
      v-model="form.totalParkingSlots"
      label="총 주차대수"
      outlined
      type="number"
    ></v-text-field>

    <!-- 현관 유형 -->
    <v-text-field
      v-model="form.entranceType"
      label="현관 유형"
      outlined
    ></v-text-field>

    <!-- 입주 가능일 -->
    <v-text-field
      v-model="form.availableMoveInDate"
      label="입주 가능일"
      outlined
      type="date"
    ></v-text-field>

    <!-- 건축물 용도 -->
    <v-text-field
      v-model="form.buildingUse"
      label="건축물 용도"
      outlined
    ></v-text-field>

    <!-- 사용 승인일 -->
    <v-text-field
      v-model="form.approvalDate"
      label="사용 승인일"
      outlined
      type="date"
    ></v-text-field>

    <!-- 최초 등록일 -->
    <v-text-field
      v-model="form.firstRegistrationDate"
      label="최초 등록일"
      outlined
      type="date"
    ></v-text-field>

    <!-- 옵션 -->
    <v-textarea
      v-model="form.options"
      label="옵션"
      outlined
    ></v-textarea>

    <!-- 보안/안전 시설 -->
    <v-textarea
      v-model="form.securityFacilities"
      label="보안/안전 시설"
      outlined
    ></v-textarea>
    <!-- 등록 버튼 -->
    <v-btn color="primary" @click="registerProperty">매물 등록</v-btn>
  </v-container>
</template>

<script>
import axios from "axios";

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
      images: [], // 이미지 파일 배열
    };
  },
  methods: {
    // 이미지 선택
    onFileChange(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push({
            file: files[i],  // 실제 파일
            url: e.target.result  // 미리보기 이미지 URL
          });
        };
        reader.readAsDataURL(files[i]);
      }
    },
    // 이미지 삭제
    removeImage(index) {
      this.images.splice(index, 1); // 이미지 배열에서 해당 이미지 삭제
    },
    // 매물 등록
    async registerProperty() {
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

      // 이미지 추가
      for (let i = 0; i < this.images.length; i++) {
        formData.append("images", this.images[i].file);  // 실제 파일만 추가
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/properties/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          alert("매물 등록 성공!");
          this.$router.push("/properties");
        }
      } catch (error) {
        console.error("매물 등록 실패", error);

        // 에러 응답이 있는 경우 메시지를 alert로 표시
        if (error.response && error.response.data && error.response.data.message) {
            alert(`매물 등록 실패: ${error.response.data.message}`);
        } else {
            // 서버에서 에러 메시지를 보내지 않은 경우 기본 메시지 표시
            alert("매물 등록 중 오류가 발생했습니다.");
        }
      }
    },

    // 날짜 형식 변환
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // yyyy-MM-dd 형식으로 반환
    },
  },
};
</script>
