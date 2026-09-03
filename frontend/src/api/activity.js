import api from './client';

export const getActivity = (limit = 50) =>
  api.get('/activity', { params: { limit } }).then((res) => res.data);
