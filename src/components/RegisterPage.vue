<template>
  <AuthLayout
    illustration-src="/images/login-img.png"
    illustration-alt="Register Illustration"
    description="Sistem Pengadaan Barang Toko Obat Larasati Farma. Buat akun untuk mulai menggunakan sistem pengadaan."
  >
    <div class="form-header">
      <h1 class="form-title">Daftar Akun Baru</h1>
      <p class="form-subtitle">Buat akun pengguna baru</p>
    </div>

    <form class="auth-form" @submit.prevent="handleRegister">
      <!-- Nama Pengguna -->
      <div class="form-group">
        <label class="form-label">Nama Pengguna <span class="required">*</span></label>
        <div class="input-wrapper">
          <input
            id="reg-username"
            v-model="form.username"
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

      <!-- Role Pengguna -->
      <div class="form-group">
        <label class="form-label">Role Pengguna <span class="required">*</span></label>
        <div class="input-wrapper">
          <select
            id="reg-role"
            v-model="form.roleId"
            class="form-input form-select"
            required
            :disabled="rolesLoading"
          >
            <option :value="null" disabled selected>
              {{ rolesLoading ? 'Memuat role...' : rolesError ? 'Gagal memuat role' : '' }}
            </option>
            <option
              v-for="role in roles"
              :key="role.id"
              :value="role.id"
            >
              {{ role.name }}
            </option>
          </select>
          <!-- Loading spinner atau ikon role -->
          <span class="input-icon">
            <svg v-if="rolesLoading" class="role-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
        </div>
        <p v-if="rolesError" class="field-error">{{ rolesError }}</p>
      </div>

      <!-- No. Telp -->
      <div class="form-group">
        <label class="form-label">No. Telp <span class="required">*</span></label>
        <div class="input-wrapper">
          <input
            id="reg-phone"
            v-model="form.phone"
            type="tel"
            class="form-input"
            required
            autocomplete="tel"
          />
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
        </div>
      </div>

      <!-- Kata Sandi -->
      <div class="form-group">
        <label class="form-label">Kata Sandi <span class="required">*</span></label>
        <div class="input-wrapper">
          <input
            id="reg-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            required
            autocomplete="new-password"
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

      <!-- Konfirmasi Kata Sandi -->
      <div class="form-group">
        <label class="form-label">Konfirmasi Kata Sandi <span class="required">*</span></label>
        <div class="input-wrapper">
          <input
            id="reg-confirm-password"
            v-model="form.confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            class="form-input"
            :class="{ 'input-error': passwordMismatch }"
            required
            autocomplete="new-password"
          />
          <button type="button" class="input-icon input-icon-btn" @click="showConfirm = !showConfirm" tabindex="-1">
            <svg v-if="!showConfirm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
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
        <p v-if="passwordMismatch" class="field-error">Kata sandi tidak cocok.</p>
      </div>

      <!-- Alert Error -->
      <div v-if="errorMsg" class="alert alert-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errorMsg }}
      </div>

      <!-- Alert Sukses -->
      <div v-if="successMsg" class="alert alert-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
        </svg>
        {{ successMsg }}
      </div>

      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Sign Up</span>
      </button>

      <p class="login-link">
        Sudah punya akun?
        <a href="#" @click.prevent="$emit('go-login')">Masuk di sini</a>
      </p>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AuthLayout from './AuthLayout.vue'
import { apiRegister, apiGetRoles, type Role } from '../api'

const emit = defineEmits<{
  'go-login': []
  'register-success': []
}>()

const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// ── Roles dari API ──
const roles = ref<Role[]>([])
const rolesLoading = ref(true)
const rolesError = ref('')

onMounted(async () => {
  try {
    roles.value = await apiGetRoles()
  } catch (err: unknown) {
    rolesError.value = err instanceof Error ? err.message : 'Gagal memuat role'
  } finally {
    rolesLoading.value = false
  }
})

const form = ref({
  username: '',
  roleId: null as number | null,
  phone: '',
  password: '',
  confirmPassword: '',
})

const passwordMismatch = computed(() =>
  form.value.confirmPassword !== '' && form.value.password !== form.value.confirmPassword
)

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (passwordMismatch.value) {
    errorMsg.value = 'Kata sandi tidak cocok. Silakan periksa kembali.'
    return
  }

  if (!form.value.roleId) {
    errorMsg.value = 'Pilih role pengguna terlebih dahulu.'
    return
  }

  loading.value = true
  try {
    await apiRegister({
      username: form.value.username,
      password: form.value.password,
      phone: form.value.phone,
      roleId: form.value.roleId,
    })
    successMsg.value = 'Akun berhasil dibuat! Silakan masuk.'
    setTimeout(() => emit('go-login'), 1500)
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Registrasi gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-header {
  margin-bottom: 24px;
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
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  appearance: none;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
}

.form-select {
  cursor: pointer;
}

.form-select:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.role-spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.field-error {
  font-size: 12px;
  color: #ef4444;
  margin: 0;
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

.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
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

.login-link {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.login-link a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
