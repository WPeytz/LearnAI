import { ref, computed } from 'vue';

// Shared state
const currentUser = ref(null);

// Initialize from localStorage
const initAuth = () => {
  const savedUser = localStorage.getItem('learnai_user');
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
  }
};

export const useAuth = () => {
  // Initialize on first use
  if (currentUser.value === null && localStorage.getItem('learnai_user')) {
    initAuth();
  }

  const isAuthenticated = computed(() => currentUser.value !== null);

  const login = (username, password) => {
    // Simple validation - in production, this would call an API
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('learnai_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // User exists, log them in
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      currentUser.value = userWithoutPassword;
      localStorage.setItem('learnai_user', JSON.stringify(userWithoutPassword));
      return { success: true, message: 'Login successful!' };
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const signup = (username, email, password) => {
    // Simple validation
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('learnai_users') || '[]');
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In production, this would be hashed
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=667eea&color=fff`
    };

    users.push(newUser);
    localStorage.setItem('learnai_users', JSON.stringify(users));

    // Log the user in
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    currentUser.value = userWithoutPassword;
    localStorage.setItem('learnai_user', JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem('learnai_user');
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout
  };
};
