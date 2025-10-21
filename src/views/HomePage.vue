<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Master the Future of
            Artificial Intelligence
          </h1>
          <p class="hero-subtitle">
            Explore in-depth articles, tutorials, and insights about AI, machine learning,
            and the technologies shaping tomorrow.
          </p>
          <div class="hero-actions">
            <router-link to="/articles" class="btn btn-primary">
              Explore Articles
            </router-link>
            <router-link to="/about" class="btn btn-secondary">
              Learn More
            </router-link>
          </div>
        </div>

        <div class="hero-image">
          <div class="floating-card">
            <span class="card-icon">🧠</span>
            <span class="card-text">What is AI?</span>
          </div>
          <div class="floating-card" style="animation-delay: 0.2s;">
            <span class="card-icon">🤖</span>
            <span class="card-text">Is AI coming for your job?</span>
          </div>
          <div class="floating-card" style="animation-delay: 0.4s;">
            <span class="card-icon">💡</span>
            <span class="card-text">How to build with AI?</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Articles</h2>
          <p class="section-subtitle">Handpicked content to accelerate your AI journey</p>
        </div>

        <div class="articles-grid">
          <ArticleCard
            v-for="article in featuredArticles"
            :key="article.id"
            :article="article"
            :featured="true"
          />
        </div>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="latest-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Latest Articles</h2>
          <router-link to="/articles" class="view-all">
            View All →
          </router-link>
        </div>

        <div class="articles-grid-regular">
          <ArticleCard
            v-for="article in latestArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Explore by Topic</h2>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-card"
            :style="{ borderColor: category.color }"
          >
            <div class="category-icon" :style="{ background: category.color }">
              {{ getCategoryIcon(category.name) }}
            </div>
            <h3>{{ category.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="container">
        <NewsletterSignup />
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import NewsletterSignup from '../components/NewsletterSignup.vue';
import MainLayout from '../components/MainLayout.vue';
import ArticleCard from '../components/ArticleCard.vue';
import { articles, categories } from '../data/articles';

const featuredArticles = computed(() =>
  articles.filter(article => article.featured).slice(0, 1)
);

const latestArticles = computed(() =>
  articles.filter(article => !article.featured).slice(0, 3)
);

const getCategoryIcon = (categoryName) => {
  const icons = {
    'Fundamentals': '📚',
    'Deep Learning': '🧠',
    'NLP': '💬',
    'Computer Vision': '👁️',
    'Ethics': '⚖️',
    'Tutorials': '🎓',
    'News & Trends': '📰'
  };
  return icons[categoryName] || '📌';
};
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="none"/><circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
  opacity: 0.3;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 600px;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
}

.gradient-text {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

.hero-image {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.floating-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 600;
  animation: float 3s ease-in-out infinite;
}

.card-icon {
  font-size: 1.5rem;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.featured-section,
.latest-section,
.categories-section {
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.view-all {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.view-all:hover {
  transform: translateX(4px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.articles-grid {
  display: grid;
  gap: 2rem;
}

.articles-grid-regular {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem 1rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  color: white;
}

.category-card h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
}

@media (max-width: 968px) {
  .hero-image {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
  }

  .articles-grid-regular {
    grid-template-columns: 1fr;
  }
}

/* Newsletter Section */
.newsletter-section {
  padding: 4rem 0;
  background: var(--bg-primary);
}

@media (max-width: 768px) {
  .newsletter-section {
    padding: 2rem 0;
  }
}
</style>
