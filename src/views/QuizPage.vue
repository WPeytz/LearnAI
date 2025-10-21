<template>
  <MainLayout>
    <div class="quiz-page">
      <div class="container">
      <!-- Quiz Selection View -->
      <div v-if="!selectedQuiz" class="quiz-selection">
        <div class="page-header">
          <h1 class="page-title">AI Knowledge Quizzes</h1>
          <p class="page-subtitle">Test your understanding of artificial intelligence concepts</p>
        </div>

        <div class="quiz-grid">
          <div
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="quiz-card"
            @click="selectQuiz(quiz)"
          >
            <div class="quiz-card-header">
              <div class="quiz-category" :style="{ background: getCategoryColor(quiz.category) }">
                {{ quiz.category }}
              </div>
              <div class="quiz-difficulty" :class="getDifficultyClass(quiz.difficulty)">
                {{ quiz.difficulty }}
              </div>
            </div>
            <h2 class="quiz-title">{{ quiz.title }}</h2>
            <p class="quiz-description">{{ quiz.description }}</p>
            <div class="quiz-meta">
              <span class="quiz-questions">📝 {{ quiz.questions.length }} questions</span>
            </div>
            <button class="start-quiz-btn">Start Quiz</button>
          </div>
        </div>
      </div>

      <!-- Quiz Taking View -->
      <div v-else-if="!showResults" class="quiz-taking">
        <div class="quiz-header">
          <button class="back-btn" @click="exitQuiz">← Back to Quizzes</button>
          <div class="quiz-info">
            <h1>{{ selectedQuiz.title }}</h1>
            <div class="progress-info">
              Question {{ currentQuestionIndex + 1 }} of {{ selectedQuiz.questions.length }}
            </div>
          </div>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }"
          ></div>
        </div>

        <div class="question-card">
          <h2 class="question-text">{{ currentQuestion.question }}</h2>

          <div class="options-list">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-item"
              :class="{
                'selected': selectedAnswer === index,
                'correct': showFeedback && index === currentQuestion.correctAnswer,
                'incorrect': showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer
              }"
              @click="!showFeedback && selectAnswer(index)"
            >
              <div class="option-letter">{{ String.fromCharCode(65 + index) }}</div>
              <div class="option-text">{{ option }}</div>
              <div v-if="showFeedback && index === currentQuestion.correctAnswer" class="check-icon">✓</div>
              <div v-else-if="showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer" class="x-icon">✗</div>
            </div>
          </div>

          <div v-if="showFeedback" class="feedback">
            <div class="feedback-header" :class="{ correct: isCorrect, incorrect: !isCorrect }">
              {{ isCorrect ? '🎉 Correct!' : '❌ Incorrect' }}
            </div>
            <p class="explanation">{{ currentQuestion.explanation }}</p>
          </div>

          <div class="question-actions">
            <button
              v-if="!showFeedback"
              class="submit-btn"
              :disabled="selectedAnswer === null"
              @click="submitAnswer"
            >
              Submit Answer
            </button>
            <button
              v-else
              class="next-btn"
              @click="nextQuestion"
            >
              {{ currentQuestionIndex < selectedQuiz.questions.length - 1 ? 'Next Question' : 'View Results' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results View -->
      <div v-else class="quiz-results">
        <div class="results-header">
          <h1>Quiz Complete! 🎊</h1>
          <div class="score-circle">
            <div class="score-percentage">{{ scorePercentage }}%</div>
            <div class="score-text">{{ score }} / {{ selectedQuiz.questions.length }}</div>
          </div>
          <p class="score-message">{{ getScoreMessage() }}</p>
        </div>

        <div class="results-breakdown">
          <h2>Review Your Answers</h2>
          <div
            v-for="(question, index) in selectedQuiz.questions"
            :key="index"
            class="result-item"
          >
            <div class="result-header">
              <span class="question-number">Question {{ index + 1 }}</span>
              <span
                class="result-badge"
                :class="{ correct: userAnswers[index] === question.correctAnswer, incorrect: userAnswers[index] !== question.correctAnswer }"
              >
                {{ userAnswers[index] === question.correctAnswer ? '✓ Correct' : '✗ Incorrect' }}
              </span>
            </div>
            <p class="result-question">{{ question.question }}</p>
            <div class="result-answers">
              <div class="answer-row">
                <strong>Your answer:</strong>
                <span :class="{ incorrect: userAnswers[index] !== question.correctAnswer }">
                  {{ question.options[userAnswers[index]] }}
                </span>
              </div>
              <div v-if="userAnswers[index] !== question.correctAnswer" class="answer-row">
                <strong>Correct answer:</strong>
                <span class="correct">{{ question.options[question.correctAnswer] }}</span>
              </div>
            </div>
            <p class="result-explanation">{{ question.explanation }}</p>
          </div>
        </div>

        <div class="results-actions">
          <button class="retry-btn" @click="retakeQuiz">Retake Quiz</button>
          <button class="browse-btn" @click="browseQuizzes">Browse Other Quizzes</button>
        </div>
      </div>
    </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import MainLayout from '../components/MainLayout.vue';
import { quizzes, categories } from '../data/quizzes';

// State
const selectedQuiz = ref(null);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const showFeedback = ref(false);
const userAnswers = ref([]);
const showResults = ref(false);

// Computed
const currentQuestion = computed(() => {
  if (!selectedQuiz.value) return null;
  return selectedQuiz.value.questions[currentQuestionIndex.value];
});

const isCorrect = computed(() => {
  if (selectedAnswer.value === null) return false;
  return selectedAnswer.value === currentQuestion.value.correctAnswer;
});

const score = computed(() => {
  return userAnswers.value.filter((answer, index) =>
    answer === selectedQuiz.value.questions[index].correctAnswer
  ).length;
});

const scorePercentage = computed(() => {
  return Math.round((score.value / selectedQuiz.value.questions.length) * 100);
});

// Methods
const getCategoryColor = (category) => {
  const cat = categories.find(c => c.name === category);
  return cat ? cat.color : '#3B82F6';
};

const getDifficultyClass = (difficulty) => {
  return `difficulty-${difficulty.toLowerCase()}`;
};

const selectQuiz = (quiz) => {
  selectedQuiz.value = quiz;
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  showFeedback.value = false;
  userAnswers.value = [];
  showResults.value = false;
};

const selectAnswer = (index) => {
  selectedAnswer.value = index;
};

const submitAnswer = () => {
  if (selectedAnswer.value === null) return;
  showFeedback.value = true;
  userAnswers.value.push(selectedAnswer.value);
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < selectedQuiz.value.questions.length - 1) {
    currentQuestionIndex.value++;
    selectedAnswer.value = null;
    showFeedback.value = false;
  } else {
    showResults.value = true;
  }
};

const exitQuiz = () => {
  if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
    selectedQuiz.value = null;
    currentQuestionIndex.value = 0;
    selectedAnswer.value = null;
    showFeedback.value = false;
    userAnswers.value = [];
    showResults.value = false;
  }
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  showFeedback.value = false;
  userAnswers.value = [];
  showResults.value = false;
};

const browseQuizzes = () => {
  selectedQuiz.value = null;
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  showFeedback.value = false;
  userAnswers.value = [];
  showResults.value = false;
};

const getScoreMessage = () => {
  const percentage = scorePercentage.value;
  if (percentage === 100) return "Perfect score! You're an AI expert! 🌟";
  if (percentage >= 80) return "Excellent work! You have a strong understanding of AI! 🎯";
  if (percentage >= 60) return "Good job! You're on the right track! 👍";
  if (percentage >= 40) return "Not bad! Keep learning to improve! 📚";
  return "Keep studying! AI is a journey! 💪";
};
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Quiz Selection */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.quiz-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.quiz-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.quiz-category {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.quiz-difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.difficulty-beginner {
  background: #10B981;
  color: white;
}

.difficulty-intermediate {
  background: #F59E0B;
  color: white;
}

.difficulty-advanced {
  background: #EF4444;
  color: white;
}

.quiz-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.quiz-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.quiz-meta {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.start-quiz-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.start-quiz-btn:hover {
  background: var(--accent-hover);
  transform: scale(1.02);
}

/* Quiz Taking */
.quiz-taking {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-header {
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.quiz-info h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.progress-info {
  color: var(--text-secondary);
  font-size: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), #764ba2);
  transition: width 0.3s ease;
}

.question-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
}

.question-text {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover:not(.correct):not(.incorrect) {
  border-color: var(--accent-color);
  transform: translateX(4px);
}

.option-item.selected {
  border-color: var(--accent-color);
  background: rgba(102, 126, 234, 0.1);
}

.option-item.correct {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.1);
}

.option-item.incorrect {
  border-color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
}

.option-letter {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-color);
  color: white;
  border-radius: 0.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.option-item.correct .option-letter {
  background: #10B981;
}

.option-item.incorrect .option-letter {
  background: #EF4444;
}

.option-text {
  flex: 1;
  color: var(--text-primary);
  font-size: 1rem;
}

.check-icon, .x-icon {
  font-size: 1.5rem;
  font-weight: 700;
}

.check-icon {
  color: #10B981;
}

.x-icon {
  color: #EF4444;
}

.feedback {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
}

.feedback-header {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.feedback-header.correct {
  color: #10B981;
}

.feedback-header.incorrect {
  color: #EF4444;
}

.explanation {
  color: var(--text-secondary);
  line-height: 1.6;
}

.question-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn, .next-btn {
  padding: 0.75rem 2rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover, .next-btn:hover {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Results */
.quiz-results {
  max-width: 900px;
  margin: 0 auto;
}

.results-header {
  text-align: center;
  margin-bottom: 3rem;
}

.results-header h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.score-circle {
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), #764ba2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.score-percentage {
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.score-text {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
}

.score-message {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.results-breakdown {
  margin-bottom: 3rem;
}

.results-breakdown h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.result-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-number {
  font-weight: 600;
  color: var(--text-secondary);
}

.result-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.result-badge.correct {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.result-badge.incorrect {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.result-question {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.result-answers {
  margin-bottom: 1rem;
}

.answer-row {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.answer-row strong {
  color: var(--text-primary);
  margin-right: 0.5rem;
}

.answer-row .correct {
  color: #10B981;
  font-weight: 600;
}

.answer-row .incorrect {
  color: #EF4444;
  font-weight: 600;
}

.result-explanation {
  color: var(--text-secondary);
  line-height: 1.6;
  font-style: italic;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  border-left: 3px solid var(--accent-color);
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.retry-btn, .browse-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn {
  background: var(--accent-color);
  color: white;
}

.retry-btn:hover {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.browse-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.browse-btn:hover {
  background: var(--bg-primary);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .quiz-grid {
    grid-template-columns: 1fr;
  }

  .question-text {
    font-size: 1.25rem;
  }

  .score-circle {
    width: 150px;
    height: 150px;
  }

  .score-percentage {
    font-size: 2.5rem;
  }

  .results-actions {
    flex-direction: column;
  }

  .retry-btn, .browse-btn {
    width: 100%;
  }
}
</style>
