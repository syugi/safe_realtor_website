import { ref } from 'vue';

export const userId = ref(localStorage.getItem('userId') || '');
export const role = ref(localStorage.getItem('role') || '');
export const roleDisplayName = ref(localStorage.getItem('roleDisplayName') || '');

export function loadUserInfo() {
  userId.value = localStorage.getItem('userId') || '';
  role.value = localStorage.getItem('role') || '';
  roleDisplayName.value = localStorage.getItem('roleDisplayName') || '';
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('roleDisplayName');
  loadUserInfo();
}
