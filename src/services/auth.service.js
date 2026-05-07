import { supabase } from "@/lib/supabase";

export const AuthService = {
    // Logic to register a new user with metadata roles
  async register(email, password, role) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: role,
            full_name: email.split('@')[0] // Optional: nice to have
         },
        
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * login to authenticate existing user
   * @param {*} email 
   * @param {*} password 
   * @returns 
   */
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log(data);

      if (error) throw error;

      // Extract the role from the metadata we set during registration
    //   const role = data.user?.user_metadata?.role;
      
    //   return {
    //     user: data.user,
    //     session: data.session,
    //     role: role
    //   };
    return data;

    } catch (error) {
      console.error("AuthService Login Error:", error.message);
      throw error;
    }
  },

  /**
   * Log out the current user and clear the session.
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current active session user.
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Helper to check if the user has a specific role.
   */
  isAuthorized(user, requiredRole) {
    return user?.user_metadata?.role === requiredRole;
  }
};