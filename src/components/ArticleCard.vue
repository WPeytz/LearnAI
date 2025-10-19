<template>
  <router-link :to="`/article/${article.slug}`" class="article-card" :class="{ 'featured': featured }">
    <div class="article-image">
      <img :src="article.image" :alt="article.title" loading="lazy" />
      <span class="category-badge" :style="{ background: getCategoryColor(article.category) }">
        {{ article.category }}
      </span>
    </div>

    <div class="article-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-excerpt">{{ article.excerpt }}</p>

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
  </router-link>
</template>

<script setup>
import { categories } from '../data/articles';

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
});

const getCategoryColor = (categoryName) => {
  const category = categories.find(c => c.name === categoryName);
  return category?.color || '#6B7280';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.article-card.featured {
  grid-column: 1 / -1;
}

.article-card.featured .article-image {
  height: 400px;
}

.article-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  background: var(--accent-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.featured .article-title {
  font-size: 2rem;
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .featured .article-title {
    font-size: 1.5rem;
  }

  .article-card.featured .article-image {
    height: 250px;
  }
}
</style>
