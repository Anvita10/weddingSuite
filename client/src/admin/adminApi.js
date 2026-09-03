import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';
const STORAGE_KEY = 'wedding_suite_admin_code';

export function getStoredCode() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function storeCode(code) {
  localStorage.setItem(STORAGE_KEY, code);
}

export function clearStoredCode() {
  localStorage.removeItem(STORAGE_KEY);
}

const adminApi = axios.create({ baseURL, timeout: 10000 });

adminApi.interceptors.request.use((config) => {
  const code = getStoredCode();
  if (code) config.headers.Authorization = `Bearer ${code}`;
  return config;
});

export const AdminApi = {
  // Returns true/false rather than throwing, so the login screen can show a
  // plain "that code isn't right" message instead of a raw error.
  verifyCode: async (code) => {
    try {
      const res = await axios.get(`${baseURL}/admin/verify`, {
        headers: { Authorization: `Bearer ${code}` },
        timeout: 8000,
      });
      return { ok: true, newEnquiries: res.data.newEnquiries };
    } catch {
      return { ok: false };
    }
  },

  getEnquiries: (status) =>
    adminApi.get('/enquiries', { params: status ? { status } : {} }).then((r) => r.data),
  updateEnquiryStatus: (id, status) =>
    adminApi.patch(`/enquiries/${id}/status`, { status }).then((r) => r.data),

  getAvailability: (year, month) =>
    adminApi.get('/availability', { params: { year, month } }).then((r) => r.data),
  setDate: (date, status) => adminApi.put(`/availability/${date}`, { status }).then((r) => r.data),
  setRange: (startDate, endDate, status) =>
    adminApi.put('/availability/bulk/range', { startDate, endDate, status }).then((r) => r.data),

  getRates: () => adminApi.get('/rates').then((r) => r.data),
  updateRate: (key, value) => adminApi.put(`/rates/${key}`, { value }).then((r) => r.data),
};
