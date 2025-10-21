import { createClient } from '@supabase/supabase-js'
import { articles } from '../src/data/articles.js'
import { quizzes } from '../src/data/quizzes.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedArticles() {
  console.log('\n📝 Seeding articles...')

  try {
    // Transform articles data to match database schema
    const articlesData = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      image: article.image,
      date: article.date,
      read_time: article.readTime,
      featured: article.featured
    }))

    const { data, error } = await supabase
      .from('articles')
      .upsert(articlesData, { onConflict: 'id' })

    if (error) {
      throw error
    }

    console.log(`✅ Successfully seeded ${articlesData.length} articles!`)
  } catch (error) {
    console.error('❌ Error seeding articles:', error.message)
    throw error
  }
}

async function seedQuizzes() {
  console.log('\n🎯 Seeding quizzes and questions...')

  try {
    // First, insert quizzes (without questions)
    const quizzesData = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      category: quiz.category
    }))

    const { error: quizzesError } = await supabase
      .from('quizzes')
      .upsert(quizzesData, { onConflict: 'id' })

    if (quizzesError) {
      throw quizzesError
    }

    console.log(`✅ Successfully seeded ${quizzesData.length} quizzes!`)

    // Then, insert quiz questions
    const questionsData = []
    quizzes.forEach(quiz => {
      quiz.questions.forEach((question, index) => {
        questionsData.push({
          quiz_id: quiz.id,
          question: question.question,
          options: JSON.stringify(question.options),
          correct_answer: question.correctAnswer,
          explanation: question.explanation || null,
          order_index: index
        })
      })
    })

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .upsert(questionsData, { onConflict: 'id' })

    if (questionsError) {
      throw questionsError
    }

    console.log(`✅ Successfully seeded ${questionsData.length} quiz questions!`)
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting database seeding...')
  console.log(`📡 Connected to: ${supabaseUrl}\n`)

  try {
    await seedArticles()
    await seedQuizzes()

    console.log('\n✨ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${articles.length} articles`)
    console.log(`   - ${quizzes.length} quizzes`)
    console.log(`   - ${quizzes.reduce((sum, q) => sum + q.questions.length, 0)} quiz questions`)
    console.log('\n👉 You can now view your data in the Supabase dashboard!')
  } catch (error) {
    console.error('\n💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding
main()
