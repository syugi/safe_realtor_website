import axios from 'axios';
import router from '/src/router';

// API 기본 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 환경변수로 설정한 API URL
});

// Axios 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // 모든 요청에 액세스 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 서버 연결 실패 또는 네트워크 에러 처리
    if (error.message === 'Network Error' || !error.response) {
      alert('서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.');
      return Promise.reject(error);
    }

    // 401 에러 처리: 액세스 토큰 만료 시 리프레시 토큰을 사용해 재발급
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        console.log("리프레시 토큰 요청하러가자!");
      originalRequest._retry = true;
      try {
        // 리프레시 토큰 요청
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');

        // 리프레시 토큰이 없다면 로그인 페이지로 리다이렉트
        if (!refreshToken || !userId) {
          await router.push('/login');
          return Promise.reject(error);
        }

        const response = await api.post('/api/auth/refreshToken', {
          userId,
          refreshToken,
        });
        console.log("리프레시 토큰 결과 여기로오나 ! "+response.data);

        // 새로운 액세스 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);

        // 원래 요청 다시 시도
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('토큰 갱신 실패', err);
        alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
        await router.push('/login');
        return Promise.reject(err);
      }
    }

    // 기타 에러 처리: 에러 응답이 있는 경우
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;

      if(code != 'INVALID_REFRESH_TOKEN'){
        alert(`Error ${code}: ${message}`); // 에러 코드를 포함한 에러 메시지를 alert로 표시
      }
    } else {
      // 예기치 않은 에러 메시지
      alert('알 수 없는 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default api;
