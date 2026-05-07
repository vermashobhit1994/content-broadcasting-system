// src/services/approval.service.js
export const ApprovalService = {
  /**
   * Sends the uploaded content metadata to the server for 
   * storage and eventual visibility on the Principal dashboard.
   */
  async sendToPrincipal(contentData) {
    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to notify principal");
      }

      return await response.json();
    } catch (error) {
      console.error("ApprovalService Error:", error);
      throw error;
    }
  },

  /**
   * Fetches all submissions for the Principal to review
   */
  async getSubmissionsForReview() {
    // We call the database directly here or via an API
    const { data, error } = await supabase
      .from('broadcast_content')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};