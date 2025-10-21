<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>

        <div class="modal-header">
          <h2>{{ isLoginMode ? 'Welcome Back!' : 'Join LearnAI Community' }}</h2>
          <p>{{ isLoginMode ? 'Sign in to your account' : 'Create your account' }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div v-if="!isLoginMode" class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              placeholder="Choose a username"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :placeholder="isLoginMode ? 'Enter your password' : 'At least 6 characters'"
              required
            />
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account') }}
          </button>
        </form>

        <div class="auth-switch">
          <p>
            {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
            <button @click="toggleMode" class="switch-btn">
              {{ isLoginMode ? 'Sign Up' : 'Sign In' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'success']);

const { login, signup } = useAuth();

const isLoginMode = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  username: '',
  email: '',
  password: ''
});

const resetForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: ''
  };
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = false;
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  resetForm();
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    if (isLoginMode.value) {
      const result = await login(formData.value.email, formData.value.password);
      successMessage.value = result.message;
      setTimeout(() => {
        emit('success');
        closeModal();
      }, 1000);
    } else {
      const result = await signup(
        formData.value.username,
        formData.value.email,
        formData.value.password
      );
      successMessage.value = result.message;
      setTimeout(() => {
        emit('success');
        closeModal();
      }, 1000);
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// Reset form when modal opens/closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-secondary);
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-header p {
  color: var(--text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error-message {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #EF4444;
  border-radius: 0.5rem;
  color: #EF4444;
  font-size: 0.875rem;
}

.success-message {
  padding: 0.75rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10B981;
  border-radius: 0.5rem;
  color: #10B981;
  font-size: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-btn {
  padding: 0.875rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-switch {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.auth-switch p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.switch-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 0.25rem;
  transition: all 0.2s;
}

.switch-btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-header h2 {
    font-size: 1.5rem;
  }
}
</style>
