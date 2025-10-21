<template>
  <div class="newsletter-signup">
    <div class="newsletter-content">
      <div class="newsletter-header">
        <h3>📬 Stay Updated</h3>
        <p>Get the latest AI insights, tutorials, and news delivered to your inbox.</p>
      </div>

      <form v-if="!isSubscribed" @submit.prevent="handleSubmit" class="newsletter-form">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
            class="email-input"
          />
          <button type="submit" :disabled="isLoading || !email" class="subscribe-btn">
            {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>

      <div v-else class="success-state">
        <div class="success-icon">✅</div>
        <p class="success-message">Thanks for subscribing! Check your inbox.</p>
      </div>

      <p class="privacy-note">We respect your privacy. Unsubscribe at any time.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabase';

const email = ref('');
const isLoading = ref(false);
const isSubscribed = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (!email.value || !email.value.includes('@')) {
    error.value = 'Please enter a valid email address';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const { error: subscribeError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.value.toLowerCase().trim()
      });

    if (subscribeError) {
      // Check if email already exists
      if (subscribeError.code === '23505') {
        error.value = 'This email is already subscribed!';
      } else {
        throw subscribeError;
      }
    } else {
      isSubscribed.value = true;
      console.log('✅ Newsletter subscription successful');
    }
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    error.value = 'Something went wrong. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.newsletter-signup {
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.newsletter-header h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.newsletter-header p {
  font-size: 1rem;
  opacity: 0.95;
  line-height: 1.5;
}

.newsletter-form {
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.email-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  color: var(--text-primary);
  transition: all 0.2s;
}

.email-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.email-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.subscribe-btn {
  padding: 0.875rem 2rem;
  background: white;
  color: var(--accent-color);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.subscribe-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.subscribe-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #fecaca;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}

.success-state {
  text-align: center;
  padding: 2rem 1rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: scaleIn 0.3s ease-out;
}

.success-message {
  font-size: 1.125rem;
  font-weight: 600;
}

.privacy-note {
  text-align: center;
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 1rem;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .newsletter-signup {
    padding: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .subscribe-btn {
    width: 100%;
  }

  .newsletter-header h3 {
    font-size: 1.5rem;
  }
}
</style>
