// Mock authentication service
const authService = {
  login: async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate credentials exist
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password required');
    }

    // Return a fake user object
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    return user;
  },

  logout: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Clear any stored tokens or user data if needed
    localStorage.removeItem('authToken');

    return { success: true };
  },
};

export default authService;
