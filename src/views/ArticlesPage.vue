<template>
  <MainLayout>
    <div class="articles-page">
      <div class="page-header">
        <div class="container">
          <h1>All Articles</h1>
          <p>Explore our complete collection of AI insights and tutorials</p>
        </div>
      </div>

      <div class="container">
        <!-- Search and Filter -->
        <div class="controls">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search articles..."
              class="search-input"
            />
          </div>

          <div class="filter-buttons">
            <button
              @click="selectedCategory = null"
              :class="['filter-btn', { active: selectedCategory === null }]"
            >
              All
            </button>
            <button
              v-for="category in categories"
              :key="category.name"
              @click="selectedCategory = category.name"
              :class="['filter-btn', { active: selectedCategory === category.name }]"
              :style="selectedCategory === category.name ? { borderColor: category.color, color: category.color } : {}"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="results-info">
          <p>{{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'article' : 'articles' }} found</p>
        </div>

        <!-- Articles Grid -->
        <div v-if="filteredArticles.length > 0" class="articles-grid">
          <ArticleCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
          />
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <span class="no-results-icon">📭</span>
          <h3>No articles found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import MainLayout from '../components/MainLayout.vue';
import ArticleCard from '../components/ArticleCard.vue';
import { articles, categories } from '../data/articles';

const searchQuery = ref('');
const selectedCategory = ref(null);

const filteredArticles = computed(() => {
  let filtered = articles;

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(article => article.category === selectedCategory.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  }

  return filtered;
});
</script>

<style scoped>
.articles-page {
  min-height: calc(100vh - 200px);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0 3rem;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.95;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.controls {
  margin: 3rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--accent-color);
}

.search-icon {
  font-size: 1.25rem;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 1rem;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.625rem 1.25rem;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.filter-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.filter-btn.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.results-info {
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.no-results-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.no-results h3 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.no-results p {
  margin: 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
  }

  .filter-btn {
    white-space: nowrap;
  }
}
</style>
