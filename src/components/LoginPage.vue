<template>
  <AuthLayout
    illustration-src="/images/login-img.png"
    illustration-alt="Login Illustration"
    description="Sistem Pengadaan Barang Toko Obat Larasati Farma. Masuk untuk mengelola stok, pembelian, dan laporan secara efisien."
  >
    <div class="form-header">
      <h1 class="form-title">Masuk</h1>
      <p class="form-subtitle">Masuk untuk melanjutkan ke sistem</p>
    </div>

    <form class="auth-form" @submit.prevent="handleLogin">
      <!-- Nama Pengguna -->
      <div class="form-group">
        <label class="form-label">Nama Pengguna <span class="required">*</span></label>
        <div class="input-wrapper">
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder=""
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

      <!-- Kata Sandi -->
      <div class="form-group">
        <label class="form-label">Kata Sandi <span class="required">*</span></label>
        <div class="input-wrapper">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder=""
            required
            autocomplete="current-password"
          />
          <button type="button" class="input-icon input-icon-btn" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Ingat Saya & Lupa Kata Sandi -->
      <div class="form-row">
        <label class="checkbox-label">
          <input id="remember" type="checkbox" v-model="form.remember" class="checkbox-input" />
          <span class="checkbox-custom"></span>
          <span class="checkbox-text">Ingat Saya</span>
        </label>
        <a href="#" class="link-forgot" @click.prevent="$emit('go-forgot')">Lupa Kata Sandi?</a>
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
        <span v-else>Masuk</span>
      </button>

      <!-- <p class="register-link">
        Belum punya akun?
        <a href="#" @click.prevent="$emit('go-register')">Daftar Akun</a>
      </p> -->
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from './AuthLayout.vue'
import { apiLogin } from '../api'

const emit = defineEmits<{
  'go-forgot': []
  'go-register': []
  'login-success': [{ userId: number; username: string; role: string }]
}>()

const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  username: '',
  password: '',
  remember: false,
})

const handleLogin = async () => {
  errorMsg.value = ''

  if (!form.value.username || !form.value.password) {
    errorMsg.value = 'Nama pengguna dan kata sandi wajib diisi.'
    return
  }

  loading.value = true
  try {
    const data = await apiLogin({
      username: form.value.username,
      password: form.value.password,
    })
    // Login berhasil — token sudah disimpan di localStorage oleh apiLogin
    emit('login-success', { userId: data.userId, username: data.username, role: data.role })
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Login gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
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
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
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

.input-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  pointer-events: all;
  padding: 0;
  color: #9ca3af;
  transition: color 0.2s;
}

.input-icon-btn:hover {
  color: #2563eb;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: #2563eb;
  border-color: #2563eb;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  display: block;
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) translateY(-1px);
}

.checkbox-text {
  font-size: 13px;
  color: #374151;
}

.link-forgot {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.link-forgot:hover {
  color: #1d4ed8;
  text-decoration: underline;
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
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
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

.register-link {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.register-link a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
