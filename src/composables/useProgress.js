import { ref } from 'vue'
import { supabase } from '../lib/supabase'

// Shared state
const articleProgress = ref([])
const quizAttempts = ref([])
const bookmarks = ref([])
const loading = ref(false)

// Fetch user's article progress
const fetchArticleProgress = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('article_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    articleProgress.value = data
    return data
  } catch (error) {
    console.error('Error fetching article progress:', error.message)
    return []
  }
}

// Fetch user's quiz attempts
const fetchQuizAttempts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error

    quizAttempts.value = data
    return data
  } catch (error) {
    console.error('Error fetching quiz attempts:', error.message)
    return []
  }
}

// Fetch user's bookmarks
const fetchBookmarks = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('article_id, created_at')
      .eq('user_id', userId)

    if (error) throw error

    bookmarks.value = data
    return data
  } catch (error) {
    console.error('Error fetching bookmarks:', error.message)
    return []
  }
}

export const useProgress = () => {
  // Mark article as completed
  const markArticleComplete = async (userId, articleId) => {
    try {
      const { data, error } = await supabase
        .from('article_progress')
        .upsert({
          user_id: userId,
          article_id: articleId,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,article_id'
        })
        .select()
        .single()

      if (error) throw error

      // Update local state
      const index = articleProgress.value.findIndex(
        p => p.article_id === articleId
      )
      if (index >= 0) {
        articleProgress.value[index] = data
      } else {
        articleProgress.value.push(data)
      }

      return data
    } catch (error) {
      console.error('Error marking article complete:', error.message)
      throw new Error('Failed to save progress')
    }
  }

  // Check if article is completed
  const isArticleCompleted = (articleId) => {
    return articleProgress.value.some(
      p => p.article_id === articleId && p.completed
    )
  }

  // Save quiz attempt
  const saveQuizAttempt = async (userId, quizId, score, totalQuestions, answers) => {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          score,
          total_questions: totalQuestions,
          answers: answers
        })
        .select()
        .single()

      if (error) throw error

      // Add to local state
      quizAttempts.value.unshift(data)

      return data
    } catch (error) {
      console.error('Error saving quiz attempt:', error.message)
      throw new Error('Failed to save quiz results')
    }
  }

  // Get quiz attempts for a specific quiz
  const getQuizAttempts = (quizId) => {
    return quizAttempts.value.filter(a => a.quiz_id === quizId)
  }

  // Get best score for a quiz
  const getBestQuizScore = (quizId) => {
    const attempts = getQuizAttempts(quizId)
    if (attempts.length === 0) return null

    return Math.max(...attempts.map(a => a.score))
  }

  // Get average quiz score
  const getAverageQuizScore = (quizId) => {
    const attempts = getQuizAttempts(quizId)
    if (attempts.length === 0) return null

    const sum = attempts.reduce((acc, a) => acc + a.score, 0)
    return Math.round(sum / attempts.length)
  }

  // Get total quiz attempts count
  const getTotalQuizAttempts = () => {
    return quizAttempts.value.length
  }

  // Get completed articles count
  const getCompletedArticlesCount = () => {
    return articleProgress.value.filter(p => p.completed).length
  }

  // Add bookmark
  const addBookmark = async (userId, articleId) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          article_id: articleId
        })
        .select()
        .single()

      if (error) {
        // Check if already bookmarked
        if (error.code === '23505') {
          throw new Error('Already bookmarked')
        }
        throw error
      }

      // Add to local state
      bookmarks.value.push(data)

      return data
    } catch (error) {
      console.error('Error adding bookmark:', error.message)
      throw error
    }
  }

  // Remove bookmark
  const removeBookmark = async (userId, articleId) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', articleId)

      if (error) throw error

      // Remove from local state
      bookmarks.value = bookmarks.value.filter(
        b => b.article_id !== articleId
      )
    } catch (error) {
      console.error('Error removing bookmark:', error.message)
      throw new Error('Failed to remove bookmark')
    }
  }

  // Check if article is bookmarked
  const isBookmarked = (articleId) => {
    return bookmarks.value.some(b => b.article_id === articleId)
  }

  // Toggle bookmark
  const toggleBookmark = async (userId, articleId) => {
    if (isBookmarked(articleId)) {
      await removeBookmark(userId, articleId)
      return false
    } else {
      await addBookmark(userId, articleId)
      return true
    }
  }

  // Get learning statistics
  const getLearningStats = () => {
    const completedArticles = getCompletedArticlesCount()
    const totalAttempts = getTotalQuizAttempts()

    // Calculate average score across all quizzes
    let totalScore = 0
    let totalPossible = 0
    quizAttempts.value.forEach(attempt => {
      totalScore += attempt.score
      totalPossible += attempt.total_questions
    })
    const overallAverage = totalPossible > 0
      ? Math.round((totalScore / totalPossible) * 100)
      : 0

    return {
      completedArticles,
      totalQuizAttempts: totalAttempts,
      bookmarkedArticles: bookmarks.value.length,
      averageQuizScore: overallAverage
    }
  }

  // Load all progress for a user
  const loadUserProgress = async (userId) => {
    loading.value = true
    try {
      await Promise.all([
        fetchArticleProgress(userId),
        fetchQuizAttempts(userId),
        fetchBookmarks(userId)
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    articleProgress,
    quizAttempts,
    bookmarks,
    loading,

    // Article progress
    markArticleComplete,
    isArticleCompleted,
    getCompletedArticlesCount,

    // Quiz attempts
    saveQuizAttempt,
    getQuizAttempts,
    getBestQuizScore,
    getAverageQuizScore,
    getTotalQuizAttempts,

    // Bookmarks
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,

    // Stats
    getLearningStats,

    // Load data
    loadUserProgress
  }
}
