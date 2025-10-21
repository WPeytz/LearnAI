import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const articles = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch all articles
const fetchArticles = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false })

    if (fetchError) throw fetchError

    // Transform to match expected format
    articles.value = data.map(article => ({
      ...article,
      readTime: article.read_time
    }))
  } catch (err) {
    console.error('Error fetching articles:', err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Fetch single article by slug
const fetchArticleBySlug = async (slug) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError) throw fetchError

    return {
      ...data,
      readTime: data.read_time
    }
  } catch (err) {
    console.error('Error fetching article:', err.message)
    throw err
  }
}

// Initialize
if (articles.value.length === 0) {
  fetchArticles()
}

export const useArticles = () => {
  return {
    articles,
    loading,
    error,
    fetchArticles,
    fetchArticleBySlug
  }
}
