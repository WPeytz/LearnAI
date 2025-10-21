import { ref, computed } from 'vue';

// Shared state
const posts = ref([]);

// Initialize from localStorage
const initPosts = () => {
  const savedPosts = localStorage.getItem('learnai_posts');
  if (savedPosts) {
    posts.value = JSON.parse(savedPosts);
  } else {
    // Initialize with some sample posts
    posts.value = [
      {
        id: '1',
        author: {
          id: 'demo1',
          username: 'AI_Enthusiast',
          avatar: 'https://ui-avatars.com/api/?name=AI+Enthusiast&background=667eea&color=fff'
        },
        content: 'Just finished reading the "What is AI?" article. The explanation of narrow vs general AI was really helpful! 🧠',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 12,
        comments: []
      },
      {
        id: '2',
        author: {
          id: 'demo2',
          username: 'ML_Developer',
          avatar: 'https://ui-avatars.com/api/?name=ML+Developer&background=764ba2&color=fff'
        },
        content: 'Has anyone tried building with the OpenAI API? I just created my first chatbot and it\'s amazing how easy it is to get started! Would love to hear about your projects. 🤖',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        comments: []
      },
      {
        id: '3',
        author: {
          id: 'demo3',
          username: 'DataScientist',
          avatar: 'https://ui-avatars.com/api/?name=Data+Scientist&background=10b981&color=fff'
        },
        content: 'The quiz section is fantastic! Scored 80% on the Machine Learning Basics quiz. Those questions on overfitting really made me think. 📊',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        likes: 8,
        comments: []
      }
    ];
    savePosts();
  }
};

const savePosts = () => {
  localStorage.setItem('learnai_posts', JSON.stringify(posts.value));
};

export const usePosts = () => {
  // Initialize on first use
  if (posts.value.length === 0) {
    initPosts();
  }

  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  });

  const createPost = (content, author) => {
    if (!content || !content.trim()) {
      throw new Error('Post content cannot be empty');
    }

    const newPost = {
      id: Date.now().toString(),
      author: {
        id: author.id,
        username: author.username,
        avatar: author.avatar
      },
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    posts.value.unshift(newPost);
    savePosts();
    return newPost;
  };

  const deletePost = (postId, userId) => {
    const postIndex = posts.value.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const post = posts.value[postIndex];
    if (post.author.id !== userId) {
      throw new Error('You can only delete your own posts');
    }

    posts.value.splice(postIndex, 1);
    savePosts();
  };

  const likePost = (postId) => {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      savePosts();
    }
  };

  const unlikePost = (postId) => {
    const post = posts.value.find(p => p.id === postId);
    if (post && post.likes > 0) {
      post.likes -= 1;
      savePosts();
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return postDate.toLocaleDateString();
  };

  return {
    posts: sortedPosts,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    getTimeAgo
  };
};
