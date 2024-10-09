import axios from 'axios';

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

    // 액세스 토큰이 만료된 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 리프레시 토큰 요청
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');
        const response = await api.post('/api/auth/refreshToken', {
            userId,
            refreshToken,
        });

        // 새로운 액세스 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);

        // 원래 요청 다시 시도
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('토큰 갱신 실패', err);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
