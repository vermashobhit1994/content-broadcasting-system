// src/services/content.service.js

// Simulated API delay to handle loading states in the UI
const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const ContentService = {
  /**
   * Fetches content associated with a teacher
   */
  getTeacherContent: async (teacherId) => {
    await mockDelay(800); // Simulate network latency
    
    // Mock data matching the "Teacher Flow" requirements[cite: 1]
    return [
      { 
        id: 1, 
        title: 'Introduction to Algebra', 
        subject: 'Mathematics', 
        status: 'Approved', 
        startTime: '2026-05-06T10:00', 
        endTime: '2026-05-06T12:00',
        rejectionReason: null 
      },
      { 
        id: 2, 
        title: 'Photosynthesis Lab', 
        subject: 'Science', 
        status: 'Pending', 
        startTime: '2026-05-07T09:00', 
        endTime: '2026-05-07T11:00',
        rejectionReason: null 
      },
      { 
        id: 3, 
        title: 'World War II Overview', 
        subject: 'History', 
        status: 'Rejected', 
        startTime: '2026-05-05T08:00', 
        endTime: '2026-05-05T10:00',
        rejectionReason: 'File quality is too low.' 
      },
    ];
  },

  /**
   * Submits new content for approval[cite: 1]
   */
  uploadContent: async (formData) => {
    await mockDelay(1200);
    console.log("Service received upload:", formData);
    return { success: true };
  }
};