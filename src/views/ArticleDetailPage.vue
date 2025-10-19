<template>
  <MainLayout>
    <div v-if="article" class="article-detail">
      <!-- Article Header -->
      <div class="article-header">
        <div class="header-image">
          <img :src="article.image" :alt="article.title" />
        </div>
        <div class="header-content container">
          <div class="breadcrumb">
            <router-link to="/">Home</router-link>
            <span class="separator">/</span>
            <router-link to="/articles">Articles</router-link>
            <span class="separator">/</span>
            <span>{{ article.title }}</span>
          </div>

          <span class="category-badge" :style="{ background: getCategoryColor(article.category) }">
            {{ article.category }}
          </span>

          <h1 class="article-title">{{ article.title }}</h1>

          <div class="article-meta">
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              {{ formatDate(article.date) }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">⏱️</span>
              {{ article.readTime }} min read
            </span>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div class="article-body container">
        <div class="content-wrapper">
          <div class="article-content" v-html="article.content"></div>

          <!-- Share Section -->
          <div class="share-section">
            <h4>Share this article</h4>
            <div class="share-buttons">
              <button class="share-btn">🐦 Twitter</button>
              <button class="share-btn">💼 LinkedIn</button>
              <button class="share-btn">📋 Copy Link</button>
            </div>
          </div>
        </div>

        <!-- Related Articles -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3>Related Articles</h3>
            <div class="related-articles">
              <router-link
                v-for="relatedArticle in relatedArticles"
                :key="relatedArticle.id"
                :to="`/article/${relatedArticle.slug}`"
                class="related-article"
              >
                <img :src="relatedArticle.image" :alt="relatedArticle.title" />
                <div class="related-content">
                  <h4>{{ relatedArticle.title }}</h4>
                  <span class="related-meta">{{ relatedArticle.readTime }} min read</span>
                </div>
              </router-link>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Table of Contents</h3>
            <nav class="toc">
              <a href="#" class="toc-item">Introduction</a>
              <a href="#" class="toc-item">Main Concepts</a>
              <a href="#" class="toc-item">Practical Examples</a>
              <a href="#" class="toc-item">Conclusion</a>
            </nav>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="not-found container">
      <h1>Article Not Found</h1>
      <p>The article you're looking for doesn't exist.</p>
      <router-link to="/articles" class="btn">Browse All Articles</router-link>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '../components/MainLayout.vue';
import { articles, categories } from '../data/articles';

const route = useRoute();

const article = computed(() =>
  articles.find(a => a.slug === route.params.slug)
);

const relatedArticles = computed(() => {
  if (!article.value) return [];

  return articles
    .filter(a => a.category === article.value.category && a.id !== article.value.id)
    .slice(0, 3);
});

const getCategoryColor = (categoryName) => {
  const category = categories.find(c => c.name === categoryName);
  return category?.color || '#6B7280';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.article-detail {
  background: var(--bg-primary);
}

.article-header {
  position: relative;
  margin-bottom: 3rem;
}

.header-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  position: relative;
}

.header-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, var(--bg-primary), transparent);
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-content {
  position: relative;
  margin-top: -6rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.breadcrumb a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--accent-color);
}

.separator {
  color: var(--text-secondary);
}

.category-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: var(--accent-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
}

.article-meta {
  display: flex;
  gap: 2rem;
  color: var(--text-secondary);
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-icon {
  font-size: 1.125rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.article-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  margin-bottom: 4rem;
}

.content-wrapper {
  min-width: 0;
}

.article-content {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 1.125rem;
}

.article-content :deep(h2) {
  font-size: 2rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--text-primary);
}

.article-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--text-primary);
}

.article-content :deep(p) {
  margin: 1rem 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-content :deep(li) {
  margin: 0.5rem 0;
}

.article-content :deep(pre) {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.article-content :deep(code) {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.share-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.share-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.share-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.share-btn {
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.share-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.sidebar {
  position: sticky;
  top: 6rem;
  height: fit-content;
}

.sidebar-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.sidebar-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.related-articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-article {
  display: flex;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.related-article:hover {
  background: var(--bg-primary);
}

.related-article img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.related-content h4 {
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.related-meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.toc {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-item {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.toc-item:hover {
  background: var(--bg-primary);
  color: var(--accent-color);
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: var(--accent-color);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 968px) {
  .article-body {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .article-title {
    font-size: 2rem;
  }

  .header-image {
    height: 250px;
  }
}
</style>
