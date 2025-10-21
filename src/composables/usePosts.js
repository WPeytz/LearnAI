import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

// Shared state
const posts = ref([])
const loading = ref(false)
const userLikes = ref(new Set()) // Track which posts current user has liked
const postComments = ref({}) // Track comments per post { postId: [comments] }
const expandedPosts = ref(new Set()) // Track which posts have expanded comments

// Fetch posts from database
const fetchPosts = async () => {
  loading.value = true
  try {
    console.log('📥 Fetching posts from Supabase...')

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          id,
          username,
          avatar
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('✅ Posts fetched:', data?.length || 0)

    // Transform data to match expected format
    posts.value = data
      .filter(post => post.profiles) // Filter out posts with missing profiles
      .map(post => ({
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

    console.log('📊 Posts after profile filtering:', posts.value.length)

    // Fetch like counts for all posts
    await fetchLikeCounts()

    // Fetch current user's likes
    await fetchUserLikes()
  } catch (error) {
    console.error('❌ Error fetching posts:', error.message)
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

    // Also fetch comment counts
    await fetchCommentCounts()
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

// Fetch comment counts for all posts
const fetchCommentCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('post_id')

    if (error) throw error

    // Count comments per post
    const commentCounts = data.reduce((acc, comment) => {
      acc[comment.post_id] = (acc[comment.post_id] || 0) + 1
      return acc
    }, {})

    // Add comment counts to posts
    posts.value = posts.value.map(post => ({
      ...post,
      commentCount: commentCounts[post.id] || 0
    }))
  } catch (error) {
    console.error('Error fetching comment counts:', error.message)
  }
}

// Fetch comments for a specific post
const fetchCommentsForPost = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          id,
          username,
          avatar
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Transform data
    postComments.value[postId] = data
      .filter(comment => comment.profiles)
      .map(comment => ({
        id: comment.id,
        content: comment.content,
        timestamp: comment.created_at,
        author: {
          id: comment.profiles.id,
          username: comment.profiles.username,
          avatar: comment.profiles.avatar
        },
        userId: comment.user_id
      }))
  } catch (error) {
    console.error('Error fetching comments:', error.message)
  }
}

// Create a new comment
const createComment = async (postId, content, userId) => {
  if (!content || !content.trim()) {
    throw new Error('Comment cannot be empty')
  }

  if (content.length > 500) {
    throw new Error('Comment must be 500 characters or less')
  }

  try {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content.trim()
      })
      .select()
      .single()

    if (error) throw error

    // Refresh comments for this post
    await fetchCommentsForPost(postId)
    await fetchCommentCounts()

    return data
  } catch (error) {
    console.error('Error creating comment:', error.message)
    throw new Error(error.message || 'Failed to create comment')
  }
}

// Delete a comment
const deleteComment = async (commentId, userId, postId) => {
  try {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    if (error) throw error

    // Refresh comments for this post
    await fetchCommentsForPost(postId)
    await fetchCommentCounts()
  } catch (error) {
    console.error('Error deleting comment:', error.message)
    throw new Error('Failed to delete comment')
  }
}

// Toggle comments visibility for a post
const toggleComments = async (postId) => {
  if (expandedPosts.value.has(postId)) {
    expandedPosts.value.delete(postId)
  } else {
    expandedPosts.value.add(postId)
    // Fetch comments if not already loaded
    if (!postComments.value[postId]) {
      await fetchCommentsForPost(postId)
    }
  }
}

// Check if comments are expanded for a post
const areCommentsExpanded = (postId) => {
  return expandedPosts.value.has(postId)
}

// Get comments for a post
const getCommentsForPost = (postId) => {
  return postComments.value[postId] || []
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
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'post_comments'
    }, (payload) => {
      // Refetch comment counts when comments change
      fetchCommentCounts()
      // If comments are expanded for this post, refresh them
      if (payload.new?.post_id && expandedPosts.value.has(payload.new.post_id)) {
        fetchCommentsForPost(payload.new.post_id)
      }
      if (payload.old?.post_id && expandedPosts.value.has(payload.old.post_id)) {
        fetchCommentsForPost(payload.old.post_id)
      }
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
      console.log('📝 Creating post...', { userId, contentLength: content.length })

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: content.trim()
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Post creation error:', error)
        throw error
      }

      console.log('✅ Post created successfully:', data)

      // Manually refresh posts since real-time might be delayed
      await fetchPosts()

      return data
    } catch (error) {
      console.error('❌ Error creating post:', error.message)
      throw new Error(error.message || 'Failed to create post')
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
    createComment,
    deleteComment,
    toggleComments,
    areCommentsExpanded,
    getCommentsForPost,
    getTimeAgo,
    refreshPosts
  }
}
