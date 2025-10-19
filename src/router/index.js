import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ArticlesPage from '../views/ArticlesPage.vue';
import ArticleDetailPage from '../views/ArticleDetailPage.vue';
import AboutPage from '../views/AboutPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'LearnAI - Master Artificial Intelligence' }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: ArticlesPage,
    meta: { title: 'All Articles - LearnAI' }
  },
  {
    path: '/article/:slug',
    name: 'ArticleDetail',
    component: ArticleDetailPage,
    meta: { title: 'Article - LearnAI' }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { title: 'About - LearnAI' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'LearnAI';
  next();
});

export default router;
