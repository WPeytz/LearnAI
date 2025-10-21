import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

// Shared state
const currentUser = ref(null)
const loading = ref(true)

// Initialize auth state
const initAuth = async () => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      await loadUserProfile(session.user)
    }
  } catch (error) {
    console.error('Error initializing auth:', error.message)
  } finally {
    loading.value = false
  }
}

// Load user profile from database
const loadUserProfile = async (user) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    currentUser.value = {
      id: user.id,
      email: user.email,
      username: profile.username,
      avatar: profile.avatar,
      createdAt: profile.created_at
    }
  } catch (error) {
    console.error('Error loading profile:', error.message)
  }
}

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    await loadUserProfile(session.user)
  } else if (event === 'SIGNED_OUT') {
    currentUser.value = null
  }
})

// Initialize on module load
initAuth()

export const useAuth = () => {
  const isAuthenticated = computed(() => currentUser.value !== null)

  const login = async (email, password) => {
    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      await loadUserProfile(data.user)

      return { success: true, message: 'Login successful!' }
    } catch (error) {
      console.error('Login error:', error.message)
      throw new Error(error.message || 'Invalid email or password')
    }
  }

  const signup = async (username, email, password) => {
    // Validation
    if (!username || !email || !password) {
      throw new Error('All fields are required')
    }

    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Check if username is already taken
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existingProfile) {
      throw new Error('Username already exists')
    }

    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
          }
        }
      })

      if (error) throw error

      // Profile is automatically created by database trigger
      await loadUserProfile(data.user)

      return {
        success: true,
        message: 'Account created successfully!'
      }
    } catch (error) {
      console.error('Signup error:', error.message)
      throw new Error(error.message || 'Failed to create account')
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      currentUser.value = null
    } catch (error) {
      console.error('Logout error:', error.message)
      throw new Error('Failed to log out')
    }
  }

  return {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  }
}
