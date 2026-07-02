<template>
  <AuthLayout
    :illustration-src="submitted ? '/reset-success-illustration.png' : '/forgot-illustration.png'"
    :illustration-alt="submitted ? 'Reset Berhasil' : 'Lupa Kata Sandi'"
  >
    <!-- FORM: Input Nama Pengguna -->
    <template v-if="!submitted">
      <div class="form-header">
        <h1 class="form-title">Lupa Kata Sandi?</h1>
        <p class="form-subtitle">
          Jika lupa kata sandi, silakan isi <strong>Nama Pengguna</strong> di bawah.
          Coba masuk kembali menggunakan <strong>kata sandi default</strong>
          setelah reset kata sandi berhasil.
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Nama Pengguna <span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="forgot-username"
              v-model="username"
              type="text"
              class="form-input"
              required
              autocomplete="username"
            />
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
          </div>
        </div>

        <!-- Alert Error -->
        <div v-if="errorMsg" class="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Kirim</span>
        </button>

        <p class="back-link">
          <a href="#" @click.prevent="$emit('go-login')">Kembali ke Masuk</a>
        </p>
      </form>
    </template>

    <!-- SUCCESS STATE -->
    <template v-else>
      <div class="success-container">
        <div class="success-icon-wrapper">
          <div class="success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <h2 class="success-title">Sukses</h2>
        <p class="success-message">Kata sandi berhasil di reset.</p>
        <button type="button" class="btn-primary" @click="$emit('go-login')">
          Kembali ke Masuk
        </button>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from './AuthLayout.vue'

const emit = defineEmits<{
  'go-login': []
}>()

const username = ref('')
const loading = ref(false)
const errorMsg = ref('')
const submitted = ref(false)

const handleSubmit = async () => {
  errorMsg.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
  if (!username.value.trim()) {
    errorMsg.value = 'Nama pengguna wajib diisi.'
    return
  }
  submitted.value = true
}
</script>

<style scoped>
.form-header {
  margin-bottom: 28px;
}

.form-title {
  font-size: 26px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.form-subtitle strong {
  color: #1e293b;
  font-weight: 700;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  height: 42px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 0 40px 0 14px;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-primary {
  width: 100%;
  height: 44px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.2px;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.99);
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.back-link {
  text-align: center;
  margin: 0;
}

.back-link a {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* SUCCESS STATE */
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 16px 0;
}

.success-icon-wrapper {
  margin-bottom: 8px;
}

.success-icon {
  width: 56px;
  height: 56px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.35);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.success-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.success-message {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 8px;
}
</style>
