import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const quizzes = ref([])
const loading = ref(false)
const error = ref(null)

// Fetch all quizzes with questions
const fetchQuizzes = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions (
          id,
          question,
          options,
          correct_answer,
          explanation,
          order_index
        )
      `)
      .order('id', { ascending: true })

    if (fetchError) throw fetchError

    // Transform data to match expected format
    quizzes.value = data.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      category: quiz.category,
      questions: quiz.quiz_questions
        .sort((a, b) => a.order_index - b.order_index)
        .map(q => ({
          id: q.id,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation
        }))
    }))
  } catch (err) {
    console.error('Error fetching quizzes:', err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Fetch single quiz by ID
const fetchQuizById = async (id) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions (
          id,
          question,
          options,
          correct_answer,
          explanation,
          order_index
        )
      `)
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      category: data.category,
      questions: data.quiz_questions
        .sort((a, b) => a.order_index - b.order_index)
        .map(q => ({
          id: q.id,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation
        }))
    }
  } catch (err) {
    console.error('Error fetching quiz:', err.message)
    throw err
  }
}

// Initialize
if (quizzes.value.length === 0) {
  fetchQuizzes()
}

export const useQuizzes = () => {
  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    fetchQuizById
  }
}
