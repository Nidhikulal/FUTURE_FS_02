import api from './client';

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const getLeads = (params = {}) =>
  api.get('/leads', { params }).then((res) => res.data);

export const createLeadByAdmin = (payload) =>
  api.post('/leads/admin', payload).then((res) => res.data);

export const getLeadById = (id) =>
  api.get(`/leads/${id}`).then((res) => res.data);

export const updateLeadStatus = (id, status) =>
  api.patch(`/leads/${id}/status`, { status }).then((res) => res.data);

export const addNote = (id, text) =>
  api.post(`/leads/${id}/notes`, { text }).then((res) => res.data);

export const deleteLead = (id) =>
  api.delete(`/leads/${id}`).then((res) => res.data);

export const getAnalytics = () =>
  api.get('/leads/analytics/summary').then((res) => res.data);
