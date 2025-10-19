<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">LearnAI</h3>
          <p class="footer-text">Your journey to understanding artificial intelligence starts here.</p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/articles">Articles</router-link></li>
            <li><router-link to="/about">About</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Categories</h4>
          <ul class="footer-links">
            <li><a href="#">Fundamentals</a></li>
            <li><a href="#">Deep Learning</a></li>
            <li><a href="#">Tutorials</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter">🐦</a>
            <a href="#" class="social-link" aria-label="GitHub">💻</a>
            <a href="#" class="social-link" aria-label="LinkedIn">💼</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} LearnAI. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
  padding: 3rem 0 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-text {
  color: var(--text-secondary);
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--accent-color);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.social-link:hover {
  transform: translateY(-2px);
  border-color: var(--accent-color);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
