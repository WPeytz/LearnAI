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
      // TEMPORARY FIX: Use fallback profile immediately
      console.log('✅ Session found, using fallback profile')
      currentUser.value = {
        id: session.user.id,
        email: session.user.email,
        username: session.user.user_metadata?.username || session.user.email.split('@')[0],
        avatar: session.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
        createdAt: session.user.created_at || new Date().toISOString()
      }
      // Comment out profile loading
      // await loadUserProfile(session.user)
    }
  } catch (error) {
    console.error('Error initializing auth:', error.message)
  } finally {
    loading.value = false
  }
}

// Load user profile from database with timeout
const loadUserProfile = async (user) => {
  try {
    console.log('🔍 Loading profile for user:', user.id)
    console.log('⏱️ Starting profile query...')
    console.log('🔌 Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('🔑 Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

    const queryStart = Date.now()

    // Test basic Supabase connection first
    console.log('🧪 Testing basic connection...')
    try {
      const { error: testError } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
      if (testError) {
        console.error('❌ Basic connection test failed:', testError)
      } else {
        console.log('✅ Basic connection works')
      }
    } catch (testErr) {
      console.error('❌ Basic connection error:', testErr)
    }

    // Add timeout to the query itself
    console.log('📡 Starting profile query for ID:', user.id)
    const profileQueryPromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile query timeout')), 10000) // 10 second timeout
    })

    let profile, error

    try {
      console.log('⏳ Waiting for profile query...')
      const result = await Promise.race([
        profileQueryPromise,
        timeoutPromise
      ])
      console.log('📥 Query result received:', result)
      profile = result.data
      error = result.error
    } catch (err) {
      if (err.message === 'Profile query timeout') {
        console.error('❌ Profile query timed out after 10 seconds')
        console.error('❌ Even with RLS disabled, query is hanging')
        console.error('❌ This suggests a network or Supabase connection issue')

        // Set a fallback user so they can still use the app
        currentUser.value = {
          id: user.id,
          email: user.email,
          username: user.email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          createdAt: new Date().toISOString()
        }
        console.log('✅ Using fallback user profile')
        return // Exit early with fallback user
      }
      throw err
    }

    const queryTime = Date.now() - queryStart
    console.log(`✅ Profile query completed in ${queryTime}ms`)

    if (error) {
      console.log('📋 Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
    }

    // If profile doesn't exist, create it
    if (error && error.code === 'PGRST116') {
      console.log('⚠️ Profile not found, creating new profile...')

      const username = user.user_metadata?.username || user.email.split('@')[0]
      const avatar = user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username,
          avatar
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Failed to create profile:', createError)
        throw createError
      }

      console.log('✅ Profile created successfully')

      currentUser.value = {
        id: user.id,
        email: user.email,
        username: newProfile.username,
        avatar: newProfile.avatar,
        createdAt: newProfile.created_at
      }
      return
    }

    if (error) throw error

    console.log('✅ Profile loaded successfully')

    currentUser.value = {
      id: user.id,
      email: user.email,
      username: profile.username,
      avatar: profile.avatar,
      createdAt: profile.created_at
    }
  } catch (error) {
    console.error('❌ Error loading profile:', error.message)
    // Re-throw so login/signup can handle it
    throw error
  }
}

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    // TEMPORARY FIX: Skip profile loading and use fallback immediately
    console.log('✅ User signed in, using fallback profile')
    currentUser.value = {
      id: session.user.id,
      email: session.user.email,
      username: session.user.user_metadata?.username || session.user.email.split('@')[0],
      avatar: session.user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
      createdAt: session.user.created_at || new Date().toISOString()
    }
    // Comment out the profile loading for now
    // await loadUserProfile(session.user)
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
      console.log('🔐 Attempting login for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Auth error:', error)
        throw error
      }

      console.log('✅ Authentication successful!')
      console.log('⏳ Profile will be loaded by auth state listener...')

      // Profile is loaded by onAuthStateChange listener - no need to call it here
      // This prevents double-loading and potential race conditions

      return { success: true, message: 'Login successful!' }
    } catch (error) {
      console.error('❌ Login error:', error)
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

      console.log('✅ Signup successful!')
      console.log('⏳ Profile will be loaded by auth state listener...')

      // Profile is automatically created by database trigger
      // Auth state listener will load the profile - no need to call it here

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
