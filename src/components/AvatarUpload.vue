<template>
  <div class="avatar-upload">
    <div class="avatar-preview">
      <img :src="currentAvatar" :alt="username" class="avatar-image" />
      <div class="avatar-overlay">
        <label for="avatar-input" class="upload-label">
          <span class="upload-icon">📷</span>
          <span class="upload-text">Change Photo</span>
        </label>
      </div>
    </div>

    <input
      id="avatar-input"
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      @change="handleFileSelect"
      class="file-input"
    />

    <div v-if="uploading" class="upload-status">
      <div class="loading-spinner"></div>
      <p>Uploading...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="success" class="success-message">
      Avatar updated successfully!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  username: {
    type: String,
    required: false,
    default: ''
  },
  currentAvatar: {
    type: String,
    required: false,
    default: ''
  }
});

const emit = defineEmits(['avatarUpdated']);

const { currentUser } = useAuth();
const uploading = ref(false);
const error = ref('');
const success = ref(false);

// Debug log
console.log('🎨 AvatarUpload component mounted!', { username: props.username, avatar: props.currentAvatar });

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'File size must be less than 2MB';
    return;
  }

  // Validate file type
  if (!file.type.match(/image\/(png|jpeg|jpg|webp)/)) {
    error.value = 'Please upload a PNG, JPG, or WebP image';
    return;
  }

  error.value = '';
  success.value = false;
  uploading.value = true;

  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.value.id}/avatar.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Replace existing file
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar: publicUrl })
      .eq('id', currentUser.value.id);

    if (updateError) throw updateError;

    success.value = true;
    emit('avatarUpdated', publicUrl);

    // Hide success message after 3 seconds
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (err) {
    console.error('Error uploading avatar:', err);
    error.value = err.message || 'Failed to upload avatar';
  } finally {
    uploading.value = false;
    // Reset file input
    event.target.value = '';
  }
};
</script>

<style scoped>
.avatar-upload {
  position: relative;
  display: inline-block;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-preview:hover {
  transform: scale(1.05);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.upload-label {
  cursor: pointer;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.upload-icon {
  font-size: 1.5rem;
}

.upload-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.file-input {
  display: none;
}

.upload-status {
  margin-top: 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #EF4444;
  border-radius: 0.5rem;
  color: #EF4444;
  font-size: 0.875rem;
  text-align: center;
}

.success-message {
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10B981;
  border-radius: 0.5rem;
  color: #10B981;
  font-size: 0.875rem;
  text-align: center;
}
</style>
