import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

// Shared state
const posts = ref([])
const loading = ref(false)
const userLikes = ref(new Set()) // Track which posts current user has liked

// Fetch posts from database
const fetchPosts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles!posts_user_id_fkey (
          id,
          username,
          avatar
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data to match expected format
    posts.value = data.map(post => ({
      id: post.id,
      content: post.content,
      timestamp: post.created_at,
      author: {
        id: post.profiles.id,
        username: post.profiles.username,
        avatar: post.profiles.avatar
      },
      userId: post.user_id // Keep for permission checks
    }))

    // Fetch like counts for all posts
    await fetchLikeCounts()

    // Fetch current user's likes
    await fetchUserLikes()
  } catch (error) {
    console.error('Error fetching posts:', error.message)
  } finally {
    loading.value = false
  }
}

// Fetch like counts for all posts
const fetchLikeCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')

    if (error) throw error

    // Count likes per post
    const likeCounts = data.reduce((acc, like) => {
      acc[like.post_id] = (acc[like.post_id] || 0) + 1
      return acc
    }, {})

    // Add like counts to posts
    posts.value = posts.value.map(post => ({
      ...post,
      likes: likeCounts[post.id] || 0
    }))
  } catch (error) {
    console.error('Error fetching like counts:', error.message)
  }
}

// Fetch current user's likes
const fetchUserLikes = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)

    if (error) throw error

    userLikes.value = new Set(data.map(like => like.post_id))
  } catch (error) {
    console.error('Error fetching user likes:', error.message)
  }
}

// Check if current user liked a post
const hasUserLiked = (postId) => {
  return userLikes.value.has(postId)
}

// Set up real-time subscription
const subscribeToChanges = () => {
  const channel = supabase
    .channel('posts_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'posts'
    }, () => {
      // Refetch posts when changes occur
      fetchPosts()
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'post_likes'
    }, () => {
      // Refetch like counts when likes change
      fetchLikeCounts()
      fetchUserLikes()
    })
    .subscribe()

  return channel
}

// Initialize
let channel = null
fetchPosts()
channel = subscribeToChanges()

export const usePosts = () => {
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  })

  const createPost = async (content, userId) => {
    if (!content || !content.trim()) {
      throw new Error('Post content cannot be empty')
    }

    if (content.length > 1000) {
      throw new Error('Post content must be 1000 characters or less')
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: content.trim()
        })
        .select()
        .single()

      if (error) throw error

      // Posts will be updated via real-time subscription
      return data
    } catch (error) {
      console.error('Error creating post:', error.message)
      throw new Error('Failed to create post')
    }
  }

  const deletePost = async (postId, userId) => {
    try {
      // Verify ownership
      const post = posts.value.find(p => p.id === postId)
      if (!post) {
        throw new Error('Post not found')
      }

      if (post.userId !== userId) {
        throw new Error('You can only delete your own posts')
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId) // Double-check ownership

      if (error) throw error

      // Remove from local state immediately for better UX
      posts.value = posts.value.filter(p => p.id !== postId)
    } catch (error) {
      console.error('Error deleting post:', error.message)
      throw new Error('Failed to delete post')
    }
  }

  const likePost = async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be logged in to like posts')

      // Check if already liked
      if (userLikes.value.has(postId)) {
        return // Already liked
      }

      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })

      if (error) throw error

      // Update local state immediately
      userLikes.value.add(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.likes = (post.likes || 0) + 1
      }
    } catch (error) {
      console.error('Error liking post:', error.message)
      throw new Error('Failed to like post')
    }
  }

  const unlikePost = async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be logged in to unlike posts')

      // Check if not liked
      if (!userLikes.value.has(postId)) {
        return // Not liked
      }

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state immediately
      userLikes.value.delete(postId)
      const post = posts.value.find(p => p.id === postId)
      if (post && post.likes > 0) {
        post.likes -= 1
      }
    } catch (error) {
      console.error('Error unliking post:', error.message)
      throw new Error('Failed to unlike post')
    }
  }

  const toggleLike = async (postId) => {
    if (hasUserLiked(postId)) {
      await unlikePost(postId)
    } else {
      await likePost(postId)
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const postDate = new Date(timestamp)
    const seconds = Math.floor((now - postDate) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

    return postDate.toLocaleDateString()
  }

  const refreshPosts = () => {
    fetchPosts()
  }

  return {
    posts: sortedPosts,
    loading,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    toggleLike,
    hasUserLiked,
    getTimeAgo,
    refreshPosts
  }
}
