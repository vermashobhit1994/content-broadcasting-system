// src/services/content.service.js
import axios from 'axios';

const mockApi = async (data, delay = 800) => 
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const ContentService = {
  uploadContent: async (formData) => {
    // In a real app: return axios.post('/api/content', formData);
    return mockApi({ success: true, message: "Content uploaded successfully" });
  },

  getTeacherContent: async (teacherId) => {
    return mockApi([
      { id: 1, title: 'Algebra L1', subject: 'Math', status: 'Approved', start: '2026-05-06T10:00', end: '2026-05-06T12:00' },
      { id: 2, title: 'Cell Biology', subject: 'Science', status: 'Pending', start: '2026-05-07T09:00', end: '2026-05-07T11:00' },
    ]);
  },

  getPrincipalStats: async () => {
    return mockApi({ total: 150, pending: 12, approved: 120, rejected: 18 });
  }
};