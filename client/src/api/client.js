import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

export const Api = {
  getVenues: () => api.get('/venues').then((r) => r.data),
  matchVenues: (guests, functions) =>
    api
      .get('/venues/match', { params: { guests, functions: functions.join(',') } })
      .then((r) => r.data),
  getAvailability: (year, month) =>
    api.get('/availability', { params: { year, month } }).then((r) => r.data),
  getStories: () => api.get('/stories').then((r) => r.data),
  getEstimate: (payload) => api.post('/estimate', payload).then((r) => r.data),
  submitEnquiry: (payload) => api.post('/enquiries', payload).then((r) => r.data),
};
