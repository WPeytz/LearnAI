<template>
  <MainLayout>
    <div class="about-page">
      <div class="page-header">
        <div class="container">
          <h1>About Learn<span class="highlight">AI</span></h1>
          <p>Empowering minds through AI education</p>
        </div>
      </div>

      <div class="container">
        <div class="content-section">
          <div class="text-content">
            <h2>Our Mission</h2>
            <p>
              LearnAI is dedicated to making artificial intelligence accessible and understandable
              for everyone. We believe that AI literacy is essential in today's rapidly evolving
              technological landscape.
            </p>

            <h2>What We Offer</h2>
            <div class="features-grid">
              <div class="feature-card">
                <span class="feature-icon">📚</span>
                <h3>In-Depth Articles</h3>
                <p>Comprehensive guides covering fundamental to advanced AI concepts</p>
              </div>
              <div class="feature-card">
                <span class="feature-icon">💻</span>
                <h3>Practical Tutorials</h3>
                <p>Step-by-step coding tutorials with real-world applications</p>
              </div>
              <div class="feature-card">
                <span class="feature-icon">🔬</span>
                <h3>Latest Research</h3>
                <p>Stay updated with cutting-edge developments in AI</p>
              </div>
              <div class="feature-card">
                <span class="feature-icon">🤝</span>
                <h3>Community Focus</h3>
                <p>Building a community of AI enthusiasts and practitioners</p>
              </div>
            </div>

            <h2>Our Approach</h2>
            <p>
              We believe in making complex AI concepts approachable through clear explanations,
              practical examples, and visual demonstrations. Whether you're a beginner taking your
              first steps in machine learning or an experienced practitioner looking to deepen your
              knowledge, LearnAI has something for you.
            </p>

            <div class="cta-section">
              <h3>Start Your AI Journey Today</h3>
              <p>Explore our articles and join thousands of learners worldwide</p>
              <router-link to="/articles" class="btn">Browse Articles</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/MainLayout.vue';
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 200px);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.highlight {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

.content-section {
  padding: 4rem 0;
}

.text-content {
  max-width: 800px;
  margin: 0 auto;
}

.text-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 3rem 0 1rem;
}

.text-content h2:first-child {
  margin-top: 0;
}

.text-content p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 1rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.feature-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  margin: 3rem 0;
  color: white;
}

.cta-section h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.cta-section p {
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  color: white;
  opacity: 0.95;
}

.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .text-content h2 {
    font-size: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-section {
    padding: 2rem;
  }

  .cta-section h3 {
    font-size: 1.5rem;
  }
}
</style>
