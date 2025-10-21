<template>
  <MainLayout>
    <div class="community-page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">LearnAI Community</h1>
          <p class="page-subtitle">Share your thoughts, ask questions, and connect with fellow AI enthusiasts</p>
        </div>

        <!-- Not Logged In State -->
        <div v-if="!isAuthenticated" class="auth-prompt">
          <div class="auth-prompt-content">
            <div class="auth-prompt-icon">🔒</div>
            <h2>Join the Conversation</h2>
            <p>Sign in or create an account to post, like, and engage with the community.</p>
            <button @click="showLoginModal = true" class="auth-prompt-btn">
              Sign In / Sign Up
            </button>
          </div>
        </div>

        <!-- Logged In State -->
        <div v-else class="community-content">
          <!-- User Info Bar -->
          <div class="user-info-bar">
            <div class="user-info">
              <img :src="currentUser.avatar" :alt="currentUser.username" class="user-avatar" />
              <div>
                <div class="user-name">{{ currentUser.username }}</div>
                <div class="user-meta">Member since {{ formatDate(currentUser.createdAt) }}</div>
              </div>
            </div>
            <button @click="handleLogout" class="logout-btn">Sign Out</button>
          </div>

          <!-- Create Post Section -->
          <div class="create-post-section">
            <div class="create-post-header">
              <img :src="currentUser.avatar" :alt="currentUser.username" class="post-avatar" />
              <h3>What's on your mind?</h3>
            </div>
            <form @submit.prevent="handleCreatePost">
              <textarea
                v-model="newPostContent"
                placeholder="Share your thoughts, questions, or discoveries about AI..."
                rows="4"
                maxlength="1000"
              ></textarea>
              <div class="create-post-footer">
                <span class="char-count" :class="{ warning: newPostContent.length > 900 }">
                  {{ newPostContent.length }} / 1000
                </span>
                <button type="submit" :disabled="!newPostContent.trim()" class="post-btn">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Posts Feed -->
        <div class="posts-feed">
          <div class="feed-header">
            <h2>Recent Posts</h2>
            <span class="post-count">{{ posts.length }} posts</span>
          </div>

          <div v-if="posts.length === 0" class="no-posts">
            <div class="no-posts-icon">💬</div>
            <p>No posts yet. Be the first to share something!</p>
          </div>

          <div v-else class="posts-list">
            <div
              v-for="post in posts"
              :key="post.id"
              class="post-card"
            >
              <div class="post-header">
                <img :src="post.author.avatar" :alt="post.author.username" class="post-avatar" />
                <div class="post-author-info">
                  <div class="post-author-name">{{ post.author.username }}</div>
                  <div class="post-timestamp">{{ getTimeAgo(post.timestamp) }}</div>
                </div>
                <button
                  v-if="isAuthenticated && currentUser.id === post.author.id"
                  @click="handleDeletePost(post.id)"
                  class="delete-post-btn"
                  title="Delete post"
                >
                  🗑️
                </button>
              </div>

              <div class="post-content">
                {{ post.content }}
              </div>

              <div class="post-actions">
                <button
                  @click="handleLike(post.id)"
                  class="action-btn"
                  :class="{ liked: hasLiked(post.id) }"
                  :disabled="!isAuthenticated"
                >
                  <span class="action-icon">{{ hasLiked(post.id) ? '❤️' : '🤍' }}</span>
                  <span class="action-text">{{ post.likes }}</span>
                </button>

                <button class="action-btn" disabled>
                  <span class="action-icon">💬</span>
                  <span class="action-text">{{ post.comments.length }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal
      :is-open="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '../components/MainLayout.vue';
import LoginModal from '../components/LoginModal.vue';
import { useAuth } from '../composables/useAuth';
import { usePosts } from '../composables/usePosts';

const { currentUser, isAuthenticated, logout } = useAuth();
const { posts, createPost, deletePost, likePost, getTimeAgo } = usePosts();

const showLoginModal = ref(false);
const newPostContent = ref('');
const likedPosts = ref(new Set());

const handleLoginSuccess = () => {
  showLoginModal.value = false;
};

const handleLogout = () => {
  if (confirm('Are you sure you want to sign out?')) {
    logout();
  }
};

const handleCreatePost = () => {
  if (!newPostContent.value.trim()) return;

  try {
    createPost(newPostContent.value, currentUser.value);
    newPostContent.value = '';
  } catch (error) {
    alert(error.message);
  }
};

const handleDeletePost = (postId) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      deletePost(postId, currentUser.value.id);
    } catch (error) {
      alert(error.message);
    }
  }
};

const handleLike = (postId) => {
  if (!isAuthenticated.value) {
    showLoginModal.value = true;
    return;
  }

  if (likedPosts.value.has(postId)) {
    likedPosts.value.delete(postId);
    // Note: In a real app, you'd track this per user in the backend
  } else {
    likedPosts.value.add(postId);
    likePost(postId);
  }
};

const hasLiked = (postId) => {
  return likedPosts.value.has(postId);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
};
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--bg-primary);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

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

/* Auth Prompt */
.auth-prompt {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
}

.auth-prompt-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.auth-prompt-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-prompt-content h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.auth-prompt-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.auth-prompt-btn {
  padding: 0.875rem 2rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-prompt-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* User Info Bar */
.user-info-bar {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.user-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.logout-btn {
  padding: 0.5rem 1.25rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

/* Create Post Section */
.create-post-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.create-post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.create-post-header h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.post-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.create-post-section textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.create-post-section textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.create-post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.char-count.warning {
  color: #F59E0B;
  font-weight: 600;
}

.post-btn {
  padding: 0.625rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.post-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.post-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Posts Feed */
.posts-feed {
  margin-top: 2rem;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.feed-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.post-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
}

.no-posts {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
}

.no-posts-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-posts p {
  color: var(--text-secondary);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.post-card:hover {
  border-color: var(--accent-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.post-author-info {
  flex: 1;
}

.post-author-name {
  font-weight: 600;
  color: var(--text-primary);
}

.post-timestamp {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.delete-post-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.delete-post-btn:hover {
  opacity: 1;
  background: rgba(239, 68, 68, 0.1);
}

.post-content {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.action-btn:hover:not(:disabled) {
  background: var(--bg-primary);
  border-color: var(--accent-color);
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn.liked {
  border-color: #EF4444;
  color: #EF4444;
}

.action-icon {
  font-size: 1.125rem;
}

.action-text {
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .user-info-bar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
  }

  .feed-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
